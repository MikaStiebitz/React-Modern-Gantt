import { ExportOptions, ExportFormat, ExportResult } from "@/types";

/**
 * Service for exporting Gantt chart as image or PDF
 * Uses html2canvas for DOM capture and jspdf for PDF generation
 */
export class ExportService {
  private static prepareCloneForExport(
    clonedElement: HTMLElement,
    padding: number,
    isDark: boolean,
  ): void {
    clonedElement.style.padding = `${padding}px`;
    if (isDark) {
      clonedElement.style.backgroundColor = "#1f2937";
    }

    const timelineContainer = clonedElement.querySelector<HTMLElement>(
      ".rmg-timeline-container",
    );
    if (timelineContainer) {
      timelineContainer.scrollLeft = 0;
      timelineContainer.scrollTop = 0;
      timelineContainer.style.overflow = "visible";
      timelineContainer.style.scrollBehavior = "auto";

      const timelineContent = timelineContainer.querySelector<HTMLElement>(
        ".rmg-timeline-content",
      );
      if (timelineContent) {
        timelineContainer.style.width = `${timelineContent.scrollWidth}px`;
        timelineContainer.style.height = `${timelineContent.scrollHeight}px`;
      }
    }

    const timelineGrid =
      clonedElement.querySelector<HTMLElement>(".rmg-timeline-grid");
    if (timelineGrid) {
      timelineGrid.style.transform = "translateX(0)";
    }

    const taskItems =
      clonedElement.querySelectorAll<HTMLElement>(".rmg-task-item");
    taskItems.forEach((item) => {
      item.style.transition = "none";
      item.style.willChange = "auto";
      item.style.overflow = "visible";
    });

    // Fix html2canvas text rendering offset - shift task text up
    const taskTextSelectors = [
      ".rmg-task-item-name",
      ".rmg-task-group-name",
      ".rmg-task-group-description",
    ];
    const taskTextElements = clonedElement.querySelectorAll<HTMLElement>(
      taskTextSelectors.join(", "),
    );
    taskTextElements.forEach((el) => {
      el.style.transform = "translateY(-7px)";
      el.style.overflow = "visible";
    });

    // Keep header text visible without transforms
    const headerTextSelectors = [
      ".rmg-title",
      ".rmg-task-list-header",
      ".rmg-timeline-unit",
      ".rmg-today-marker-label",
    ];
    const headerTextElements = clonedElement.querySelectorAll<HTMLElement>(
      headerTextSelectors.join(", "),
    );
    headerTextElements.forEach((el) => {
      el.style.overflow = "visible";
    });

    const hoverElements = clonedElement.querySelectorAll<HTMLElement>(
      ".rmg-resize-handle, .rmg-progress-handle, .rmg-progress-tooltip, .rmg-tooltip",
    );
    hoverElements.forEach((el) => {
      el.style.display = "none";
    });

    const headerElement =
      clonedElement.querySelector<HTMLElement>(".rmg-header");
    if (headerElement) {
      headerElement.style.display = "none";
    }

    const todayMarker =
      clonedElement.querySelector<HTMLElement>(".rmg-today-marker");
    if (todayMarker) {
      todayMarker.style.display = "none";
    }

    const allElements = clonedElement.querySelectorAll<HTMLElement>("*");
    allElements.forEach((el) => {
      el.style.transition = "none";
      el.style.animation = "none";
    });

    clonedElement.style.overflow = "visible";

    const rmgContainer =
      clonedElement.querySelector<HTMLElement>(".rmg-container");
    if (rmgContainer) {
      rmgContainer.style.overflow = "visible";
    }
  }

  /**
   * Export the Gantt chart element to the specified format
   */
  public static async export(
    element: HTMLElement,
    options: ExportOptions = {},
  ): Promise<ExportResult> {
    const {
      format = "png",
      filename = "gantt-chart",
      quality = 0.95,
      scale = 2,
      backgroundColor = "#ffffff",
      padding = 20,
      includeTitle = true,
      pdfOptions = {},
    } = options;

    try {
      // Dynamically import html2canvas
      const html2canvas = await this.loadHtml2Canvas();

      if (!html2canvas) {
        throw new Error(
          "html2canvas is required for export functionality. " +
            "Please install it: npm install html2canvas",
        );
      }

      const isDark = element.classList.contains("rmg-dark");

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale,
        backgroundColor,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: element.scrollWidth + padding * 2,
        windowHeight: element.scrollHeight + padding * 2,
        onclone: (_clonedDoc, clonedElement) => {
          this.prepareCloneForExport(clonedElement, padding, isDark);
        },
      });

