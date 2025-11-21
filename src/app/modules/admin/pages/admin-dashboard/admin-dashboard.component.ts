import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  reports: any = null;
  permitAging: any[] = [];

  permitAgingFull: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  visiblePages: number[] = [];
  totalEntries: number = 0;

  constructor(
    private router: Router,
    private api: AdminService
  ) {}

  ngOnInit(): void {
    this.initReports();
  }

  initReports() {
    this.api.getAdminReports().subscribe({
      next: (response: any) => {
        this.permitAgingFull = response.permitAging || [];
        this.permitAging = this.permitAgingFull.slice(0, this.pageSize);
        this.updatePagination();
        
        const total = response.totalPermits || 1;
        response.totalPendingPercent  = ((response.totalPending / total) * 100).toFixed(1);
        response.totalApprovedPercent = ((response.totalApproved / total) * 100).toFixed(1);
        response.totalDeclinedPercent = ((response.totalDeclined / total) * 100).toFixed(1);

        this.reports = response;
        
        const labels = Object.keys(response.businessTypes);
        const data = Object.values(response.businessTypes).map(v => Number(v));

        this.createDoughnutChart(labels, data);
        this.createMonthlyLineChart(response.monthlyStatus);
      },
      error: (err: any) => {
        console.error("Error initializing reports:", err);
      }
    });
  }

  createDoughnutChart(labels: string[], data: number[]) {
    const ctx = document.getElementById('businessDoughnutChart') as HTMLCanvasElement;

    const greenShades = [
      '#008900',
      '#00A200',
      '#00BB00',
      '#00D400',
      '#00ED00',
      '#00FF33'
    ];

    new Chart(ctx, {
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
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 20,
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percent = ((value / total) * 100).toFixed(1);
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

    const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const labels = monthOrder;

    const approvedData = monthOrder.map(m => monthlyStatus[m]?.approved || 0);
    const declinedData = monthOrder.map(m => monthlyStatus[m]?.declined || 0);

    const approvedGradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, ctx.height);
    approvedGradient.addColorStop(0, 'rgba(0, 137, 0, 1)');
    approvedGradient.addColorStop(1, 'rgba(16,185,129,0)');

    const declinedGradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, ctx.height);
    declinedGradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    declinedGradient.addColorStop(1, 'rgba(239,68,68,0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Approved',
            data: approvedData,
            borderColor: '#008900',
            backgroundColor: '#008900',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Declined',
            data: declinedData,
            borderColor: '#ff0000ff',
            backgroundColor: '#ff0000ff',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true,
            stepSize: 1,
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
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalEntries);
    return `${start} - ${end}`;
  }

  updatePagination() {
    const filtered = this.filteredPermits();

    this.totalEntries = filtered.length;
    this.totalPages = Math.ceil(this.totalEntries / this.pageSize);

    this.permitAging = filtered.slice(
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

  navigate(num: number) {
    if (num === 1) {
      this.router.navigate(['/applications']);
    } else if (num === 2) {
      this.router.navigate(['/approved-applications']);
    } else if (num === 3) {
      this.router.navigate(['/declined-applications']);
    }
  }
}
