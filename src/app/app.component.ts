import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DemoDbService } from './demo/demo-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  withNavigation: boolean = false;
  isSidebarOpen: boolean = true;
  showHeader: boolean = true;
  showSidebar: boolean = true;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private demoDb: DemoDbService) {  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.withNavigation = !event.url.includes('');
        this.cdr.detectChanges();
      });
  }

  onRouteChange(componentInstance: any): void {
    if (componentInstance && 'emitNavigationState' in componentInstance) {
      componentInstance.emitNavigationState.subscribe((value: boolean) => {
        this.withNavigation = value;
        this.cdr.detectChanges();
      });
    }
  }

  close() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  resetDemoData() {
    Swal.fire({
      title: 'Reset demo data?',
      text: 'This restores all applications, schedules, and notifications to their original demo state and signs you out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#009800',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reset it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.demoDb.resetToSeed();
        window.location.href = '/';
      }
    });
  }
}
