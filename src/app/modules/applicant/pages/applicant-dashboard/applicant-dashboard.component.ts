import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicantService } from '../../services/applicant.service';

@Component({
  selector: 'app-applicant-dashboard',
  templateUrl: './applicant-dashboard.component.html',
  styleUrls: ['./applicant-dashboard.component.css']
})
export class ApplicantDashboardComponent {
  @Output() emitNavigationState = new EventEmitter<boolean>();
  isLoading: boolean = true;
  showProfileWarning: boolean = false;

  applications: any[] = [];
  filteredApplications: any[] = [];
  paginatedApplications: any[] = [];

  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  visiblePages: number[] = [];
  totalEntries: number = 0;

  constructor(
    private router: Router,
    private api: ApplicantService
  ) {}
  
  ngOnInit() {
    this.emitNavigationState.emit(true);
    this.initApplications();
    this.initUserInformation();
  }

  initUserInformation() {
    this.api.getUserProfile().subscribe({
      next: (response: any) => {
        
        const fieldsToCheck = ['first_name', 'middle_name', 'last_name', 'suffix', 'number', 'email', 'signature'];
        this.showProfileWarning = fieldsToCheck.some(field => !response[field]);
      },
      error: (err: any) => {
        console.error("error fetching user information: ", err)
      }
    });
  }

  newApplication() {
    this.router.navigate(['/applications/apply-permit']);
  }

  initApplications() {
    this.api.getApplications().subscribe({
      next: (response: any) => {
        if (response) {
          this.isLoading = false;
        }
        this.applications = response;
        this.filteredApplications = [...this.applications];
        this.updatePagination();
      },
      error: (error: any) => {
        console.log('Error fetching applications:', error);
      }
    });
  }

  getShowingRange(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalEntries);
    return `${start} - ${end}`;
  }

  filterApplications() {
    this.filteredApplications = this.applications.filter(app =>
      app.business_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalEntries = this.filteredApplications.length;
    this.totalPages = Math.ceil(this.totalEntries / this.pageSize);
    this.paginatedApplications = this.filteredApplications.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
    this.updateVisiblePages();
  }

  updateVisiblePages() {
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + 4);
    this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'bg-green-200 text-green-800';
      case 'Pending':
        return 'bg-blue-200 text-blue-800';
      case 'Declined':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }

  viewDetails(uuid: number) {
    this.router.navigate(['/application/application-details/', uuid]);
  }
}
