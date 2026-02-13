import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, Divider, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface SectionTemplateProps {
    title: string;
    description: string;
    nextRoute: string;
    prevRoute?: string;
    isLast?: boolean;
    pageCount: string;
    setPageCount: (text: string) => void;
    content: string;
    setContent: (text: string) => void;
    onGenerate?: () => void;
    isGenerating?: boolean;
    children?: React.ReactNode;
}

export default function SectionTemplate({
    title,
    description,
    nextRoute,
    prevRoute,
    isLast = false,
    pageCount,
    setPageCount,
    content,
    setContent,
    onGenerate,
    isGenerating = false,
    children
}: SectionTemplateProps) {
    const theme = useTheme();
    const router = useRouter();

    const handleDownload = () => {
        // In a real app, this would generate a PDF or .docx
        alert(`Descargando contenido de: ${title}`);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Card style={styles.card}>
                    <Card.Title title={title} subtitle={description} titleStyle={styles.title} />
                    <Card.Content>
                        {/* Custom Children (Wizard, etc.) */}
                        {children}

                        {/* Page Count Input */}
                        <TextInput
                            label="Número de páginas a desarrollar"
                            value={pageCount}
                            onChangeText={setPageCount}
                            keyboardType="numeric"
                            mode="outlined"
                            style={styles.input}
                        />

                        {onGenerate && (
                            <Button
                                mode="contained"
                                icon="creation"
                                onPress={onGenerate}
                                loading={isGenerating}
                                disabled={isGenerating}
                                style={styles.aiButton}
                            >
                                GENERAR con IA
                            </Button>
                        )}

                        <Divider style={styles.divider} />

                        {/* Content Input */}
                        <Text variant="titleMedium" style={styles.subtitle}>Contenido de la Sección</Text>
                        <TextInput
                            mode="outlined"
                            multiline
                            numberOfLines={10}
                            placeholder={`Escribe aquí el contenido de ${title}...`}
                            value={content}
                            onChangeText={setContent}
                            style={styles.textArea}
                        />

                    </Card.Content>

                    <Card.Actions style={styles.actions}>
                        {prevRoute && (
                            <Button mode="outlined" onPress={() => router.push(prevRoute)}>
                                VOLVER
                            </Button>
                        )}

                        <Button mode="contained-tonal" icon="download" onPress={handleDownload}>
                            DESCARGAR
                        </Button>

                        {!isLast && (
                            <Button mode="contained" onPress={() => router.push(nextRoute)}>
                                CONTINUAR
                            </Button>
                        )}
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
        maxWidth: 800,
        padding: 8,
    },
    input: {
        marginBottom: 8,
    },
    aiButton: {
        marginBottom: 8,
    },
    divider: {
        marginVertical: 16,
    },
    subtitle: {
        marginBottom: 8,
        fontWeight: 'bold',
    },
    textArea: {
        backgroundColor: '#fff',
        marginBottom: 24,
        minHeight: 200,
    },
    actions: {
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
    },
});
