import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  isLoggedIn = localStorage.getItem('isLoggedIn') != null;

  loginForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(private formBuilder: FormBuilder, private apiServices: ApiServicesService) {}
  
  ngOnInit(): void {
    console.log(this.isLoggedIn);
  }

  loginSubmit() {
    if (this.loginForm.invalid) {
      console.log('invalid');
    } else {
      this.apiServices.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          // console.log(response.token);
          const token = response.token;
          
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', token);
        },
        error: (error: any) => {
          console.log('error logging in:', error);
        }
      })
      
    }
  }
}
