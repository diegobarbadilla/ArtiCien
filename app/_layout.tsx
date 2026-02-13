import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { ArticleProvider } from '../context/ArticleContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#005f73', // Academic Blue/Teal
    secondary: '#94d2bd',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#212529',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <ArticleProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen name="index" options={{ title: 'ARTICIEN' }} />
            <Stack.Screen name="bibliografia" options={{ title: 'Bibliografía' }} />
            <Stack.Screen name="reglas" options={{ title: 'Reglas' }} />
            {/* Add other screens here as they are created, or rely on file-based routing auto-discovery */}
          </Stack>
        </ArticleProvider>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
