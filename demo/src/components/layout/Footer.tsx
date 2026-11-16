import React from "react";
import { useTheme } from "../../context/ThemeContext";

// lucide-react v1 removed brand icons, so the GitHub mark is inlined here.
const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
);

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
