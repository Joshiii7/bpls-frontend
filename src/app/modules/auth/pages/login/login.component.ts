import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: AuthService,
    private router: Router
  ) {
    document.title = 'BPLS | Login';

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.api.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        const { token, role, user: userId } = response;

          if (token) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('t', token);
            localStorage.setItem('r', role);
            localStorage.setItem('u', userId);
            localStorage.setItem('sn', role === 2 ? '1' : role === 1 ? '5' : '');
            
            const redirectRoute = role === 2 ? '/applications' : role === 1 ? '/admin-dashboard' : '';
            if (redirectRoute) {
              this.router.navigate([redirectRoute]);
            }
          } else {
            this.isLoading = false;
            Swal.fire({
              icon: "error",
              title: "Login Failed",
              text: "Invalid email or password. Please try again.",
              confirmButtonColor: '#d33',
              confirmButtonText: 'Understood'
            });
          }
      },
      error: (err: any) => {
        console.error("error login in: ", err);
        this.isLoading = false;
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err.error?.message || 'An error occurred while signing in. Please try again later.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Understood'
        });
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
