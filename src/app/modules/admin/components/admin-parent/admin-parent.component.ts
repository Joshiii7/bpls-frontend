import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-parent',
  templateUrl: './admin-parent.component.html',
  styleUrls: ['./admin-parent.component.css']
})
export class AdminParentComponent {
  withNavigation: boolean = false;
  isSidebarOpen: boolean = true;
  showHeader: boolean = true;
  showSidebar: boolean = true;

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}

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
}
