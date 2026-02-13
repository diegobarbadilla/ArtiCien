import React from 'react';
import SectionTemplate from '../components/SectionTemplate';
import { useArticle } from '../context/ArticleContext';
import { generateSimulatedText } from '../utils/textGenerator';
import { generateSectionContent } from '../services/geminiService';

export default function ConclusionesScreen() {
    const { state, setSectionContent, setSectionPageCount } = useArticle();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);

        const prompt = `
        ELABORA el apartado de Conclusiones acorde a estos antecedentes y objetivos.
        
        CONTEXTO:
        - Tema: ${state.theme}
        - Pregunta de Investigación: (Derivada del tema)
        - Vacíos Temáticos: ${state.vaciosTematicos}
        - Antecedentes: ${state.antecedentes}
        - Enfoque: ${state.enfoque}
        - Bibliografía (Archivo Principal - Índice General): ${state.marcoTeoricoFile?.name || 'No adjunto'}
        - Otras Fuentes: ${state.bibliography.map(f => f.name).join(', ')}
        - Reglas Personales: ${state.customRules}
        
        LONGITUD: A desarrollar en ${state.pageCounts.conclusiones || '1'} páginas.

        INSTRUCCIONES ESPECÍFICAS:
        Elabora el apartado de Conclusiones siguiendo estas pautas detalladas en español:
        1) Resultados Clave: Comienza con un párrafo que resuma los principales hallazgos de tu investigación. Detalla los resultados más significativos y cómo contribuyen al campo.
        2) Respuesta al Objetivo de Investigación: Aborda específicamente el objetivo planteado.
        3) Tipo de Estudio: Especifica el tipo de estudio realizado para contextualizar dentro del marco metodológico.
        4) Reflexiones Finales y Futuras Direcciones: Concluye con implicaciones más amplias y sugerencias para investigaciones futuras.
        
        Mantén un lenguaje académico con un tono formal. Utiliza citas y referencias (APA 7) según sea necesario.
        `;

        console.log("GENERATING CONCLUSIONES WITH PROMPT:", prompt);

        try {
            const pageCountStr = state.pageCounts.conclusiones || '1';
            const generatedText = await generateSectionContent('Conclusiones', prompt, pageCountStr);
            setSectionContent('conclusiones', generatedText);
        } catch (error) {
            console.error("Error generating Conclusiones:", error);
            alert("Error al generar las Conclusiones. Por favor, revisa tu conexión.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SectionTemplate
            title="10. Conclusiones"
            description="Resume los hallazgos y su relevancia."
            nextRoute="/recomendaciones" // Este botón quizás debería cambiar a "Finalizar" o ir a un resumen
            prevRoute="/discusion"
            pageCount={state.pageCounts.conclusiones}
            setPageCount={(text) => setSectionPageCount('conclusiones', text)}
            content={state.sections.conclusiones}
            setContent={(text) => setSectionContent('conclusiones', text)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
        />
    );
}
