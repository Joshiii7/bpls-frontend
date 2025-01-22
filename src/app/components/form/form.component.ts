import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  @Input('businessName') businessName: string = '';
  @Input('franchiseName') franchiseName: string = '';
  @Input('dtiNumber') dtiNumber: string = '';
  @Input('registrationDate') registrationDate: string = '';
  @Input('tinNumber') tinNumber: string = '';
  @Input('surname') surname: string = '';
  @Input('givenname') givenname: string = '';
  @Input('middlename') middlename: string = '';
  @Input('suffix') suffix: string = '';
  @Input('email') email: string = '';
  @Input('number') number: string = '';
  @Input('street') street: string = '';
  @Input('barangay') barangay: string = '';
  @Input('city') city: string = '';
  @Input('province') province: string = '';
  @Input('zipCode') zipCode: string = '';
  @Input('businessArea') businessArea: string = '';
  @Input('totalFemale') totalFemale: string = '';
  @Input('totalMale') totalMale: string = '';
  @Input('totalEmployee') totalEmployee: string = '';
  
  @Input('businessActivity') businessActivity: number = 0;
  @Input('paymentType') paymentType: number = 0;
  @Input('businessType') businessType: number = 0;
  @Input('gender') gender: number = 0;
  @Input('isNew') isNew: number = 0;

  constructor() {  }
}