      // Generate output based on format
      switch (format) {
        case "png":
          return this.exportAsPng(canvas, filename);
        case "jpeg":
        case "jpg":
          return this.exportAsJpeg(canvas, filename, quality);
        case "pdf":
          return this.exportAsPdf(canvas, filename, pdfOptions);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Export failed",
      };
    }
  }

  /**
   * Export as PNG image
   */
  private static exportAsPng(
    canvas: HTMLCanvasElement,
    filename: string,
  ): ExportResult {
    const dataUrl = canvas.toDataURL("image/png");
    this.downloadFile(dataUrl, `${filename}.png`);

    return {
      success: true,
      dataUrl,
      filename: `${filename}.png`,
      format: "png",
    };
  }

  /**
   * Export as JPEG image
   */
  private static exportAsJpeg(
    canvas: HTMLCanvasElement,
    filename: string,
    quality: number,
  ): ExportResult {
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    this.downloadFile(dataUrl, `${filename}.jpg`);

    return {
      success: true,
      dataUrl,
      filename: `${filename}.jpg`,
      format: "jpeg",
    };
  }

  /**
   * Export as PDF document
   */
  private static async exportAsPdf(
    canvas: HTMLCanvasElement,
    filename: string,
    pdfOptions: ExportOptions["pdfOptions"] = {},
  ): Promise<ExportResult> {
    const jsPDF = await this.loadJsPDF();

    if (!jsPDF) {
      throw new Error(
        "jspdf is required for PDF export. " +
          "Please install it: npm install jspdf",
      );
    }

    const {
      orientation = "landscape",
      pageSize = "a4",
      margins = { top: 10, right: 10, bottom: 10, left: 10 },
      title,
      author,
      subject,
      fitToPage = true,
    } = pdfOptions;

    // Get canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const imgRatio = imgWidth / imgHeight;

    // Create PDF with specified orientation
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: pageSize,
    });

    // Set metadata if provided
    if (title) pdf.setProperties({ title });
    if (author) pdf.setProperties({ author });
    if (subject) pdf.setProperties({ subject });

    // Get page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate available space
    const availableWidth = pageWidth - margins.left - margins.right;
    const availableHeight = pageHeight - margins.top - margins.bottom;
    const availableRatio = availableWidth / availableHeight;

    // Calculate final dimensions
    let finalWidth: number;
    let finalHeight: number;

    if (fitToPage) {
      if (imgRatio > availableRatio) {
        // Image is wider than available space
        finalWidth = availableWidth;
        finalHeight = availableWidth / imgRatio;
      } else {
        // Image is taller than available space
        finalHeight = availableHeight;
        finalWidth = availableHeight * imgRatio;
      }
    } else {
      // Use original size (convert pixels to mm, assuming 96 DPI)
      const pxToMm = 25.4 / 96;
      finalWidth = Math.min(imgWidth * pxToMm, availableWidth);
      finalHeight = Math.min(imgHeight * pxToMm, availableHeight);
    }

    // Center the image
    const x = margins.left + (availableWidth - finalWidth) / 2;
    const y = margins.top + (availableHeight - finalHeight) / 2;

    // Add image to PDF
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);

    // Handle multi-page export for very wide charts
    if (!fitToPage && imgWidth * (25.4 / 96) > availableWidth) {
      // Calculate number of pages needed
      const totalPages = Math.ceil((imgWidth * (25.4 / 96)) / availableWidth);

      for (let page = 1; page < totalPages; page++) {
        pdf.addPage();
        const offsetX = -(page * availableWidth) + margins.left;
        pdf.addImage(
          imgData,
          "PNG",
          offsetX,
          margins.top,
          imgWidth * (25.4 / 96),
          finalHeight,
        );
      }
    }

    // Generate blob and download
    const pdfBlob = pdf.output("blob");
    const dataUrl = URL.createObjectURL(pdfBlob);

    // Trigger download
    pdf.save(`${filename}.pdf`);

    return {
      success: true,
      dataUrl,
      filename: `${filename}.pdf`,
      format: "pdf",
      blob: pdfBlob,
    };
  }

  /**
   * Get data URL without downloading (useful for previews)
   */
  public static async getDataUrl(
    element: HTMLElement,
    format: ExportFormat = "png",
    options: Omit<ExportOptions, "format" | "filename"> = {},
  ): Promise<string | null> {
    try {
      const html2canvas = await this.loadHtml2Canvas();

      if (!html2canvas) {
        throw new Error("html2canvas is required");
      }

      const padding = options.padding ?? 20;
      const isDark = element.classList.contains("rmg-dark");

      const canvas = await html2canvas(element, {
        scale: options.scale || 2,
        backgroundColor: options.backgroundColor || "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: element.scrollWidth + padding * 2,
        windowHeight: element.scrollHeight + padding * 2,
        onclone: (_clonedDoc, clonedElement) => {
          this.prepareCloneForExport(clonedElement, padding, isDark);
        },
      });

      if (format === "png") {
        return canvas.toDataURL("image/png");
      } else if (format === "jpeg" || format === "jpg") {
        return canvas.toDataURL("image/jpeg", options.quality || 0.95);
      }

      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Failed to get data URL:", error);
      return null;
    }
  }

  /**
   * Get as Blob (useful for uploading or processing)
   */
  public static async getBlob(
    element: HTMLElement,
    format: ExportFormat = "png",
    options: Omit<ExportOptions, "format" | "filename"> = {},
  ): Promise<Blob | null> {
    try {
      const html2canvas = await this.loadHtml2Canvas();

      if (!html2canvas) {
        throw new Error("html2canvas is required");
      }

      const padding = options.padding ?? 20;
      const isDark = element.classList.contains("rmg-dark");

      const canvas = await html2canvas(element, {
        scale: options.scale || 2,
        backgroundColor: options.backgroundColor || "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: element.scrollWidth + padding * 2,
        windowHeight: element.scrollHeight + padding * 2,
        onclone: (_clonedDoc, clonedElement) => {
          this.prepareCloneForExport(clonedElement, padding, isDark);
        },
      });

      return new Promise((resolve) => {
        const mimeType =
          format === "jpeg" || format === "jpg" ? "image/jpeg" : "image/png";
        canvas.toBlob(
          (blob) => resolve(blob),
          mimeType,
          options.quality || 0.95,
        );
      });
    } catch (error) {
      console.error("Failed to get blob:", error);
      return null;
    }
  }

  /**
   * Copy chart to clipboard as image
   */
  public static async copyToClipboard(
    element: HTMLElement,
    options: Omit<ExportOptions, "format" | "filename"> = {},
  ): Promise<boolean> {
    try {
      const blob = await this.getBlob(element, "png", options);

      if (!blob) {
        throw new Error("Failed to create image blob");
      }

      // Check if clipboard API is available
      if (!navigator.clipboard || !navigator.clipboard.write) {
        throw new Error("Clipboard API not available");
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }

  /**
   * Helper to download file from data URL
   */
  private static downloadFile(dataUrl: string, filename: string): void {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Dynamically load html2canvas
   */
  private static async loadHtml2Canvas(): Promise<
    typeof import("html2canvas").default | null
  > {
    try {
      // Try to import html2canvas
      const module = await import("html2canvas");
      return module.default;
    } catch {
      // html2canvas not installed
      console.warn(
        "html2canvas is not installed. Export functionality requires html2canvas. " +
          "Install it with: npm install html2canvas",
      );
      return null;
    }
  }

  /**
   * Dynamically load jsPDF
   */
  private static async loadJsPDF(): Promise<
    typeof import("jspdf").jsPDF | null
  > {
    try {
      const module = await import("jspdf");
      return module.jsPDF;
    } catch {
      console.warn(
        "jspdf is not installed. PDF export functionality requires jspdf. " +
          "Install it with: npm install jspdf",
      );
      return null;
    }
  }

  /**
   * Check if export dependencies are available
   */
  public static async checkDependencies(): Promise<{
    html2canvas: boolean;
    jspdf: boolean;
  }> {
    const html2canvas = await this.loadHtml2Canvas();
    const jspdf = await this.loadJsPDF();

    return {
      html2canvas: html2canvas !== null,
      jspdf: jspdf !== null,
    };
  }
}
