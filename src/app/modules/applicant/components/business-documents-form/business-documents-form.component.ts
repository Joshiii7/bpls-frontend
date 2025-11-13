import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-business-documents-form',
  templateUrl: './business-documents-form.component.html',
  styleUrls: ['./business-documents-form.component.css']
})
export class BusinessDocumentsFormComponent implements OnInit {
  @Output() formDataChange = new EventEmitter<any>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedLocation: any = null;
  showModal = false;
  modalTitle = '';
  activeField = '';
  previewUrl: string | null = null;
  activeFile: File | null = null;

  documents: {
    [key: string]: {
      title: string;
      file?: File;
      previewUrl?: string | null;
      fileName?: string;
    };
  } = {
    file1: { title: 'Proof of Registration (DTI/SEC/CDA)', previewUrl: null },
    file2: { title: 'Authority to Use of Place of Business', previewUrl: null },
    file3: { title: 'Fire Safety Inspection Certificate', previewUrl: null },
    file4: { title: 'Sanitary Permit / Health Clearance', previewUrl: null },
    file6: { title: 'Environmental Clearance / Barangay Clearance', previewUrl: null },
    file7: { title: 'Occupancy Permit', previewUrl: null },
  };

  ngOnInit(): void {
    
  }

  onLocationSelected(location: { lng: number; lat: number }) {
    this.selectedLocation = location;
    console.log('Location received from child:', location);

    this.emitFormData();
  }

  openUploadModal(title: string, field: string) {
    this.modalTitle = title;
    this.activeField = field;
    this.showModal = true;

    // Restore preview if already uploaded before
    this.previewUrl = this.documents[field]?.previewUrl || null;
    this.activeFile = this.documents[field]?.file || null;
  }

  closeModal() {
    this.showModal = false;
    this.previewUrl = null;
    this.activeFile = null;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelect(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.activeFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.activeFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  confirmSelection() {
    if (!this.previewUrl) {
      Swal.fire({
        icon: 'warning',
        title: 'No image selected',
        text: 'Please select an image before continuing.',
        confirmButtonColor: '#009800',
      });
      return;
    }

    if (this.activeField && this.activeFile && this.previewUrl) {
      this.documents[this.activeField] = {
        title: this.modalTitle,
        file: this.activeFile,
        previewUrl: this.previewUrl,
        fileName: this.activeFile.name,
      };
    }
    this.closeModal();

    Swal.fire({
      icon: 'success',
      title: 'Image selected!',
      text: 'Your image has been successfully chosen.',
      confirmButtonColor: '#009800',
    });

    this.emitFormData();
  }

  emitFormData() {
    this.formDataChange.emit({
      documents: this.documents,
      location: this.selectedLocation,
    });
  }
}
