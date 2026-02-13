import React from 'react';
import SectionTemplate from '../components/SectionTemplate';
import { useArticle } from '../context/ArticleContext';
import { generateSimulatedText } from '../utils/textGenerator';
import { generateSectionContent } from '../services/geminiService';

export default function IntroduccionScreen() {
    const { state, setSectionContent, setSectionPageCount } = useArticle();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);

        const prompt = `
        ELABORA el apartado introducción acorde a estos antecedentes y que responda a los objetivos anteriores.
        
        CONTEXTO:
        - Tema: ${state.theme}
        - Pregunta de Investigación: (Derivada del tema)
        - Vacíos Temáticos: ${state.vaciosTematicos}
        - Antecedentes: ${state.antecedentes}
        - Enfoque: ${state.enfoque}
        - Bibliografía (Archivo Principal): ${state.marcoTeoricoFile?.name || 'No adjunto'}
        - Otras Fuentes: ${state.bibliography.map(f => f.name).join(', ')}
        - Reglas Personales: ${state.customRules}
        
        LONGITUD: A desarrollar en ${state.pageCounts.introduccion || '1'} páginas.

        INSTRUCCIONES DETALLADAS:
        1. Bases Teóricas: Describe las bases teóricas fundamentales del estudio, respaldada por fuentes bibliográficas del Punto 2. Bibliografía. Estas fuentes deben establecer claramente los principios teóricos que fundamentan el objetivo de la investigación. Utiliza palabras claves específicas relacionadas con el objetivo.
        2. Investigaciones Realizadas: Resume las investigaciones más relevantes realizadas en el área, citando los estudios clave. Describe como estos estudios contribuyen al conocimiento actual del objetivo de investigación. Asegúrate de seleccionar estudios que reflejen avances recientes y relevantes en el campo.
        3. Vacíos temáticos: Identifica y discute y desarrolla el vacío temáticos elegidos. Explica cómo este vacío temáticos justifica la necesidad del objetivo de investigación y como tu estudio propone abordarlos.
        4. Objetivo del Artículo: Define claramente el objetivo del artículo. Este objetivo debe reflejar una intención de llenar los vacíos temáticos identificados y avanzar en el conocimiento del campo.
        5. Para todas las citas utiliza el formato APA7, autor-fecha. Asegúrate de cada cita esté correctamente referenciada.
        6. Mantén un lenguaje académico formal, coherente y preciso. Evita el uso de jerga especializada y asegúrate de que cada sección de la introducción esté claramente delineada y enfocada en responder al objetivo del estudio.
        7. Tras completar la redacción, revisa cuidadosamente el texto para asegurar que cumpla con los criterios establecidos, incluyendo la coherencia interna, la relevancia de las fuentes seleccionadas y la claridad del argumento.
        `;

        console.log("GENERATING INTRO WITH PROMPT:", prompt);

        try {
            const pageCountStr = state.pageCounts.introduccion || '1';
            const generatedText = await generateSectionContent('Introducción', prompt, pageCountStr);
            setSectionContent('introduccion', generatedText);
        } catch (error: any) {
            console.error("Error generating Introduction:", error);
            alert(`Error al generar la introducción: ${error.message || "Error desconocido"}. Revisa la consola/terminal.`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SectionTemplate
            title="4. Introducción"
            description="Redacta la introducción de tu artículo."
            nextRoute="/marco-teorico"
            prevRoute="/reglas"
            pageCount={state.pageCounts.introduccion}
            setPageCount={(text) => setSectionPageCount('introduccion', text)}
            content={state.sections.introduccion}
            setContent={(text) => setSectionContent('introduccion', text)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
        />
    );
}
