import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

type StatusFilter = 'All' | 'Pending' | 'Approved' | 'Declined';

// Backs every "Applications" list in the admin area, All, Pending, Approved,
// and Declined are the same table and the same component, filtered by the
// route's `data.status` (see admin-routing.module.ts). Every status reads from
// one call to AdminService.getAllApplications(), which is itself just the
// shared localStorage-backed application records split by status, the same
// records the applicant side and the demo "database" work from, so a status
// change made from the detail page shows up here on the next load.
@Component({
  selector: 'app-permit-review',
  templateUrl: './permit-review.component.html',
  styleUrls: ['./permit-review.component.css']
})
export class PermitReviewComponent {
  status: StatusFilter = 'All';
  pageTitle = 'All Applications';
  pageDescription = 'Every business permit application submitted through the system.';

  isLoading = true;
  searchText = '';
  selectedApplicationType = '';
  selectedSchedule = '';

  allApplications: any[] = [];
  filteredApplications: any[] = [];
  paginatedApplications: any[] = [];

  currentPage = 1;
  perPage = 10;
  totalEntries = 0;
  totalPages = 0;
  visiblePages: number[] = [];

  private readonly descriptions: Record<StatusFilter, string> = {
    All: 'Every business permit application submitted through the system.',
    Pending: 'Applications currently awaiting department review.',
    Approved: 'Applications approved by every reviewing department.',
    Declined: 'Applications declined by at least one reviewing department.',
  };

  constructor(
    private api: AdminService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.status = (this.route.snapshot.data['status'] as StatusFilter) || 'All';
    this.pageTitle = this.route.snapshot.data['breadcrumb'] || 'Applications';
    this.pageDescription = this.descriptions[this.status];
    document.title = `BPLS Admin | ${this.pageTitle}`;
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.api.getAllApplications().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        const byStatus: Record<StatusFilter, any[]> = {
          All: response.data,
          Pending: response.businessess,
          Approved: response.approvedBusiness,
          Declined: response.declinedBusiness,
        };
        this.allApplications = byStatus[this.status] || [];
        this.filterApplications();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching applications:', err);
        this.allApplications = [];
        this.filterApplications();
      }
    });
  }

  filterApplications(): void {
    const query = this.searchText.toLowerCase().trim();
    this.filteredApplications = this.allApplications.filter(app => {
      const matchesSearch = !query
        || app.business_name?.toLowerCase().includes(query)
        || app.owner?.toLowerCase().includes(query)
        || app.tracking_number?.toLowerCase().includes(query);
      const matchesType = !this.selectedApplicationType || app.application_type === this.selectedApplicationType;
      const matchesSchedule = !this.selectedSchedule || app.permit_schedule === this.selectedSchedule;
      return matchesSearch && matchesType && matchesSchedule;
    });
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalEntries = this.filteredApplications.length;
    this.totalPages = Math.ceil(this.totalEntries / this.perPage) || 1;
    this.paginatedApplications = this.filteredApplications.slice(
      (this.currentPage - 1) * this.perPage,
      this.currentPage * this.perPage
    );
    this.updateVisiblePages();
  }

  updateVisiblePages(): void {
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, startPage + 4);
    this.visiblePages = Array.from({ length: Math.max(endPage - startPage + 1, 0) }, (_, i) => startPage + i);
  }

  getShowingRange(): string {
    if (this.totalEntries === 0) return '0';
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalEntries);
    return `${start}-${end}`;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  viewApplication(uuid: string): void {
    this.router.navigate(['/admin/applications', uuid]);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Declined': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Approved': return 'ti ti-circle-check';
      case 'Declined': return 'ti ti-circle-x';
      case 'Pending': return 'ti ti-hourglass';
      default: return 'ti ti-circle';
    }
  }

  getTypeBadgeClass(type: string): string {
    return type === 'Renewal' ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800';
  }
}
