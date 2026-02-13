import React from 'react';
import SectionTemplate from '../components/SectionTemplate';
import { useArticle } from '../context/ArticleContext';
import { generateSimulatedText } from '../utils/textGenerator';
import { generateSectionContent } from '../services/geminiService';

export default function MarcoTeoricoScreen() {
    const { state, setSectionContent, setSectionPageCount } = useArticle();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);

        const prompt = `
        ELABORA el Marco Teórico acorde a estos antecedentes y que responda a los objetivos anteriores.
        
        CONTEXTO:
        - Tema: ${state.theme}
        - Pregunta de Investigación: (Derivada del tema)
        - Vacíos Temáticos: ${state.vaciosTematicos}
        - Antecedentes: ${state.antecedentes}
        - Enfoque: ${state.enfoque}
        - Bibliografía (Archivo Principal - Índice General): ${state.marcoTeoricoFile?.name || 'No adjunto'}
        - Otras Fuentes: ${state.bibliography.map(f => f.name).join(', ')}
        - Reglas Personales: ${state.customRules}
        
        LONGITUD: A desarrollar en ${state.pageCounts.marcoTeorico || '1'} páginas.

        INSTRUCCIONES ESPECÍFICAS:
        Utiliza la misma metodología que para el apartado de Introducción, desarrollando todos los epígrafes y subepígrafes del ÍNDICE GENERAL contenido en el pdf subido en el Paso 1 ("${state.marcoTeoricoFile?.name || 'Archivo Principal'}").
        
        Asegúrate de:
        1. Seguir rigurosamente la estructura del índice del archivo subido.
        2. Citar adecuadamente según APA 7.
        3. Mantener coherencia con los vacíos temáticos y el enfoque definidos.
        `;

        console.log("GENERATING MARCO TEORICO WITH PROMPT:", prompt);

        try {
            const pageCountStr = state.pageCounts.marcoTeorico || '1';
            const generatedText = await generateSectionContent('Marco Teórico', prompt, pageCountStr);
            setSectionContent('marcoTeorico', generatedText);
        } catch (error) {
            console.error("Error generating Marco Teórico:", error);
            alert("Error al generar el Marco Teórico. Por favor, revisa tu conexión.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SectionTemplate
            title="5. Marco Teórico"
            description="Desarrolla el marco teórico siguiendo el índice de tu archivo base."
            nextRoute="/otras"
            prevRoute="/introduccion"
            pageCount={state.pageCounts.marcoTeorico}
            setPageCount={(text) => setSectionPageCount('marcoTeorico', text)}
            content={state.sections.marcoTeorico}
            setContent={(text) => setSectionContent('marcoTeorico', text)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
        />
    );
}
