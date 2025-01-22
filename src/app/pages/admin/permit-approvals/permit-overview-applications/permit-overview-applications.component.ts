import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiServicesService } from 'src/app/api-services.service';
import { RealTimeService } from 'src/app/real-time.service';

@Component({
  selector: 'app-permit-overview-applications',
  templateUrl: './permit-overview-applications.component.html',
  styleUrls: ['./permit-overview-applications.component.css'],
  providers: [MessageService, DatePipe]
})
export class PermitOverviewApplicationsComponent {
  @Output() emitNavigationState = new EventEmitter<boolean>();
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
  
  constructor(private apiService: ApiServicesService, private router: Router, private messageService: MessageService, private datePipe: DatePipe, private realTimeService: RealTimeService) {  }

  ngOnInit():void {
    this.emitNavigationState.emit(true);
    this.loadBusinesses();
    this.realTimeService.listenForUpdates();
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
    this.apiService.getBusinesses(this.currentPage, this.perPage).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response) {
          this.isLoading = false;
        }
        this.businesses = response.data;
        this.totalPages = response.pagination.last_page;
        this.total = response.pagination.total;
        console.log(this.total);
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
        this.loadBusinesses();
    }
  }

  updateRange(): void {
    this.start = (this.currentPage - 1) * this.perPage + 1;
    this.end = Math.min(this.start + this.perPage - 1, this.total);
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

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
    this.router.navigate(['applications/application-details', uuid]);
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
