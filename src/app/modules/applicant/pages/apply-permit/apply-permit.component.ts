import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-apply-permit',
  templateUrl: './apply-permit.component.html',
  styleUrls: ['./apply-permit.component.css']
})
export class ApplyPermitComponent {
  activeTab = 'businessInfo';
  tabs = [
    { key: 'businessInfo', label: 'A. Business Information' },
    { key: 'businessOperation', label: 'B. Business Operation' },
    { key: 'documentsLocation', label: 'C. Documents & Location' },
    { key: 'review', label: 'D. Review' },
  ];

  applicationTypeForm!: FormGroup;
  paymentOptionForm!: FormGroup;
  businessInfoForm!: FormGroup;

  genderOptions = ['Male', 'Female'];
  organizationOptions = [
    'Sole Proprietorship',
    'One Person Corporation',
    'Partnership',
    'Corporation',
    'Cooperative',
  ];

  filteredGenders = [...this.genderOptions];
  filteredOrganizations = [...this.organizationOptions];

  genderDropdownOpen = false;
  orgDropdownOpen = false;
  
  provinceDropdownOpen = false;
  cityDropdownOpen = false;
  barangayDropdownOpen = false;

  filteredProvinces: string[] = [];
  filteredCities: string[] = [];
  filteredBarangays: string[] = [];

  allProvinces: string[] = ['Cebu', 'Bohol', 'Davao'];

  allCities: { [province: string]: string[] } = {
    Cebu: ['Cebu City', 'Lapu-Lapu', 'Mandaue'],
    Bohol: ['Tagbilaran', 'Loboc', 'Panglao'],
    Davao: ['Davao City', 'Panabo', 'Digos'],
  };

  allBarangays: { [city: string]: string[] } = {
    'Cebu City': ['Barangay 1', 'Barangay 2'],
    'Lapu-Lapu': ['Pajo', 'Marigondon'],
    'Mandaue': ['Looc', 'Basak'],
    Tagbilaran: ['Cogon', 'Tawala'],
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.applicationTypeForm = this.fb.group({
      applicationType: ['', Validators.required],
    });

    this.paymentOptionForm = this.fb.group({
      paymentOption: ['', Validators.required],
    });

    this.businessInfoForm = this.fb.group({
      // Business Information
      businessName: ['', Validators.required],
      tradeName: [''],
      registrationNumber: ['', Validators.required],
      registrationDate: ['', Validators.required],
      tin: ['', [Validators.required, Validators.pattern(/^(\d{3}-\d{3}-\d{3}|\d{3}-\d{3}-\d{3}-\d{3})$/)]],
      organizationType: ['', Validators.required],
      gender: [''],

      // Owner's Information
      givenName: ['', Validators.required],
      middleName: ['', Validators.required],
      surname: ['', Validators.required],
      suffix: [''],
      contactNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],

      // Main Office Primary Address
      province: ['', Validators.required],
      city: ['', Validators.required],
      barangay: ['', Validators.required],
      zipCode: ['', Validators.required],
    });

