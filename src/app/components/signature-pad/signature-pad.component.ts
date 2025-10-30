import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.css']
})
export class SignaturePadComponent {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() signatureSaved = new EventEmitter<string>();

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private storageKey = 'savedSignature';

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000000';

    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const img = new Image();
      img.src = saved;
      img.onload = () => this.ctx.drawImage(img, 0, 0);
    }
  }

  onMouseDown(event: MouseEvent) {
    this.startDrawing(event.offsetX, event.offsetY);
  }

  onMouseMove(event: MouseEvent) {
    if (!this.drawing) return;
    this.drawLine(event.offsetX, event.offsetY);
  }

  onMouseUp() {
    this.stopDrawing();
  }

  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
  }

  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    if (!this.drawing) return;
    const touch = event.touches[0];
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.drawLine(touch.clientX - rect.left, touch.clientY - rect.top);
  }

  onTouchEnd() {
    this.stopDrawing();
  }

  private startDrawing(x: number, y: number) {
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  private drawLine(x: number, y: number) {
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  private stopDrawing() {
    if (this.drawing) {
      this.drawing = false;
    }
  }

  clearCanvas() {
    Swal.fire({
      title: 'Clear Signature?',
      text: 'Are you sure you want to clear your signature? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#009800',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const canvas = this.canvasRef.nativeElement;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        localStorage.removeItem(this.storageKey);
        this.signatureSaved.emit('');

        Swal.fire({
          title: 'Cleared!',
          text: 'Your signature has been cleared successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  saveImage() {
    Swal.fire({
      title: 'Save Signature?',
      text: 'Are you sure you want to save this signature?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#009800',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const canvas = this.canvasRef.nativeElement;
        const imageData = canvas.toDataURL('image/png');
        localStorage.setItem(this.storageKey, imageData);
        this.signatureSaved.emit(imageData);

        Swal.fire({
          title: 'Saved!',
          text: 'Your signature has been saved successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
}
