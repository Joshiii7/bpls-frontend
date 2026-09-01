import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ApplicationPdfData, PdfApprovalRow, PdfDocumentImage, PdfSection, PdfSignatureBlock } from './pdf-document.models';
import { loadImageAsPngDataUrl, LoadedPdfImage } from './pdf-image.util';

// Builds a structured, paginated A4 PDF from application data (never a screenshot of
// the page). Any component can call generateApplicationPdf() with an ApplicationPdfData
// object. This file owns all PDF layout/rendering so page components stay presentation-only.
@Injectable({ providedIn: 'root' })
export class PdfGeneratorService {
  private readonly pageWidth = 210; // A4, mm
  private readonly pageHeight = 297;
  private readonly margin = 14;
  private readonly footerReserve = 18;
  private readonly contentWidth = this.pageWidth - this.margin * 2;
  private readonly brandColor: [number, number, number] = [0, 152, 0];

  async generateApplicationPdf(data: ApplicationPdfData): Promise<Blob> {
    const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    doc.setProperties({ title: data.documentTitle });

    const [logoImage, documentImages, signatureImages] = await Promise.all([
      data.logoUrl ? loadImageAsPngDataUrl(data.logoUrl) : Promise.resolve(null),
      Promise.all((data.documents || []).map(d => loadImageAsPngDataUrl(d.url))),
      Promise.all((data.signatures || []).map(s => (s.imageUrl ? loadImageAsPngDataUrl(s.imageUrl) : Promise.resolve(null)))),
    ]);

    let y = this.margin;
    y = this.drawHeader(doc, data, logoImage, y);

    for (const section of data.sections) {
      y = this.ensureSpace(doc, y, 16);
      y = this.drawSection(doc, section, y);
    }

    if (data.documents?.length) {
      y = this.ensureSpace(doc, y, 20);
      y = this.drawDocumentsGrid(doc, data.documents, documentImages, y);
    }

    if (data.approvals?.length) {
      y = this.ensureSpace(doc, y, 16);
      y = this.drawApprovalsTable(doc, data.approvals, y);
    }

    if (data.signatures?.length) {
      y = this.ensureSpace(doc, y, 34);
      y = this.drawSignatures(doc, data.signatures, signatureImages, y);
    }

    if (data.declaration) {
      this.drawDeclaration(doc, data.declaration, y);
    }

    this.addFooters(doc, data);

    return doc.output('blob');
  }

  private ensureSpace(doc: jsPDF, y: number, needed: number): number {
    if (y + needed > this.pageHeight - this.footerReserve) {
      doc.addPage();
      return this.margin;
    }
    return y;
  }

  private drawHeader(doc: jsPDF, data: ApplicationPdfData, logoImage: LoadedPdfImage | null, y: number): number {
    const startY = y;
    let textX = this.margin;

    if (logoImage) {
      const boxSize = 20;
      const ratio = logoImage.width / logoImage.height;
      const w = ratio > 1 ? boxSize : boxSize * ratio;
      const h = ratio > 1 ? boxSize / ratio : boxSize;
      doc.addImage(logoImage.dataUrl, 'PNG', this.margin, y, w, h);
      textX = this.margin + boxSize + 4;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(90);
    doc.text('Republic of the Philippines', textX, y + 4);
    doc.text('City of Bislig, Surigao del Sur', textX, y + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(20);
    doc.text(data.documentTitle, textX, y + 15);

    if (data.subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(90);
      doc.text(data.subtitle, textX, y + 20);
    }

    const rightX = this.pageWidth - this.margin;
    let metaY = startY + 2;
    doc.setFontSize(9);

    if (data.statusLabel) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...this.brandColor);
      doc.text(`Status: ${data.statusLabel}`, rightX, metaY, { align: 'right' });
      metaY += 5;
    }

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90);
    if (data.trackingNumber) {
      doc.text(`Tracking No.: ${data.trackingNumber}`, rightX, metaY, { align: 'right' });
      metaY += 5;
    }
    if (data.businessIdNumber) {
      doc.text(`Business ID No.: ${data.businessIdNumber}`, rightX, metaY, { align: 'right' });
      metaY += 5;
    }

    const bottomY = Math.max(startY + 24, metaY) + 2;
    doc.setDrawColor(...this.brandColor);
    doc.setLineWidth(0.6);
    doc.line(this.margin, bottomY, this.pageWidth - this.margin, bottomY);
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.setTextColor(20);

