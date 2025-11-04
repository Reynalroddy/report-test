export async function createReportPdfFromPages(
  employeeName: string
): Promise<Blob> {
  // Collect all page sections from the DOM
  const pages: { element: HTMLElement; name: string }[] = [];

  // Get all pages in order
  const pageNames = [
    "cover",
    "employment-history",
    "pre-employment",
    "proof-of-address",
    "proof-of-identification",
    "references",
    "supporting-documents",
  ];

  for (const pageName of pageNames) {
    const element = document.querySelector(
      `[data-page='${pageName}']`
    ) as HTMLElement;
    if (element) {
      pages.push({ element, name: pageName });
    }
  }

  if (pages.length === 0) {
    throw new Error(
      "No report pages found in DOM. Make sure you're on a report page."
    );
  }

  // Load html2pdf library
  const html2pdf = await loadHtml2pdf();

  return new Promise((resolve, reject) => {
    try {
      // Create a container div with all pages
      const container = document.createElement("div");
      container.style.fontFamily = "Arial, sans-serif";
      container.style.fontSize = "12px";
      container.style.lineHeight = "1.4";
      container.style.color = "#000000";

      // Clone and sanitize each page
      pages.forEach((page, index) => {
        const clonedPage = page.element.cloneNode(true) as HTMLElement;

        // Sanitize CSS for html2pdf compatibility
        sanitizeElementForPdf(clonedPage);

        // Add page break between pages (except first)
        if (index > 0) {
          const pageBreak = document.createElement("div");
          pageBreak.style.pageBreakBefore = "always";
          container.appendChild(pageBreak);
        }

        container.appendChild(clonedPage);
      });

      // Create PDF options with better compatibility
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${employeeName}_Compliance_Report.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: {
          scale: 1.5,
          useCORS: false,
          allowTaint: true,
          logging: false,
          letterRendering: true,
          backgroundColor: "#ffffff",
          removeContainer: true,
        },
        jsPDF: {
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true,
        },
      };

      // Generate PDF from container
      html2pdf()
        .set(opt)
        .from(container)
        .toPdf()
        .get("pdf")
        .then((pdfObj: any) => {
          const blob = pdfObj.output("blob");
          resolve(blob);
        })
        .catch((error: any) => {
          console.error("PDF generation error:", error);
          reject(
            new Error(
              `PDF generation failed: ${error.message || "Unknown error"}`
            )
          );
        });
    } catch (error) {
      console.error("PDF setup error:", error);
      reject(error);
    }
  });
}

// Helper function to load html2pdf library
async function loadHtml2pdf(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).html2pdf) {
      resolve((window as any).html2pdf);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => {
      if ((window as any).html2pdf) {
        resolve((window as any).html2pdf);
      } else {
        reject(new Error("html2pdf not loaded properly"));
      }
    };
    script.onerror = () => {
      reject(new Error("Failed to load html2pdf library"));
    };
    document.head.appendChild(script);
  });
}

// Helper function to sanitize CSS for html2pdf compatibility
function sanitizeElementForPdf(element: HTMLElement) {
  // Remove problematic CSS properties and classes
  const problematicClasses = [
    "bg-gradient-to-br",
    "bg-linear-to-br",
    "backdrop-blur",
    "shadow-xl",
    "shadow-lg",
    "shadow-md",
    "shadow-sm",
  ];

  // Walk through all elements
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT,
    null
  );

  const elements: Element[] = [element];
  let node;
  while ((node = walker.nextNode())) {
    elements.push(node as Element);
  }

  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;

    // Remove problematic classes
    problematicClasses.forEach((className) => {
      htmlEl.classList.remove(className);
    });

    // Force safe background colors for common classes
    if (htmlEl.classList.contains("bg-purple-200")) {
      htmlEl.style.backgroundColor = "#e9d5ff";
    }
    if (htmlEl.classList.contains("bg-white")) {
      htmlEl.style.backgroundColor = "#ffffff";
    }
    if (htmlEl.classList.contains("bg-primary")) {
      htmlEl.style.backgroundColor = "#3b82f6";
    }
    if (htmlEl.classList.contains("text-primary")) {
      htmlEl.style.color = "#3b82f6";
    }
    if (htmlEl.classList.contains("text-green-600")) {
      htmlEl.style.color = "#059669";
    }

    // Remove CSS custom properties and unsupported color functions from inline style
    const unsupportedColorFn = /lab\(|oklch\(|var\(/;
    // Remove any CSS variables from inline style
    Object.keys(htmlEl.style).forEach((key) => {
      if (key.startsWith("--")) {
        htmlEl.style.removeProperty(key);
      }
    });
    // Check and override color-related properties
    const colorProps = [
      "backgroundColor",
      "color",
      "borderColor",
      "outlineColor",
      "boxShadow",
      "textShadow",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
    ];
    colorProps.forEach((prop) => {
      if (unsupportedColorFn.test(htmlEl.style[prop as any])) {
        if (prop.includes("background")) htmlEl.style[prop as any] = "#ffffff";
        else if (prop.includes("color")) htmlEl.style[prop as any] = "#000000";
        else htmlEl.style[prop as any] = "none";
      }
    });
    // Remove unsupported color functions from style attribute
    if (htmlEl.hasAttribute("style")) {
      const styleAttr = htmlEl.getAttribute("style") || "";
      if (unsupportedColorFn.test(styleAttr)) {
        // Remove the style attribute entirely if it contains unsupported color functions
        htmlEl.removeAttribute("style");
      }
    }

    // Also forcibly override computed styles if they contain unsupported color functions
    const computedStyle = window.getComputedStyle(htmlEl);
    colorProps.forEach((prop) => {
      if (unsupportedColorFn.test(computedStyle[prop as any])) {
        if (prop.includes("background")) htmlEl.style[prop as any] = "#ffffff";
        else if (prop.includes("color")) htmlEl.style[prop as any] = "#000000";
        else htmlEl.style[prop as any] = "none";
      }
    });
  });
}
