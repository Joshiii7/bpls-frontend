import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiServicesService } from 'src/app/api-services.service';
import { DatePipe } from '@angular/common';
import { Chart } from 'chart.js/auto';

interface ChartData {
  issued: { [key: number]: number };
  renewed: { [key: number]: number };
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  providers: [MessageService, DatePipe]
})
export class AdminDashboardComponent {
  @Output() emitNavigationState = new EventEmitter<boolean>();
  searchText: string = '';
  isLoading: boolean = true;

  businesses: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  perPage: number = 10;
  total: number = 0;
  
  startValue = 0; 
  totalUser: number = 0;
  totalPending: number = 0;
  totalApproved: number = 0;
  totalDeclined: number = 0;

  displayValue: string = '0';
  displayPending: string = '0';
  displayApproved: string = '0';
  displayDeclined: string = '0';

  totalBusiness: number = 0;
  pendingPercentage: number = 0;
  approvedPercentage: number = 0;
  declinedPercentage: number = 0;

  chartData: ChartData = {
    issued: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 },
    renewed: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 },
  };

  agingData: any[] = [];
  chart: any;
  
  constructor(private apiService: ApiServicesService, private router: Router, private messageService: MessageService, private datePipe: DatePipe) {  }

  ngOnInit():void {
    this.emitNavigationState.emit(true);

    setInterval(() => {
      this.loadBusinessTotalPermits();
    }, 1000);
    this.loadBusinesses();
    this.getUser();
  }

  loadBusinessTotalPermits() {
    this.apiService.allBusiness().subscribe({
      next: (response: any) => {
        this.totalPending = response.totalPending;
        this.totalApproved = response.totalApproved;
        this.totalDeclined = response.totalDeclined;
        this.animateNumberPending();
        this.animateNumberApproved();
        this.animateNumberDeclined();
        this.totalBusiness = response.totalBusiness;

        this.calculatePendingPercentage();
        this.calculateApprovePercentage();
        this.calculateDeclinePercentage();
      },
      error: (error: any) => {
        console.log('error fetching business', error);
      }
    });
  }

  calculatePendingPercentage() {
    if (this.totalBusiness > 0) {
      this.pendingPercentage = (this.totalPending / this.totalBusiness) * 100;
    } else {
      this.pendingPercentage = 0;
    }
  }

  calculateApprovePercentage() {
    if (this.totalBusiness > 0) {
      this.approvedPercentage = (this.totalApproved / this.totalBusiness) * 100;
    } else {
      this.approvedPercentage = 0;
    }
  }

  calculateDeclinePercentage() {
    if (this.totalBusiness > 0) {
      this.declinedPercentage = (this.totalDeclined / this.totalBusiness) * 100;
    } else {
      this.declinedPercentage = 0;
    }
  }

  getUser() {
    this.apiService.getUserRole().subscribe({
      next: (response: any) => {
        this.totalUser = response.userCount;
        // this.totalUser = 1234;
        this.animateNumberUser();
      },
      error: (error: any) => {
        console.log('Error fetching users:', error);
      }
    });
  }

  loadBusinesses(): void {
    this.apiService.getBusinesses(this.currentPage, this.perPage).subscribe({
      next: (response: any) => {
        if (response) {
          this.isLoading = false;
        }
        // this.chartData = response.issued;
        // const issuedData = { 12: 1 };
        // const renewedData = { 1: 2, 3: 1, 5: 1, 7: 3 };
        const issuedData: { [key: number]: number } = response.issued || {}; 
        const renewedData: { [key: number]: number } = response.renewed;

        for (const [month, count] of Object.entries(issuedData)) {
          const monthKey = Number(month.split('-')[1]);
          const parsedCount = Number(count);
          
          if (monthKey >= 1 && monthKey <= 12 && !isNaN(parsedCount)) {
            this.chartData.issued[monthKey] = parsedCount;
          } else {
            console.error(`Invalid data for issued: month=${monthKey}, count=${count}`);
          }
        }
        
        for (const [month, count] of Object.entries(renewedData)) {
          // Extract the month part from the 'YYYY-MM' format
          const monthKey = Number(month.split('-')[1]);
          const parsedCount = Number(count);
          
          if (monthKey >= 1 && monthKey <= 12 && !isNaN(parsedCount)) {
            this.chartData.renewed[monthKey] = parsedCount;
          } else {
            console.error(`Invalid data for renewed: month=${monthKey}, count=${count}`);
          }
        }

        this.createChart();

        this.agingData = response.pendingAge;
        const labels = ['1-7 Days', '8-14 Days', '15+ Days'];

        let values = [0, 0, 0];

        this.agingData.forEach((item: any) => {
          if (item.aging_range === '1-7 Days') {
            values[0] = item.count;
          } else if (item.aging_range === '8-14 Days') {
            values[1] = item.count;
          } else if (item.aging_range === '15+ Days') {
            values[2] = item.count;
          }
        });

        this.createAgeChart(labels, values);
      },
      error: (error: any) => {
        console.log('Error fetching paginated page:', error);
      }
    });
  }

  animateNumberUser() {
    const duration = 20;
    const step = (this.totalUser - this.startValue) / duration;
    let currentValue = this.startValue;

    const interval = setInterval(() => {
      currentValue += step;

      if (currentValue >= this.totalUser) {
        clearInterval(interval);
        currentValue = this.totalUser;
      }

      const value = Math.floor(currentValue);
      this.displayValue = value.toLocaleString();
    }, .2);
  }

  createAgeChart(labels: string[], values: number[]) {
    const ctx = (document.getElementById('pendingPermitsChart') as HTMLCanvasElement).getContext('2d');
  
    if (!ctx) return;
  
    // Create gradients
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, 'rgba(66, 135, 245, 0.9)');
    gradient1.addColorStop(1, 'rgba(0, 91, 234, 0.5)');
  
    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, 'rgba(38, 194, 129, 0.9)');
    gradient2.addColorStop(1, 'rgba(0, 150, 100, 0.5)');
  
    const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient3.addColorStop(0, 'rgba(255, 193, 7, 0.9)');
    gradient3.addColorStop(1, 'rgba(255, 193, 7, 0.5)'); 
  
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: [gradient1, gradient2, gradient3],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              generateLabels: (chart: any) => {
                return chart.data.labels.map((label: string, index: number) => {
                  return {
                    text: `${label}: ${values[index]}${values[index] === 0 ? ' (No Data)' : ''}`,
                    fillStyle: chart.data.datasets[0].backgroundColor[index],
                    strokeStyle: chart.data.datasets[0].backgroundColor[index],
                    lineWidth: 1,
                  };
                });
              },
            }
          },
        },
      },
    });
  }

  createChart(): void {
    const ctx = document.getElementById('businessPermitChart') as HTMLCanvasElement;
    const gradientIssued = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
    gradientIssued.addColorStop(0, 'rgba(0, 123, 255, 0.3)');
    gradientIssued.addColorStop(1, 'rgba(0, 123, 255, 0)');

    const gradientRenewed = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
    gradientRenewed.addColorStop(0, 'rgba(40, 167, 69, 0.3)');
    gradientRenewed.addColorStop(1, 'rgba(40, 167, 69, 0)');

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dynamicLabels = Array.from({ length: 12 }, (_, i) => monthLabels[(currentMonth - 11 + i + 12) % 12]);

    const issuedData = dynamicLabels.map((_, i) => {
        const monthIndex = (currentMonth - 11 + i + 12) % 12 + 1;
        return this.chartData.issued[monthIndex] || 0;
    });

    const renewedData = dynamicLabels.map((_, i) => {
        const monthIndex = (currentMonth - 11 + i + 12) % 12 + 1;
        return this.chartData.renewed[monthIndex] || 0;
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dynamicLabels,
            datasets: [
                {
                    label: 'Business Permits Issued',
                    data: issuedData,
                    borderColor: '#007bff',
                    backgroundColor: gradientIssued,
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Business Permits Renewed',
                    data: renewedData,
                    borderColor: '#28a745',
                    backgroundColor: gradientRenewed,
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.5)',
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
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
      },
      error: (error: any) => {
        console.log('Error fetching searched business:', error);
      }
    });
  }

  animateNumberApproved() {
    const duration = 20;
    const step = (this.totalApproved - this.startValue) / duration;
    let currentValue = this.startValue;

    const interval = setInterval(() => {
      currentValue += step;

      if (currentValue >= this.totalApproved) {
        clearInterval(interval);
        currentValue = this.totalApproved;
      }

      const value = Math.floor(currentValue);
      this.displayApproved = value.toLocaleString();
    }, .2);
  }

  animateNumberDeclined() {
    const duration = 20;
    const step = (this.totalDeclined - this.startValue) / duration;
    let currentValue = this.startValue;

    const interval = setInterval(() => {
      currentValue += step;

      if (currentValue >= this.totalDeclined) {
        clearInterval(interval);
        currentValue = this.totalDeclined;
      }

      const value = Math.floor(currentValue);
      this.displayDeclined = value.toLocaleString();
    }, .2);
  }

  animateNumberPending() {
    const duration = 20;
    const step = (this.totalPending - this.startValue) / duration;
    let currentValue = this.startValue;

    const interval = setInterval(() => {
      currentValue += step;

      if (currentValue >= this.totalPending) {
        clearInterval(interval);
        currentValue = this.totalPending;
      }

      const value = Math.floor(currentValue);
      this.displayPending = value.toLocaleString();
    }, .2);
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.loadBusinesses();
    }
  }

  approveButton(num: any) {
    this.apiService.approveApplication(num).subscribe({
      next: (response: any) => {
        console.log(response);

        if (response) {
          this.messageService.add({ severity: 'success', summary: "Success", detail: 'Application Approved Successfully' });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }

      },
      error: (error: any) => {
        console.log('error approving application:', error);
      }
    });
  }

  declineButton(num: any) {
    this.apiService.declineApplication(num).subscribe({
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

  viewButton(uuid: any) {
    // vad = view application details
    localStorage.setItem('vad', `${uuid}`);
    this.router.navigate(['application-details', uuid]);
  }
}
