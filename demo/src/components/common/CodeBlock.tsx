import React, { useEffect, useState, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Dark theme
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import { useTheme } from "../../context/ThemeContext";
import { ClipboardIcon, ClipboardCheckIcon } from "lucide-react";

interface CodeBlockProps {
    code: string;
    language: string;
    showLineNumbers?: boolean;
    caption?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, showLineNumbers = true, caption }) => {
    const { darkMode } = useTheme();
    const [copied, setCopied] = useState(false);
    const codeRef = useRef<HTMLElement>(null);

    // Map common language shortcuts to their Prism-supported language
    const normalizeLanguage = (lang: string) => {
        const languageMap: { [key: string]: string } = {
            js: "javascript",
            ts: "typescript",
            jsx: "jsx",
            tsx: "tsx",
            bash: "bash",
            sh: "bash",
            json: "json",
            py: "python",
            python: "python",
            html: "html",
            css: "css",
        };

        return languageMap[lang.toLowerCase()] || lang;
    };

    const normalizedLanguage = normalizeLanguage(language);

    useEffect(() => {
        if (codeRef.current) {
            // Manually set the language class to ensure proper highlighting
            codeRef.current.className = `language-${normalizedLanguage}`;

            // Capture the element to ensure it's not null in the timeout callback
            const highlightedEl = codeRef.current;
            // Force Prism to highlight the code
            setTimeout(() => Prism.highlightElement(highlightedEl), 0);
        }
    }, [code, normalizedLanguage, darkMode]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Custom styles to fix light mode syntax highlighting
    const lightModeStyles = !darkMode
        ? {
              style: {
                  color: "#24292e",
                  backgroundColor: "#f6f8fa",
              },
          }
        : {};

    return (
        <div className="relative my-6">
            {caption && (
                <div
                    className={`px-4 py-2 text-sm font-medium ${
                        darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                    } rounded-t-lg border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    {caption}
                </div>
            )}
            <div className={`relative rounded-lg ${caption ? "rounded-t-none" : ""} overflow-hidden`}>
                <button
                    onClick={copyToClipboard}
                    className={`absolute right-2 top-2 p-2 rounded-md transition-colors ${
                        darkMode
                            ? "text-gray-400 hover:text-white hover:bg-gray-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    } focus:outline-none z-10`}
                    aria-label="Copy code">
                    {copied ? <ClipboardCheckIcon className="h-5 w-5" /> : <ClipboardIcon className="h-5 w-5" />}
                </button>
                <pre
                    className={`${showLineNumbers ? "line-numbers" : ""} overflow-x-auto ${
                        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
                    }`}
                    {...lightModeStyles}>
                    <code ref={codeRef} className={`language-${normalizedLanguage}`}>
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;
