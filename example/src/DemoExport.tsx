import * as React from "react";
import { GanttChart, useGanttExport, TaskGroup } from "react-modern-gantt";
import { basicDemoData } from "./data";

interface DemoExportProps {
    darkMode: boolean;
}

const DemoExport: React.FC<DemoExportProps> = ({ darkMode }) => {
    const [tasks] = React.useState<TaskGroup[]>(basicDemoData);
    const [exportStatus, setExportStatus] = React.useState<string>("");
    const [dependencies, setDependencies] = React.useState<{ html2canvas: boolean; jspdf: boolean } | null>(null);

    // Use the useGanttExport hook to get all export functionality
    const {
        ganttRef,
        exportChart,
        exportAsPng,
        exportAsJpeg,
        exportAsPdf,
        getDataUrl,
        copyToClipboard,
        checkDependencies,
    } = useGanttExport();

    // Check if export dependencies are available
    React.useEffect(() => {
        const checkLibs = async () => {
            const deps = await checkDependencies();
            setDependencies(deps);
        };
        checkLibs();
    }, [checkDependencies]);

    // Handle export with status messages
    const handleExport = async (exportFn: () => Promise<any>, action: string) => {
        setExportStatus(`Exporting ${action}...`);
        try {
            const result = await exportFn();
            if (result && "success" in result) {
                setExportStatus(
                    result.success ? `✓ ${action} exported successfully!` : `✗ ${result.error || "Export failed"}`,
                );
            } else {
                setExportStatus(`✓ ${action} completed!`);
            }
        } catch (error) {
            setExportStatus(`✗ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
        // Clear status after 3 seconds
        setTimeout(() => setExportStatus(""), 3000);
    };

    // Export handlers
    const handleExportCustom = () =>
        handleExport(
            () =>
                exportChart({
                    format: "png",
                    filename: "custom-export",
                    quality: 0.95,
                    scale: 2, // Higher resolution
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                }),
            "Custom PNG",
        );

    const handleGetDataUrl = async () => {
        setExportStatus("Generating data URL...");
        try {
            const dataUrl = await getDataUrl("png");
            if (dataUrl) {
                // Create a preview
                const img = document.createElement("img");
                img.src = dataUrl;
                img.style.maxWidth = "300px";
                img.style.border = "2px solid #3B82F6";
                img.style.borderRadius = "8px";
                img.style.marginTop = "10px";

                // Remove previous preview if exists
                const preview = document.getElementById("preview-container");
                if (preview) {
                    preview.innerHTML = "";
                    preview.appendChild(img);
                }

                setExportStatus("✓ Data URL generated! Preview below.");
            } else {
                setExportStatus("✗ Failed to generate data URL");
            }
        } catch (error) {
            setExportStatus(`✗ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    const handleCopyToClipboard = () => handleExport(() => copyToClipboard(), "Copy to clipboard");

    return (
        <div>
            <div className="demo-description">
                <h3>Export Functionality Demo</h3>
                <p>
                    This demo showcases the export capabilities of React Modern Gantt. You can export the chart as PNG,
                    JPEG, or PDF, get it as a data URL or Blob, and even copy it to the clipboard.
                </p>

                {/* Dependency Status */}
                {dependencies && (
                    <div
                        style={{
                            marginTop: "1rem",
                            padding: "1rem",
                            backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                            borderRadius: "8px",
                        }}>
                        <strong>Export Dependencies:</strong>
                        <ul style={{ marginTop: "0.5rem", marginLeft: "1.5rem" }}>
                            <li>html2canvas: {dependencies.html2canvas ? "✓ Available" : "✗ Not installed"}</li>
                            <li>jsPDF: {dependencies.jspdf ? "✓ Available" : "✗ Not installed"}</li>
                        </ul>
                        {(!dependencies.html2canvas || !dependencies.jspdf) && (
                            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#ef4444" }}>
                                Install missing dependencies: <code>npm install html2canvas jspdf</code>
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Export Controls */}
            <div style={{ marginTop: "1.5rem" }}>
                <h4 style={{ marginBottom: "0.75rem" }}>Export Options:</h4>

                {/* Quick Actions - Traditional Buttons */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <button
                        onClick={() => handleExport(() => exportAsPng("gantt-chart"), "PNG")}
                        disabled={!dependencies?.html2canvas}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            fontWeight: 500,
                            cursor: dependencies?.html2canvas ? "pointer" : "not-allowed",
                            opacity: dependencies?.html2canvas ? 1 : 0.6,
                        }}>
                        📥 Export PNG
                    </button>
                    <button
                        onClick={() => handleExport(() => exportAsPdf("gantt-chart"), "PDF")}
                        disabled={!dependencies?.html2canvas || !dependencies?.jspdf}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            fontWeight: 500,
                            cursor: dependencies?.html2canvas && dependencies?.jspdf ? "pointer" : "not-allowed",
                            opacity: dependencies?.html2canvas && dependencies?.jspdf ? 1 : 0.6,
                        }}>
                        📄 Export PDF
                    </button>
                    <button
                        onClick={() => handleExport(() => exportAsJpeg("gantt-chart"), "JPEG")}
                        disabled={!dependencies?.html2canvas}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            backgroundColor: "#6b7280",
                            color: "white",
                            border: "none",
                            fontWeight: 500,
                            cursor: dependencies?.html2canvas ? "pointer" : "not-allowed",
                            opacity: dependencies?.html2canvas ? 1 : 0.6,
                        }}>
                        🖼️ Export JPEG
                    </button>
                </div>

                {/* Advanced Options - Collapsible */}
                <details style={{ marginTop: "1rem" }}>
                    <summary
                        style={{
                            cursor: "pointer",
                            fontWeight: 500,
                            color: darkMode ? "#9ca3af" : "#6b7280",
                            userSelect: "none",
                        }}>
                        Advanced Options
                    </summary>
                    <div
                        style={{
                            marginTop: "0.75rem",
                            padding: "1rem",
                            backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
                            borderRadius: "6px",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "0.5rem",
                        }}>
                        <button onClick={handleExportCustom} disabled={!dependencies?.html2canvas}>
                            ⚙️ Custom Export
                        </button>
                        <button onClick={handleGetDataUrl} disabled={!dependencies?.html2canvas}>
                            🔗 Get Data URL
                        </button>
                        <button onClick={handleCopyToClipboard} disabled={!dependencies?.html2canvas}>
                            📋 Copy to Clipboard
                        </button>
                    </div>
                </details>
            </div>

            {/* Export Status */}
            {exportStatus && (
                <div
                    style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1rem",
                        backgroundColor: exportStatus.startsWith("✓")
                            ? "#10b981"
                            : exportStatus.startsWith("✗")
                              ? "#ef4444"
                              : "#3b82f6",
                        color: "white",
                        borderRadius: "8px",
                        textAlign: "center",
                        fontWeight: "500",
                    }}>
                    {exportStatus}
                </div>
            )}

            {/* Preview Container */}
            <div id="preview-container" style={{ marginTop: "1rem", textAlign: "center" }}></div>

            {/* Gantt Chart with ref attached */}
            <GanttChart
                ref={ganttRef}
                tasks={tasks}
                title="Exportable Gantt Chart"
                darkMode={darkMode}
                showProgress={true}
            />

            {/* Usage Instructions */}
            <div
                style={{
                    marginTop: "2rem",
                    padding: "1rem",
                    backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                    borderRadius: "8px",
                }}>
                <h4 style={{ marginTop: 0 }}>Usage Example:</h4>
                <pre
                    style={{
                        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                        padding: "1rem",
                        borderRadius: "4px",
                        overflow: "auto",
                    }}>
                    <code>{`import GanttChart, { useGanttExport } from 'react-modern-gantt';

function MyComponent() {
  const { ganttRef, exportAsPng, exportAsPdf } = useGanttExport();

  return (
    <div>
      <GanttChart ref={ganttRef} tasks={tasks} />
      <button onClick={() => exportAsPng('my-gantt')}>
        Export PNG
      </button>
      <button onClick={() => exportAsPdf('my-gantt')}>
        Export PDF
      </button>
    </div>
  );
}`}</code>
                </pre>
            </div>
        </div>
    );
};

export default DemoExport;
