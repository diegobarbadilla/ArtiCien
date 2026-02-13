import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Divider, SegmentedButtons, useTheme, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useArticle } from '../context/ArticleContext';

export default function InicioScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { state, setVaciosTematicos, setAntecedentes, setEnfoque, setMarcoTeoricoFile, toggleTermsAccepted } = useArticle();

    const handleUploadMT = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setMarcoTeoricoFile(result.assets[0]);
            }
        } catch (err) {
            console.error("Error picking document:", err);
        }
    };

    const isFormComplete = state.marcoTeoricoFile && state.vaciosTematicos && state.antecedentes && state.enfoque;

    if (!state.termsAccepted) {
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <Card style={[styles.card, { maxWidth: 800 }]}>
                        <Card.Title
                            title="CONDICIONES DE USO"
                            titleStyle={styles.termsTitle}
                        />
                        <Card.Content>
                            <Text style={styles.termsIntro}>
                                Debe aceptar los siguientes términos y condiciones a continuación como condición expresa de usar esta aplicación ARTICIEN. Si no está de acuerdo con alguno de los siguientes términos y condiciones, no debe utilizar la aplicación ARTICIEN. El uso de la aplicación ARTICIEN y cualquier participación o aplicación de los consejos encontrados dentro de esta aplicación significa que usted acepta estar legalmente sujeto a estos términos y condiciones.
                            </Text>

                            <View style={styles.termsList}>
                                <Text style={styles.termsItem}><Text style={styles.bold}>1.</Text> El contenido que proporciona esta aplicación no es un sustituto de la elaboración por parte del autor de un paper académico o artículo científico. Ninguno de los textos proporcionados por esta la aplicación ARTICIEN se deben realizar, aplicar o usar sin la cita o referencia bibliográfica a que lo ha efectuado una Inteligencia Artificial, es decir, hay que hacer un uso ético de la aplicación.</Text>
                                <Text style={styles.termsItem}><Text style={styles.bold}>2.</Text> Cualquier contenido o información proporcionada en la aplicación ARTICIEN es solo para fines informativos y educativos, y cualquier uso de los mismos es únicamente bajo su propio riesgo. Los creadores de la aplicación ARTICIEN no se responsabilizan por la información contenida en este documento, ya que se utilizará exclusivamente como guía y se utilizará bajo su propio riesgo. Usted acepta eximir de responsabilidad a todos los propietarios, creadores o empleados de todas las reclamaciones por daños, incluidos los honorarios y costos de abogados, incurridos por usted o causados a terceros por usted, como resultado de la información que se encuentra en ARTICIEN (Web o App).</Text>
                                <Text style={styles.termsItem}><Text style={styles.bold}>3.</Text> La aplicación ARTICIEN no pretende ser un sustituto de ninguna elaboración por parte del investigador, es una herramienta que puede ayudar al resultado final.</Text>
                                <Text style={styles.termsItem}><Text style={styles.bold}>4.</Text> Toda la información contenida en la aplicación ARTICIEN, incluidos, entre otros, textos, gráficos, imágenes, información, consejos, sitios web, enlaces y / o cualquier otro material contenido en el presente documento tiene únicamente fines informativos y educativos.</Text>
                                <Text style={styles.termsItem}><Text style={styles.bold}>5.</Text> Al utilizar la aplicación ARTICIEN, el usuario, consumidor, el lector y / o el espectador reconocen por este medio que es su responsabilidad exclusiva revisar esta exención de responsabilidad y cualquier otra exención de responsabilidad o renuncia.</Text>
                            </View>

                            <Button
                                mode="contained"
                                onPress={toggleTermsAccepted}
                                style={styles.conformeButton}
                                contentStyle={{ height: 50 }}
                                labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                            >
                                CONFORME
                            </Button>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Branding Header */}
                <View style={styles.brandingContainer}>
                    <Text variant="displayMedium" style={styles.appTitle}>ARTICIEN</Text>
                    <Chip icon="school" style={styles.logoChip} textStyle={{ fontWeight: 'bold' }}>AI Assistant</Chip>
                    <Text variant="labelLarge" style={styles.authorCredit}>por DIEGO BARBADILLA MESA</Text>
                </View>

                <Card style={styles.card}>
                    <Card.Title title="1. Inicio - Marco Teórico" subtitle="Sube tu Marco Teórico y configura el análisis." />
                    <Card.Content>

                        {/* Upload Section */}
                        <View style={styles.section}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>1. Subir PDF Marco Teórico</Text>
                            <Button
                                mode={state.marcoTeoricoFile ? "outlined" : "contained-tonal"}
                                icon={state.marcoTeoricoFile ? "check" : "upload"}
                                onPress={handleUploadMT}
                            >
                                {state.marcoTeoricoFile ? `Archivo Cargado: ${state.marcoTeoricoFile.name}` : "SELECCIONAR PDF"}
                            </Button>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Question 1 */}
                        <View style={styles.section}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>2. Vacíos Temáticos</Text>
                            <SegmentedButtons
                                value={state.vaciosTematicos}
                                onValueChange={setVaciosTematicos}
                                buttons={[
                                    { value: '1', label: '1' },
                                    { value: '2', label: '2' },
                                    { value: '3', label: '3' },
                                    { value: '4', label: '4' },
                                ]}
                            />
                            {state.vaciosTematicos && <Chip icon="check" style={styles.chip}>Opción {state.vaciosTematicos} seleccionada</Chip>}
                        </View>

                        {/* Question 2 */}
                        <View style={styles.section}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>3. Antecedentes</Text>
                            <SegmentedButtons
                                value={state.antecedentes}
                                onValueChange={setAntecedentes}
                                buttons={[
                                    { value: 'A', label: 'Opción A' },
                                    { value: 'B', label: 'Opción B' },
                                    { value: 'C', label: 'Opción C' },
                                ]}
                            />
                            {state.antecedentes && <Chip icon="check" style={styles.chip}>Antecedentes {state.antecedentes} seleccionados</Chip>}
                        </View>

                        {/* Question 3 */}
                        <View style={styles.section}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>4. Enfoque</Text>
                            <SegmentedButtons
                                value={state.enfoque}
                                onValueChange={setEnfoque}
                                buttons={[
                                    { value: '1', label: 'Enfoque 1' },
                                    { value: '2', label: 'Enfoque 2' },
                                    { value: '3', label: 'Enfoque 3' },
                                ]}
                            />
                            {state.enfoque && <Chip icon="check" style={styles.chip}>Enfoque {state.enfoque} seleccionado</Chip>}
                        </View>

                        {/* Summary Cards (Dynamic) */}
                        {isFormComplete && (
                            <View style={styles.summaryContainer}>
                                <Card style={styles.summaryCard}>
                                    <Card.Content>
                                        <Text variant="bodySmall">Resumen de selección:</Text>
                                        <Text variant="bodyMedium">Vacíos: {state.vaciosTematicos} | Ant: {state.antecedentes} | Enf: {state.enfoque}</Text>
                                    </Card.Content>
                                </Card>
                            </View>
                        )}

                    </Card.Content>
                    <Card.Actions style={styles.actions}>
                        <Button mode="contained" onPress={() => router.push('/bibliografia')} disabled={!isFormComplete}>
                            SIGUIENTE
                        </Button>
                    </Card.Actions>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 600,
        padding: 8,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        marginBottom: 8,
    },
    brandingContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    appTitle: {
        fontWeight: 'bold',
        color: '#005f73',
        marginBottom: 4,
    },
    logoChip: {
        backgroundColor: '#e0f7fa',
        marginVertical: 8,
    },
    authorCredit: {
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
    },
    divider: {
        marginVertical: 16,
    },
    chip: {
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    summaryContainer: {
        marginTop: 16,
    },
    summaryCard: {
        backgroundColor: '#e0f7fa',
    },
    actions: {
        justifyContent: 'flex-end',
        paddingTop: 16,
    },
    termsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#005f73',
        textAlign: 'center',
        marginBottom: 16,
    },
    termsIntro: {
        fontSize: 16,
        textAlign: 'justify',
        marginBottom: 20,
        lineHeight: 24,
    },
    termsList: {
        marginBottom: 24,
    },
    termsItem: {
        fontSize: 15,
        textAlign: 'justify',
        marginBottom: 12,
        lineHeight: 22,
        color: '#333',
    },
    bold: {
        fontWeight: 'bold',
    },
    conformeButton: {
        marginTop: 16,
        borderRadius: 8,
    },
});
