import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ComponentsPage from "./pages/ComponentsPage";
import "./App.css";

// Animated page transitions component
const AnimatedRoutes = () => {
    const location = useLocation();

    // Scroll to top when navigating
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route
                    path="/"
                    element={
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}>
                            <HomePage />
                        </motion.div>
                    }
                />
                <Route
                    path="/components"
                    element={
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}>
                            <ComponentsPage />
                        </motion.div>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <AnimatedRoutes />
                    </main>
                    <Footer />
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;
