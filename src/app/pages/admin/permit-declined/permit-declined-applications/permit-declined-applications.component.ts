import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiServicesService } from 'src/app/api-services.service';
import { RealTimeService } from 'src/app/real-time.service';

@Component({
  selector: 'app-permit-declined-applications',
  templateUrl: './permit-declined-applications.component.html',
  styleUrls: ['./permit-declined-applications.component.css'],
  providers: [MessageService, DatePipe]
})
export class PermitDeclinedApplicationsComponent {
searchText: string = '';
  isLoading: boolean = true; 

  confirmationMessage: string | null = null;
  actionToConfirm: string | null = null;
  businessIdToActOn: number | null = null;

  businesses: any[] = [];
  currentPage: number = 1;
  perPage: number = 5;
  total: number = 0;
  
  start: number = 1;
  end: number = 5;
  totalPages: number = Math.ceil(this.total / this.perPage);

  selectedBusinessType: string = '';

  allBusinesses: any[] = [];
  filteredBusinesses: any[] = [];

  currentTab: number = 1;
  Math = Math;

  businessTypes = [
    { id: 1, business_name: "Sole Proprietorship" },
    { id: 2, business_name: "One Person Corporation" },
    { id: 3, business_name: "Partnership" },
    { id: 4, business_name: "Corporation" },
    { id: 5, business_name: "Cooperative" }
  ];

  constructor(private apiService: ApiServicesService, private router: Router, private messageService: MessageService, private datePipe: DatePipe, private realTimeService: RealTimeService) {  }

  ngOnInit():void {
    this.loadBusinesses();
    this.realTimeService.listenForUpdates();

    this.allBusiness();

    this.businesses = this.getMockBusinesses();
    this.total = this.businesses.length;
  }

  getMockBusinesses() {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `Business ${i + 1}`,
    }));
  }

  detectRowValue(e: Event) {
    const selectElement = e.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.perPage = +selectedValue;
    this.currentPage = 1;
    this.updateRange();
  }

  allBusiness() {
    this.apiService.allBusiness().subscribe({
      next: (response: any) => {
        this.allBusinesses = response.declinedBusiness;
        this.filteredBusinesses = this.allBusinesses;
      },
      error: (error: any) => {
        console.log('error fetching data:', error);
      }
    });
  }

  filterBusinesses(event: Event | null = null): void {
    const inputValue = event ? (event.target as HTMLInputElement)?.value : '';
    const searchValue = inputValue.toLowerCase();
  
    this.filteredBusinesses = this.allBusinesses.filter(business => {
      const matchesSearch = 
        business.business_name.toLowerCase().includes(searchValue) ||
        business.first_name.toLowerCase().includes(searchValue) ||
        business.last_name.toLowerCase().includes(searchValue);
  
      let matchesTab = true;
      if (this.currentTab === 2) {
        matchesTab = business.isNew === 'New';
      } else if (this.currentTab === 3) {
        matchesTab = business.isNew === 'Renewal';
      }
  
      let matchesBusinessType = true;
        if (this.selectedBusinessType && this.selectedBusinessType !== '') {
            matchesBusinessType = business.business_type_id == this.selectedBusinessType;
        }

        return matchesSearch && matchesTab && matchesBusinessType;
    });
  
    this.total = this.filteredBusinesses.length;
    this.totalPages = Math.ceil(this.total / this.perPage);
    this.updateRange();
  }
  
  tabIndex(number: any) {
    this.currentTab = number;
    this.filterBusinesses();
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    // console.log('Input changed:', this.searchText);
    this.searchBusinessess();
  }

  searchBusinessess() {
    this.apiService.searchBusinesses(this.searchText).subscribe({
      next: (response: any) => {
        this.businesses = response.data;
        this.totalPages = response.pagination.last_page;
        this.total = response.pagination.total;
        console.log(this.total);
      },
      error: (error: any) => {
        console.log('Error fetching searched business:', error);
      }
    });
  }

  loadBusinesses(): void {
    this.apiService.getBusinesses().subscribe({
      next: (response: any) => {
        // console.log(response);
        if (response) {
          this.isLoading = false;
        }
        this.businesses = response.data;
        this.totalPages = response.pagination.last_page;
        this.total = response.pagination.total;
        // console.log(this.total);
        // console.log(this.totalPages);
      },
      error: (error: any) => {
        console.log('Error fetching paginated page:', error);
      }
    });
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updateRange();
        // this.loadBusinesses();
    }
  }

  updateRange(): void {
    this.start = (this.currentPage - 1) * this.perPage + 1;
    this.end = Math.min(this.start + this.perPage - 1, this.total);
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    const totalPages = Math.ceil(this.total / this.perPage);

    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return pages;
  }

  approveButton(num: any) {
    this.confirmationMessage = `Are you sure you want to proceed?`;
    this.actionToConfirm = 'approve';
    this.businessIdToActOn = num;
  }

  declineButton(num: any) {
    this.confirmationMessage = `Do you want to decline this record?`;
    this.actionToConfirm = 'decline';
    this.businessIdToActOn = num;
    this.showToast(`Business ${num} has been declined.`);
  }

  handleConfirm() {
    if (this.actionToConfirm && this.businessIdToActOn !== null) {
      if (this.actionToConfirm === 'decline') {
        this.declineAction(this.businessIdToActOn);
      } else if (this.actionToConfirm === 'approve') {
        this.approveAction(this.businessIdToActOn);
      }
    }
    this.resetConfirmation();
  }

  // Handle Cancel Action
  handleCancel() {
    this.resetConfirmation();
  }

  declineAction(businessId: number) {
    console.log('Declined business:', businessId);
    this.showToast(`Business ${businessId} has been declined.`);
    this.apiService.declineApplication(businessId).subscribe({
      next: (response: any) => {
        console.log(response);

        if (response) {
          this.messageService.add({ severity: 'success', summary: "Success", detail: 'Application Declined Successfully' });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }

      },
      error: (error: any) => {
        console.log('error declining application:', error);
      }
    });
  }

  approveAction(businessId: number) {
    console.log('Approved business:', businessId);
    this.showToast(`Business ${businessId} has been approved.`);
    this.apiService.approveApplication(businessId).subscribe({
      next: (response: any) => {
        console.log(response);

        if (response) {
          this.messageService.add({ severity: 'success', summary: "Success", detail: 'Application Approved Successfully' });
          setTimeout(() => {
            // window.location.reload();
          }, 1000);
        }

      },
      error: (error: any) => {
        console.log('error approving application:', error);
      }
    });
  }

  showToast(message: string) {
    setTimeout(() => {
      console.log(message);
    }, 1000);
  }

  resetConfirmation() {
    this.confirmationMessage = null;
    this.actionToConfirm = null;
    this.businessIdToActOn = null;
  }

  viewButton(uuid: any) {
    // vad = view application details
    // localStorage.setItem('vad', `${uuid}`);
    // this.router.navigate(['application-details', uuid]);
    this.router.navigate(['declined-applications/declined-application-details', uuid]);
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'New':
        return 'bg-green-200 text-green-800';
      case 'Renewal':
        return 'bg-blue-200 text-blue-800';
      case 'Additional':
        return 'bg-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }
}
