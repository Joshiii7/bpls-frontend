import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedLocation: { lng: number; lat: number } | null = null;
  isLocationSaved = false; 
  signatureImage: string | null = null;

  businessTypes: any;
  isLoading: boolean = false;
  confirmation: boolean = false;
  isChecked: boolean = false;
  provinces: any;
  cities: any;
  barangays: any;
  
  currentTab: number = 1;
  totalTabs = 4;
  existingPhoneNumber: boolean = false;
  existingEmail: boolean = false;

  currentProvinceRegister: any;
  currentCityRegister: any;
  currentBarangayRegister: any;

  operationBarangayRegister: any;

  showModal = false;
  modalTitle = '';
  activeField = '';
  previewUrl: string | null = null;
  activeFile: File | null = null;

  // Store all uploaded documents here
  documents: {
    [key: string]: {
      title: string;
      file?: File;
      previewUrl?: string | null;
    };
  } = {
    file1: { title: 'Proof of Registration (DTI/SEC/CDA)', previewUrl: null },
    file2: { title: 'Authority to Use of Place of Business', previewUrl: null },
    file3: { title: 'Fire Safety Inspection Certificate', previewUrl: null },
    file4: { title: 'Sanitary Permit / Health Clearance', previewUrl: null },
    file6: { title: 'Environmental Clearance / Barangay Clearance', previewUrl: null },
    file7: { title: 'Occupancy Permit', previewUrl: null },
  };
  
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
    { id: 'Male', gender: 'Male' },
    { id: 'Female', gender: 'Female' },
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

  permitForm: FormGroup = this.formBuilder.group({
    businessName: ['', [Validators.required]],
    tradeName: ['', [Validators.required]],
    dtiNumber: ['', [Validators.required]],
    registrationDate: ['', [Validators.required]],
    tinNumber: ['', [Validators.required, Validators.pattern(/^(\d{3}-?\d{3}-?\d{3}(-?\d{3})?)$/)]],
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
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {  }

  onLocationSelected(location: { lng: number; lat: number }) {
    this.selectedLocation = location;
    console.log('Location received from child:', location);
  }

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

  nextTab() {
    if (this.currentTab < this.totalTabs) {
      this.currentTab++;
      setTimeout(() => this.viewportScroller.scrollToPosition([0, 0]), 0);
    }
  }

  prevTab() {
    if (this.currentTab > 1) {
      this.currentTab--;
      setTimeout(() => this.viewportScroller.scrollToPosition([0, 0]), 0);
    }
  }

  onTinInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 9) {
      value = value.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join('-')
      );
    } else {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,3})/, (_, a, b, c, d) =>
        [a, b, c, d].filter(Boolean).join('-')
      );
    }

    input.value = value;
    this.permitForm.get('tinNumber')?.setValue(value, { emitEvent: false });
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
      this.isLoading = false;
      Swal.fire({
        icon: 'warning',
        title: 'Confirmation Required',
        text: 'Please check the confirmation box to proceed.',
        confirmButtonColor: '#009800',
        confirmButtonText: 'OK'
      });
      return;
    }


    const formData = new FormData();

    // Helper to append all keys of an object
    const appendFormData = (obj: any, prefix = '') => {
      for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
          formData.append(`${prefix}${key}`, obj[key]);
        }
      }
    };

    // Basic business info
    appendFormData({
      businessName: this.permitForm.value.businessName,
      tradeName: this.permitForm.value.tradeName,
      registrationDate: this.permitForm.value.registrationDate,
      dtiNumber: this.permitForm.value.dtiNumber,
      tinNumber: this.permitForm.value.tinNumber,
      businessType: this.permitForm.value.businessType,
      first_name: this.permitForm.value.first_name,
      middle_name: this.permitForm.value.middle_name,
      last_name: this.permitForm.value.last_name,
      suffix: this.permitForm.value.suffix,
      gender: this.permitForm.value.gender,
      number: this.permitForm.value.number,
      email: this.permitForm.value.email,
    });

    // Registration address
    appendFormData({
      registerProvince: this.permitForm.value.registerProvince,
      registerCities: this.permitForm.value.registerCities,
      registerBaranggays: this.permitForm.value.registerBaranggays,
      registerZipCode: this.permitForm.value.registerZipCode,
      registerStreet: this.permitForm.value.registerStreet,
      registerHouse: this.permitForm.value.registerHouse,
      registerNameBuilding: this.permitForm.value.registerNameBuilding,
      registerLotNo: this.permitForm.value.registerLotNo,
      registerBlockNo: this.permitForm.value.registerBlockNo,
      registerSubdivision: this.permitForm.value.registerSubdivision
    });

    // Business operation info
    appendFormData({
      activity: this.permitOperationForm.value.activity,
      employees: this.permitOperationForm.value.employees,
      no_male: this.permitOperationForm.value.no_male,
      no_female: this.permitOperationForm.value.no_female,
      van: this.permitOperationForm.value.van,
      motor: this.permitOperationForm.value.motor,
      province: '87',
      city: '1624',
      baranggays: this.permitOperationForm.value.baranggays,
      zip_code: this.permitOperationForm.value.zip_code,
      businessArea: this.permitOperationForm.value.businessArea,
      businessFloorArea: this.permitOperationForm.value.businessFloorArea,
      house: this.permitOperationForm.value.house,
      name_building: this.permitOperationForm.value.name_building,
      lot_no: this.permitOperationForm.value.lot_no,
      block_no: this.permitOperationForm.value.block_no,
      street: this.permitOperationForm.value.street,
      subdivision: this.permitOperationForm.value.subdivision
    });

    // Latitude & longitude
    if (this.selectedLocation) {
      formData.append('latitude', this.selectedLocation.lat.toString());
      formData.append('longitude', this.selectedLocation.lng.toString());
    } else {
      console.error("Error: Location is not selected!");
    }

    // Payment type
    if (this.selectedPayment) {
      formData.append('payment_type_id', this.selectedPayment.toString());
    }

    // Application type
    if (this.selectedApplicationType) {
      formData.append(
        'isNew',
        this.selectedApplicationType === 1 ? 'New' : 'Renewal'
      );
    }

    // Attach documents
    if (this.documents) {
      for (const key in this.documents) {
        const doc = this.documents[key];
        if (doc.file) {
          formData.append(key, doc.file);
          formData.append(`${key}_title`, doc.title);
        }
      }
    }

    // Signature
    if (this.signatureImage) {
      const blob = this.dataURLtoBlob(this.signatureImage);
      const randomName = `signature_${Date.now()}_${Math.floor(Math.random() * 10000)}.png`;
      formData.append('signatureImage', blob, randomName);
    }

    // Submit to API
    this.apiService.businessStore(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Business successfully created! Your application has been submitted for permit processing'
        }).then(() => {
          this.router.navigate(['/application']).then(() => {
            window.location.reload();
          });
        });
      },
      error: (error: any) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error saving permit form',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Understood!'
        });
      }
    });
  }

  private dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
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
      };
    }

    Swal.fire({
      icon: 'success',
      title: 'Image selected!',
      text: 'Your image has been successfully chosen.',
      confirmButtonColor: '#009800',
    }).then(() => {
      this.closeModal();
    });
  }

  getUploadedDocuments() {
    return Object.entries(this.documents).map(([key, doc]) => ({
      field: key,
      title: doc.title,
      file: doc.file,
    }));
  }

  onSignatureSaved(base64Image: string) {
    this.signatureImage = base64Image;
  }
}
