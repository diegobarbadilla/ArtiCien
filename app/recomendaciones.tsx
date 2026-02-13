import React from 'react';
import SectionTemplate from '../components/SectionTemplate';
import { useArticle } from '../context/ArticleContext';
import { generateSimulatedText } from '../utils/textGenerator';
import { generateSectionContent } from '../services/geminiService';

export default function RecomendacionesScreen() {
    const { state, setSectionContent, setSectionPageCount } = useArticle();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);

        const prompt = `
        ELABORA el apartado de Recomendaciones acorde a estos antecedentes y objetivos.
        
        CONTEXTO INTEGRAL:
        - Tema: ${state.theme}
        - Pregunta de Investigación: (Derivada del tema)
        - Vacíos Temáticos: ${state.vaciosTematicos}
        - Antecedentes: ${state.antecedentes}
        - Enfoque: ${state.enfoque}
        - Bibliografía (Archivo Principal - Índice General): ${state.marcoTeoricoFile?.name || 'No adjunto'}
        - Otras Fuentes: ${state.bibliography.map(f => f.name).join(', ')}
        - Reglas Personales: ${state.customRules}
        
        LONGITUD: A desarrollar en ${state.pageCounts.recomendaciones || '1'} páginas.

        INSTRUCCIONES ESPECÍFICAS:
        Elabora el apartado de Recomendaciones basándote en todos los puntos anteriores (Introducción, Marco Teórico, Metodología, Resultados, Discusión, Conclusiones).
        
        Debes centrarte en:
        1. Recomendaciones de literatura adicional para profundizar en el tema.
        2. Recomendaciones de temas específicos para investigaciones futuras que se deriven de este estudio.
        
        Utiliza el ÍNDICE GENERAL del PDF del punto 1 para sugerir continudad o expansión en áreas no cubiertas.
        `;

        console.log("GENERATING RECOMENDACIONES WITH PROMPT:", prompt);

        try {
            const pageCountStr = state.pageCounts.recomendaciones || '1';
            const generatedText = await generateSectionContent('Recomendaciones', prompt, pageCountStr);
            setSectionContent('recomendaciones', generatedText);
        } catch (error) {
            console.error("Error generating Recomendaciones:", error);
            alert("Error al generar las Recomendaciones. Por favor, revisa tu conexión.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SectionTemplate
            title="11. Recomendaciones"
            description="Sugerencias para futuros investigadores."
            nextRoute="/articulo" // Hacia la vista final de compilación
            prevRoute="/conclusiones"
            pageCount={state.pageCounts.recomendaciones}
            setPageCount={(text) => setSectionPageCount('recomendaciones', text)}
            content={state.sections.recomendaciones}
            setContent={(text) => setSectionContent('recomendaciones', text)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
        />
    );
}