    this.businessInfoForm.get('organizationType')?.valueChanges.subscribe((val) => {
      if (val === 'Sole Proprietorship' || val === 'One Person Corporation') {
        this.businessInfoForm.get('gender')?.setValidators([Validators.required]);
      } else {
        this.businessInfoForm.get('gender')?.clearValidators();
      }
      this.businessInfoForm.get('gender')?.updateValueAndValidity();
    });
  }

  get showGender() {
    const type = this.businessInfoForm.get('organizationType')?.value;
    return type === 'Sole Proprietorship' || type === 'One Person Corporation';
  }

  inputClass(field: string): string {
    const control = this.businessInfoForm.get(field);
    const base =
      'bg-white border text-sm rounded-md block w-full p-2.5 text-gray-800 placeholder-gray-400 focus:outline-none';
    if (control?.invalid && control?.touched) {
      return base + ' border-red-500 focus:border-red-500';
    }
    return base + ' focus:border-green-500';
  }

  labelClass(field: string): string {
    const control = this.businessInfoForm.get(field);
    if (control?.invalid && control?.touched) {
      return 'block font-medium text-sm text-red-600';
    }
    return 'block font-medium text-sm text-gray-700';
  }

  isInvalid(field: string): string | null {
    const control = this.businessInfoForm.get(field);
    if (!control || !control.touched || !control.errors) return null;

    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['pattern']) {
      if (field === 'tin') {
        return 'Please enter a valid TIN (format: 123-456-789 or 123-456-789-000).';
      }
      return 'Invalid format.';
    }

    return null;
  }

  formatTin(): void {
    const control = this.businessInfoForm.get('tin');
    if (!control) return;

    let value = control.value.replace(/[^0-9]/g, '');

    if (value.length <= 3) {
      value = value;
    } else if (value.length <= 6) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length <= 9) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    } else {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 9)}-${value.slice(9, 12)}`;
    }

    control.setValue(value, { emitEvent: false });
  }

  filterProvinces() {
    const value = this.businessInfoForm.get('province')?.value?.toLowerCase() || '';
    this.filteredProvinces = this.allProvinces.filter(p => p.toLowerCase().includes(value));
  }

  selectProvince(province: string) {
    this.businessInfoForm.get('province')?.setValue(province);
    this.provinceDropdownOpen = false;

    // reset dependent fields
    this.businessInfoForm.get('city')?.reset();
    this.businessInfoForm.get('barangay')?.reset();
    this.filteredCities = [];
    this.filteredBarangays = [];
  }

  closeProvinceDropdown() {
    setTimeout(() => (this.provinceDropdownOpen = false), 150);
  }

  // City methods
  filterCities() {
    const province = this.businessInfoForm.get('province')?.value;
    const value = this.businessInfoForm.get('city')?.value?.toLowerCase() || '';
    if (!province) return;
    this.filteredCities = this.allCities[province].filter(c => c.toLowerCase().includes(value));
  }

  selectCity(city: string) {
    this.businessInfoForm.get('city')?.setValue(city);
    this.cityDropdownOpen = false;

    // reset dependent barangay
    this.businessInfoForm.get('barangay')?.reset();
    this.filteredBarangays = [];
  }

  closeCityDropdown() {
    setTimeout(() => (this.cityDropdownOpen = false), 150);
  }

  // Barangay methods
  filterBarangays() {
    const city = this.businessInfoForm.get('city')?.value;
    const value = this.businessInfoForm.get('barangay')?.value?.toLowerCase() || '';
    if (!city) return;
    this.filteredBarangays = this.allBarangays[city].filter(b => b.toLowerCase().includes(value));
  }

  selectBarangay(barangay: string) {
    this.businessInfoForm.get('barangay')?.setValue(barangay);
    this.barangayDropdownOpen = false;
  }

  closeBarangayDropdown() {
    setTimeout(() => (this.barangayDropdownOpen = false), 150);
  }

  filterGenderOptions() {
    const input = this.businessInfoForm.get('gender')?.value.toLowerCase() || '';
    this.filteredGenders = this.genderOptions.filter((g) =>
      g.toLowerCase().includes(input)
    );
  }

  selectGender(g: string) {
    this.businessInfoForm.get('gender')?.setValue(g);
    this.genderDropdownOpen = false;
  }

  closeGenderDropdown() {
    setTimeout(() => (this.genderDropdownOpen = false), 150);
  }

  // 🏢 Organization filter
  filterOrganizationOptions() {
    const input = this.businessInfoForm.get('organizationType')?.value.toLowerCase() || '';
    this.filteredOrganizations = this.organizationOptions.filter((o) =>
      o.toLowerCase().includes(input)
    );
  }

  selectOrganization(o: string) {
    this.businessInfoForm.get('organizationType')?.setValue(o);
    this.orgDropdownOpen = false;
  }

  closeOrgDropdown() {
    setTimeout(() => (this.orgDropdownOpen = false), 150);
  }
}
