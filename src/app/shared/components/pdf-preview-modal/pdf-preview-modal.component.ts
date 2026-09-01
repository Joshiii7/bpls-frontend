import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Generic PDF viewer modal: knows nothing about where the Blob came from. A page calls
// showLoading() while it builds the PDF (via PdfGeneratorService), then showPdf() or
// showError() with the result. Kept separate from PdfGeneratorService so the "how to
// view a PDF" concern and the "how to build a PDF" concern can each be reused alone.
@Component({
  selector: 'app-pdf-preview-modal',
  templateUrl: './pdf-preview-modal.component.html',
  styleUrls: ['./pdf-preview-modal.component.css']
})
export class PdfPreviewModalComponent implements OnDestroy {
  @ViewChild('pdfFrame') pdfFrame?: ElementRef<HTMLIFrameElement>;

  visible = false;
  isGenerating = false;
  errorMessage: string | null = null;
  fileName = 'document.pdf';
  safeUrl: SafeResourceUrl | null = null;

  private objectUrl: string | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  showLoading(fileName: string): void {
    this.fileName = fileName;
    this.isGenerating = true;
    this.errorMessage = null;
    this.safeUrl = null;
    this.visible = true;
  }

  showPdf(blob: Blob, fileName: string): void {
    this.revokeUrl();
    this.objectUrl = URL.createObjectURL(blob);
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
    this.fileName = fileName;
    this.isGenerating = false;
    this.errorMessage = null;
    this.visible = true;
  }

  showError(message: string): void {
    this.isGenerating = false;
    this.errorMessage = message;
    this.visible = true;
  }

  close(): void {
    this.visible = false;
    this.revokeUrl();
    this.safeUrl = null;
  }

  download(): void {
    if (!this.objectUrl) return;
    const link = document.createElement('a');
    link.href = this.objectUrl;
    link.download = this.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  print(): void {
    const frameWindow = this.pdfFrame?.nativeElement?.contentWindow;
    try {
      if (!frameWindow) throw new Error('preview frame not ready');
      frameWindow.focus();
      frameWindow.print();
    } catch {
      // Fallback for browsers that block scripted printing of embedded PDFs:
      // open it in a new tab where the native PDF viewer's own print button works.
      if (this.objectUrl) {
        window.open(this.objectUrl, '_blank');
      }
    }
  }

  ngOnDestroy(): void {
    this.revokeUrl();
  }

  private revokeUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
