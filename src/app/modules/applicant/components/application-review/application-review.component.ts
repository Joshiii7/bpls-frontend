import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-application-review',
  templateUrl: './application-review.component.html',
  styleUrls: ['./application-review.component.css']
})
export class ApplicationReviewComponent implements OnChanges {
  @Input() applicationData: any;

  is_new: number = 0;
  payment_type: number = 0;

  unifiedData: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['applicationData']) {
      const appType = this.applicationData.applicationType?.toLowerCase().trim();
      const payOption = this.applicationData.paymentOption?.toLowerCase().trim();

      this.is_new = appType === 'new' ? 1 : appType === 'renew' ? 2 : 0;

      this.payment_type =
        payOption === 'annual'
          ? 1
          : payOption === 'bi-annual'
          ? 2
          : payOption === 'quarterly'
          ? 3
          : 0;
      
      const businessInfo = this.applicationData.businessInfo || {};
      const businessOperation = this.applicationData.businessOperation || {};
      const location = this.applicationData.location || {};

      const genderOptions = ['Male', 'Female'];
      const organizationOptions = [
        'Sole Proprietorship',
        'One Person Corporation',
        'Partnership',
        'Corporation',
        'Cooperative'
      ];
      const businessActivityOptions = [
        'Main Office',
        'Branch Office',
        'Admin Office Only',
        'Warehouse',
        'Others'
      ];

      this.unifiedData = {
        // ----------------------
        // Business Information
        // ----------------------
        businessName: businessInfo.businessName || '',
        tradeName: businessInfo.tradeName || '',
        registrationNumber: businessInfo.registrationNumber || '',
        registrationDate: businessInfo.registrationDate || '',
        tin: businessInfo.tin || '',
        organizationType: organizationOptions.indexOf(businessInfo.organizationType) + 1 || 0,
        gender: genderOptions.indexOf(businessInfo.gender) + 1 || 0,

        // Owner's Information
        givenName: businessInfo.givenName || '',
        middleName: businessInfo.middleName || '',
        surname: businessInfo.surname || '',
        suffix: businessInfo.suffix || '',
        contactNumber: businessInfo.contactNumber || '',
        email: businessInfo.email || '',

        // Main Office Primary Address
        province: businessInfo.province || '',
        city: businessInfo.city || '',
        barangay: businessInfo.barangay || '',
        zipCode: businessInfo.zipCode || '',

        // Main Office Optional Address
        streetAddress: businessInfo.streetAddress || '',
        houseNumber: businessInfo.houseNumber || '',
        buildingName: businessInfo.buildingName || '',
        lotNumber: businessInfo.lotNumber || '',
        blockNumber: businessInfo.blockNumber || '',
        subdivision: businessInfo.subdivision || '',

        // ----------------------
        // Business Operation
        // ----------------------
        businessActivity: businessActivityOptions.indexOf(businessOperation.businessActivity) + 1 || 0,
        businessArea: businessOperation.businessArea || '',
        totalFloorArea: businessOperation.totalFloorArea || '',
        employeesWithinLGU: businessOperation.employeesWithinLGU || '',

        // Total number of employees
        totalMale: businessOperation.totalEmployees?.male || 0,
        totalFemale: businessOperation.totalEmployees?.female || 0,
        totalEmployee: (businessOperation.totalEmployees?.male || 0) + (businessOperation.totalEmployees?.female || 0),

        // Number of delivery vehicles
        no_van: businessOperation.deliveryVehicles?.vanOrTruck || '',
        no_motor: businessOperation.deliveryVehicles?.motorcycle || '',

        // Business Operation Address
        operationalProvince: businessOperation.province || 'Surigao del Sur',
        operationalCity: businessOperation.city || 'Bislig City',
        operationalBarangay: businessOperation.barangay || '',
        operationalZipCode: businessOperation.zipCode || '',
        operationalStreet: businessOperation.streetAddress || '',
        operationalHouseNumber: businessOperation.houseNumber || '',
        operationalBuildingName: businessOperation.buildingName || '',
        operationalLotNumber: businessOperation.lotNumber || '',
        operationalBlockNumber: businessOperation.blockNumber || '',
        operationalSubdivision: businessOperation.subdivision || '',

        // Signature/Image
        image: businessOperation.signatureImage || ''
      };

    }
  }
}
