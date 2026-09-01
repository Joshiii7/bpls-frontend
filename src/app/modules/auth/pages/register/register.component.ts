import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private api: AuthService, private router: Router) {
    document.title = 'BPLS | Register'

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  submit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.api.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Account Created',
          html: `
            <p class="text-sm text-gray-700 mb-3">Sign in with the sample account (user / user) to explore the applicant experience, or admin / admin to explore the admin side.</p>
            <p class="text-left text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md p-3">
              <strong>Demo System:</strong> this is a demonstration of the Business Permit and Licensing System. Accounts are stored locally in this browser only and are not created on a real server.
            </p>
          `,
          confirmButtonColor: '#008900',
          confirmButtonText: 'Go to Login'
        }).then(() => this.router.navigate(['/'], { fragment: 'login' }));
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'An error occurred while creating your account. Please try again later.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Understood'
        });
      }
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
