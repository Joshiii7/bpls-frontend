import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-permit-parent-element',
  templateUrl: './permit-parent-element.component.html',
  styleUrls: ['./permit-parent-element.component.css']
})
export class PermitParentElementComponent {
withNavigation: boolean = false;
  isSidebarOpen: boolean = true;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {  }

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
      });
    }
  }

  close() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
