import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  providers: [MessageService]
})
export class LandingPageComponent {
  @Input('withHeader') withHeader: boolean = false;
  isLoggedIn = localStorage.getItem('isLoggedIn') != null;

  hasAccount: boolean = true;
  loginSeePass: boolean = false;
  registerSeePass: boolean = false;
  registerConfirmSeePass: boolean = false;

  loginForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  registerForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmpassword: ['', [Validators.required]],
  });

  constructor(private formBuilder: FormBuilder, private apiServices: ApiServicesService, private messageService: MessageService, private router: Router) {}
  
  ngOnInit(): void {
    // console.log(this.isLoggedIn);
  }

  signUpFunction() {
    this.hasAccount = false;
  }

  signInFunction() {
    this.hasAccount = true;
  }

  loginSubmit() {
    if (this.loginForm.invalid) {
      console.log('invalid');
      return;
    }

    this.apiServices.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log(response);
        const token = response.token;
        const role = response.role;
        const userId = response.user;

        if (token) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('t', token);
          localStorage.setItem('r', role);
          localStorage.setItem('u', userId);
          if (role === 2) {
            localStorage.setItem('sn', '1');
          } else if (role === 1) {
            localStorage.setItem('sn', '5');
          }
          
          this.messageService.add({ severity: 'success', summary: "Success", detail: 'Successfully Signed in' });

          setTimeout(() => {
            if (response.role === 2) {
              this.router.navigate(['/dashboard']).then(() => {
                window.location.reload();
              });
            } else if (response.role === 1) {
              this.router.navigate(['admin-dashboard']).then(() => {
                window.location.reload();
              });
            }
          }, 1000);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid credentials' });
        }
      },
      error: (error: any) => {
        console.log('error logging in:', error);
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: error.error.message || 'Invalid credentials' });
      }
    });
  }

  registerSubmit() {
    if (this.registerForm.invalid) {
      console.log('invalid');
      return;
    } else {
      const password = this.registerForm.value.password;
      const confirmpassword = this.registerForm.value.confirmpassword;

      if (password == confirmpassword) {
        // console.log('ok nani');
        this.apiServices.register(this.registerForm.value).subscribe({
          next: (response: any) => {
            // console.log(response);
            if (response) {
              window.location.reload();

              this.messageService.add({ severity: 'success', summary: "Success", detail: 'Successfully Registered' });
            }
          },
          error: (error: any) => {
            console.log('error registering an account');
          }
        })
      } else {
        this.messageService.add({ severity: 'error', summary: "Password didn't match", detail: 'Please make sure both passwords are the same.' });
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
