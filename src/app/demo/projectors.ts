import { ApplicationRecord } from './models';

// Shared response shapes built from a single canonical ApplicationRecord. Different screens
// in the app were written against different historical API contracts (nested "transactions"
// vs. a flattened "permit" object vs. a list row), these functions keep that one record as
// the source of truth and just re-shape it per consumer.

export function toListRow(app: ApplicationRecord) {
  return {
    uuid: app.uuid,
    id: app.id,
    tracking_number: app.tracking_number,
    business_name: app.business_name,
    business_type: app.business_type,
    business_type_id: app.business_type_id,
    application_type: app.application_type,
    owner: app.owner,
    status: app.status,
    application_status: app.application_status,
    permit_schedule: app.permit_schedule,
    permit_schedule_other: app.permit_schedule_other,
    is_draft: app.is_draft,
    created_at: app.created_at,
    updated_at: app.updated_at,
    date_filed: app.created_at,
  };
}

export function toDetailShape(app: ApplicationRecord) {
  // Matches the shape read by applicant-application-details / permit-review-details
  // (response.transactions[0].register_business / .business_operation / .business_addresses).
  // status/application_status/departments are additionally read by
  // applicant-application-details so a business owner can see their own application's
  // outcome (and, if declined, which department and why) instead of just a read-only form.
  return {
    id: app.id,
    uuid: app.uuid,
    business_name: app.business_name,
    franchise_name: app.franchise_name,
    tracking_number: app.tracking_number,
    business_id_number: app.business_id_number,
    created_at: app.created_at,
    updated_at: app.updated_at,
    status: app.status,
    application_status: app.application_status,
    permit_schedule: app.permit_schedule,
    permit_schedule_other: app.permit_schedule_other,
    is_draft: app.is_draft,
    departments: app.departments,
    history: app.history,
    transactions: app.transactions,
  };
}

const PAYMENT_TYPE_MAP: Record<string, number> = { annual: 1, 'bi-annual': 2, quarterly: 3 };
const ACTIVITY_MAP: Record<string, number> = {
  'main office': 1,
  'branch office': 2,
  'admin office only': 3,
  warehouse: 4,
  others: 5,
};

export function toFlatPermitShape(app: ApplicationRecord) {
  // Matches the legacy flat "permit" contract read by permit-view-application-details.component.ts.
  // status/departments are additionally read there so the admin sees the same clear
  // status/guidance context already shown on the newer review-details screen.
  const tx = app.transactions[0];
  const reg = tx.register_business;
  const op = tx.business_operation;
  const registered = tx.business_addresses.find(a => a.type === 'registered')!;
  const operation = tx.business_addresses.find(a => a.type === 'operation')!;

  return {
    permit: {
      businessID: app.id,
      businessName: app.business_name,
      status: app.status,
      applicationStatus: app.application_status,
      departments: app.departments,
      franchiseName: app.franchise_name,
      dtiNumber: reg.dti_number,
      dtiRegistrationDate: reg.dti_registration_date,
      tinNumber: reg.tin_number,
      surname: reg.last_name,
      givenname: reg.first_name,
      middlename: reg.middle_name,
      suffix: reg.suffix,
      email: reg.email,
      number: reg.number,
      businessArea: op.business_area,
      totalMale: op.total_male,
      totalFemale: op.total_female,
      totalEmployee: op.no_employee,
      businessActivity: ACTIVITY_MAP[op.business_activity.toLowerCase()] ?? 0,
      paymentType: PAYMENT_TYPE_MAP[reg.payment_type.toLowerCase()] ?? 0,
      businessType: reg.business_type_id,
      gender: reg.gender,
      isNew: app.application_type,
      trackingNumber: app.tracking_number,
      businessIdNumber: app.business_id_number,
      created_at: app.created_at,
      lat: op.latitude,
      lng: op.longitude,
      signature: reg.signature || '',
      barangay: registered.barangay,
      city: registered.city,
      province: registered.province,
      zipCode: registered.zip_code,
      street: registered.street,
      houseNo: registered.house_no,
      buildingName: registered.building_name,
      lotNo: registered.lot_no,
      blockNo: registered.block_no,
      subdivision: registered.subdivision,
      operationalBarangay: operation.barangay,
      operationalCity: operation.city,
      operationalProvince: operation.province,
      operationalZipCode: operation.zip_code,
      operationalStreet: operation.street,
      operationalHouseNo: operation.house_no,
      operationalBuildingName: operation.building_name,
      operationalLotNo: operation.lot_no,
      operationalBlockNo: operation.block_no,
      operationalSubdivision: operation.subdivision,
      images: reg.business_images,
    },
  };
}
