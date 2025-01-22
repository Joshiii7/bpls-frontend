import { leadingComment } from '@angular/compiler';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-apply-permit',
  templateUrl: './apply-permit.component.html',
  styleUrls: ['./apply-permit.component.css'],
  providers: [MessageService]
})
export class ApplyPermitComponent {
  @Output() emitNavigationState = new EventEmitter<boolean>();

  businessTypes: any;
  isLoading: boolean = true;
  confirmation: boolean = false;
  provinces: any;
  cities: any;
  barangays: any;
  
  currentTab: number = 1;
  existingPhoneNumber: boolean = false;
  existingEmail: boolean = false;

  currentProvinceRegister: any;
  currentCityRegister: any;
  currentBarangayRegister: any;
  
  payments = [
    { id: 1, payment: 'Annually' },
    { id: 2, payment: 'Bi-annually' },
    { id: 3, payment: 'Quarterly' },
  ];

  genders = [
    { id: 1, gender: 'Male' },
    { id: 2, gender: 'Female' },
  ];

  businessActivity = [
    { id: 1, activity: 'Main Office' },
    { id: 2, activity: 'Branch Office' },
    { id: 4, activity: 'Admin Office Only' },
    { id: 5, activity: 'Warehouse' },
    { id: 6, activity: 'Others' },
  ];

  registerBaranggays = [
    { id: 41649, brgy_name: "Bucto", brgy_code: "166803002"},
    { id: 41650, brgy_name: "Burboanan", brgy_code: "166803003"},
    { id: 41651, brgy_name: "San Roque (Cadanglasan)", brgy_code: "166803004"},
    { id: 41652, brgy_name: "Caguyao", brgy_code: "166803005"},
    { id: 41653, brgy_name: "Coleto", brgy_code: "166803006"},
    { id: 41654, brgy_name: "Labisma", brgy_code: "166803007"},
    { id: 41655, brgy_name: "Lawigan", brgy_code: "166803008"},
    { id: 41656, brgy_name: "Mangagoy", brgy_code: "166803009"},
    { id: 41657, brgy_name: "Mone", brgy_code: "166803010"},
    { id: 41658, brgy_name: "Pamaypayan", brgy_code: "166803011"},
    { id: 41659, brgy_name: "Poblacion", brgy_code: "166803012"},
    { id: 41660, brgy_name: "San Antonio", brgy_code: "166803013"},
    { id: 41661, brgy_name: "San Fernando", brgy_code: "166803014"},
    { id: 41662, brgy_name: "San Isidro (Bagnan)", brgy_code: "166803015"},
    { id: 41663, brgy_name: "San Jose", brgy_code: "166803016"},
    { id: 41664, brgy_name: "San Vicente", brgy_code: "166803017"},
    { id: 41665, brgy_name: "Santa Cruz", brgy_code: "166803018"},
    { id: 41666, brgy_name: "Sibaroy", brgy_code: "166803019"},
    { id: 41667, brgy_name: "Tabon", brgy_code: "166803020"},
    { id: 41668, brgy_name: "Tumanan", brgy_code: "166803021"},
    { id: 41669, brgy_name: "Pamanlinan", brgy_code: "166803022"},
    { id: 41670, brgy_name: "Kahayag", brgy_code: "166803023"},
    { id: 41671, brgy_name: "Maharlika", brgy_code: "166803024"},
    { id: 41672, brgy_name: "Comawas", brgy_code: "166803025"},
  ];

  baranggaysArray = [
    { id: 41649, brgy_name: "Bucto", brgy_code: "166803002"},
    { id: 41650, brgy_name: "Burboanan", brgy_code: "166803003"},
    { id: 41651, brgy_name: "San Roque (Cadanglasan)", brgy_code: "166803004"},
    { id: 41652, brgy_name: "Caguyao", brgy_code: "166803005"},
    { id: 41653, brgy_name: "Coleto", brgy_code: "166803006"},
    { id: 41654, brgy_name: "Labisma", brgy_code: "166803007"},
    { id: 41655, brgy_name: "Lawigan", brgy_code: "166803008"},
    { id: 41656, brgy_name: "Mangagoy", brgy_code: "166803009"},
    { id: 41657, brgy_name: "Mone", brgy_code: "166803010"},
    { id: 41658, brgy_name: "Pamaypayan", brgy_code: "166803011"},
    { id: 41659, brgy_name: "Poblacion", brgy_code: "166803012"},
    { id: 41660, brgy_name: "San Antonio", brgy_code: "166803013"},
    { id: 41661, brgy_name: "San Fernando", brgy_code: "166803014"},
    { id: 41662, brgy_name: "San Isidro (Bagnan)", brgy_code: "166803015"},
    { id: 41663, brgy_name: "San Jose", brgy_code: "166803016"},
    { id: 41664, brgy_name: "San Vicente", brgy_code: "166803017"},
    { id: 41665, brgy_name: "Santa Cruz", brgy_code: "166803018"},
    { id: 41666, brgy_name: "Sibaroy", brgy_code: "166803019"},
    { id: 41667, brgy_name: "Tabon", brgy_code: "166803020"},
    { id: 41668, brgy_name: "Tumanan", brgy_code: "166803021"},
    { id: 41669, brgy_name: "Pamanlinan", brgy_code: "166803022"},
    { id: 41670, brgy_name: "Kahayag", brgy_code: "166803023"},
    { id: 41671, brgy_name: "Maharlika", brgy_code: "166803024"},
    { id: 41672, brgy_name: "Comawas", brgy_code: "166803025"},
  ];

