
import { GoogleGenerativeAI } from "@google/generative-ai";

// CAUTION: In a production app, do not store keys directly in code.
// Ideally usage should be proxy via backend or using environment variables.
const API_KEY = "AIzaSyA7GNf87Mz1HLKDdj0hNuFBcYyUtWAwNBc";

const genAI = new GoogleGenerativeAI(API_KEY);

const MODELS_TO_TRY = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-flash-latest",
    "gemini-pro-latest"
];

// Helper to wait
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateWithFallback = async (prompt: string): Promise<string> => {
    let lastError: any = null;
    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`GeminiService: Attempting to generate with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.warn(`GeminiService: Model ${modelName} failed:`, error.message || error);
            lastError = error;
            // Wait 1 second before trying the next model to avoid hammering the API
            await delay(1000);
            continue;
        }
    }
    console.error("GeminiService: All models failed.");
    // Throw a more descriptive error that includes the last error message
    throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

export const generateSectionContent = async (sectionName: string, prompt: string, pageCount: string | number): Promise<string> => {
    try {
        // Estimate token count needed: 1 page ~ 400-500 words ~ 600-700 tokens
        // We will add explicit length instructions to the prompt.
        const pages = typeof pageCount === 'string' ? parseInt(pageCount, 10) : pageCount;
        const targetWordCount = pages * 400;

        const enhancedPrompt = `
        ${prompt}

        IMPORTANTE - INSTRUCCIONES DE LONGITUD:
        El usuario ha solicitado una extensión de aproximadamente ${pages} páginas.
        Debes generar un texto detallado y extenso de aproximadamente ${targetWordCount} palabras.
        No seas breve. Desarrolla los puntos en profundidad para cumplir con la longitud requerida.
        `;

        return await generateWithFallback(enhancedPrompt);
    } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        console.error("Error details:", error.message);
        throw error;
    }
};

export const generateSimpleContent = async (prompt: string): Promise<string> => {
    return await generateWithFallback(prompt);
};
