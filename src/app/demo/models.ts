// Shape of the local demo "database" persisted to localStorage.
// This is the single source of truth the mock backend reads from and writes to.

export interface DemoUser {
  id: number;
  uuid: string;
  password: string;
  role: number; // 1 = admin, 2 = business_owner (matches numeric role used across the app)
  role_name: string; // matches the role_name checked by route guards ('admin' | 'business_owner')
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  number: string;
  email: string;
  signature: string | null;
}

export interface BusinessAddress {
  type: 'registered' | 'operation';
  province: string;
  city: string;
  barangay: string;
  zip_code: string;
  street: string;
  house_no: string;
  building_name: string;
  lot_no: string;
  block_no: string;
  subdivision: string;
}

export interface BusinessImage {
  type: string;
  file_path: string;
}

export interface RegisterBusiness {
  dti_number: string;
  dti_registration_date: string;
  tin_number: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  email: string;
  number: string;
  payment_type: 'Annual' | 'Bi-Annual' | 'Quarterly';
  business_type_id: number;
  gender: 'Male' | 'Female';
  signature: string | null;
  business_images: BusinessImage[];
}

export interface BusinessOperation {
  business_area: number | string;
  total_floor_area: number | string;
  no_employee: number;
  total_male: number;
  total_female: number;
  no_van: number | string;
  no_motor: number | string;
  business_activity: string;
  latitude: number;
  longitude: number;
}

export interface DepartmentApproval {
  department: string;
  status: 'Pending' | 'Approved' | 'Declined';
  notes: string | null;
}

export interface Transaction {
  transaction_type: 'new' | 'renew';
  register_business: RegisterBusiness;
  business_operation: BusinessOperation;
  business_addresses: BusinessAddress[];
}

export interface ApplicationHistoryEntry {
  status: string;
  date: string;
  note: string;
}

export interface ApplicationRecord {
  id: number;
  uuid: string;
  user_id: number | null;
  business_name: string;
  franchise_name: string;
  tracking_number: string;
  business_id_number: string;
  business_type: string;
  business_type_id: number;
  application_type: 'New' | 'Renewal';
  owner: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Declined';
  application_status: 'Draft' | 'Pending' | 'Approved' | 'Declined';
  // Which processing window or purpose this application falls under. This is
  // separate from application_type (the New/Renewal transaction mechanics):
  // it is what the applicant tells the office they are filing for, so
  // "Others" can capture purposes (a business name change, for example) that
  // are not a plain new filing or renewal.
  permit_schedule: 'New Business Permit Period' | 'Business Permit Renewal Period' | 'Amendment / Update' | 'Others';
  permit_schedule_other: string | null;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
  days_pending: number;
  transactions: Transaction[];
  departments: DepartmentApproval[];
  history: ApplicationHistoryEntry[];
}

export interface ScheduleRecord {
  id: number;
  schedule_type: string;
  // Set only when schedule_type is "Others": what the admin typed to describe
  // a schedule that doesn't fit the standard new/renewal periods.
  schedule_type_other: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface NotificationRecord {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface DemoDatabase {
  version: number;
  users: DemoUser[];
  applications: ApplicationRecord[];
  schedules: ScheduleRecord[];
  notifications: NotificationRecord[];
  meta: {
    nextApplicationId: number;
    nextScheduleId: number;
    nextNotificationId: number;
  };
}
