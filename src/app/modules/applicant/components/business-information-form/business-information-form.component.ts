import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicantService } from '../../services/applicant.service';

@Component({
  selector: 'app-business-information-form',
  templateUrl: './business-information-form.component.html',
  styleUrls: ['./business-information-form.component.css']
})
export class BusinessInformationFormComponent implements OnInit {
  @Output() formValueChange = new EventEmitter<{ formType: string; form: FormGroup }>();
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

  allProvinces: { province_name: string; province_code: string }[] = [];
  filteredProvinces: { province_name: string; province_code: string }[] = [];

  allCities: { city_name: string; city_code: string }[] = [];
  filteredCities: { city_name: string; city_code: string }[] = [];

  allBarangays: { brgy_name: string; brgy_code: string }[] = [];
  filteredBarangays: { brgy_name: string; brgy_code: string }[] = [];

  highlightedProvinceIndex: number = -1;
  highlightedCityIndex: number = -1;
  highlightedBarangayIndex: number = -1;

  highlightedOrganizationIndex: number = -1;
  highlightedGenderIndex: number = -1;

  constructor(
    private api: ApplicantService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {

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

      // Main Office Optional Address
      streetAddress: ['', Validators.required], // required
      houseNumber: [''],
      buildingName: [''],
      lotNumber: [''],
      blockNumber: [''],
      subdivision: ['']
    });

    this.businessInfoForm.get('organizationType')?.valueChanges.subscribe((val) => {
      if (val === 'Sole Proprietorship' || val === 'One Person Corporation') {
        this.businessInfoForm.get('gender')?.setValidators([Validators.required]);
      } else {
        this.businessInfoForm.get('gender')?.clearValidators();
      }
      this.businessInfoForm.get('gender')?.updateValueAndValidity();
    });

    this.businessInfoForm.valueChanges.subscribe(() => {
      this.formValueChange.emit({ formType: 'businessInfo', form: this.businessInfoForm });
    });

