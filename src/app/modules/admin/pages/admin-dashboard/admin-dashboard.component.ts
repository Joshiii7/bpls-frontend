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

        const total = response.totalPermits || 1;
        response.totalPendingPercent  = ((response.totalPending / total) * 100).toFixed(1);
        response.totalApprovedPercent = ((response.totalApproved / total) * 100).toFixed(1);
        response.totalDeclinedPercent = ((response.totalDeclined / total) * 100).toFixed(1);

        this.reports = response;
        
        const labels = Object.keys(response.businessTypes);
        const data = Object.values(response.businessTypes).map(v => Number(v));

        this.createDoughnutChart(labels, data);

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
        layout: {
          padding: 20
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
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
