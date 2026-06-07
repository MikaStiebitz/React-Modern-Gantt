// In src/components/demo/CodeExample.tsx

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import CodeBlock from "../common/CodeBlock";

// Import shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface CodeExampleProps {
    title: string;
    description?: string;
    code: string;
    language: string;
    demoComponent?: React.ReactNode; // Optional demo component
    showCopyButton?: boolean;
    defaultTab?: "demo" | "code"; // NEW: Allow setting the default tab
}

const CodeExample: React.FC<CodeExampleProps> = ({
    title,
    description,
    code,
    language,
    demoComponent,
    defaultTab = "demo", // Default to 'demo' if not specified
}) => {
    const { darkMode } = useTheme();

    // If no demo component is provided, just show the code example
    if (!demoComponent) {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                    <CardHeader
                        className={`pb-2 ${darkMode ? "border-b border-gray-700" : "border-b border-gray-200"}`}>
                        <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>{title}</CardTitle>
                        {description && (
                            <CardDescription className={darkMode ? "text-gray-400" : "text-gray-500"}>
                                {description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-1">
                            <CodeBlock code={code} language={language} showLineNumbers={true} />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    // If a demo component is provided, show both code and demo in tabs
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <CardHeader className={darkMode ? "border-b border-gray-700" : "border-b border-gray-200"}>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>{title}</CardTitle>
                            {description && (
                                <CardDescription className={darkMode ? "text-gray-400" : "text-gray-500"}>
                                    {description}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs defaultValue={defaultTab} className="w-full">
                        {/* Updated tab switch */}
                        <div
                            className={`px-4 py-3 border-b ${
                                darkMode ? "bg-gray-900/60 border-gray-700" : "bg-gray-50 border-gray-200"
                            }`}>
                            {/* Optimized TabsList styling */}
                            <div className="flex">
                                <div
                                    className={`overflow-hidden rounded-lg ${
                                        darkMode ? "bg-gray-800/80" : "bg-white/80"
                                    } shadow-sm p-1`}>
                                    <TabsList className="flex gap-1 bg-transparent border-0">
                                        <TabsTrigger
                                            value="demo"
                                            className={`px-6 py-2 rounded-md font-medium transition-all text-base min-w-20 ${
                                                darkMode
                                                    ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-300 data-[state=inactive]:hover:bg-gray-700"
                                                    : "data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-700 data-[state=inactive]:hover:bg-gray-100"
                                            }`}>
                                            Demo
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="code"
                                            className={`px-6 py-2 rounded-md font-medium transition-all text-base min-w-20 ${
                                                darkMode
                                                    ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-300 data-[state=inactive]:hover:bg-gray-700"
                                                    : "data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-700 data-[state=inactive]:hover:bg-gray-100"
                                            }`}>
                                            Code
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>
                        </div>

                        <TabsContent value="demo" className="p-6">
                            {demoComponent}
                        </TabsContent>

                        <TabsContent value="code" className="p-0">
                            <div className={darkMode ? "bg-gray-900" : "bg-white"}>
                                <CodeBlock code={code} language={language} showLineNumbers={true} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CodeExample;
