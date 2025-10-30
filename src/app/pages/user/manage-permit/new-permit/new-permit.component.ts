import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { ApiServicesService } from 'src/app/api-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-permit',
  templateUrl: './new-permit.component.html',
  styleUrls: ['./new-permit.component.css'],
  providers: [MessageService]
})
export class NewPermitComponent {
  selectedLocation: { lng: number; lat: number } | null = null;
  isLocationSaved = false; 
  signatureImage: string | null = null;

  businessTypes: any;
  isLoading: boolean = true;
  confirmation: boolean = false;
  isChecked: boolean = false;
  provinces: any;
  cities: any;
  barangays: any;
  
  currentTab: number = 1;
  existingPhoneNumber: boolean = false;
  existingEmail: boolean = false;

  currentProvinceRegister: any;
  currentCityRegister: any;
  currentBarangayRegister: any;

  operationBarangayRegister: any;
  
  payments = [
    { id: 1, payment: 'Annually' },
    { id: 2, payment: 'Bi-annually' },
    { id: 3, payment: 'Quarterly' },
  ];

  applicationTypes = [
    { id: 1, label: 'New' },
    { id: 2, label: 'Renewal' }
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

  selectedPayment: number = 0;
  selectedApplicationType: number = 0;

  selectedFiles: { [key: string]: File | null } = {
    file1: null,
    file2: null,
    file3: null
  };

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
    registerZipCode: ['', [Validators.required]],

    registerStreet: ['', [Validators.required]],
    registerHouse: [''],
    registerNameBuilding: [''],
    registerLotNo: [''],
    registerBlockNo: [''],
    registerSubdivision: [''],
  });

  permitOperationForm: FormGroup = this.formBuilder.group({
    activity: ['', [Validators.required]],
    businessArea: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
    businessFloorArea: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
    employees: ['', [Validators.required]],
    no_male: ['', [Validators.required]],
    no_female: ['', [Validators.required]],

    province: ['', [Validators.required]],
    city: ['', [Validators.required]],
    baranggays: ['', [Validators.required]],
    zip_code: ['', [Validators.required]],

    van: [''],
    motor: [''],
    
    house: [''],
    name_building: [''],
    lot_no: [''],
    block_no: [''],
    street: ['', [Validators.required]],
    subdivision: [''],
    sameAsMainOffice: [''],
  });

  constructor(
    private apiService: ApiServicesService, 
    private formBuilder: FormBuilder, 
    private messageService: MessageService, 
    private router: Router
  ) {  }

  ngOnInit():void {
    this.permitOperationForm.get('province')?.disable();
    this.permitOperationForm.get('city')?.disable();

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
    this.getBusinessTypeFunction();
    this.getProvinceAddress();
    this.getBusinessCity();
  }

  onLocationSaved(location: { lng: number; lat: number }): void {
    this.selectedLocation = location;
    this.isLocationSaved = true;
    // console.log('Location received in NewPermitComponent:', this.selectedLocation);
    setTimeout(() => {
      this.isLocationSaved = false;
    }, 2000);
  }

  confirmDetails() {
    if (!this.permitForm.valid || !this.permitOperationForm.valid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please complete all required fields before proceeding.",
        confirmButtonColor: '#d33',
        confirmButtonText: 'Understood!'
      });
      return;
    }
  
    if (!this.selectedPayment) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a payment method before proceeding with the business registration.",
        confirmButtonColor: '#d33',
        confirmButtonText: 'Understood!'
      });
      return;
    }
  
    this.confirmation = true;
    this.isChecked = false;
  }

  closeModal() {
    this.confirmation = false;
  }

  closeModalOutside(event: MouseEvent) {
    // Close modal if user clicks outside the modal box
    if ((event.target as HTMLElement).classList.contains('bg-black')) {
      this.closeModal();
    }
  }

  confirmSubmission() {
    this.confirmation = false;
    this.isLoading = true;
    if (!this.isChecked) {
      alert('Please check the confirmation box to proceed.');
      return;
    }


    const formData = new FormData();
    formData.append('businessName', this.permitForm.value.businessName);
    formData.append('registrationDate', this.permitForm.value.registrationDate);
    formData.append('tradeName', this.permitForm.value.tradeName);
    formData.append('dtiNumber', this.permitForm.value.dtiNumber);
    formData.append('tinNumber', this.permitForm.value.tinNumber);
    formData.append('businessType', this.permitForm.value.businessType);
    formData.append('first_name', this.permitForm.value.first_name);
    formData.append('middle_name', this.permitForm.value.middle_name);
    formData.append('last_name', this.permitForm.value.last_name);
    formData.append('number', this.permitForm.value.number);
    formData.append('email', this.permitForm.value.email);
    formData.append('suffix', this.permitForm.value.suffix);
    formData.append('gender', this.permitForm.value.gender);
    formData.append('isNew', 'New');
    
    // register address
    formData.append('registerProvince', this.permitForm.value.registerProvince);
    formData.append('registerCities', this.permitForm.value.registerCities);
    formData.append('registerBaranggays', this.permitForm.value.registerBaranggays);
    formData.append('registerZipCode', this.permitForm.value.registerZipCode);
    formData.append('registerStreet', this.permitForm.value.registerStreet);
    formData.append('registerHouse', this.permitForm.value.registerHouse);
    formData.append('registerNameBuilding', this.permitForm.value.registerNameBuilding);
    formData.append('registerLotNo', this.permitForm.value.registerLotNo);
    formData.append('registerBlockNo', this.permitForm.value.registerBlockNo);
    formData.append('registerSubdivision', this.permitForm.value.registerSubdivision);

    formData.append('activity', this.permitOperationForm.value.activity);
    formData.append('employees', this.permitOperationForm.value.employees);
    formData.append('no_male', this.permitOperationForm.value.no_male);
    formData.append('no_female', this.permitOperationForm.value.no_female);
    
    formData.append('van', this.permitOperationForm.value.van);
    formData.append('motor', this.permitOperationForm.value.motor);
    // operational address
    formData.append('province', '87');
    formData.append('city', '1624');
    formData.append('baranggays', this.permitOperationForm.value.baranggays);
    formData.append('zip_code', this.permitOperationForm.value.zip_code);
    formData.append('businessArea', this.permitOperationForm.value.businessArea);
    formData.append('businessFloorArea', this.permitOperationForm.value.businessFloorArea);
    formData.append('street', this.permitOperationForm.value.street);
    formData.append('house', this.permitOperationForm.value.house);
    formData.append('name_building', this.permitOperationForm.value.name_building);
    formData.append('lot_no', this.permitOperationForm.value.lot_no);
    formData.append('block_no', this.permitOperationForm.value.block_no);
    formData.append('street', this.permitOperationForm.value.street);
    formData.append('subdivision', this.permitOperationForm.value.subdivision);
    
    if (this.selectedLocation) {
      formData.append('latitude', this.selectedLocation.lat.toString());
      formData.append('longitude', this.selectedLocation.lng.toString());
    } else {
        console.error("Error: Location is not selected!");
    }

    if (this.selectedPayment) {
      formData.append('payment_type_id', this.selectedPayment.toString());
    }

    if (this.selectedFiles['file1']) {
      formData.append('proof_of_registration', this.selectedFiles['file1']);
    }
    if (this.selectedFiles['file2']) {
      formData.append('authority_to_use', this.selectedFiles['file2']);
    }
    if (this.selectedFiles['file3']) {
      formData.append('fire_safety_certificate', this.selectedFiles['file3']);
    }

    this.apiService.businessStore(formData).subscribe({
      next: (response: any) => {
        if (response) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Business successfully created! Your application has been submitted for permit processing",
            // confirmButtonColor: '#d33',
            // confirmButtonText: 'Understood!'
          }).then(() => {
            this.router.navigate(['/application']).then(() => {
              window.location.reload();
            });
          });
        }
      },
      error: (error: any) => {
        Swal.fire({
          icon: "error",
          title: "Opps...",
          text: "Error saving permit form",
          confirmButtonColor: '#d33',
          confirmButtonText: 'Understood!'
        })
      }
    });
  }

  confirmDuplicate(e: Event) {
    const event = e.target as HTMLInputElement;
    // console.log(event.value);
    this.apiService.checkNumber(event.value).subscribe({
      next: (response: any) => {
        if (response.existingPhoneNumber != null) {
          this.existingPhoneNumber = true;
        } else {
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
        if (response.existingEmail != null) {
          this.existingEmail = true;
        } else {
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
      const barangayId = this.permitForm.get('registerBaranggays')?.value;

      const barangay = this.baranggaysArray.find((b) => b.id == barangayId);

      // console.log(barangay?.brgy_name);
      this.operationBarangayRegister = barangay?.brgy_name

      // console.log(provinceValue, cityValue)
      if (provinceValue == 87 && cityValue == 1624) {
        this.permitOperationForm.patchValue({
          baranggays: barangayId,
          zip_code: this.permitForm.get('registerZipCode')?.value,
          street: this.permitForm.get('registerStreet')?.value,
          house: this.permitForm.get('registerHouse')?.value,
          name_building: this.permitForm.get('registerNameBuilding')?.value,
          lot_no: this.permitForm.get('registerLotNo')?.value,
          block_no: this.permitForm.get('registerBlockNo')?.value,
          subdivision: this.permitForm.get('registerSubdivision')?.value,
        });
  
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "This functionality is only available for businesses compliant with the designated zoning regulations.",
          confirmButtonColor: '#d33',
          confirmButtonText: 'Understood!'
        }).then(() => {
          this.permitOperationForm.get('sameAsMainOffice')?.setValue(false, { emitEvent: false });
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
        },
        error: (error: any) => {
          console.log('error fetching baranggays:', error);
        }
      });
    }
  }

  getBarangay(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const barangayName = selectedOption?.text; 
    // console.log(barangayName);
    this.currentBarangayRegister = barangayName;
  }

  operationalBaranggay(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const barangayName = selectedOption?.text; 

    // console.log(barangayName);
    this.operationBarangayRegister = barangayName;
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

  back(number: number) {
    this.currentTab = number;
  }

  proceed(number: number) {
    if (number === 2) {
      if (this.permitForm.invalid) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Form Submission Error', 
          detail: 'Please ensure that all required fields are filled out correctly before proceeding. Missing or invalid information needs to be completed or corrected.' 
        });
      } else {
        this.currentTab = 2;
      }
    } else if (number === 3) {
      if (this.permitOperationForm.invalid) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Form Submission Error', 
          detail: 'Please ensure that all required fields are filled out correctly before proceeding. Missing or invalid information needs to be completed or corrected.' 
        });
      } else {
        this.currentTab = 3;
      } 
    } else if (number === 4) {
      this.currentTab = 4;
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
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Business successfully created! Your application has been submitted for permit processing",
            // confirmButtonColor: '#d33',
            // confirmButtonText: 'Understood!'
          }).then(() => {
            this.router.navigate(['/application']).then(() => {
              window.location.reload();
            });
          });
        }
      },
      error: (error: any) => {
        Swal.fire({
          icon: "error",
          title: "Opps...",
          text: "Error saving permit form",
          confirmButtonColor: '#d33',
          confirmButtonText: 'Understood!'
        })
      }
    });
  }

  // drag and drop image functionality
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

    this.selectedFiles[field] = file;
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

  onSignatureSaved(base64Image: string) {
    this.signatureImage = base64Image;
  }
}
