import { afterNextRender, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServicesService } from '../api-services.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import Swal from 'sweetalert2';
// import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [MessageService]
})
export class AuthComponent {
  @Input('withHeader') withHeader: boolean = false;
  @Output() emitNavigationState = new EventEmitter<boolean>();
  isLoggedIn = localStorage.getItem('isLoggedIn') != null;
  userProfile: any = null;

  hasAccount: boolean = true;
  loginSeePass: boolean = false;
  registerSeePass: boolean = false;
  registerConfirmSeePass: boolean = false;
  isLoading: boolean = false;

  user: any;
  isAuthenticated: boolean = false;
  showModal: boolean = false;

  newRequirements = [
    'Unified Application Form',
    'Barangay Clearance',
    'Zoning Clearance',
    'Sanitary Permit',
    'Environmental Compliance Certificate',
    'BFP-Fire Safety Inspection Certificate (FSIC)',
    'Occupancy Permit Building Official',
  ]

  renewalRequirements = [
    'Unified Application Form',
    'Barangay Clearance',
    'Old Business Permit',
  ]

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  registerForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmpassword: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private apiServices: ApiServicesService, 
    private messageService: MessageService, 
    private router: Router,
    public auth: AuthService
  ) {}
  
  ngOnInit(): void {
    this.emitNavigationState.emit(false);
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;

      if (isAuthenticated) {
        this.auth.user$.subscribe((user) => {
          this.userProfile = user;
        });
      }
    });

    this.clearStorage();
  }
  
  clearStorage() {
    localStorage.clear();
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
      openUrl: false,
    });
  }

  closeModal() {
    this.showModal = false;
  }

  goToProfile(): void {
    alert('Go to profile functionality can be added here!');
  }

  loginWithGoogle() {
    this.auth
      .loginWithPopup({
        authorizationParams: {
          connection: 'google-oauth2',
          prompt: 'select_account',
        },
      })
      .subscribe(() => {
        this.auth.user$.subscribe((user) => {
          if (user) {
            this.isLoading = true;
            console.log('User Info:', user);
  
            const userData = {
              email: user.email,
              given_name: user.given_name,
              google_id: user.sub,
            };
            this.saveUserToDatabase(userData);
          }
        });
      });
  }

  saveUserToDatabase(userData: any) {
    this.apiServices.loginGoogle(userData).subscribe({
      next: (response: any) => {
        console.log('User data saved to backend:', response);
        const { token, role, user: userId } = response
        if (token) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('t', token);
          localStorage.setItem('r', role);
          localStorage.setItem('u', userId);
          localStorage.setItem('sn', role === 2 ? '1' : role === 1 ? '5' : '');

          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Signed in' });

          setTimeout(() => {
            const redirectRoute = role === 2 ? '/dashboard' : role === 1 ? 'admin-dashboard' : '';
            if (redirectRoute) {
              this.router.navigate([redirectRoute]).then(() => {
                window.location.reload();
              });
            }
          }, 1000);
        }
      },
      error: (err: any) => {
        console.error('Error saving user to backend:', err);
      }
    });
  }

  backendAuthentication(token: string) {
    this.apiServices.loginGoogle(token).subscribe({
      next: (response: any) => {
        console.log('Backend authentication successful', response);
      },
      error: (error: any) => {
        console.error('Backend authentication failed', error);
      }
    });
  }

  signUpFunction() {
    this.hasAccount = false;
  }

  signInFunction() {
    this.hasAccount = true;
  }

  loginSubmit() {
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Form",
        text: "Please fill out all required fields before proceeding.",
        confirmButtonColor: '#d33',
        confirmButtonText: 'Understood'
      });
      return;
    }

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.apiServices.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          const { token, role, user: userId } = response;

          if (token) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('t', token);
            localStorage.setItem('r', role);
            localStorage.setItem('u', userId);
            localStorage.setItem('sn', role === 2 ? '1' : role === 1 ? '5' : '');

            Swal.fire({
              icon: "success",
              title: "Login Successful",
              text: "You have successfully signed in.",
            }).then(() => {
              this.isLoading = false;
              const redirectRoute = role === 2 ? '/application' : role === 1 ? 'admin-dashboard' : '';
              if (redirectRoute) {
                this.router.navigate([redirectRoute]).then(() => {
                  window.location.reload();
                });
              }
            });
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
        error: (error: any) => {
          console.log('Error logging in:', error);
          this.isLoading = false;
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: error.error?.message || 'An error occurred while signing in. Please try again later.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Understood'
          });
        }
      });
    }
  }

  
  registerSubmit() {
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Form",
        text: "Please fill out all required fields before proceeding.",
        confirmButtonColor: '#d33',
        confirmButtonText: 'Got it'
      });
      return;
    }

    if (this.registerForm.valid) {
      const password = this.registerForm.value.password;
      const confirmpassword = this.registerForm.value.confirmpassword;

      if (password === confirmpassword) {
        this.apiServices.register(this.registerForm.value).subscribe({
          next: (response: any) => {
            if (response) {
              Swal.fire({
                icon: "success",
                title: "Registration Successful",
                text: "Your account has been created successfully!",
              }).then(() => {
                window.location.reload();
              });
            }
          },
          error: (error: any) => {
            console.log('Error registering an account', error);
            Swal.fire({
              icon: "error",
              title: "Registration Failed",
              text: "Something went wrong while registering your account. Please try again later.",
              confirmButtonColor: '#d33',
              confirmButtonText: 'Okay'
            });
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Password Mismatch",
          text: "Please make sure both passwords match.",
          confirmButtonColor: '#d33',
          confirmButtonText: 'Understood'
        });
      }
    }
  }

  loginPass() {
    this.loginSeePass = !this.loginSeePass;
  }

  registerPass() {
    this.registerSeePass = !this.registerSeePass;
  }

  registerConfirmPass() {
    this.registerConfirmSeePass = !this.registerConfirmSeePass;
  }
}
