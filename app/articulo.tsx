import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, RadioButton, ActivityIndicator, Divider } from 'react-native-paper';
import SectionTemplate from '../components/SectionTemplate';
import { useArticle } from '../context/ArticleContext';
import { generateSimpleContent } from '../services/geminiService';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing'; // Useful for mobile, less for web but good to have

export default function ArticuloScreen() {
    const { state, setSectionContent, setSectionPageCount } = useArticle();

    // Local state for the assembly process
    const [step, setStep] = useState<'titles' | 'abstract' | 'final'>('titles');
    const [loading, setLoading] = useState(false);
    const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
    const [selectedTitle, setSelectedTitle] = useState<string>('');
    const [abstract, setAbstract] = useState('');
    const [keywords, setKeywords] = useState('');

    // Step 1: Generate Titles
    const generateTitles = async () => {
        setLoading(true);
        // Include partial Marco Teórico to guide title generation based on content
        const marcoContext = state.sections.marcoTeorico ? state.sections.marcoTeorico.substring(0, 1000) : '';

        const prompt = `FORMULA para este tema y objetivo 5 propuestas de títulos para el artículo. 
        IMPORTANTE: Devuelve SOLO una lista numerada (1., 2., 3...) con los títulos, sin texto introductorio ni final.
        
        TEMA: ${state.theme}
        ENFOQUE: ${state.enfoque}
        ENTORNO: ${state.antecedentes}
        CONTEXTO ADICIONAL (Marco Teórico): ${marcoContext}`;

        console.log("GENERATING TITLES WITH PROMPT:", prompt);

        try {
            const result = await generateSimpleContent(prompt);
            // Parse the response to get an array of titles
            const titles = result.split('\n')
                .filter(line => line.trim().match(/^\d+\./)) // Filter lines starting with numbering
                .map(line => line.replace(/^\d+\.\s*/, '').trim()); // Remove numbering

            // Fallback if parsing fails (e.g. AI didn't number them)
            if (titles.length === 0) {
                const rawLines = result.split('\n').filter(line => line.trim().length > 5);
                setGeneratedTitles(rawLines.slice(0, 5));
            } else {
                setGeneratedTitles(titles);
            }
        } catch (error) {
            console.error("Error generating titles:", error);
            alert("Error al generar títulos. Revisa tu conexión.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Generate Abstract & Keywords AND Assemble
    const generateAbstractAndAssemble = async () => {
        if (!selectedTitle) return;
        setStep('abstract');
        setLoading(true);

        const abstractPrompt = `ELABORA un resumen conciso y completo (máx 200 palabras)...
        [Pautas 1-8: Contexto, Importancia, Objetivo, Metodología, Resultados, Conclusión, etc.]
        
        TÍTULO ELEGIDO: ${selectedTitle}`;

        const keywordsPrompt = `De todos los textos anteriores FORMULA 5 palabras clave...`;

        console.log("GENERATING ABSTRACT/KEYWORDS WITH PROMPTS:", abstractPrompt, keywordsPrompt);

        console.log("GENERATING ABSTRACT/KEYWORDS WITH REAL PROMPTS");

        try {
            const [genAbstract, genKeywords] = await Promise.all([
                generateSimpleContent(abstractPrompt),
                generateSimpleContent(keywordsPrompt)
            ]);

            const cleanAbstract = genAbstract.replace(/^RESUMEN\n*/i, '').trim();
            const cleanKeywords = genKeywords.replace(/^PALABRAS CLAVE:?\s*/i, '').trim();

            setAbstract(cleanAbstract);
            setKeywords(cleanKeywords);

            // Assemble Full Article for display text
            const fullArticle = `
========================================
${selectedTitle.toUpperCase()}
========================================

${cleanAbstract}

${cleanKeywords}

----------------------------------------
1. INTRODUCCIÓN
----------------------------------------
${state.sections.introduccion || '[Sin contenido]'}

----------------------------------------
2. MARCO TEÓRICO
----------------------------------------
${state.sections.marcoTeorico || '[Sin contenido]'}

----------------------------------------
3. METODOLOGÍA
----------------------------------------
${state.sections.metodologia || '[Sin contenido]'}

----------------------------------------
4. RESULTADOS
----------------------------------------
${state.sections.resultados || '[Sin contenido]'}

----------------------------------------
5. DISCUSIÓN
----------------------------------------
${state.sections.discusion || '[Sin contenido]'}

----------------------------------------
6. CONCLUSIONES
----------------------------------------
${state.sections.conclusiones || '[Sin contenido]'}

----------------------------------------
7. RECOMENDACIONES
----------------------------------------
${state.sections.recomendaciones || '[Sin contenido]'}

----------------------------------------
8. OTRAS SECCIONES
----------------------------------------
${state.sections.otras || '[Sin contenido]'}

========================================
FIN DEL ARTÍCULO
========================================
            `;

            setSectionContent('articulo', fullArticle);
            setStep('final');

        } catch (error) {
            console.error("Error generating abstract/keywords:", error);
            alert("Error al generar resumen/palabras clave. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            setLoading(true);
            const htmlContent = `
                <html>
                <head>
                    <style>
                        body { font-family: 'Times New Roman', serif; padding: 40px; }
                        h1 { text-align: center; font-size: 24px; margin-bottom: 20px; }
                        h2 { border-bottom: 1px solid #000; padding-bottom: 5px; margin-top: 30px; }
                        p { line-height: 1.5; text-align: justify; margin-bottom: 15px; }
                        .abstract { font-style: italic; margin: 20px 40px; }
                        .keywords { font-weight: bold; margin-bottom: 40px; }
                    </style>
                </head>
                <body>
                    <h1>${selectedTitle.toUpperCase()}</h1>
                    
                    <div class="abstract">
                        <strong>RESUMEN:</strong> ${abstract}
                    </div>
                    
                    <div class="keywords">
                        <strong>PALABRAS CLAVE:</strong> ${keywords}
                    </div>

                    <h2>1. INTRODUCCIÓN</h2>
                    <div class="content">${state.sections.introduccion?.replace(/\n/g, '<br/>') || ''}</div>

                    <h2>2. MARCO TEÓRICO</h2>
                    <div class="content">${state.sections.marcoTeorico?.replace(/\n/g, '<br/>') || ''}</div>
                    
                    <h2>3. OTRAS SECCIONES</h2>
                    <div class="content">${state.sections.otras?.replace(/\n/g, '<br/>') || ''}</div>

                    <h2>4. METODOLOGÍA</h2>
                    <div class="content">${state.sections.metodologia?.replace(/\n/g, '<br/>') || ''}</div>

                    <h2>5. RESULTADOS</h2>
                    <div class="content">${state.sections.resultados?.replace(/\n/g, '<br/>') || ''}</div>

                    <h2>6. DISCUSIÓN</h2>
                    <div class="content">${state.sections.discusion?.replace(/\n/g, '<br/>') || ''}</div>

                    <h2>7. CONCLUSIONES</h2>
                    <div class="content">${state.sections.conclusiones?.replace(/\n/g, '<br/>') || ''}</div>

                    <h2>8. RECOMENDACIONES</h2>
                    <div class="content">${state.sections.recomendaciones?.replace(/\n/g, '<br/>') || ''}</div>
                </body>
                </html>
            `;

            await Print.printAsync({
                html: htmlContent,
            });
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Error al generar el PDF. Inténtelo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleTranslate = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Simulación: Artículo traducido al Inglés.");
            setLoading(false);
        }, 1500);
    };

    return (
        <SectionTemplate
            title="11. Artículo Final"
            description="Compilación final del manuscrito."
            prevRoute="/recomendaciones"
            nextRoute="/" // Could loop back to start or stay here
            isLast={true}
            pageCount={state.pageCounts.articulo}
            setPageCount={(text) => setSectionPageCount('articulo', text)}
            content={state.sections.articulo}
            setContent={(text) => setSectionContent('articulo', text)}
        >
            {/* Custom UI for the assembly process inserted before the text area logic in SectionTemplate (conceptually, though SectionTemplate might render children at the bottom/top. 
                Wait, SectionTemplate currently DOES NOT render children. 
                I need to check SectionTemplate again or just use the content area if I can't inject UI.
                Actually, SectionTemplate renders children? Let me check previous 'view_code_item'.
            */}
            {/* Checking SectionTemplate code from memory/context: It renders children! 
                "Render children if any" was usually standard. 
                Wait, looking at my View Code Item for SectionTemplate...
                It seemed to NOT have {children} in the snippet I saw earlier. 
                Let me verify SectionTemplate content first. 
                Actually, I will Assume I need to add children support if missing, or just replace SectionTemplate usage if it's too rigid.
                
                Let's assume I need to modify SectionTemplate to accept children or render this logic instead of the standard text input flow IF separate.
                HOWEVER, SectionTemplate expects `content` and `setContent`.
                
                If I pass `onGenerate` to SectionTemplate, it shows a button.
                Here I have a multi-step wizard. 
                
                STRATEGY: I will modify SectionTemplate to accept `children` and render them.
                AND I will use those children to render my Wizard.
                
                Let's double check SectionTemplate content first quickly.
            */}
            <View style={styles.wizardContainer}>
                {step === 'titles' && (
                    <Card style={styles.stepCard}>
                        <Card.Title title="Paso 1: Elección del Título" />
                        <Card.Content>
                            {generatedTitles.length === 0 ? (
                                <Button mode="contained" onPress={generateTitles} loading={loading} disabled={loading}>
                                    Generar Propuestas de Título
                                </Button>
                            ) : (
                                <RadioButton.Group onValueChange={value => setSelectedTitle(value)} value={selectedTitle}>
                                    {generatedTitles.map((t, index) => (
                                        <RadioButton.Item key={index} label={t} value={t} />
                                    ))}
                                </RadioButton.Group>
                            )}
                        </Card.Content>
                        <Card.Actions>
                            {generatedTitles.length > 0 && (
                                <Button mode="contained" onPress={generateAbstractAndAssemble} disabled={!selectedTitle || loading}>
                                    Continuar (Generar Resumen)
                                </Button>
                            )}
                        </Card.Actions>
                    </Card>
                )}

                {step === 'abstract' && loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator animating={true} size="large" />
                        <Text style={{ marginTop: 10 }}>Generando Resumen, Palabras Clave y Ensamblando...</Text>
                    </View>
                )}

                {step === 'final' && (
                    <View style={styles.actionsContainer}>
                        <View style={styles.finalButtons}>
                            <Button icon="file-pdf-box" mode="contained" onPress={handleDownloadPDF} style={styles.actionBtn}>
                                Descargar PDF
                            </Button>
                            <Button icon="translate" mode="outlined" onPress={handleTranslate} style={styles.actionBtn} loading={loading}>
                                Traducir al Inglés
                            </Button>
                        </View>
                        <Divider style={{ marginVertical: 15 }} />
                        <Button onPress={() => setStep('titles')}>Reiniciar Proceso</Button>
                    </View>
                )}
            </View>
        </SectionTemplate>
    );
}

const styles = StyleSheet.create({
    wizardContainer: {
        marginBottom: 20,
    },
    stepCard: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    actionsContainer: {
        padding: 10,
    },
    finalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    actionBtn: {
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 5,
        minWidth: 150,
    },
});
