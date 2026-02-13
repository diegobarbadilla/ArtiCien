import React from 'react';
import SectionTemplate from '../components/SectionTemplate';
import { useArticle } from '../context/ArticleContext';
import { generateSimulatedText } from '../utils/textGenerator';
import { generateSectionContent } from '../services/geminiService';

export default function MetodologiaScreen() {
    const { state, setSectionContent, setSectionPageCount } = useArticle();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);

        const prompt = `
        ELABORA el apartado de Metodología acorde a estos antecedentes y objetivos.
        
        CONTEXTO:
        - Tema: ${state.theme}
        - Pregunta de Investigación: (Derivada del tema)
        - Vacíos Temáticos: ${state.vaciosTematicos}
        - Antecedentes: ${state.antecedentes}
        - Enfoque: ${state.enfoque}
        - Bibliografía (Archivo Principal): ${state.marcoTeoricoFile?.name || 'No adjunto'}
        - Otras Fuentes: ${state.bibliography.map(f => f.name).join(', ')}
        - Reglas Personales: ${state.customRules}
        
        LONGITUD: A desarrollar en ${state.pageCounts.metodologia || '1'} páginas.

        INSTRUCCIONES ESPECÍFICAS:
        Elabora el apartado Metodología basándote en los epígrafes del ÍNDICE GENERAL del PDF subido en el punto 1.
        
        Los párrafos deben desarrollar imperativamente los siguientes puntos:
        1) Método PRISMA: Describe cómo se aplicó el Método PRISMA para la revisión sistemática.
        2) Preguntas de Investigación: Formula 5 preguntas de investigación clave para la revisión sistemática.
        3) Estrategias de Búsqueda: Establece las estrategias de búsqueda e inclusión de palabras clave que se usaron para identificar los estudios relevantes (basado en la Bibliografía del punto 2).
        4) Criterios de Exclusión: Explica cuáles fueron los criterios de exclusión en los estudios encontrados.
        
        Toda la redacción debe responder al objetivo de investigación y al tipo de artículo (Revisión Sistemática / Artículo Científico).
        Presenta toda la información en español, asegurando una redacción coherente y profesional.
        `;

        console.log("GENERATING METODOLOGIA WITH PROMPT:", prompt);

        try {
            const pageCountStr = state.pageCounts.metodologia || '1';
            const generatedText = await generateSectionContent('Metodología', prompt, pageCountStr);
            setSectionContent('metodologia', generatedText);
        } catch (error) {
            console.error("Error generating Metodología:", error);
            alert("Error al generar la Metodología. Por favor, revisa tu conexión.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SectionTemplate
            title="7. Metodología"
            description="Define cómo se realizó la investigación (PRISMA)."
            nextRoute="/resultados"
            prevRoute="/otras"
            pageCount={state.pageCounts.metodologia}
            setPageCount={(text) => setSectionPageCount('metodologia', text)}
            content={state.sections.metodologia}
            setContent={(text) => setSectionContent('metodologia', text)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
        />
    );
}
