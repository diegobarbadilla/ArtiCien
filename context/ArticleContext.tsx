import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as DocumentPicker from 'expo-document-picker';

// Define the shape of the data
export interface ArticleState {
    title: string;
    authors: string; // Stored as a comma-separated string for simple input
    theme: string;
    vaciosTematicos: string;
    antecedentes: string;
    enfoque: string;
    customRules: string;
    marcoTeoricoFile: DocumentPicker.DocumentPickerAsset | null;
    bibliography: DocumentPicker.DocumentPickerAsset[];
    sections: {
        introduccion: string;
        marcoTeorico: string;
        otras: string;
        metodologia: string;
        resultados: string;
        discusion: string;
        conclusiones: string;
        recomendaciones: string;
        articulo: string; // The full text or final adjustments
    };
    pageCounts: {
        introduccion: string;
        marcoTeorico: string;
        otras: string;
        metodologia: string;
        resultados: string;
        discusion: string;
        conclusiones: string;
        recomendaciones: string;
        articulo: string;
    };
    termsAccepted: boolean;
}

// Define the context shape
interface ArticleContextType {
    state: ArticleState;
    setTitle: (title: string) => void;
    setAuthors: (authors: string) => void;
    setTheme: (theme: string) => void;
    setVaciosTematicos: (value: string) => void;
    setAntecedentes: (value: string) => void;
    setEnfoque: (value: string) => void;
    setCustomRules: (value: string) => void;
    setMarcoTeoricoFile: (file: DocumentPicker.DocumentPickerAsset | null) => void;
    addFile: (file: DocumentPicker.DocumentPickerAsset) => void;
    removeFile: (uri: string) => void;
    setSectionContent: (section: keyof ArticleState['sections'], content: string) => void;
    setSectionPageCount: (section: keyof ArticleState['pageCounts'], count: string) => void;
    toggleTermsAccepted: () => void;
}

// Initial State
const initialState: ArticleState = {
    title: '',
    authors: '',
    theme: '',
    vaciosTematicos: '',
    antecedentes: '',
    enfoque: '',
    customRules: '',
    marcoTeoricoFile: null,
    bibliography: [],
    sections: {
        introduccion: '',
        marcoTeorico: '',
        otras: '',
        metodologia: '',
        resultados: '',
        discusion: '',
        conclusiones: '',
        recomendaciones: '',
        articulo: '',
    },
    pageCounts: {
        introduccion: '',
        marcoTeorico: '',
        otras: '',
        metodologia: '',
        resultados: '',
        discusion: '',
        conclusiones: '',
        recomendaciones: '',
        articulo: '',
    },
    termsAccepted: false,
};

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
    // Attempt to load from localStorage on initialization
    const [state, setState] = useState<ArticleState>(() => {
        try {
            if (typeof window !== 'undefined') {
                const saved = window.localStorage.getItem('artiCienState');
                if (saved) {
                    return JSON.parse(saved);
                }
            }
        } catch (e) {
            console.error("Failed to load state from localStorage", e);
        }
        return initialState;
    });

    // Save to localStorage whenever state changes
    React.useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                // Exclude file objects if they cause issues, but for now try saving everything.
                // If files are huge, this might fail, but text content is priority.
                window.localStorage.setItem('artiCienState', JSON.stringify(state));
            }
        } catch (e) {
            console.error("Failed to save state to localStorage", e);
        }
    }, [state]);

    const setTitle = (title: string) => setState(prev => ({ ...prev, title }));
    const setAuthors = (authors: string) => setState(prev => ({ ...prev, authors }));
    const setTheme = (theme: string) => setState(prev => ({ ...prev, theme }));
    const setVaciosTematicos = (val: string) => setState(prev => ({ ...prev, vaciosTematicos: val }));
    const setAntecedentes = (val: string) => setState(prev => ({ ...prev, antecedentes: val }));
    const setEnfoque = (val: string) => setState(prev => ({ ...prev, enfoque: val }));
    const setCustomRules = (val: string) => setState(prev => ({ ...prev, customRules: val }));
    const setMarcoTeoricoFile = (file: DocumentPicker.DocumentPickerAsset | null) => setState(prev => ({ ...prev, marcoTeoricoFile: file }));

    const addFile = (file: DocumentPicker.DocumentPickerAsset) => {
        setState(prev => ({ ...prev, bibliography: [...prev.bibliography, file] }));
    };

    const removeFile = (uri: string) => {
        setState(prev => ({ ...prev, bibliography: prev.bibliography.filter(f => f.uri !== uri) }));
    };

    const setSectionContent = (section: keyof ArticleState['sections'], content: string) => {
        setState(prev => ({
            ...prev,
            sections: { ...prev.sections, [section]: content }
        }));
    };

    const setSectionPageCount = (section: keyof ArticleState['pageCounts'], count: string) => {
        setState(prev => ({
            ...prev,
            pageCounts: { ...prev.pageCounts, [section]: count }
        }));
    };

    const toggleTermsAccepted = () => setState(prev => ({ ...prev, termsAccepted: !prev.termsAccepted }));

    return (
        <ArticleContext.Provider value={{
            state,
            setTitle,
            setAuthors,
            setTheme,
            setVaciosTematicos,
            setAntecedentes,
            setEnfoque,
            setCustomRules,
            setMarcoTeoricoFile,
            addFile,
            removeFile,
            setSectionContent,
            setSectionPageCount,
            toggleTermsAccepted
        }}>
            {children}
        </ArticleContext.Provider>
    );
};

export const useArticle = () => {
    const context = useContext(ArticleContext);
    if (!context) {
        throw new Error('useArticle must be used within an ArticleProvider');
    }
    return context;
};
