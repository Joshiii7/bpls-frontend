import { Component } from '@angular/core';

// A standalone page, deliberately separate from the public site's header,
// footer, and hero. Administrators reach it directly at /admin/login (linked
// only from the footer utility row), rather than through the public sign-in
// form, which is scoped to business owners.
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  constructor() {
    document.title = 'BPLS | Admin Login';
  }
}
