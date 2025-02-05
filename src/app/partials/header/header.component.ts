import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title = 'Business Permit and Licensing System';
  isLoggedIn = localStorage.getItem('loggedIn') !== null;
  currentTime: any;
  
  dropDownMenu: boolean = false;
  isSidebarOpen = true;

  constructor(private router: Router, private sidebarService: SidebarService) {  }

  ngOnInit():void {
    // console.log(this.isLoggedIn);
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime(): void {
    const now = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const dateString = now.toLocaleDateString('en-US', {
      timeZone: timeZone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const timeString = now.toLocaleTimeString('en-US', {
      timeZone: timeZone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    this.currentTime = `${dateString}, ${timeString}`;
  }

  dropDown() {
    this.dropDownMenu =! this.dropDownMenu;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarService.toggleSidebar();
  }
}