    return bottomY + 7;
  }

  private drawSectionHeading(doc: jsPDF, heading: string, y: number): number {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...this.brandColor);
    doc.text(heading, this.margin, y);

    doc.setDrawColor(...this.brandColor);
    doc.setLineWidth(0.3);
    doc.line(this.margin, y + 1.5, this.pageWidth - this.margin, y + 1.5);
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.setTextColor(20);

    return y + 7;
  }

  private drawSection(doc: jsPDF, section: PdfSection, y: number): number {
    y = this.drawSectionHeading(doc, section.heading, y);

    autoTable(doc, {
      startY: y,
      margin: { left: this.margin, right: this.margin, bottom: this.footerReserve },
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2.2, overflow: 'linebreak', valign: 'top', lineColor: [222, 222, 222], textColor: 30 },
      columnStyles: {
        0: { cellWidth: 55, fontStyle: 'bold', fillColor: [246, 248, 246] },
        1: { cellWidth: this.contentWidth - 55 },
      },
      body: section.rows.map(r => [r.label, (r.value ?? '').toString().trim() || 'Not provided']),
    });

    return (doc as any).lastAutoTable.finalY + 8;
  }

  private drawDocumentsGrid(doc: jsPDF, documents: PdfDocumentImage[], images: (LoadedPdfImage | null)[], y: number): number {
    y = this.drawSectionHeading(doc, 'Uploaded Documents', y);

    const boxW = 40;
    const boxH = 30;
    const gap = 6;
    const cellW = boxW + gap;
    const cellH = boxH + 6 + gap + 4;
    const cols = Math.max(1, Math.floor((this.contentWidth + gap) / cellW));

    documents.forEach((docImg, i) => {
      const col = i % cols;
      if (col === 0) {
        y = this.ensureSpace(doc, y, cellH);
      }
      const x = this.margin + col * cellW;

      doc.setDrawColor(200);
      doc.setLineWidth(0.2);
      doc.rect(x, y, boxW, boxH);

      const loaded = images[i];
      if (loaded && loaded.width > 0 && loaded.height > 0) {
        const ratio = loaded.width / loaded.height;
        let w = boxW - 4;
        let h = w / ratio;
        if (h > boxH - 4) {
          h = boxH - 4;
          w = h * ratio;
        }
        doc.addImage(loaded.dataUrl, 'PNG', x + (boxW - w) / 2, y + (boxH - h) / 2, w, h);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(160);
        doc.text('No preview available', x + boxW / 2, y + boxH / 2, { align: 'center' });
        doc.setTextColor(20);
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(60);
      const labelLines = (doc.splitTextToSize(docImg.label || 'Document', boxW) as string[]).slice(0, 2);
      doc.text(labelLines, x + boxW / 2, y + boxH + 4, { align: 'center' });
      doc.setTextColor(20);

      if (col === cols - 1 || i === documents.length - 1) {
        y += cellH;
      }
    });

    return y + 2;
  }

  private drawApprovalsTable(doc: jsPDF, approvals: PdfApprovalRow[], y: number): number {
    y = this.drawSectionHeading(doc, 'Department Approval Status', y);

    autoTable(doc, {
      startY: y,
      margin: { left: this.margin, right: this.margin, bottom: this.footerReserve },
      theme: 'grid',
      head: [['Department', 'Status', 'Notes / Remarks']],
      headStyles: { fillColor: this.brandColor, textColor: 255, fontStyle: 'bold', fontSize: 9 },
      styles: { fontSize: 9, cellPadding: 2.5, overflow: 'linebreak', valign: 'top', textColor: 30 },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 28 },
        2: { cellWidth: this.contentWidth - 83 },
      },
      body: approvals.map(a => [a.department, a.status, (a.notes ?? '').trim() || 'None']),
    });

    return (doc as any).lastAutoTable.finalY + 8;
  }

  private drawSignatures(doc: jsPDF, signatures: PdfSignatureBlock[], images: (LoadedPdfImage | null)[], y: number): number {
    const blockW = this.contentWidth / signatures.length;

    signatures.forEach((sig, i) => {
      const x = this.margin + i * blockW;
      const centerX = x + blockW / 2;
      const loaded = images[i];

      if (loaded && loaded.width > 0 && loaded.height > 0) {
        const maxW = blockW - 20;
        const maxH = 16;
        const ratio = loaded.width / loaded.height;
        let w = maxW;
        let h = w / ratio;
        if (h > maxH) {
          h = maxH;
          w = h * ratio;
        }
        doc.addImage(loaded.dataUrl, 'PNG', centerX - w / 2, y, w, h);
      }

      const lineY = y + 18;
      doc.setDrawColor(60);
      doc.setLineWidth(0.2);
      doc.line(x + 8, lineY, x + blockW - 8, lineY);
      doc.setDrawColor(0);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(20);
      doc.text((sig.name || '').toUpperCase(), centerX, lineY + 4, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(90);
      doc.text(sig.role || '', centerX, lineY + 8, { align: 'center' });
      doc.setTextColor(20);
    });

    return y + 30;
  }

  private drawDeclaration(doc: jsPDF, text: string, y: number): number {
    const lines = doc.splitTextToSize(text, this.contentWidth) as string[];
    const needed = lines.length * 3.6 + 4;
    y = this.ensureSpace(doc, y, needed);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100);
    doc.text(lines, this.margin, y);
    doc.setTextColor(20);

    return y + needed;
  }

  private addFooters(doc: jsPDF, data: ApplicationPdfData): void {
    const total = doc.getNumberOfPages();
    const generated = (data.generatedAt || new Date()).toLocaleString('en-US');

    for (let i = 1; i <= total; i++) {
      doc.setPage(i);

      doc.setDrawColor(215);
      doc.setLineWidth(0.2);
      doc.line(this.margin, this.pageHeight - 14, this.pageWidth - this.margin, this.pageHeight - 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(130);
      doc.text(`Generated ${generated}. System-generated document, not valid without an authorized signature.`, this.margin, this.pageHeight - 9);
      doc.text(`Page ${i} of ${total}`, this.pageWidth - this.margin, this.pageHeight - 9, { align: 'right' });
    }
  }
}
