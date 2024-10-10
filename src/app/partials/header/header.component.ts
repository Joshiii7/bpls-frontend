import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title = 'Business Permit and Licensing System';
  isLoggedIn = localStorage.getItem('loggedIn') !== null;
  
  dropDownMenu: boolean = false;

  constructor() {  }

  ngOnInit():void {
    // console.log(this.isLoggedIn);
  }

  dropDown() {
    this.dropDownMenu =! this.dropDownMenu;
  }
}
