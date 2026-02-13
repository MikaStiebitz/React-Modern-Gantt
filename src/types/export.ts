/**
 * Export-related types for React Modern Gantt
 */

/**
 * Supported export formats
 */
export type ExportFormat = "png" | "jpeg" | "jpg" | "pdf";

/**
 * PDF-specific export options
 */
export interface PdfExportOptions {
  /**
   * Page orientation
   * @default 'landscape'
   */
  orientation?: "portrait" | "landscape";

  /**
   * Page size
   * @default 'a4'
   */
  pageSize?: "a4" | "a3" | "letter" | "legal" | [number, number];

  /**
   * Page margins in mm
   * @default { top: 10, right: 10, bottom: 10, left: 10 }
   */
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  /**
   * PDF document title metadata
   */
  title?: string;

  /**
   * PDF document author metadata
   */
  author?: string;

  /**
   * PDF document subject metadata
   */
  subject?: string;

  /**
   * Whether to fit the chart to the page
   * @default true
   */
  fitToPage?: boolean;
}

/**
 * Options for exporting the Gantt chart
 */
export interface ExportOptions {
  /**
   * Export format
   * @default 'png'
   */
  format?: ExportFormat;

  /**
   * Filename without extension
   * @default 'gantt-chart'
   */
  filename?: string;

  /**
   * Image quality for JPEG format (0-1)
   * @default 0.95
   */
  quality?: number;

  /**
   * Scale factor for higher resolution
   * @default 2
   */
  scale?: number;

  /**
   * Background color for the exported image
   * @default '#ffffff'
   */
  backgroundColor?: string;

  /**
   * Padding around the chart in pixels
   * @default 20
   */
  padding?: number;

  /**
   * Whether to include the chart title
   * @default true
   */
  includeTitle?: boolean;

  /**
   * PDF-specific options
   */
  pdfOptions?: PdfExportOptions;
}

/**
 * Result of an export operation
 */
export interface ExportResult {
  /**
   * Whether the export was successful
   */
  success: boolean;

  /**
   * Data URL of the exported content (for images)
   */
  dataUrl?: string;

  /**
   * Blob of the exported content (for PDF)
   */
  blob?: Blob;

  /**
   * Final filename with extension
   */
  filename?: string;

  /**
   * Export format used
   */
  format?: ExportFormat;

  /**
   * Error message if export failed
   */
  error?: string;
}

/**
 * Methods exposed via ref for programmatic control
 */
export interface GanttChartRef {
  /**
   * Export the chart as image or PDF
   */
  exportChart: (options?: ExportOptions) => Promise<ExportResult>;

  /**
   * Get the chart as a data URL (without downloading)
   */
  getDataUrl: (
    format?: ExportFormat,
    options?: Omit<ExportOptions, "format" | "filename">,
  ) => Promise<string | null>;

  /**
   * Get the chart as a Blob
   */
  getBlob: (
    format?: ExportFormat,
    options?: Omit<ExportOptions, "format" | "filename">,
  ) => Promise<Blob | null>;

  /**
   * Copy the chart to clipboard as image
   */
  copyToClipboard: (
    options?: Omit<ExportOptions, "format" | "filename">,
  ) => Promise<boolean>;

  /**
   * Get the container element
   */
  getContainerElement: () => HTMLDivElement | null;

  /**
   * Scroll to a specific date
   */
  scrollToDate: (date: Date) => void;

  /**
   * Scroll to show "today" in view
   */
  scrollToToday: () => void;
}
