import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, List, Button, useTheme, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useArticle } from '../context/ArticleContext';

export default function ReglasScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { state, setCustomRules } = useArticle();
    const [expanded, setExpanded] = useState<string | null>('rule1');
    const [showFullRule1, setShowFullRule1] = useState(false);

    const handlePress = (accordianId: string) => {
        setExpanded(expanded === accordianId ? null : accordianId);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Card style={styles.card}>
                    <Card.Title title="3. Reglas" subtitle="Directrices para la redacción científica." />
                    <Card.Content>
                        <List.Section>
                            {/* Rule 1: Custom Truncation Logic */}
                            <List.Accordion
                                title="Regla 1: Experto Académico"
                                left={props => <List.Icon {...props} icon="account-tie" />}
                                expanded={expanded === 'rule1'}
                                onPress={() => handlePress('rule1')}
                            >
                                <View style={styles.accordionContent}>
                                    <Text variant="bodyMedium">
                                        Eres un experto en redacción de textos académicos y científicos. Tu misión es generar texto de calidad revisado por pares...
                                    </Text>

                                    {!showFullRule1 ? (
                                        <Button onPress={() => setShowFullRule1(true)} compact style={styles.showMoreBtn}>
                                            Seguir viendo
                                        </Button>
                                    ) : (
                                        <>
                                            <Text variant="bodyMedium" style={styles.marginTop}>
                                                ...con precisión conceptual y coherencia argumental.
                                            </Text>
                                            <Text variant="bodyMedium" style={styles.marginTop}>
                                                Instrucciones: Tono profesional, objetivo, vocabulario técnico preciso, fuentes académicas verificables (artículos indexados), citas con DOI, voz impersonal.
                                            </Text>
                                            <Button onPress={() => setShowFullRule1(false)} compact style={styles.showMoreBtn}>
                                                Ver menos
                                            </Button>
                                        </>
                                    )}
                                </View>
                            </List.Accordion>

                            <List.Accordion
                                title="Regla 2: Adaptación al Tema"
                                left={props => <List.Icon {...props} icon="target" />}
                                expanded={expanded === 'rule2'}
                                onPress={() => handlePress('rule2')}
                            >
                                <View style={styles.accordionContent}>
                                    <Text variant="bodyMedium">
                                        Todo el contenido debe adaptarse al Tema de Investigación, Pregunta de Investigación y respuestas del paso 1 (Vacíos, Antecedentes, Enfoque), basado en el Marco Teórico subido.
                                    </Text>
                                </View>
                            </List.Accordion>

                            <List.Accordion
                                title="Regla 3: Formato APA 7"
                                left={props => <List.Icon {...props} icon="format-quote-close" />}
                                expanded={expanded === 'rule3'}
                                onPress={() => handlePress('rule3')}
                            >
                                <View style={styles.accordionContent}>
                                    <Text variant="bodyMedium">
                                        El desarrollo se basará en los archivos PDF subidos, con citas narrativas y parentéticas ajustadas al formato APA 7.
                                    </Text>
                                </View>
                            </List.Accordion>

                            {/* New Rule: Custom Rules */}
                            <List.Accordion
                                title="Reglas Personales (Opcional)"
                                left={props => <List.Icon {...props} icon="pencil-plus" />}
                                expanded={expanded === 'customRules'}
                                onPress={() => handlePress('customRules')}
                            >
                                <View style={styles.accordionContent}>
                                    <TextInput
                                        mode="outlined"
                                        label="Añade tus propias reglas aquí..."
                                        placeholder="Ej: Usar un tono más divulgativo, evitar tecnicismos..."
                                        multiline
                                        numberOfLines={4}
                                        value={state.customRules}
                                        onChangeText={setCustomRules}
                                        style={styles.textArea}
                                    />
                                </View>
                            </List.Accordion>

                        </List.Section>
                    </Card.Content>

                    <Card.Actions style={styles.actions}>
                        <Button mode="outlined" onPress={() => router.push('/bibliografia')}>
                            VOLVER
                        </Button>
                        <Button mode="contained" onPress={() => router.push('/introduccion')}>
                            CONTINUAR
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
    accordionContent: {
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    marginTop: {
        marginTop: 8,
    },
    actions: {
        justifyContent: 'space-between',
        paddingTop: 16,
    },
    showMoreBtn: {
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    textArea: {
        backgroundColor: '#fff',
        marginTop: 8,
    },
});
