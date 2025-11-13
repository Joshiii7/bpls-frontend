import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicantService } from '../../services/applicant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-business-operation-form',
  templateUrl: './business-operation-form.component.html',
  styleUrls: ['./business-operation-form.component.css']
})
export class BusinessOperationFormComponent implements OnInit {
  @Input() mainAddressForm!: FormGroup;
  businessOperationForm!: FormGroup;

  businessActivityDropdownOpen = false;
  filteredBusinessActivities: any[] = [];
  highlightedBusinessActivityIndex = 0;

  sameAsMainAddress = false;

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

  businessActivities = [
    { name: 'Main Office' },
    { name: 'Branc Office' },
    { name: 'Admin Office Only' },
    { name: 'Warehouse' },
    { name: 'Others' },
  ];

  constructor(
    private api: ApplicantService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.businessOperationForm = this.fb.group({

      // Business Operation
      businessActivity: ['', Validators.required],
      businessArea: ['', [Validators.required, Validators.min(0)]],
      totalFloorArea: ['', [Validators.required, Validators.min(0)]],
      employeesWithinLGU: ['', [Validators.required, Validators.min(0)]],

      // Total number of employees in establishment
      totalEmployees: this.fb.group({
        male: ['', [Validators.required, Validators.min(0)]],
        female: ['', [Validators.required, Validators.min(0)]]
      }),

      // Number of delivery vehicles (if applicable)
      deliveryVehicles: this.fb.group({
        vanOrTruck: [''],
        motorcycle: ['']
      }),

      province: ['', Validators.required],
      city: ['', Validators.required],
      barangay: ['', Validators.required],
      zipCode: ['', Validators.required],
      streetAddress: ['', Validators.required],
      houseNumber: [''],
      buildingName: [''],
      lotNumber: [''],
      blockNumber: [''],
      subdivision: ['']
    });
  }

  toggleSameAsMainAddress(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.sameAsMainAddress = checked;

    if (checked && this.mainAddressForm) {
      const province = this.mainAddressForm.get('province')?.value?.trim();
      const city = this.mainAddressForm.get('city')?.value?.trim();
      const barangay = this.mainAddressForm.get('barangay')?.value?.trim();
      const zipCode = this.mainAddressForm.get('zipCode')?.value?.trim();
      const streetAddress = this.mainAddressForm.get('streetAddress')?.value?.trim();
      const houseNumber = this.mainAddressForm.get('houseNumber')?.value?.trim();
      const buildingName = this.mainAddressForm.get('buildingName')?.value?.trim();
      const lotNumber = this.mainAddressForm.get('lotNumber')?.value?.trim();
      const blockNumber = this.mainAddressForm.get('blockNumber')?.value?.trim();
      const subdivision = this.mainAddressForm.get('subdivision')?.value?.trim();

      const isEmptyField = [province, city, barangay, zipCode, streetAddress, houseNumber, buildingName, lotNumber, blockNumber, subdivision]
        .some(field => !field);

      const isValidLocation = province === 'Surigao del Sur' && city === 'Bislig City';

      if (isEmptyField || !isValidLocation) {
        this.sameAsMainAddress = false;
        
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Address',
          text: 'This functionality is only available for businesses compliant with the designated zoning regulations.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Understood!'
        });
      } else {
        this.businessOperationForm.patchValue({
          province,
          city,
          barangay,
          zipCode,
          streetAddress,
          houseNumber,
          buildingName,
          lotNumber,
          blockNumber,
          subdivision
        });
      }
    }
  }

  // Province
  filterProvinces() {
    const value = this.businessOperationForm.get('province')?.value?.toLowerCase() || '';
    this.filteredProvinces = this.allProvinces.filter(p =>
      p.province_name.toLowerCase().includes(value)
    );
  }

  selectProvince(province: any) {
    this.businessOperationForm.get('province')?.setValue(province.province_name);
    this.provinceDropdownOpen = false;

    // reset dependent fields
    this.businessOperationForm.get('city')?.reset();
    this.businessOperationForm.get('barangay')?.reset();
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
    const value = this.businessOperationForm.get('city')?.value?.toLowerCase() || '';
    this.filteredCities = this.allCities.filter(c =>
      c.city_name.toLowerCase().includes(value)
    );
  }

  selectCity(city: any) {
    this.businessOperationForm.get('city')?.setValue(city.city_name);
    this.cityDropdownOpen = false;

    this.businessOperationForm.get('barangay')?.reset();
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
    const value = this.businessOperationForm.get('barangay')?.value?.toLowerCase() || '';
    this.filteredBarangays = this.allBarangays.filter(b =>
      b.brgy_name.toLowerCase().includes(value)
    );
  }

  selectBarangay(barangay: any) {
    this.businessOperationForm.get('barangay')?.setValue(barangay.brgy_name);
    this.barangayDropdownOpen = false;
  }

  handleProvinceKeydown(event: KeyboardEvent) {
    const key = event.key;
    this.selectProvince('Surigao del Sur');

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
      const selected = this.filteredProvinces[this.highlightedProvinceIndex];
      event.preventDefault();
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

  closeProvinceDropdown() {
    setTimeout(() => (this.provinceDropdownOpen = false), 150);
  }

  closeCityDropdown() {
    setTimeout(() => (this.cityDropdownOpen = false), 150);
  }

  closeBarangayDropdown() {
    setTimeout(() => (this.barangayDropdownOpen = false), 150);
  }

  filterBusinessActivities() {
    const value = this.businessOperationForm.get('businessActivity')?.value?.toLowerCase() || '';
    this.filteredBusinessActivities = this.businessActivities.filter(activity =>
      activity.name.toLowerCase().includes(value)
    );
    this.highlightedBusinessActivityIndex = 0;
  }

  handleBusinessActivityKeydown(event: KeyboardEvent) {
    const maxIndex = this.filteredBusinessActivities.length - 1;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedBusinessActivityIndex =
        this.highlightedBusinessActivityIndex < maxIndex
          ? this.highlightedBusinessActivityIndex + 1
          : 0;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedBusinessActivityIndex =
        this.highlightedBusinessActivityIndex > 0
          ? this.highlightedBusinessActivityIndex - 1
          : maxIndex;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.filteredBusinessActivities[this.highlightedBusinessActivityIndex]) {
        this.selectBusinessActivity(this.filteredBusinessActivities[this.highlightedBusinessActivityIndex]);
      }
    }
  }

  selectBusinessActivity(activity: any) {
    this.businessOperationForm.get('businessActivity')?.setValue(activity.name);
    this.businessActivityDropdownOpen = false;
    this.filteredBusinessActivities = [];
  }

  /** Close the dropdown when input loses focus */
  closeBusinessActivityDropdown() {
    // Small delay to allow click event on list item
    setTimeout(() => {
      this.businessActivityDropdownOpen = false;
    }, 150);
  }

  inputClass(field: string): string {
    const control = this.businessOperationForm.get(field);
    const base =
      'bg-white border text-sm rounded-md block w-full p-2.5 text-gray-800 placeholder-gray-400 focus:outline-none';
    if (control?.invalid && control?.touched) {
      return base + ' border-red-500 focus:border-red-500';
    }
    return base + ' focus:border-green-500';
  }

  labelClass(field: string): string {
    const control = this.businessOperationForm.get(field);
    if (control?.invalid && control?.touched) {
      return 'block font-medium text-sm text-red-600';
    }
    return 'block font-medium text-sm text-gray-700';
  }

  isInvalid(field: string): string | null {
    const control = this.businessOperationForm.get(field);
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
}
