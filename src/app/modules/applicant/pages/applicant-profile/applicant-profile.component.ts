import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApplicantService } from '../../services/applicant.service';
import { map, catchError, of } from 'rxjs';

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

  constructor(
    private fb: FormBuilder,
    private api: ApplicantService,
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      id: [''],
      first_name: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
      middle_name: [''],
      last_name: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
      suffix: [''],
      number: ['', [Validators.pattern(/^\+63\s?\d{3}\s?\d{3}\s?\d{4}$/)]],
      email: ['', [Validators.email]],
      signature: ['']
    });

    this.initUserProfile();
  }

  ngAfterViewInit() {
    if (this.signatureMode === 'draw') {
      this.initCanvas();
    }
  }

  initUserProfile() {
    this.api.getUserProfile().subscribe({
      next: (response: any) => {

        this.profileForm.patchValue({
          id: response.id || '',
          first_name: response.first_name || '',
          middle_name: response.middle_name || '',
          last_name: response.last_name || '',
          suffix: response.suffix || '',
          number: response.number || '',
          email: response.email || '',
          signature: response.signature || '',
        });
      },
      error: (err: any) => {
        console.error("error fetching user profile data: ", err)
      }
    });
  }

  checkUniqueNumber() {
    const numberControl = this.profileForm.get('number');
    const number = numberControl?.value?.trim();

    if (!number) return;

    this.api.checkPhoneNumber(number).subscribe({
      next: (res: any) => {
        if (res.exists) {
          numberControl?.setErrors({ phoneTaken: true });
        } else {
          
          if (numberControl?.hasError('phoneTaken')) {
            numberControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
            numberControl?.setErrors(null);
          }
        }
      },
      error: (err: any) => {
        console.error("error fetching api: ", err);
      }
    });
  }

  onNumberInput(event: any) {
    let input = event.target.value;

    if (!input.startsWith('+63')) {
      input = '+63' + input.replace(/\D/g, '');
    } else {
      input = '+63' + input.slice(3).replace(/\D/g, '');
    }

    if (input.length > 3 && input[3] === '0') {
      input = '+63' + input.slice(4);
    }

    const digits = input.slice(3);
    let formatted = '+63 ';
    if (digits.length > 0) formatted += digits.substring(0, 3);
    if (digits.length >= 4) formatted += ' ' + digits.substring(3, 6);
    if (digits.length >= 7) formatted += ' ' + digits.substring(6, 10);

    event.target.value = formatted;

    this.profileForm.patchValue({ number: formatted }, { emitEvent: false });
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
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
    }

    if (this.profileForm.valid) {
      console.log('Profile submitted', this.profileForm.value);

      const userID = this.profileForm.value.id;
      
      this.api.patchUserProfile(this.profileForm.value, userID).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Profile Updated',
            text: 'Your profile has been successfully updated.',
            icon: 'success',
            confirmButtonColor: '#008900',
            confirmButtonText: 'OK'
          });
        },
        error: (err: any) => {
          console.error("Error patching value to your profile: ", err);
          Swal.fire({
            title: 'Error',
            text: 'There was an error updating your profile.',
            icon: 'error',
            confirmButtonColor: '#FF0000',
            confirmButtonText: 'Understood'
          });
        }
    });

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