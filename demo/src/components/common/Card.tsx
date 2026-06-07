import React, { ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";

interface CardProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    footer?: ReactNode;
    className?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    noPadding?: boolean;
    noBorder?: boolean;
    hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    title,
    subtitle,
    footer,
    className = "",
    headerClassName = "",
    bodyClassName = "",
    footerClassName = "",
    noPadding = false,
    noBorder = false,
    hoverable = false,
}) => {
    const { darkMode } = useTheme();

    return (
        <div
            className={`overflow-hidden rounded-lg transition-all duration-200 ${
                !noBorder ? (darkMode ? "border border-gray-700" : "border border-gray-200") : ""
            } ${darkMode ? "bg-gray-800" : "bg-white"} ${
                hoverable ? (darkMode ? "hover:bg-gray-700 hover:shadow-lg" : "hover:shadow-lg") : ""
            } ${className}`}>
            {(title || subtitle) && (
                <div
                    className={`${darkMode ? "border-gray-700" : "border-gray-200"} ${
                        title && subtitle ? "pb-3" : "pb-2"
                    } ${!noPadding ? "px-4 pt-4" : "px-2 pt-2"} ${headerClassName}`}>
                    {title && <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{title}</h3>}
                    {subtitle && (
                        <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{subtitle}</p>
                    )}
                </div>
            )}

            <div
                className={`${!noPadding ? "p-4" : ""} ${
                    title || subtitle ? (darkMode ? "border-t border-gray-700" : "border-t border-gray-200") : ""
                } ${bodyClassName}`}>
                {children}
            </div>

            {footer && (
                <div
                    className={`${!noPadding ? "px-4 py-3" : "px-2 py-2"} ${
                        darkMode ? "bg-gray-900 border-t border-gray-700" : "bg-gray-50 border-t border-gray-200"
                    } ${footerClassName}`}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
