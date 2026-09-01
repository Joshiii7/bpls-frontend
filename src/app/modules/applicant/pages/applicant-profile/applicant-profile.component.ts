import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApplicantService } from '../../services/applicant.service';
import { UserProfileService } from 'src/app/core/services/user-profile.service';

interface CompletionField {
  key: 'first_name' | 'last_name' | 'number' | 'email' | 'signature';
  label: string;
}

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
  showSignatureEditor = false;

  isLoading = true;
  isSaving = false;
  accountTypeLabel = 'Applicant Account';
  private lastSavedValue: any = null;

  // What "complete profile" means for an applicant, kept in sync with the
  // dashboard's own nudge (fieldsToCheck in applicant-dashboard.component.ts).
  // middle_name/suffix are intentionally excluded: they're genuinely optional.
  private readonly completionFields: CompletionField[] = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'number', label: 'Contact Number' },
    { key: 'email', label: 'Email' },
    { key: 'signature', label: 'Signature' },
  ];
  completionPercent = 0;
  missingFieldLabels: string[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApplicantService,
    private profileApi: UserProfileService,
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      id: [''],
      first_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      middle_name: [''],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      suffix: [''],
      number: ['', [Validators.required, Validators.pattern(/^\+63\s?\d{3}\s?\d{3}\s?\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      signature: ['']
    });

    this.profileForm.valueChanges.subscribe(() => this.updateCompletion());
    this.initUserProfile();
  }

  initUserProfile() {
    this.isLoading = true;
    this.profileApi.getUserProfile().subscribe({
      next: (response: any) => {
        this.isLoading = false;
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
        this.lastSavedValue = this.profileForm.getRawValue();
        // Applicants without a signature yet land straight in the editor; those
        // who already have one see a preview first instead of a blank canvas.
        this.showSignatureEditor = !response.signature;
        this.updateCompletion();

        // The whole form (canvas included) sits behind *ngIf="!isLoading", so
        // the canvas only just entered the DOM, this is the first point it
        // can actually be initialized, not ngAfterViewInit.
        if (this.showSignatureEditor && this.signatureMode === 'draw') {
          setTimeout(() => this.initCanvas(), 0);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error("error fetching user profile data: ", err)
      }
    });

    this.api.getUserRole().subscribe({
      next: (response: any) => {
        const role = response?.user?.[0]?.user_role?.role_name;
        this.accountTypeLabel = role === 'admin' ? 'Administrator Account' : 'Business Owner Account';
      },
      error: () => {
        // Non-critical: the page still works with the generic label.
      }
    });
  }

  get displayName(): string {
    const name = [this.profileForm?.value?.first_name, this.profileForm?.value?.last_name].filter(Boolean).join(' ');
    return name || 'Complete your name below';
  }

  get initials(): string {
    const first = this.profileForm?.value?.first_name?.[0] || '';
    const last = this.profileForm?.value?.last_name?.[0] || '';
    return (first + last).toUpperCase() || '?';
  }

  get hasSignatureOnFile(): boolean {
    return !!this.profileForm?.value?.signature;
  }

  private updateCompletion(): void {
    if (!this.profileForm) return;
    const values = this.profileForm.value;
    const missing = this.completionFields.filter(f => !values[f.key]);
    this.missingFieldLabels = missing.map(f => f.label);
    this.completionPercent = Math.round(((this.completionFields.length - missing.length) / this.completionFields.length) * 100);
  }

  editSignature(): void {
    this.showSignatureEditor = true;
    setTimeout(() => this.initCanvas(), 0);
  }

  cancelSignatureEdit(): void {
    if (!this.hasSignatureOnFile) return;
    this.showSignatureEditor = false;
  }

  discardChanges(): void {
    if (!this.profileForm.dirty) return;

    Swal.fire({
      title: 'Discard unsaved changes?',
      text: 'Your edits since the last save will be lost.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, discard',
      cancelButtonText: 'Keep editing'
    }).then((result) => {
      if (result.isConfirmed && this.lastSavedValue) {
        this.profileForm.reset(this.lastSavedValue);
        this.showSignatureEditor = !this.lastSavedValue.signature;
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
          this.profileForm.markAsDirty();
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
      Swal.fire({
        icon: 'warning',
        title: 'No Signature',
        text: 'Please draw or upload a signature first.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Understood'
      });
      return;
    }
    this.signatureError = false;
    this.profileForm.patchValue({ signature: dataUrl });
    this.profileForm.markAsDirty();
    // Attached, not yet saved, collapses to the preview so it reads as
    // captured, while the "unsaved changes" note below still points to
    // Save Changes as the step that actually persists it.
    this.showSignatureEditor = false;
  }

  onSubmitProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Profile',
        text: 'Please complete all required fields before saving.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Understood'
      });
      return;
    }

    const userID = this.profileForm.value.id;
    this.isSaving = true;

    this.profileApi.patchUserProfile(this.profileForm.value, userID).subscribe({
      next: () => {
        this.isSaving = false;
        this.lastSavedValue = this.profileForm.getRawValue();
        this.profileForm.markAsPristine();
        this.profileApi.notifyProfileUpdated();
        Swal.fire({
          title: 'Profile Updated',
          text: 'Your profile has been successfully updated.',
          icon: 'success',
          confirmButtonColor: '#008900',
          confirmButtonText: 'OK'
        });
      },
      error: (err: any) => {
        this.isSaving = false;
        console.error("Error patching value to your profile: ", err);
        Swal.fire({
          title: 'Error',
          text: 'There was an error updating your profile. Please try again.',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Understood'
        });
      }
    });
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

  // Stores the uploaded image's data URL directly as the signature. This
  // intentionally never touches the drawing <canvas>, that element only
  // exists in the DOM while signatureMode is 'draw' (see the *ngIf in the
  // template), so reaching into it here would throw once a user actually
  // switched to Upload mode to select a file.
  private useUploadedImage(dataUrl: string): void {
    this.signatureError = false;
    this.profileForm.patchValue({ signature: dataUrl });
    this.profileForm.markAsDirty();
    this.showSignatureEditor = false;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => this.useUploadedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragHover = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => this.useUploadedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }
}