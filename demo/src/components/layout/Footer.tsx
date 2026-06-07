import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { GithubIcon } from "lucide-react";

const Footer: React.FC = () => {
    const { darkMode } = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className={`py-8 ${
                darkMode ? "bg-gray-900 text-gray-400" : "bg-gray-100 text-gray-600"
            } transition-colors duration-200`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm">
                            React Modern Gantt - A flexible, customizable Gantt chart component for React
                        </p>
                        <p className="text-sm mt-1">© {currentYear} All rights reserved. MIT License.</p>
                    </div>
                    <div className="flex space-x-6">
                        <a
                            href="https://github.com/MikaStiebitz/React-Modern-Gantt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${
                                darkMode ? "hover:text-white" : "hover:text-gray-900"
                            } transition-colors`}>
                            <span className="sr-only">GitHub</span>
                            <GithubIcon className="h-6 w-6" />
                        </a>
                        <a
                            href="https://www.npmjs.com/package/react-modern-gantt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${
                                darkMode ? "hover:text-white" : "hover:text-gray-900"
                            } transition-colors`}>
                            <span className="sr-only">NPM</span>
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M0 0v24h24v-24h-24zm19.2 19.2h-2.4v-9.6h-4.8v9.6h-7.2v-14.4h14.4v14.4z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