    this.initAddress();
  }

  initAddress() {
    this.api.getProvinces().subscribe({
      next: (response: any) => {
        this.allProvinces = response;
      },
      error: (err: any) => {
        console.error("error fetching provinces: ", err)
      }
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

  // Province
  filterProvinces() {
    const value = this.businessInfoForm.get('province')?.value?.toLowerCase() || '';
    this.filteredProvinces = this.allProvinces.filter(p =>
      p.province_name.toLowerCase().includes(value)
    );
  }

  selectProvince(province: any) {
    this.businessInfoForm.get('province')?.setValue(province.province_name);
    this.provinceDropdownOpen = false;

    // reset dependent fields
    this.businessInfoForm.get('city')?.reset();
    this.businessInfoForm.get('barangay')?.reset();
    this.filteredCities = [];
    this.filteredBarangays = [];

    this.api.getCities(province.province_code).subscribe({
      next: (cities: any[]) => {
        this.allCities = cities;
      },
      error: (err) => console.error('Error fetching cities:', err)
    });
  }

  // City
  filterCities() {
    const value = this.businessInfoForm.get('city')?.value?.toLowerCase() || '';
    this.filteredCities = this.allCities.filter(c =>
      c.city_name.toLowerCase().includes(value)
    );
  }

  selectCity(city: any) {
    this.businessInfoForm.get('city')?.setValue(city.city_name);
    this.cityDropdownOpen = false;

    this.businessInfoForm.get('barangay')?.reset();
    this.filteredBarangays = [];

    this.api.getBaranggays(city.city_code).subscribe({
      next: (barangays: any[]) => {
        this.allBarangays = barangays;
      },
      error: (err) => console.error('Error fetching barangays:', err)
    });
  }

  // Barangay
  filterBarangays() {
    const value = this.businessInfoForm.get('barangay')?.value?.toLowerCase() || '';
    this.filteredBarangays = this.allBarangays.filter(b =>
      b.brgy_name.toLowerCase().includes(value)
    );
  }

  selectBarangay(barangay: any) {
    this.businessInfoForm.get('barangay')?.setValue(barangay.brgy_name);
    this.barangayDropdownOpen = false;
  }

  handleProvinceKeydown(event: KeyboardEvent) {
    const key = event.key;

    if (!this.provinceDropdownOpen || this.filteredProvinces.length === 0) return;

    if (key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedProvinceIndex =
        (this.highlightedProvinceIndex + 1) % this.filteredProvinces.length;
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedProvinceIndex =
        (this.highlightedProvinceIndex - 1 + this.filteredProvinces.length) %
        this.filteredProvinces.length;
    } else if (key === 'Enter') {
      event.preventDefault();
      const selected = this.filteredProvinces[this.highlightedProvinceIndex];
      if (selected) this.selectProvince(selected);
    } else if (key === 'Escape') {
      this.provinceDropdownOpen = false;
    }
  }

  handleCityKeydown(event: KeyboardEvent) {
    const key = event.key;

    if (!this.cityDropdownOpen || this.filteredCities.length === 0) return;

    if (key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedCityIndex =
        (this.highlightedCityIndex + 1) % this.filteredCities.length;
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedCityIndex =
        (this.highlightedCityIndex - 1 + this.filteredCities.length) %
        this.filteredCities.length;
    } else if (key === 'Enter') {
      event.preventDefault();
      const selected = this.filteredCities[this.highlightedCityIndex];
      if (selected) this.selectCity(selected);
    } else if (key === 'Escape') {
      this.cityDropdownOpen = false;
    }
  }

  handleBarangayKeydown(event: KeyboardEvent) {
    const key = event.key;

    if (!this.barangayDropdownOpen || this.filteredBarangays.length === 0) return;

    if (key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedBarangayIndex =
        (this.highlightedBarangayIndex + 1) % this.filteredBarangays.length;
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedBarangayIndex =
        (this.highlightedBarangayIndex - 1 + this.filteredBarangays.length) %
        this.filteredBarangays.length;
    } else if (key === 'Enter') {
      event.preventDefault();
      const selected = this.filteredBarangays[this.highlightedBarangayIndex];
      if (selected) this.selectBarangay(selected);
    } else if (key === 'Escape') {
      this.barangayDropdownOpen = false;
    }
  }

  handleOrganizationKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!this.orgDropdownOpen || this.filteredOrganizations.length === 0) return;

    if (key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedOrganizationIndex =
        (this.highlightedOrganizationIndex + 1) % this.filteredOrganizations.length;
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedOrganizationIndex =
        (this.highlightedOrganizationIndex - 1 + this.filteredOrganizations.length) %
        this.filteredOrganizations.length;
    } else if (key === 'Enter') {
      event.preventDefault();
      const selected = this.filteredOrganizations[this.highlightedOrganizationIndex];
      if (selected) this.selectOrganization(selected);
    } else if (key === 'Escape') {
      this.orgDropdownOpen = false;
    }
  }

  handleGenderKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!this.genderDropdownOpen || this.filteredGenders.length === 0) return;

    if (key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedGenderIndex =
        (this.highlightedGenderIndex + 1) % this.filteredGenders.length;
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedGenderIndex =
        (this.highlightedGenderIndex - 1 + this.filteredGenders.length) %
        this.filteredGenders.length;
    } else if (key === 'Enter') {
      event.preventDefault();
      const selected = this.filteredGenders[this.highlightedGenderIndex];
      if (selected) this.selectGender(selected);
    } else if (key === 'Escape') {
      this.genderDropdownOpen = false;
    }
  }

  filterGenderOptions() {
    const input = this.businessInfoForm.get('gender')?.value.toLowerCase() || '';
    this.filteredGenders = this.genderOptions.filter((g) =>
      g.toLowerCase().includes(input)
    );
  }

  closeProvinceDropdown() {
    setTimeout(() => (this.provinceDropdownOpen = false), 150);
  }

  closeCityDropdown() {
    setTimeout(() => (this.cityDropdownOpen = false), 150);
  }

  closeBarangayDropdown() {
    setTimeout(() => (this.barangayDropdownOpen = false), 150);
  }

  selectGender(g: string) {
    this.businessInfoForm.get('gender')?.setValue(g);
    this.genderDropdownOpen = false;
  }

  closeGenderDropdown() {
    setTimeout(() => (this.genderDropdownOpen = false), 150);
  }

  // Organization filter
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
