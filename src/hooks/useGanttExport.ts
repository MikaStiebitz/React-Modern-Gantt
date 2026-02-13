import { useRef, useCallback } from 'react';
import { ExportService } from '@/services/ExportService';
import { ExportOptions, ExportResult, ExportFormat, GanttChartRef } from '@/types';

/**
 * Hook return type
 */
export interface UseGanttExportReturn {
  /**
   * Ref to attach to the GanttChart component
   */
  ganttRef: React.RefObject<GanttChartRef | null>;

  /**
   * Export the chart to the specified format
   */
  exportChart: (options?: ExportOptions) => Promise<ExportResult>;

  /**
   * Export as PNG
   */
  exportAsPng: (filename?: string, options?: Omit<ExportOptions, 'format' | 'filename'>) => Promise<ExportResult>;

  /**
   * Export as JPEG
   */
  exportAsJpeg: (filename?: string, options?: Omit<ExportOptions, 'format' | 'filename'>) => Promise<ExportResult>;

  /**
   * Export as PDF
   */
  exportAsPdf: (filename?: string, options?: Omit<ExportOptions, 'format' | 'filename'>) => Promise<ExportResult>;

  /**
   * Get chart as data URL
   */
  getDataUrl: (format?: ExportFormat) => Promise<string | null>;

  /**
   * Get chart as Blob
   */
  getBlob: (format?: ExportFormat) => Promise<Blob | null>;

  /**
   * Copy chart to clipboard
   */
  copyToClipboard: () => Promise<boolean>;

  /**
   * Check if export dependencies are available
   */
  checkDependencies: () => Promise<{ html2canvas: boolean; jspdf: boolean }>;

  /**
   * Get preview URL for the chart (useful for preview modal)
   */
  getPreviewUrl: (format?: ExportFormat, options?: Omit<ExportOptions, 'format' | 'filename'>) => Promise<string | null>;
}

/**
 * Custom hook for easy Gantt chart export functionality
 *
 * @example
 * ```tsx
 * import { useGanttExport, GanttChart } from 'react-modern-gantt';
 *
 * function MyComponent() {
 *   const { ganttRef, exportAsPng, exportAsPdf, copyToClipboard } = useGanttExport();
 *
 *   return (
 *     <div>
 *       <GanttChart ref={ganttRef} tasks={tasks} />
 *       <button onClick={() => exportAsPng('my-gantt')}>Export PNG</button>
 *       <button onClick={() => exportAsPdf('my-gantt')}>Export PDF</button>
 *       <button onClick={copyToClipboard}>Copy to Clipboard</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useGanttExport(): UseGanttExportReturn {
  const ganttRef = useRef<GanttChartRef>(null);

  const exportChart = useCallback(async (options?: ExportOptions): Promise<ExportResult> => {
    if (ganttRef.current) {
      return ganttRef.current.exportChart(options);
    }
    return {
      success: false,
      error: 'GanttChart ref not available. Make sure to attach the ref to the GanttChart component.',
    };
  }, []);

  const exportAsPng = useCallback(
    async (
      filename?: string,
      options?: Omit<ExportOptions, 'format' | 'filename'>
    ): Promise<ExportResult> => {
      return exportChart({
        ...options,
        format: 'png',
        filename: filename || 'gantt-chart',
      });
    },
    [exportChart]
  );

  const exportAsJpeg = useCallback(
    async (
      filename?: string,
      options?: Omit<ExportOptions, 'format' | 'filename'>
    ): Promise<ExportResult> => {
      return exportChart({
        ...options,
        format: 'jpeg',
        filename: filename || 'gantt-chart',
      });
    },
    [exportChart]
  );

  const exportAsPdf = useCallback(
    async (
      filename?: string,
      options?: Omit<ExportOptions, 'format' | 'filename'>
    ): Promise<ExportResult> => {
      return exportChart({
        ...options,
        format: 'pdf',
        filename: filename || 'gantt-chart',
      });
    },
    [exportChart]
  );

  const getDataUrl = useCallback(async (format?: ExportFormat): Promise<string | null> => {
    if (ganttRef.current) {
      return ganttRef.current.getDataUrl(format);
    }
    return null;
  }, []);

  const getBlob = useCallback(async (format?: ExportFormat): Promise<Blob | null> => {
    if (ganttRef.current) {
      return ganttRef.current.getBlob(format);
    }
    return null;
  }, []);

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    if (ganttRef.current) {
      return ganttRef.current.copyToClipboard();
    }
    return false;
  }, []);

  const checkDependencies = useCallback(async () => {
    return ExportService.checkDependencies();
  }, []);

  const getPreviewUrl = useCallback(
    async (
      format?: ExportFormat,
      options?: Omit<ExportOptions, 'format' | 'filename'>
    ): Promise<string | null> => {
      return getDataUrl(format);
    },
    [getDataUrl]
  );

  const openPreview = useCallback(
    async (
      format?: ExportFormat,
      options?: Omit<ExportOptions, 'format' | 'filename'>
    ): Promise<string | null> => {
      return getDataUrl(format);
    },
    [getDataUrl]
  );

  const closePreview = useCallback(() => {
    return null;
  }, []);

  return {
    ganttRef,
    exportChart,
    exportAsPng,
    exportAsJpeg,
    exportAsPdf,
    getDataUrl,
    getBlob,
    copyToClipboard,
    checkDependencies,
    getPreviewUrl,
  };
}

export default useGanttExport;