  selectedPayment: number | null = null;

  permitForm: FormGroup = this.formBuilder.group({
    businessName: ['', [Validators.required]],
    tradeName: ['', [Validators.required]],
    dtiNumber: ['', [Validators.required]],
    registrationDate: ['', [Validators.required]],
    tinNumber: ['', [Validators.required]],
    businessType: ['', [Validators.required]],
    first_name: ['', [Validators.required]],
    middle_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    number: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    suffix: [''],
    gender: [''],

    registerProvince: ['', [Validators.required]],
    registerCities: ['', [Validators.required]],
    registerBaranggays: ['', [Validators.required]],
    zip_code: ['', [Validators.required]],

    street: ['', [Validators.required]],
    house: [''],
    name_building: [''],
    lot_no: [''],
    block_no: [''],
    subdivision: [''],
  });

  permitOperationForm: FormGroup = this.formBuilder.group({
    province: ['', [Validators.required]],
    city: ['', [Validators.required]],
    baranggays: ['', [Validators.required]],
    activity: ['', [Validators.required]],
    businessArea: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
    employees: ['', [Validators.required]],
    no_male: ['', [Validators.required]],
    no_female: ['', [Validators.required]],
    zip_code: ['', [Validators.required]],

    van: [''],
    motor: [''],
    
    house: [''],
    name_building: [''],
    lot_no: [''],
    block_no: [''],
    street: [''],
    subdivision: [''],
  });

  constructor(private apiService: ApiServicesService, private formBuilder: FormBuilder, private messageService: MessageService, private router: Router) {  }

  ngOnInit():void {
    this.emitNavigationState.emit(true);
    this.permitOperationForm.get('province')?.disable();
    this.permitOperationForm.get('city')?.disable();

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
    this.getBusinessTypeFunction();
    this.getProvinceAddress();
    this.getBusinessCity();
  }

