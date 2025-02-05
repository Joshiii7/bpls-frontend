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
  @Input('businessArea') businessArea: string = '';
  @Input('businessFloorArea') businessFloorArea: string = '';
  @Input('totalFemale') totalFemale: string = '';
  @Input('totalMale') totalMale: string = '';
  @Input('totalEmployee') totalEmployee: string = '';
  @Input('no_van') no_van: string = '';
  @Input('no_motor') no_motor: string = '';
  
  @Input('province') province: string = '';
  @Input('city') city: string = '';
  @Input('barangay') barangay: string = '';
  @Input('zipCode') zipCode: string = '';
  @Input('street') street: string = '';
  @Input('house_no') house_no: string = '';
  @Input('name_building') name_building: string = '';
  @Input('lot_no') lot_no: string = '';
  @Input('block_no') block_no: string = '';
  @Input('subdivision') subdivision: string = '';

  @Input('operationalProvince') operationalProvince: string = '';
  @Input('operationalCity') operationalCity: string = '';
  @Input('operationalBarangay') operationalBarangay: string = '';
  @Input('operationalZipCode') operationalZipCode: string = '';
  @Input('operationalStreet') operationalStreet: string = '';
  @Input('operational_house_no') operational_house_no: string = '';
  @Input('operational_name_building') operational_name_building: string = '';
  @Input('operational_lot_no') operational_lot_no: string = '';
  @Input('operational_block_no') operational_block_no: string = '';
  @Input('operational_subdivision') operational_subdivision: string = '';
  
  @Input('businessActivity') businessActivity: number = 0;
  @Input('paymentType') paymentType: number = 0;
  @Input('businessType') businessType: number = 0;
  @Input('gender') gender: number = 0;
  @Input('isNew') isNew: number = 0;

  constructor() {  }
}
