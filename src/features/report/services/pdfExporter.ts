import { jsPDF } from "jspdf";

export function exportReportToPDF(
    title: string,
    rangeLabel: string,
    generatedAt: string,
    markdown: string
) {
    const doc = new jsPDF({ format: "a4", unit: "mm" });
    
    // Page sizes
    const pageWidth = doc.internal.pageSize.getWidth(); // 210
    const pageHeight = doc.internal.pageSize.getHeight(); // 297
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin; // 170
    const topMargin = 25;
    const bottomMargin = 25;
    const maxY = pageHeight - bottomMargin;

    let y = topMargin;

    // Helper: Add page if space is low
    const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > maxY) {
            doc.addPage();
            y = topMargin;
            return true;
        }
        return false;
    };

    // Draw Cover / Top Header info on page 1
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(24, 24, 27); // zinc-950
    
    // Draw indigo top line
    doc.setFillColor(79, 70, 229); // indigo-600
    doc.rect(margin, y, contentWidth, 1.5, "F");
    y += 8;

    // Title
    const titleLines = doc.splitTextToSize(title, contentWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 8 + 4;

    // Metadata
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(113, 113, 122); // zinc-500
    
    const formattedDate = new Date(generatedAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });
    doc.text(`Timeframe: ${rangeLabel}   |   Generated: ${formattedDate}   |   Source: LOOP AI`, margin, y);
    y += 8;

    // Draw horizontal separator line
    doc.setDrawColor(228, 228, 231); // zinc-200
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentWidth, y);
    y += 10;

    // Parse Markdown blocks
    const blocks = markdown.split("\n");
    let inList = false;
    let listCounter = 1;
    let inTable = false;
    let tableRows: string[][] = [];

    // Helper to print standard text
    const printParagraph = (text: string, isBold = false, isItalic = false) => {
        doc.setFont("helvetica", isBold ? "bold" : isItalic ? "italic" : "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(39, 39, 42); // zinc-800
        const lines = doc.splitTextToSize(text, contentWidth);
        const lineHeight = 5.5;
        
        lines.forEach((line: string) => {
            checkPageBreak(lineHeight);
            doc.text(line, margin, y);
            y += lineHeight;
        });
        y += 2.5; // block gap
    };

    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i].trim();
        if (!block) {
            inList = false;
            listCounter = 1;
            continue;
        }

        // Check for table rows starting with |
        if (block.startsWith("|")) {
            inTable = true;
            // Parse columns
            const cols = block.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
            // Skip header separators e.g. |---|---|
            if (cols.every(c => c.startsWith("-"))) {
                continue;
            }
            tableRows.push(cols);
            
            // If next line doesn't start with | or is empty, finalize table rendering
            const nextLine = (blocks[i + 1] || "").trim();
            if (!nextLine.startsWith("|")) {
                inTable = false;
                // Render table
                if (tableRows.length > 0) {
                    checkPageBreak(tableRows.length * 8 + 4);
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(8.5);
                    doc.setTextColor(39, 39, 42);
                    
                    // Simple programmatic table layout
                    const colCount = tableRows[0].length;
                    const colWidth = contentWidth / colCount;

                    // Draw Headers
                    const headers = tableRows[0];
                    headers.forEach((h, cIdx) => {
                        doc.text(h, margin + cIdx * colWidth + 2, y + 5);
                    });
                    
                    doc.setDrawColor(161, 161, 170); // zinc-400
                    doc.line(margin, y + 7, margin + contentWidth, y + 7);
                    y += 8;

                    // Draw Rows
                    doc.setFont("helvetica", "normal");
                    for (let r = 1; r < tableRows.length; r++) {
                        checkPageBreak(8);
                        const row = tableRows[r];
                        row.forEach((cell, cIdx) => {
                            const wrapped = doc.splitTextToSize(cell, colWidth - 4)[0] || cell;
                            doc.text(wrapped, margin + cIdx * colWidth + 2, y + 5);
                        });
                        
                        doc.setDrawColor(244, 244, 245); // zinc-100
                        doc.line(margin, y + 7, margin + contentWidth, y + 7);
                        y += 8;
                    }
                    y += 4;
                    tableRows = [];
                }
            }
            continue;
        }

        // H1 Heading
        if (block.startsWith("# ")) {
            const text = block.replace(/^#\s+/, "");
            checkPageBreak(12);
            y += 4;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(79, 70, 229); // Indigo brand accent headers
            doc.text(text, margin, y);
            y += 8;
            continue;
        }

        // H2 Heading
        if (block.startsWith("## ")) {
            const text = block.replace(/^##\s+/, "");
            checkPageBreak(10);
            y += 3;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11.5);
            doc.setTextColor(24, 24, 27); // zinc-950
            doc.text(text, margin, y);
            y += 7;
            continue;
        }

        // H3 Heading
        if (block.startsWith("### ")) {
            const text = block.replace(/^###\s+/, "");
            checkPageBreak(9);
            y += 2;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(39, 39, 42); // zinc-800
            doc.text(text, margin, y);
            y += 6;
            continue;
        }

        // Blockquotes
        if (block.startsWith(">")) {
            const text = block.replace(/^>\s*/, "");
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(113, 113, 122); // zinc-500
            const lines = doc.splitTextToSize(text, contentWidth - 10);
            
            checkPageBreak(lines.length * 5 + 4);
            
            // Draw gray left vertical border
            doc.setDrawColor(228, 228, 231);
            doc.setLineWidth(0.8);
            doc.line(margin + 2, y, margin + 2, y + lines.length * 5 + 2);
            
            lines.forEach((line: string) => {
                doc.text(line, margin + 7, y + 4);
                y += 5;
            });
            y += 4;
            continue;
        }

        // Horizontal Rules
        if (block === "---" || block === "***") {
            checkPageBreak(6);
            y += 2;
            doc.setDrawColor(244, 244, 245); // zinc-100
            doc.setLineWidth(0.3);
            doc.line(margin, y, margin + contentWidth, y);
            y += 4;
            continue;
        }

        // Bullet Lists
        if (block.startsWith("- ") || block.startsWith("* ")) {
            inList = true;
            const text = block.replace(/^[-*]\s+/, "");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(39, 39, 42);
            const bulletIndent = 6;
            const lines = doc.splitTextToSize(text, contentWidth - bulletIndent);
            const lineHeight = 5;

            lines.forEach((line: string, lineIdx: number) => {
                checkPageBreak(lineHeight);
                if (lineIdx === 0) {
                    doc.text("•", margin + 2, y); // draw bullet
                }
                doc.text(line, margin + bulletIndent, y);
                y += lineHeight;
            });
            y += 1.5;
            continue;
        }

        // Numbered Lists
        const numListRegex = /^(\d+)\.\s+/;
        if (numListRegex.test(block)) {
            const match = block.match(numListRegex);
            const num = match ? match[1] : String(listCounter++);
            const text = block.replace(numListRegex, "");
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(39, 39, 42);
            const numIndent = 8;
            const lines = doc.splitTextToSize(text, contentWidth - numIndent);
            const lineHeight = 5;

            lines.forEach((line: string, lineIdx: number) => {
                checkPageBreak(lineHeight);
                if (lineIdx === 0) {
                    doc.text(`${num}.`, margin + 2, y); // draw number
                }
                doc.text(line, margin + numIndent, y);
                y += lineHeight;
            });
            y += 1.5;
            continue;
        }

        // Standard Paragraph block
        // Clean double asterisks if present in plain paragraph
        const cleanText = block.replace(/\*\*/g, "");
        printParagraph(cleanText);
    }

    // Add page numbers, headers, and footers to all pages at the end
    const pageCount = doc.internal.pages.length - 1; // get true page count
    for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);
        
        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(161, 161, 170); // zinc-400
        doc.text("LOOP EXECUTIVE BOARD BRIEFING", margin, 12);
        
        doc.setFont("helvetica", "normal");
        doc.text(`TIMEFRAME: ${rangeLabel.toUpperCase()}`, pageWidth - margin - 35, 12);
        
        doc.setDrawColor(244, 244, 245);
        doc.setLineWidth(0.2);
        doc.line(margin, 14, pageWidth - margin, 14);

        // Footer
        doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(113, 113, 122);
        doc.text("LOOP AI Feedback Intelligence Platform", margin, pageHeight - 9);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.text(`Page ${p} of ${pageCount}`, pageWidth - margin - 15, pageHeight - 9);
    }

    // Trigger download
    const filename = `Executive_Report_${rangeLabel}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(filename);
}