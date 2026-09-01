import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';

// Shared by two different entry points: the homepage hero (public sign-in)
// and the standalone admin login page. The `variant` input controls which
// consumer-facing affordances (sign up, Google) show up, since those don't
// make sense on the admin side, without duplicating the form/auth logic.
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  @Input() variant: 'public' | 'admin' = 'public';

  loginForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: AuthService,
    private router: Router,
    private authState: AuthStateService,
  ) {
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
      next: (response: any) => this.handleAuthResponse(response),
      error: (err: any) => this.handleAuthError(err)
    });
  }

  // Google OAuth isn't wired up to a real identity provider, so clicking the
  // button explains that instead of silently signing the visitor in.
  showGoogleSignInNotice() {
    Swal.fire({
      icon: 'info',
      title: 'Google Sign-In',
      text: 'Google Sign-In isn\'t connected yet. Please sign in with your account credentials instead.',
      confirmButtonColor: '#009800',
      confirmButtonText: 'OK'
    });
  }

  private handleAuthResponse(response: any) {
    const { token, role, user: userId } = response;

    if (token) {
      localStorage.setItem('isLoggedIn', 'true');
      // header.component.ts and admin-header.component.ts check 'loggedIn' (not
      // 'isLoggedIn') to decide whether to show the signed-in header state.
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('t', token);
      localStorage.setItem('r', role);
      localStorage.setItem('u', userId);
      localStorage.setItem('sn', role === 2 ? '1' : role === 1 ? '5' : '');
      this.authState.markLoggedIn();

      const redirectRoute = role === 2 ? '/applications' : role === 1 ? '/admin/dashboard' : '';
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
  }

  private handleAuthError(err: any) {
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

  // Sample sign-in details shown above the form, kept separate per variant
  // since the admin and business-owner demo accounts are different.
  get sampleCredentials(): { email: string; password: string } {
    return this.variant === 'admin'
      ? { email: 'admin@gmail.com', password: 'admin' }
      : { email: 'user@gmail.com', password: 'user' };
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
