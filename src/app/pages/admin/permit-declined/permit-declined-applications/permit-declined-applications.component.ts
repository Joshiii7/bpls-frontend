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
  allBusinesses: any[] = [];
  filteredBusinesses: any[] = [];

  currentPage: number = 1;
  perPage: number = 5;
  total: number = 0;
  totalPages: number = 0;

  start: number = 1;
  end: number = 5;

  selectedBusinessType: string = '';

  currentTab: number = 1;
  Math = Math;

  businessTypes = [
    { id: 1, business_name: "Sole Proprietorship" },
    { id: 2, business_name: "One Person Corporation" },
    { id: 3, business_name: "Partnership" },
    { id: 4, business_name: "Corporation" },
    { id: 5, business_name: "Cooperative" }
  ];

  constructor(
    private apiService: ApiServicesService,
    private router: Router,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private realTimeService: RealTimeService
  ) {  }

  ngOnInit(): void {
    this.initAllBusiness();
  }

  // ---------- Data loading ----------
  initAllBusiness() {
    this.isLoading = true;
    this.apiService.allBusiness().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.allBusinesses = response.declinedBusiness ?? response.data ?? [];
        this.filteredBusinesses = [...this.allBusinesses];
        this.recalcPagination();
      },
      error: (error: any) => {
        console.log('error fetching data:', error);
        this.isLoading = false;
        this.allBusinesses = [];
        this.filteredBusinesses = [];
        this.recalcPagination();
      }
    });
  }

  // ---------- Filtering ----------
  filterBusinesses(event?: Event | null): void {
    if (event) {
      const input = event.target as HTMLInputElement;
      this.searchText = input?.value ?? '';
    }

    const searchValue = this.searchText?.toLowerCase().trim() ?? '';

    this.filteredBusinesses = this.allBusinesses.filter(business => {
      const name = (business.business_name ?? '').toString().toLowerCase();
      const owner = (business.owner ?? '').toString().toLowerCase();
      const tracking = (business.tracking_number ?? business.tracking_no ?? '').toString().toLowerCase();

      const matchesSearch = !searchValue || name.includes(searchValue) || owner.includes(searchValue) || tracking.includes(searchValue);

      let matchesTab = true;
      if (this.currentTab === 2) {
        matchesTab = business.application_type === 'New';
      } else if (this.currentTab === 3) {
        matchesTab = business.application_type === 'Renewal';
      }

      let matchesBusinessType = true;
      if (this.selectedBusinessType && this.selectedBusinessType !== '') {
        matchesBusinessType = (business.business_type_id ?? business.businessTypeId ?? '').toString() === this.selectedBusinessType.toString();
      }

      return matchesSearch && matchesTab && matchesBusinessType;
    });

    this.currentPage = 1;
    this.recalcPagination();
  }

  tabIndex(index: number) {
    this.currentTab = index;
    this.filterBusinesses();
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    this.filterBusinesses();
  }

  searchBusinessess() {
    if (!this.searchText) {
      this.filteredBusinesses = [...this.allBusinesses];
      this.recalcPagination();
      return;
    }

    this.apiService.searchBusinesses(this.searchText).subscribe({
      next: (response: any) => {
        this.filteredBusinesses = response.data ?? [];
        this.totalPages = response.pagination?.last_page ?? Math.ceil(this.filteredBusinesses.length / this.perPage);
        this.total = response.pagination?.total ?? this.filteredBusinesses.length;
        this.currentPage = 1;
        this.updateRange();
      },
      error: (error: any) => {
        console.log('Error fetching searched business:', error);
      }
    });
  }

  // ---------- Pagination helpers ----------
  detectRowValue(e: Event) {
    const selectElement = e.target as HTMLSelectElement;
    const selectedValue = +selectElement.value;
    this.perPage = selectedValue || 5;
    this.currentPage = 1;
    this.recalcPagination();
  }

  changePage(page: number): void {
    const pages = Math.ceil(this.total / this.perPage) || 1;
    if (page < 1 || page > pages) return;
    this.currentPage = page;
    this.updateRange();
  }

  recalcPagination(): void {
    this.total = this.filteredBusinesses.length;
    this.totalPages = Math.ceil(this.total / this.perPage) || 1;
    
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    if (this.currentPage < 1) this.currentPage = 1;
    this.updateRange();
  }

  updateRange(): void {
    if (this.total === 0) {
      this.start = 0;
      this.end = 0;
      return;
    }
    this.start = (this.currentPage - 1) * this.perPage + 1;
    this.end = Math.min(this.start + this.perPage - 1, this.total);
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const totalPages = Math.ceil(this.total / this.perPage) || 1;

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

  // ---------- Actions (unchanged) ----------

  viewButton(uuid: any) {
    this.router.navigate(['approved-applications/application-details', uuid]);
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