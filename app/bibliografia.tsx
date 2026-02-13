import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { Card, Text, Button, List, IconButton, useTheme, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useArticle } from '../context/ArticleContext';

export default function BibliografiaScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { state, addFile, removeFile } = useArticle();
    const [showAllFiles, setShowAllFiles] = React.useState(false);

    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
                multiple: true
            });

            if (!result.canceled && result.assets) {
                result.assets.forEach(asset => addFile(asset));
            }
        } catch (err) {
            console.error("Error picking document:", err);
        }
    };

    const handleFinal = () => {
        if (Platform.OS === 'web') {
            window.alert('Carga de bibliografía finalizada. Puede continuar.');
        } else {
            Alert.alert('Completado', 'Carga de bibliografía finalizada. Puede continuar.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Card style={styles.card}>
                    <Card.Title title="2. Bibliografía" subtitle="Sube un mínimo de 10 papers académicos." />
                    <Card.Content>

                        <View style={styles.uploadContainer}>
                            <Button mode="contained-tonal" icon="upload" onPress={handleUpload} style={styles.uploadBtn}>
                                SUBIR PDF
                            </Button>
                            <Text variant="titleMedium" style={styles.counter}>
                                Archivos subidos: {state.bibliography.length}
                            </Text>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.fileList}>
                            {state.bibliography.length === 0 ? (
                                <Text style={styles.emptyText}>No hay archivos subidos aún.</Text>
                            ) : (
                                <>
                                    {state.bibliography.slice(0, showAllFiles ? undefined : 3).map((file, index) => (
                                        <List.Item
                                            key={index}
                                            title={file.name}
                                            description={`${(file.size ? file.size / 1024 : 0).toFixed(2)} KB`}
                                            left={props => <List.Icon {...props} icon="file-pdf-box" />}
                                            right={props => <IconButton {...props} icon="delete" onPress={() => removeFile(file.uri)} />}
                                        />
                                    ))}
                                    {state.bibliography.length > 3 && (
                                        <Button
                                            mode="text"
                                            onPress={() => setShowAllFiles(!showAllFiles)}
                                            style={{ marginTop: 8 }}
                                        >
                                            {showAllFiles ? 'Ver menos' : `Ver más (${state.bibliography.length - 3})`}
                                        </Button>
                                    )}
                                </>
                            )}
                        </View>

                    </Card.Content>
                    <Card.Actions style={styles.actions}>
                        <Button mode="outlined" onPress={() => router.push('/')}>
                            VOLVER
                        </Button>

                        <Button mode="outlined" onPress={handleFinal} disabled={state.bibliography.length === 0}>
                            FINALIZAR CARGA
                        </Button>

                        <Button mode="contained" onPress={() => router.push('/reglas')} disabled={state.bibliography.length < 1}>
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
    uploadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    uploadBtn: {
        flex: 1,
        marginRight: 16,
    },
    counter: {
        fontWeight: 'bold',
    },
    divider: {
        marginVertical: 8,
    },
    fileList: {
        marginBottom: 16,
    },
    emptyText: {
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 16,
        color: '#888',
    },
    actions: {
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
    },
});
