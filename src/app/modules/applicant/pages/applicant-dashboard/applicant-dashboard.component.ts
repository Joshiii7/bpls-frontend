import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicantService } from '../../services/applicant.service';
import { UserProfileService } from 'src/app/core/services/user-profile.service';

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

  stats = { total: 0, drafts: 0, pending: 0, approved: 0 };

  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  visiblePages: number[] = [];
  totalEntries: number = 0;

  constructor(
    private router: Router,
    private api: ApplicantService,
    private profileApi: UserProfileService,
  ) {
    document.title = 'BPLS | Applications';
  }

  ngOnInit() {
    this.emitNavigationState.emit(true);
    this.initApplications();
    this.initUserInformation();
  }

  initUserInformation() {
    this.profileApi.getUserProfile().subscribe({
      next: (response: any) => {
        // middle_name/suffix are legitimately optional (most applicants have no
        // suffix at all), so only the fields actually needed to identify and
        // reach the applicant gate the "complete your profile" nudge.
        const fieldsToCheck = ['first_name', 'last_name', 'number', 'email', 'signature'];
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

  continueDraft(uuid: string) {
    this.router.navigate(['/applications/apply-permit'], { queryParams: { draft: uuid } });
  }

  initApplications() {
    this.api.getApplications().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.applications = response || [];
        this.filteredApplications = [...this.applications];
        this.updateStats();
        this.updatePagination();
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log('Error fetching applications:', error);
      }
    });
  }

  updateStats() {
    this.stats = {
      total: this.applications.length,
      drafts: this.applications.filter(a => a.status === 'Draft').length,
      pending: this.applications.filter(a => a.status === 'Pending').length,
      approved: this.applications.filter(a => a.status === 'Approved').length,
    };
  }

  getShowingRange(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalEntries);
    return `${start} - ${end}`;
  }

  filterApplications() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredApplications = this.applications.filter(app =>
      !query ||
      app.business_name?.toLowerCase().includes(query) ||
      app.tracking_number?.toLowerCase().includes(query)
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
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Declined':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Approved':
        return 'ti ti-circle-check';
      case 'Pending':
        return 'ti ti-hourglass';
      case 'Declined':
        return 'ti ti-circle-x';
      case 'Draft':
        return 'ti ti-pencil';
      default:
        return 'ti ti-circle';
    }
  }

  viewDetails(uuid: number) {
    this.router.navigate(['/applications/', uuid]);
  }
}
