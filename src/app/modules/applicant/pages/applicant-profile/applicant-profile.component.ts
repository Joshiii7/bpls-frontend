import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-applicant-profile',
  templateUrl: './applicant-profile.component.html',
  styleUrls: ['./applicant-profile.component.css']
})
export class ApplicantProfileComponent {
  profileForm!: FormGroup;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | null;
  private drawing = false;
  private lastX = 0;
  private lastY = 0;

  signatureMode: 'draw' | 'upload' = 'draw';
  signatureError = false;
  dragHover = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      middle_name: [''],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      suffix: [''],
      number: ['', [Validators.required, Validators.pattern(/^\+?\d{9,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      signature: ['']
    });
  }

  ngAfterViewInit() {
    if (this.signatureMode === 'draw') {
      this.initCanvas();
    }
  }

  // Reinitialize canvas when switching back to draw
  onSignatureModeChange(mode: 'draw' | 'upload') {
    this.signatureMode = mode;
    if (mode === 'draw') {
      setTimeout(() => this.initCanvas(), 0); // wait for DOM to render
    }
  }

  private initCanvas() {
    if (!this.canvas) return;
    const canvasEl = this.canvas.nativeElement;
    canvasEl.width = canvasEl.offsetWidth;
    canvasEl.height = canvasEl.offsetHeight;
    this.ctx = canvasEl.getContext('2d');
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    if (!this.ctx) return;
    this.drawing = true;
    const { x, y } = this.getCoords(event);
    this.lastX = x;
    this.lastY = y;
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.drawing || !this.ctx) return;
    const { x, y } = this.getCoords(event);
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.lastX = x;
    this.lastY = y;
  }

  stopDrawing() {
    this.drawing = false;
  }

  private getCoords(event: MouseEvent | TouchEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    if (event instanceof MouseEvent) {
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    } else {
      const touch = event.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
  }

  clearCanvas() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will clear your signature!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#009800',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.ctx) {
          this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
          this.profileForm.patchValue({ signature: '' });
        }
        Swal.fire({
          title: 'Signature Cleared!',
          text: 'Your signature has been successfully removed.',
          icon: 'success',
          confirmButtonColor: '#009800',
          confirmButtonText: 'Got it'
        });

      }
    });
  }

  onSubmitSignature() {
    if (!this.ctx) return;
    const dataUrl = this.canvas.nativeElement.toDataURL();
    if (!dataUrl) {
      this.signatureError = true;
      alert('Please provide a signature.');
      return;
    }
    this.signatureError = false;
    this.profileForm.patchValue({ signature: dataUrl });
    console.log('Signature saved', dataUrl);
  }

  onSubmitProfile() {
    if (this.profileForm.valid) {
      console.log('Profile submitted', this.profileForm.value);
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  // Drag & drop
  @HostListener('window:dragover', ['$event'])
  @HostListener('window:drop', ['$event'])
  preventDefault(event: DragEvent) {
    event.preventDefault();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragHover = true;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          this.clearCanvas();
          this.ctx?.drawImage(img, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
          this.profileForm.patchValue({ signature: this.canvas.nativeElement.toDataURL() });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragHover = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          this.clearCanvas();
          this.ctx?.drawImage(img, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
          this.profileForm.patchValue({ signature: this.canvas.nativeElement.toDataURL() });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}