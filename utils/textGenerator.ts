
export const generateSimulatedText = (topic: string, section: string, pages: string | number): string => {
    const pageCount = typeof pages === 'string' ? parseInt(pages, 10) || 1 : pages;
    const wordsPerPage = 400; // Aproximación de palabras por página (espacio doble, fuente 12)
    const paragraphsPerPage = 4;

    let content = `[SIMULACIÓN DE ${section.toUpperCase()} GENERADA POR IA - EXTENSIÓN: ${pageCount} PÁGINAS]\n\n`;

    const baseParagraphs = [
        `En el contexto de ${topic}, es fundamental analizar las variables implicadas con detenimiento. Esta sección aborda los aspectos críticos identificados en la revisión preliminar de la literatura.`,
        `Diversos estudios han demostrado que la implementación de estrategias adecuadas puede mejorar significativamente los resultados. Sin embargo, persisten desafíos que requieren una atención meticulosa por parte de los investigadores y profesionales del campo.`,
        `La metodología empleada se alinea con los estándares internacionales, garantizando la reproducibilidad y la validez de los hallazgos. Se ha prestado especial atención a la selección de fuentes y al análisis de los datos recolectados.`,
        `A medida que avanzamos en el análisis, se hace evidente que las correlaciones observadas no son meramente circunstanciales. Existe una base teórica sólida que respalda las hipótesis planteadas inicialmente.`,
        `Es imperativo considerar las implicaciones éticas y prácticas de estos resultados. La aplicación de este conocimiento debe realizarse con responsabilidad y con una visión a largo plazo.`,
        `Finalmente, este apartado busca integrar las distintas perspectivas discutidas, ofreciendo una visión holística que sirva de base para las siguientes etapas de la investigación.`
    ];

    for (let p = 0; p < pageCount * paragraphsPerPage; p++) {
        const paragraphIndex = p % baseParagraphs.length;
        const variation = Math.floor(Math.random() * 1000);
        content += `${baseParagraphs[paragraphIndex]} (Ref. Dato ${variation})\n\n`;

        // Simular epígrafes cada ciertos párrafos
        if (p > 0 && p % 3 === 0) {
            content += `### ${p / 3}. Subtítulo Relevante para ${section} \n\n`;
        }
    }

    content += `(Fin de la simulación de ${pageCount} páginas para ${section}.)`;

    return content;
};
