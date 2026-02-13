import React from 'react';
import SectionTemplate from '../components/SectionTemplate';
import { useArticle } from '../context/ArticleContext';
import { generateSimulatedText } from '../utils/textGenerator';
import { generateSectionContent } from '../services/geminiService';

export default function OtrasScreen() {
    const { state, setSectionContent, setSectionPageCount } = useArticle();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);

        const prompt = `
        ELABORA el desarrollo de los capítulos adicionales ("Otras") acorde a estos antecedentes.
        
        CONTEXTO:
        - Tema: ${state.theme}
        - Pregunta de Investigación: (Derivada del tema)
        - Vacíos Temáticos: ${state.vaciosTematicos}
        - Antecedentes: ${state.antecedentes}
        - Enfoque: ${state.enfoque}
        - Bibliografía (Archivo Principal - Índice General): ${state.marcoTeoricoFile?.name || 'No adjunto'}
        - Otras Fuentes: ${state.bibliography.map(f => f.name).join(', ')}
        - Reglas Personales: ${state.customRules}
        
        LONGITUD: A desarrollar en ${state.pageCounts.otras || '1'} páginas.

        INSTRUCCIONES ESPECÍFICAS:
        Esta sección se refiere a OTROS CAPÍTULOS del ÍNDICE GENERAL contenido en el pdf subido en el Paso 1 que NO son ninguno de los pasos estándar de esta aplicación (Introducción, Marco Teórico, Metodología, Resultados, Discusión, Conclusiones).
        
        Desarrolla TODOS los epígrafes y subepígrafes de estos capítulos adicionales del ÍNDICE GENERAL.
        Si existiera más de un Capítulo del INDICE GENERAL no contenidos en los pasos de la aplicación, desarróllalos en este punto de manera secuencial.
        Utiliza la misma metodología académica y de citas (APA 7) que para los apartados anteriores.
        `;

        console.log("GENERATING OTRAS WITH PROMPT:", prompt);

        try {
            const pageCountStr = state.pageCounts.otras || '1';
            const generatedText = await generateSectionContent('Otras Secciones', prompt, pageCountStr);
            setSectionContent('otras', generatedText);
        } catch (error) {
            console.error("Error generating Otras Secciones:", error);
            alert("Error al generar Otras Secciones. Por favor, revisa tu conexión.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SectionTemplate
            title="6. Otras"
            description="Incluye secciones adicionales del índice general."
            nextRoute="/metodologia"
            prevRoute="/marco-teorico"
            pageCount={state.pageCounts.otras}
            setPageCount={(text) => setSectionPageCount('otras', text)}
            content={state.sections.otras}
            setContent={(text) => setSectionContent('otras', text)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
        />
    );
}
