import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-unified-application-form',
  templateUrl: './unified-application-form.component.html',
  styleUrls: ['./unified-application-form.component.css']
})
export class UnifiedApplicationFormComponent {
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

  @Input('date_of_receipt') date_of_receipt: string = '';
  @Input('tracking_number') tracking_number: string = '';
  @Input('business_id_number') business_id_number: string = '';

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
  @Input('businessType') businessType: number = 0;
  @Input('gender') gender: number = 0;
  @Input('paymentType') paymentType: number = 0;
  @Input('isNew') isNew: number = 0;

  @Input() image: string | null = null;

  // Static option lists driving the template's *ngFor choice-badge groups below.
  // These are purely presentational (the same fixed set of checkboxes the original
  // markup hardcoded one-by-one), no data model or @Input changed by introducing them.
  readonly businessTypeOptions: { id: number; label: string; showGender?: boolean }[] = [
    { id: 1, label: 'Sole Proprietorship', showGender: true },
    { id: 2, label: 'One Person Corporation', showGender: true },
    { id: 3, label: 'Partnership' },
    { id: 4, label: 'Corporation' },
    { id: 5, label: 'Cooperative' },
  ];

  readonly applicationTypeOptions = [
    { id: 1, label: 'New' },
    { id: 2, label: 'Renewal' },
    { id: 3, label: 'Additional' },
  ];

  readonly paymentScheduleOptions = [
    { id: 1, label: 'Annually' },
    { id: 2, label: 'Bi-annually' },
    { id: 3, label: 'Quarterly' },
  ];

  readonly businessActivityOptions = [
    { id: 1, label: 'Main Office' },
    { id: 2, label: 'Branch Office' },
    { id: 3, label: 'Admin Office Only' },
    { id: 4, label: 'Warehouse' },
    { id: 5, label: 'Others' },
  ];

  readonly lineOfBusinessColumns = [
    'Line of Business',
    'PSIC Code (if Available)',
    'Capital (if new, for monitoring purposes only)',
    "Last year's Essential Gross Sales/Receipts (if renewal)",
    "Last year's Non-Essential Gross Sales/Receipts (if renewal)",
  ];

  // Five blank rows, matching the original table exactly (no data was ever bound here).
  readonly lineOfBusinessRows = [0, 1, 2, 3, 4];

  constructor() { }
}
