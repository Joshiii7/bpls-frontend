import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title: string = 'Business Permit & Licensing System';

  constructor() {
    document.title = 'Business Permit & Licensing System';
  }
}
