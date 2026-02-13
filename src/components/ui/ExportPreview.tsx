import React, { useEffect, useState } from "react";
import { ExportFormat } from "@/types";

/**
 * Props for ExportPreview component
 */
export interface ExportPreviewProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Data URL or Blob URL to preview
   */
  previewUrl: string | null;

  /**
   * Format of the preview
   */
  format: ExportFormat;

  /**
   * Filename for download
   */
  filename?: string;

  /**
   * Custom title
   */
  title?: string;

  /**
   * Dark mode
   */
  darkMode?: boolean;

  /**
   * Show download button
   * @default true
   */
  showDownload?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

/**
 * ExportPreview Component
 * A modal for previewing exported Gantt charts before download
 *
 * @example
 * ```tsx
 * import { ExportPreview, useGanttExport } from 'react-modern-gantt';
 *
 * function MyComponent() {
 *   const { ganttRef, getDataUrl } = useGanttExport();
 *   const [previewUrl, setPreviewUrl] = useState(null);
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   const handlePreview = async () => {
 *     const url = await getDataUrl('png');
 *     setPreviewUrl(url);
 *     setIsOpen(true);
 *   };
 *
 *   return (
 *     <>
 *       <GanttChart ref={ganttRef} tasks={tasks} />
 *       <button onClick={handlePreview}>Preview Export</button>
 *       <ExportPreview
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *         previewUrl={previewUrl}
 *         format="png"
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export const ExportPreview: React.FC<ExportPreviewProps> = ({
  isOpen,
  onClose,
  previewUrl,
  format,
  filename = "gantt-chart",
  title,
  darkMode = false,
  showDownload = true,
  className = "",
  style,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Reset image loaded state whenever preview URL or open state changes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsImageLoaded(false);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, previewUrl]);

  const handleDownload = () => {
    if (!previewUrl) return;

    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalTitle = title || `Export Preview - ${format.toUpperCase()}`;

  const backdropStyles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
    borderRadius: "12px",
    maxWidth: "90vw",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
    ...style,
  };

  const headerStyles: React.CSSProperties = {
    padding: "20px 24px",
    borderBottom: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const titleStyles: React.CSSProperties = {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: darkMode ? "#f3f4f6" : "#111827",
    margin: 0,
  };

  const closeButtonStyles: React.CSSProperties = {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: darkMode ? "#9ca3af" : "#6b7280",
    padding: "4px",
    lineHeight: 1,
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    overflow: "auto",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: darkMode ? "#111827" : "#f9fafb",
  };

  const previewImageStyles: React.CSSProperties = {
    maxWidth: "100%",
    maxHeight: "100%",
    border: `2px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
    borderRadius: "8px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    display: isImageLoaded ? "block" : "none",
  };

  const footerStyles: React.CSSProperties = {
    padding: "16px 24px",
    borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  };

  const buttonStyles: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: 500,
    fontSize: "0.875rem",
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s ease",
  };

  const downloadButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: "#3b82f6",
    color: "#ffffff",
  };

  const cancelButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: darkMode ? "#374151" : "#e5e7eb",
    color: darkMode ? "#f3f4f6" : "#374151",
  };

  const loadingStyles: React.CSSProperties = {
    display: isImageLoaded ? "none" : "flex",
    alignItems: "center",
    gap: "8px",
    color: darkMode ? "#9ca3af" : "#6b7280",
  };

  return (
    <div
      className={`rmg-export-preview-backdrop ${className}`}
      style={backdropStyles}
      onClick={handleBackdropClick}
      data-rmg-component="export-preview"
    >
      <div className="rmg-export-preview-modal" style={modalStyles}>
        {/* Header */}
        <div className="rmg-export-preview-header" style={headerStyles}>
          <h2 style={titleStyles}>{modalTitle}</h2>
          <button
            style={closeButtonStyles}
            onClick={onClose}
            aria-label="Close preview"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="rmg-export-preview-content" style={contentStyles}>
          {previewUrl ? (
            <>
              <div style={loadingStyles}>
                <span style={{ animation: "spin 1s linear infinite" }}>⏳</span>
                <span>Loading preview...</span>
              </div>
              <img
                src={previewUrl}
                alt="Export preview"
                style={previewImageStyles}
                onLoad={() => setIsImageLoaded(true)}
              />
            </>
          ) : (
            <div style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
              No preview available
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="rmg-export-preview-footer" style={footerStyles}>
          <button style={cancelButtonStyles} onClick={onClose}>
            Close
          </button>
          {showDownload && previewUrl && (
            <button style={downloadButtonStyles} onClick={handleDownload}>
              📥 Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPreview;
