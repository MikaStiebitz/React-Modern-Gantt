import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
    applyLightModeStyles: () => {
        background: string;
        text: string;
        border: string;
        cardBg: string;
        cardBorder: string;
        secondaryBg: string;
        btnPrimary: string;
        btnHover: string;
        highlight: string;
    };
    applyDarkModeStyles: () => {
        background: string;
        text: string;
        border: string;
        cardBg: string;
        cardBorder: string;
        secondaryBg: string;
        btnPrimary: string;
        btnHover: string;
        highlight: string;
    };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Initialize from localStorage or system preference
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme === "dark";
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        // Update document class and localStorage when theme changes
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            document.body.style.backgroundColor = "#111827"; // gray-900
            document.body.style.color = "#f9fafb"; // gray-50
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            document.body.style.backgroundColor = "#ffffff"; // white
            document.body.style.color = "#111827"; // gray-900
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Enhanced light mode styles with more pleasing colors
    const applyLightModeStyles = () => ({
        background: "bg-white",
        text: "text-gray-800",
        border: "border-gray-200",
        cardBg: "bg-white",
        cardBorder: "border-gray-200",
        secondaryBg: "bg-gray-50",
        btnPrimary: "bg-indigo-600",
        btnHover: "hover:bg-indigo-700",
        highlight: "bg-indigo-50 text-indigo-700",
    });

    // Dark mode styles
    const applyDarkModeStyles = () => ({
        background: "bg-gray-900",
        text: "text-white",
        border: "border-gray-700",
        cardBg: "bg-gray-800",
        cardBorder: "border-gray-700",
        secondaryBg: "bg-gray-800",
        btnPrimary: "bg-indigo-600",
        btnHover: "hover:bg-indigo-700",
        highlight: "bg-gray-800 text-indigo-400",
    });

    return (
        <ThemeContext.Provider
            value={{
                darkMode,
                toggleDarkMode,
                applyLightModeStyles,
                applyDarkModeStyles,
            }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
