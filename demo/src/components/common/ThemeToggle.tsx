import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { SunIcon, MoonIcon } from "lucide-react";

interface ThemeToggleProps {
    className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode
                    ? "text-yellow-300 hover:text-yellow-200 focus:ring-yellow-500"
                    : "text-gray-600 hover:text-gray-900 focus:ring-indigo-500"
            } transition-colors ${className}`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
    );
};

export default ThemeToggle;
