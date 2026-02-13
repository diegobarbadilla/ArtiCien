import React from 'react';
import SectionTemplate from '../components/SectionTemplate';
import { useArticle } from '../context/ArticleContext';
import { generateSimulatedText } from '../utils/textGenerator';
import { generateSectionContent } from '../services/geminiService';

export default function DiscusionScreen() {
    const { state, setSectionContent, setSectionPageCount } = useArticle();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);

        const prompt = `
        ELABORA el apartado de Discusión acorde a estos antecedentes y objetivos.
        
        CONTEXTO:
        - Tema: ${state.theme}
        - Pregunta de Investigación: (Derivada del tema)
        - Vacíos Temáticos: ${state.vaciosTematicos}
        - Antecedentes: ${state.antecedentes}
        - Enfoque: ${state.enfoque}
        - Bibliografía (Archivo Principal - Índice General): ${state.marcoTeoricoFile?.name || 'No adjunto'}
        - Otras Fuentes: ${state.bibliography.map(f => f.name).join(', ')}
        - Reglas Personales: ${state.customRules}
        
        LONGITUD: A desarrollar en ${state.pageCounts.discusion || '1'} páginas.

        INSTRUCCIONES ESPECÍFICAS:
        Elabora el apartado Discusión teniendo en cuenta que debes:
        1. Analizar y contextualizar los resultados obtenidos en este estudio (simulados/teóricos si es una revisión).
        2. Compararlos con la literatura existente (basado en la Bibliografía y Antecedentes).
        3. Identificar las limitaciones de la investigación.
        4. Sugerir direcciones para futuros trabajos.
        
        Utiliza el ÍNDICE GENERAL del PDF del punto 1 como guía estructural si es relevante.
        Presenta toda la información en español, asegurando una redacción coherente y profesional (APA 7).
        `;

        console.log("GENERATING DISCUSION WITH PROMPT:", prompt);

        try {
            const pageCountStr = state.pageCounts.discusion || '1';
            const generatedText = await generateSectionContent('Discusión', prompt, pageCountStr);
            setSectionContent('discusion', generatedText);
        } catch (error) {
            console.error("Error generating Discusión:", error);
            alert("Error al generar la Discusión. Por favor, revisa tu conexión.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SectionTemplate
            title="9. Discusión"
            description="Interpreta tus resultados y compáralos con estudios previos."
            nextRoute="/conclusiones"
            prevRoute="/resultados"
            pageCount={state.pageCounts.discusion}
            setPageCount={(text) => setSectionPageCount('discusion', text)}
            content={state.sections.discusion}
            setContent={(text) => setSectionContent('discusion', text)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
        />
    );
}