  confirmDuplicate(e: Event) {
    const event = e.target as HTMLInputElement;
    // console.log(event.value);
    this.apiService.checkNumber(event.value).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.existingPhoneNumber != null) {
          console.log('Hello World');
          this.existingPhoneNumber = true;
        } else {
          console.log('wala');
          this.existingPhoneNumber = false;
        }
      },
      error: (error: any) => {
        console.log('Error checking duplicate number:', error);
      }
    });
  }

  confirmDuplicateEmail(e: Event) {
    const event = e.target as HTMLInputElement;
    // console.log(event.value);
    this.apiService.checkEmail(event.value).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.existingEmail != null) {
          console.log('Hello World');
          this.existingEmail = true;
        } else {
          console.log('wala');
          this.existingEmail = false;
        }
      },
      error: (error: any) => {
        console.log('Error checking duplicate number:', error);
      }
    });
  }

  copyAddress(event: any) {
    if (event.target.checked) {
      const provinceValue = this.permitForm.get('registerProvince')?.value;
      const cityValue = this.permitForm.get('registerCities')?.value;

      // console.log(provinceValue, cityValue)
      if (provinceValue == 87 && cityValue == 1624) {
        this.permitOperationForm.patchValue({
          province: this.permitForm.get('registerProvince')?.value,
          city: this.permitForm.get('registerCities')?.value,
          baranggays: this.permitForm.get('registerBaranggays')?.value,
          zip_code: this.permitForm.get('zip_code')?.value,
          street: this.permitForm.get('street')?.value,
          house: this.permitForm.get('house')?.value,
          name_building: this.permitForm.get('name_building')?.value,
          lot_no: this.permitForm.get('lot_no')?.value,
          block_no: this.permitForm.get('block_no')?.value,
          subdivision: this.permitForm.get('subdivision')?.value,
        });
  
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Selection',
          detail: 'This functionality is only available for Bislig City. Please select the correct province and city.'
        });
      }
    }
  }

  tabIndex(number: any) {
    this.currentTab = number;
    // if (this.permitForm.invalid && number === 2) {
    //   this.messageService.add({ 
    //     severity: 'error', 
    //     summary: 'Form Submission Error', 
    //     detail: 'Please ensure that all required fields are filled out correctly before proceeding. Missing or invalid information needs to be completed or corrected.' 
    //   });
    // } else {
    //   this.currentTab = number;
    // }
  }

  // registerAddress
  selectProvince() {
    const province = this.permitForm.value.registerProvince;

    const foundProvince = this.provinces.find((ele: any) => {
      return ele.id == province;
    });

    this.currentProvinceRegister = foundProvince.province_name;
    // console.log(this.currentProvinceRegister);
    
    if (foundProvince) {
      this.apiService.getCities(foundProvince.province_code).subscribe({
        next: (response: any) => {
          // console.log(response);
          this.cities = response.cities;
        },
        error: (error: any) => {
          console.log('error fetching cities:', error);
        }
      });
    }
  }

  // registerAddress
  selectCity() {
    const city = this.permitForm.value.registerCities;
    // console.log(city);

    const foundCity = this.cities.find((ele: any) => {
      // console.log(ele);
      return ele.id == city;
    });

    // console.log(foundCity);
    this.currentCityRegister = foundCity.city_name
    
    if (foundCity) {
      this.apiService.getBarangays(foundCity.city_code).subscribe({
        next: (response: any) => {
          // console.log(response);
          this.barangays = response.barangays;
          this.barangayValue(this.barangays);
        },
        error: (error: any) => {
          console.log('error fetching baranggays:', error);
        }
      });
    }
  }

  barangayValue(barangay: any) {
    console.log(barangay);
    console.log(this.permitForm.get('registerBaranggays')?.value)
  }

  getBusinessCity() {
    const city = 166803;

    this.apiService.getBarangays(city).subscribe({
      next: (response: any) => {
        // console.log(response);
        // this.barangays = response.barangays;
        // console.log(this.barangays);
      },
      error: (error: any) => {
        console.log('error fetching baranggays:', error);
      }
    });
  }

  getProvinceAddress() {
    this.apiService.getProvinces().subscribe({
      next: (response: any) => {
        // console.log(response);
        this.provinces = response.provinces;
      },
      error: (error: any) => {
        console.log('error fetching provinces:', error);
      }
    });
  }

  getBusinessTypeFunction() {
    this.apiService.getBusinessType().subscribe({
      next: (response: any) => {
        this.businessTypes = response.businessType;
        // console.log(this.businessTypes);
      },
      error: (error: any) => {
        console.log('error fetching business type:', error);
      }
    });
  }

  proceed() {
    if (this.permitForm.invalid) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Form Submission Error', 
        detail: 'Please ensure that all required fields are filled out correctly before proceeding. Missing or invalid information needs to be completed or corrected.' 
      });
    } else {
      this.currentTab = 2;
      // console.log(this.permitForm.value);
    }
  }

  permitSubmit() {
    if (this.selectedPayment === null) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Form Submission Error', 
        detail: 'Select payment first.' 
      });
    }
    if (this.permitOperationForm.invalid && this.selectedPayment === null) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Form Submission Error', 
        detail: 'Please ensure that all required fields are filled out correctly before proceeding. Missing or invalid information needs to be completed or corrected.' 
      });
      return;
    } else {
      // this.confirmation = true;

      const formData = {
        ...this.permitForm.value,
        ...this.permitOperationForm.value,
        payment: this.selectedPayment,
      };

      // console.log(formData, this.selectedPayment);
      this.confirmData(formData);
    }
  }

  confirmData(data:any) {
    console.log(data);
    this.apiService.businessStore(data).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response) {
          this.messageService.add({ severity: 'success', summary: "Success", detail: 'Business successfully created! Your application has been submitted for permit processing' });
          setTimeout(() => {
            this.router.navigate(['dashboard']).then(() => {
              window.location.reload();
            });
          }, 2000);
        }
        
      },
      error: (error: any) => {
        console.log('error saving permit form:', error);
      }
    });
  }

  // drag and drop image
  triggerFileInput(inputId: string): void {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
        fileInput.click();
    }
}

onFileSelect(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        this.validateAndPreviewFile(input.files[0], field);
    }
}

onFileDrop(event: DragEvent, field: string): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        this.validateAndPreviewFile(event.dataTransfer.files[0], field);
    }
}

onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
}

onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
}

validateAndPreviewFile(file: File, field: string): void {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        alert('Invalid file type. Only JPEG, PNG, or JPG are allowed.');
        return;
    }

    const reader = new FileReader();
    const previewImage = document.getElementById(`${field}-preview-image`) as HTMLImageElement;

    reader.onload = (e: ProgressEvent<FileReader>) => {
        if (previewImage) {
            previewImage.src = e.target?.result as string;
            previewImage.classList.remove('hidden');
        }
    };
    reader.readAsDataURL(file);
  }

}
