import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

declare var Chart: any;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  providers: [DatePipe],
})
export class AdminDashboardComponent implements OnInit {
  isLoading = true;
  reports: any = null;
  hasApplicationData = false;
  permitAging: any[] = [];

  // Kept so a repeat load (e.g. a future refresh action) destroys the previous
  // Chart.js instance before drawing a new one, reusing a canvas without
  // destroying its prior chart throws "Canvas is already in use".
  private doughnutChart: any = null;
  private lineChart: any = null;

  permitAgingFull: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  visiblePages: number[] = [];
  totalEntries: number = 0;

  constructor(
    private router: Router,
    private api: AdminService,
    private cdr: ChangeDetectorRef,
  ) {
    document.title = 'BPLS Admin | Dashboard';
  }

  ngOnInit(): void {
    this.initReports();
  }

  initReports() {
    this.isLoading = true;
    this.api.getAdminReports().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.permitAgingFull = response.permitAging || [];
        this.permitAging = this.permitAgingFull.slice(0, this.pageSize);
        this.updatePagination();

        const total = response.totalPermits || 1;
        response.totalPendingPercent = ((response.totalPending / total) * 100).toFixed(1);
        response.totalApprovedPercent = ((response.totalApproved / total) * 100).toFixed(1);
        response.totalDeclinedPercent = ((response.totalDeclined / total) * 100).toFixed(1);

        const newCount = response.applicationTypeCounts?.New || 0;
        const renewalCount = response.applicationTypeCounts?.Renewal || 0;
        const typeTotal = newCount + renewalCount || 1;
        response.newPercent = Math.round((newCount / typeTotal) * 100);
        response.renewalPercent = 100 - response.newPercent;
        response.newCount = newCount;
        response.renewalCount = renewalCount;

        this.reports = response;
        this.hasApplicationData = (response.totalPermits || 0) > 0;

        // The chart <canvas> elements sit behind *ngIf="hasApplicationData", so
        // they don't exist in the DOM yet at this point in the callback, force
        // Angular to render that view right now instead of waiting for the next
        // change-detection cycle, otherwise document.getElementById() below
        // returns null and Chart.js silently has nothing to draw into.
        this.cdr.detectChanges();

        if (this.hasApplicationData) {
          const labels = Object.keys(response.businessTypes);
          const data = Object.values(response.businessTypes).map(v => Number(v));

          this.createDoughnutChart(labels, data);
          this.createMonthlyLineChart(response.monthlyStatus);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error("Error initializing reports:", err);
      }
    });
  }

  createDoughnutChart(labels: string[], data: number[]) {
    const ctx = document.getElementById('businessDoughnutChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.doughnutChart?.destroy();

    const greenShades = [
      '#008900',
      '#00A200',
      '#00BB00',
      '#00D400',
      '#00ED00',
      '#00FF33'
    ];

    this.doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: greenShades,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 20,
              padding: 15,
              font: { family: 'Inter' }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percent = total ? ((value / total) * 100).toFixed(1) : '0';
                return `${label}: ${value} (${percent}%)`;
              }
            }
          }
        }
      }
    });
  }

  createMonthlyLineChart(monthlyStatus: any) {
    const ctx = document.getElementById('monthlyLineChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.lineChart?.destroy();

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = monthOrder;

    const submittedData = monthOrder.map(m => monthlyStatus[m]?.submitted || 0);
    const approvedData = monthOrder.map(m => monthlyStatus[m]?.approved || 0);
    const declinedData = monthOrder.map(m => monthlyStatus[m]?.declined || 0);

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Submitted',
            data: submittedData,
            borderColor: '#1d4ed8',
            backgroundColor: '#1d4ed8',
            fill: false,
            tension: 0.3
          },
          {
            label: 'Approved',
            data: approvedData,
            borderColor: '#008900',
            backgroundColor: '#008900',
            fill: false,
            tension: 0.3
          },
          {
            label: 'Declined',
            data: declinedData,
            borderColor: '#dc2626',
            backgroundColor: '#dc2626',
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15,
              font: { family: 'Inter' }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
            grid: { drawTicks: false, drawBorder: false }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  filteredPermits() {
    return [...this.permitAgingFull];
  }

  getShowingRange(): string {
    if (this.totalEntries === 0) return '0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalEntries);
    return `${start} - ${end}`;
  }

  updatePagination() {
    const filtered = this.filteredPermits();

    this.totalEntries = filtered.length;
    this.totalPages = Math.ceil(this.totalEntries / this.pageSize) || 1;

    this.permitAging = filtered.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );

    this.updateVisiblePages();
  }

  updateVisiblePages() {
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, startPage + 4);
    this.visiblePages = Array.from({ length: Math.max(endPage - startPage + 1, 0) }, (_, i) => startPage + i);
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

  goToApplications(status: 'Pending' | 'Approved' | 'Declined' | 'All') {
    const path = status === 'All' ? '/admin/applications' : `/admin/applications/${status.toLowerCase()}`;
    this.router.navigate([path]);
  }
}
