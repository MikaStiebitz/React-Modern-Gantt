import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import { Menu, Search, ChartGantt, Star } from "lucide-react";
import { motion } from "framer-motion";
import SearchModal from "../common/SearchModal";

// Import shadcn components
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const Navbar: React.FC = () => {
    const { darkMode } = useTheme();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [packageVersion, setPackageVersion] = useState<string>("");
    const location = useLocation();

    useEffect(() => {
        // Fetch latest version from NPM registry
        fetch("https://registry.npmjs.org/react-modern-gantt/latest")
            .then(response => response.json())
            .then(data => {
                setPackageVersion(data.version);
            })
            .catch(error => {
                console.error("Failed to fetch package version:", error);
            });
    }, []);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const openSearchModal = () => {
        setIsSearchOpen(true);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`sticky top-0 z-50 ${
                    darkMode ? "bg-gray-900 border-b border-gray-800" : "bg-white border-b border-gray-100"
                } shadow-sm transition-colors duration-200`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <ChartGantt className={`h-8 w-8 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                                <span className={`ml-2 text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    React Modern Gantt
                                </span>
                                {packageVersion && (
                                    <span
                                        className={`ml-2 px-2 py-0.5 text-xs font-medium rounded ${
                                            darkMode
                                                ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700"
                                                : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                        }`}>
                                        v{packageVersion}
                                    </span>
                                )}
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    to="/"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive("/")
                                            ? `${darkMode ? "border-indigo-400 text-indigo-300" : "border-indigo-500 text-indigo-700"}`
                                            : `${
                                                  darkMode
                                                      ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-200"
                                                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                              }`
                                    }`}>
                                    Home
                                </Link>
                                <Link
                                    to="/components"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive("/components")
                                            ? `${darkMode ? "border-indigo-400 text-indigo-300" : "border-indigo-500 text-indigo-700"}`
                                            : `${
                                                  darkMode
                                                      ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-200"
                                                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                              }`
                                    }`}>
                                    Components
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="max-w-lg w-full lg:max-w-xs ml-4 hidden sm:block">
                                <Button
                                    variant="outline"
                                    onClick={openSearchModal}
                                    className={`w-full justify-between ${
                                        darkMode
                                            ? "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                    }`}>
                                    <div className="flex items-center">
                                        <Search className="h-4 w-4 mr-2" />
                                        <span>Search docs...</span>
                                    </div>
                                    <kbd
                                        className={`pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-xs ${
                                            darkMode
                                                ? "border-gray-700 bg-gray-900 text-gray-400"
                                                : "border-gray-200 bg-gray-100 text-gray-500"
                                        }`}>
                                        ⌘K
                                    </kbd>
                                </Button>
                            </div>

                            {/* GitHub Star Button */}
                            <a
                                href="https://github.com/MikaStiebitz/React-Modern-Gantt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-3 hidden sm:block">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`flex items-center gap-2 ${
                                        darkMode
                                            ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}>
                                    <Star className="h-4 w-4" />
                                    <span className="hidden md:inline">Star on GitHub</span>
                                </Button>
                            </a>

                            <ThemeToggle className="ml-3" />

                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="ml-2 sm:hidden">
                                        <Menu className="h-6 w-6" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className={darkMode ? "bg-gray-900 text-white" : "bg-white"}>
                                    <div className="flex flex-col space-y-4 mt-6">
                                        <Link
                                            to="/"
                                            className={`px-3 py-2 rounded-md text-base font-medium ${
                                                isActive("/")
                                                    ? `${darkMode ? "bg-gray-800 text-indigo-300" : "bg-indigo-50 text-indigo-700"}`
                                                    : `${
                                                          darkMode
                                                              ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                      }`
                                            }`}>
                                            Home
                                        </Link>
                                        <Link
                                            to="/components"
                                            className={`px-3 py-2 rounded-md text-base font-medium ${
                                                isActive("/components")
                                                    ? `${darkMode ? "bg-gray-800 text-indigo-300" : "bg-indigo-50 text-indigo-700"}`
                                                    : `${
                                                          darkMode
                                                              ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                      }`
                                            }`}>
                                            Components
                                        </Link>

                                        <Button
                                            variant="outline"
                                            onClick={openSearchModal}
                                            className={`justify-between ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                            }`}>
                                            <div className="flex items-center">
                                                <Search className="h-4 w-4 mr-2" />
                                                <span>Search docs...</span>
                                            </div>
                                            <kbd
                                                className={`pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-xs ${
                                                    darkMode
                                                        ? "border-gray-700 bg-gray-900 text-gray-400"
                                                        : "border-gray-200 bg-gray-100 text-gray-500"
                                                }`}>
                                                ⌘K
                                            </kbd>
                                        </Button>

                                        <a
                                            href="https://github.com/MikaStiebitz/React-Modern-Gantt"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full">
                                            <Button
                                                variant="outline"
                                                className={`w-full justify-center ${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                                                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}>
                                                <Star className="h-4 w-4 mr-2" />
                                                <span>Star on GitHub</span>
                                            </Button>
                                        </a>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </motion.nav>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Navbar;
