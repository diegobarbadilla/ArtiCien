import React from 'react';
import SectionTemplate from '../components/SectionTemplate';
import { useArticle } from '../context/ArticleContext';
import { generateSimulatedText } from '../utils/textGenerator';
import { generateSectionContent } from '../services/geminiService';

export default function ResultadosScreen() {
    const { state, setSectionContent, setSectionPageCount } = useArticle();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);

        const prompt = `
        ELABORA el apartado de Resultados acorde a la metodología y antecedentes.
        
        CONTEXTO:
        - Tema: ${state.theme}
        - Pregunta de Investigación: (Derivada del tema)
        - Vacíos Temáticos: ${state.vaciosTematicos}
        - Antecedentes: ${state.antecedentes}
        - Enfoque: ${state.enfoque}
        - Bibliografía (Archivo Principal): ${state.marcoTeoricoFile?.name || 'No adjunto'}
        - Otras Fuentes: ${state.bibliography.map(f => f.name).join(', ')}
        
        LONGITUD: A desarrollar en ${state.pageCounts.resultados || '1'} páginas.

        INSTRUCCIONES ESPECÍFICAS:
        1. Presenta los hallazgos de manera objetiva.
        2. Utiliza tablas o figuras simuladas si es necesario (descríbelas).
        3. Asegúrate de que los resultados respondan a las preguntas de investigación planteadas en la Metodología.
        `;

        console.log("GENERATING RESULTADOS WITH PROMPT:", prompt);

        try {
            const pageCountStr = state.pageCounts.resultados || '1';
            const generatedText = await generateSectionContent('Resultados', prompt, pageCountStr);
            setSectionContent('resultados', generatedText);
        } catch (error: any) {
            console.error("Error generating Resultados:", error);
            alert(`Error al generar los Resultados: ${error.message || 'Error desconocido'}. Intenta de nuevo en unos momentos.`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SectionTemplate
            title="8. Resultados"
            description="Presenta los hallazgos de tu investigación."
            nextRoute="/discusion"
            prevRoute="/metodologia"
            pageCount={state.pageCounts.resultados}
            setPageCount={(text) => setSectionPageCount('resultados', text)}
            content={state.sections.resultados}
            setContent={(text) => setSectionContent('resultados', text)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
        />
    );
}
