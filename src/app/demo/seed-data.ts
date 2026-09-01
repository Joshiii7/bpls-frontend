import { ApplicationRecord, DemoDatabase, DemoUser, NotificationRecord, ScheduleRecord } from './models';
import { formatDate, genUuid, placeholderImage } from './mock-utils';

// Admin account, signed into at /admin/login. Its numeric role (1) sends the
// post-login redirect to the admin dashboard. The applicant routes also accept
// the 'admin' role, so this account can additionally walk through the
// business-owner experience without needing to switch accounts.
export const DEMO_USER: DemoUser = {
  id: 1,
  uuid: 'demo-admin-user',
  password: 'admin',
  role: 1,
  role_name: 'admin',
  first_name: 'Admin',
  middle_name: 'Q',
  last_name: 'Cabrera',
  suffix: '',
  number: '+63 917 234 5678',
  email: 'admin@gmail.com',
  signature: placeholderImage('Signature on file', '#ffffff', '#1d4ed8'),
};

// Regular business-owner account, signed into from the homepage hero. Kept
// separate from the admin account above so the two sign-in experiences (and
// their localStorage session state) never overlap.
export const DEMO_BUSINESS_USER: DemoUser = {
  id: 2,
  uuid: 'demo-business-user',
  password: 'user',
  role: 2,
  role_name: 'business_owner',
  first_name: 'Juan',
  middle_name: 'D',
  last_name: 'Dela Cruz',
  suffix: '',
  number: '+63 917 555 0100',
  email: 'user@gmail.com',
  signature: placeholderImage('Signature on file', '#ffffff', '#1d4ed8'),
};

export const BUSINESS_TYPES: Record<number, string> = {
  1: 'Sole Proprietorship',
  2: 'One Person Corporation',
  3: 'Partnership',
  4: 'Corporation',
  5: 'Cooperative',
};

const DEPARTMENTS = [
  'Business Permits and Licensing Office',
  'Bureau of Fire Protection',
  'City Health Office',
  'City Engineering Office (Zoning)',
  'Barangay Office',
];

function historyFor(status: 'Draft' | 'Pending' | 'Approved' | 'Declined', created: Date, daysAgo: number): ApplicationRecord['history'] {
  const submittedDate = formatDate(created);
  if (status === 'Draft') {
    return [{ status: 'Draft', date: submittedDate, note: 'Application saved as a draft. Not yet submitted for review.' }];
  }
  const entries: ApplicationRecord['history'] = [
    { status: 'Submitted', date: submittedDate, note: 'Application submitted and received by the permitting office.' },
  ];
  if (daysAgo > 0) {
    const underReview = new Date(created);
    underReview.setDate(underReview.getDate() + 1);
    entries.push({ status: 'Under Review', date: formatDate(underReview), note: 'Being reviewed by the concerned departments.' });
  }
  if (status === 'Approved') {
    const approvedDate = new Date(created);
    approvedDate.setDate(approvedDate.getDate() + Math.max(daysAgo - 1, 1));
    entries.push({ status: 'Approved', date: formatDate(approvedDate), note: 'All departments have approved the application.' });
  }
  if (status === 'Declined') {
    const declinedDate = new Date(created);
    declinedDate.setDate(declinedDate.getDate() + Math.max(daysAgo - 1, 1));
    entries.push({ status: 'Declined', date: formatDate(declinedDate), note: 'One or more departments did not approve the application. See remarks for details.' });
  }
  return entries;
}

function departmentsFor(status: 'Pending' | 'Approved' | 'Declined'): ApplicationRecord['departments'] {
  if (status === 'Pending') {
    return DEPARTMENTS.map((department, i) => ({
      department,
      status: i === 0 ? 'Approved' : i === 1 ? 'Pending' : 'Pending',
      notes: i === 0 ? 'Complete and in order.' : null,
    }));
  }
  if (status === 'Approved') {
    return DEPARTMENTS.map(department => ({
      department,
      status: 'Approved' as const,
      notes: 'Complete and in order.',
    }));
  }
  return DEPARTMENTS.map((department, i) => ({
    department,
    status: i === DEPARTMENTS.length - 1 ? 'Declined' : 'Approved',
    notes: i === DEPARTMENTS.length - 1 ? 'Zoning classification does not match declared business activity.' : 'Complete and in order.',
  }));
}

interface SeedSpec {
  business_name: string;
  franchise_name: string;
  owner_first: string;
  owner_middle: string;
  owner_last: string;
  business_type_id: number;
  application_type: 'New' | 'Renewal';
  status: 'Pending' | 'Approved' | 'Declined';
  business_activity: string;
  barangay: string;
  daysAgo: number;
  documentLabel: string;
  user_id: number | null;
}

// user_id links a handful of these seed applications to the demo business-owner
// account (id 2) so signing in as user@gmail.com shows real, owned applications
// with a mix of statuses. The rest belong to other (fictional) business owners
// who don't have a login account, the way a real permitting office would have
// far more applicants than staff test accounts.
const SPECS: SeedSpec[] = [
  { business_name: 'Mangagoy Hardware & Construction Supply', franchise_name: '', owner_first: 'Ramon', owner_middle: 'P', owner_last: 'Salcedo', business_type_id: 1, application_type: 'New', status: 'Pending', business_activity: 'Main Office', barangay: 'Mangagoy', daysAgo: 2, documentLabel: 'Hardware Store', user_id: 2 },
  { business_name: 'Poblacion Fresh Mart', franchise_name: 'FreshMart PH', owner_first: 'Liza', owner_middle: 'D', owner_last: 'Ronquillo', business_type_id: 4, application_type: 'Renewal', status: 'Pending', business_activity: 'Main Office', barangay: 'Poblacion', daysAgo: 5, documentLabel: 'Grocery Store', user_id: null },
  { business_name: 'Bislig Bay Eatery', franchise_name: '', owner_first: 'Noel', owner_middle: 'A', owner_last: 'Tabares', business_type_id: 1, application_type: 'New', status: 'Pending', business_activity: 'Main Office', barangay: 'Lawigan', daysAgo: 9, documentLabel: 'Restaurant', user_id: null },
  { business_name: 'Mone Internet & Print Hub', franchise_name: '', owner_first: 'Cristy', owner_middle: 'L', owner_last: 'Barredo', business_type_id: 1, application_type: 'New', status: 'Approved', business_activity: 'Main Office', barangay: 'Mone', daysAgo: 21, documentLabel: 'Internet Cafe', user_id: 2 },
  { business_name: 'San Antonio Auto Repair Shop', franchise_name: '', owner_first: 'Danilo', owner_middle: 'C', owner_last: 'Fernandez', business_type_id: 3, application_type: 'Renewal', status: 'Approved', business_activity: 'Main Office', barangay: 'San Antonio', daysAgo: 30, documentLabel: 'Auto Repair Shop', user_id: null },
  { business_name: 'Golden Harvest Rice Trading Corp.', franchise_name: '', owner_first: 'Ester', owner_middle: 'V', owner_last: 'Macalino', business_type_id: 4, application_type: 'New', status: 'Approved', business_activity: 'Warehouse', barangay: 'Mangagoy', daysAgo: 14, documentLabel: 'Rice Trading', user_id: null },
  { business_name: 'Bislig Coastal Divers Cooperative', franchise_name: '', owner_first: 'Marlon', owner_middle: 'T', owner_last: 'Yparraguirre', business_type_id: 5, application_type: 'New', status: 'Declined', business_activity: 'Branch Office', barangay: 'Poblacion', daysAgo: 18, documentLabel: 'Dive Shop', user_id: 2 },
  { business_name: 'Sunrise Bakeshop', franchise_name: '', owner_first: 'Teresita', owner_middle: 'N', owner_last: 'Onate', business_type_id: 1, application_type: 'Renewal', status: 'Declined', business_activity: 'Main Office', barangay: 'San Antonio', daysAgo: 25, documentLabel: 'Bakery', user_id: null },
];

function buildApplication(spec: SeedSpec, index: number): ApplicationRecord {
  const id = 1000 + index;
  const uuid = genUuid();
  const created = new Date();
  created.setDate(created.getDate() - spec.daysAgo);

  const address = {
    province: 'Surigao del Sur',
    city: 'Bislig City',
    barangay: spec.barangay,
    zip_code: '8311',
    street: `${spec.barangay} Access Road`,
    house_no: `${10 + index}`,
    building_name: '',
    lot_no: '',
    block_no: '',
    subdivision: '',
  };

  return {
    id,
    uuid,
    user_id: spec.user_id,
    business_name: spec.business_name,
    franchise_name: spec.franchise_name,
    tracking_number: `BPLS-${created.getFullYear()}-${String(id).padStart(6, '0')}`,
    business_id_number: `BIZ-${String(id).padStart(6, '0')}`,
    business_type: BUSINESS_TYPES[spec.business_type_id],
    business_type_id: spec.business_type_id,
    application_type: spec.application_type,
    owner: `${spec.owner_first} ${spec.owner_last}`,
    status: spec.status,
    application_status: spec.status,
    permit_schedule: spec.application_type === 'Renewal' ? 'Business Permit Renewal Period' : 'New Business Permit Period',
    permit_schedule_other: null,
    is_draft: false,
    created_at: formatDate(created),
    updated_at: formatDate(created),
    days_pending: spec.status === 'Pending' ? spec.daysAgo : 0,
    history: historyFor(spec.status, created, spec.daysAgo),
    transactions: [
      {
        transaction_type: spec.application_type === 'New' ? 'new' : 'renew',
        register_business: {
          dti_number: `DTI-${2020 + (index % 5)}-${100000 + id}`,
          dti_registration_date: formatDate(new Date(created.getFullYear() - 1, 0, 15)),
          tin_number: `${900 + index}-${111 + index}-${222 + index}-000`,
          first_name: spec.owner_first,
          middle_name: spec.owner_middle,
          last_name: spec.owner_last,
          suffix: '',
          email: `${spec.owner_first.toLowerCase()}.${spec.owner_last.toLowerCase()}@example.com`,
          number: `+63 9${(10 + index).toString().padStart(2, '0')} ${(300 + index * 7).toString().padStart(3, '0')} ${(4000 + index).toString().padStart(4, '0')}`,
          payment_type: index % 3 === 0 ? 'Annual' : index % 3 === 1 ? 'Quarterly' : 'Bi-Annual',
          business_type_id: spec.business_type_id,
          gender: index % 2 === 0 ? 'Male' : 'Female',
          signature: placeholderImage('Applicant Signature', '#ffffff', '#1d4ed8'),
          business_images: [
            { type: 'Proof of Registration (DTI/SEC/CDA)', file_path: placeholderImage('DTI Certificate') },
            { type: 'Authority to Use of Place of Business', file_path: placeholderImage('Lease Contract') },
            { type: 'Fire Safety Inspection Certificate', file_path: placeholderImage('FSIC') },
            { type: 'Sanitary Permit / Health Clearance', file_path: placeholderImage('Sanitary Permit') },
            { type: 'Environmental Clearance / Barangay Clearance', file_path: placeholderImage('Barangay Clearance') },
            { type: 'Occupancy Permit', file_path: placeholderImage(spec.documentLabel) },
          ],
        },
        business_operation: {
          business_area: 40 + index * 8,
          total_floor_area: 60 + index * 10,
          no_employee: 3 + (index % 5),
          total_male: 1 + (index % 3),
          total_female: 2 + (index % 2),
          no_van: index % 3 === 0 ? 1 : 0,
          no_motor: index % 2 === 0 ? 2 : 1,
          business_activity: spec.business_activity,
          latitude: 8.2175 + (index * 0.003 - 0.01),
          longitude: 126.3162 + (index * 0.003 - 0.01),
        },
        business_addresses: [
          { ...address, type: 'registered' },
          { ...address, type: 'operation' },
        ],
      },
    ],
    departments: departmentsFor(spec.status),
  };
}

// A single in-progress draft for the demo business-owner account, so the
// "continue a saved draft" flow has something real to demonstrate right away.
function buildDraftApplication(index: number): ApplicationRecord {
  const id = 1000 + index;
  const uuid = genUuid();
  const created = new Date();
  created.setDate(created.getDate() - 1);

  const address = {
    province: 'Surigao del Sur',
    city: 'Bislig City',
    barangay: 'Comawas',
    zip_code: '8311',
    street: 'Comawas Access Road',
    house_no: '25',
    building_name: '',
    lot_no: '',
    block_no: '',
    subdivision: '',
  };

  return {
    id,
    uuid,
    user_id: DEMO_BUSINESS_USER.id,
    business_name: 'Dela Cruz Sari-Sari Store',
    franchise_name: '',
    tracking_number: `BPLS-${created.getFullYear()}-${String(id).padStart(6, '0')}`,
    business_id_number: `BIZ-${String(id).padStart(6, '0')}`,
    business_type: BUSINESS_TYPES[1],
    business_type_id: 1,
    application_type: 'New',
    owner: `${DEMO_BUSINESS_USER.first_name} ${DEMO_BUSINESS_USER.last_name}`,
    status: 'Draft',
    application_status: 'Draft',
    permit_schedule: 'New Business Permit Period',
    permit_schedule_other: null,
    is_draft: true,
    created_at: formatDate(created),
    updated_at: formatDate(created),
    days_pending: 0,
    history: historyFor('Draft', created, 0),
    transactions: [
      {
        transaction_type: 'new',
        register_business: {
          dti_number: '',
          dti_registration_date: '',
          tin_number: '',
          first_name: DEMO_BUSINESS_USER.first_name,
          middle_name: DEMO_BUSINESS_USER.middle_name,
          last_name: DEMO_BUSINESS_USER.last_name,
          suffix: '',
          email: DEMO_BUSINESS_USER.email,
          number: DEMO_BUSINESS_USER.number,
          payment_type: 'Annual',
          business_type_id: 1,
          gender: 'Male',
          signature: null,
          business_images: [],
        },
        business_operation: {
          business_area: '',
          total_floor_area: '',
          no_employee: 0,
          total_male: 0,
          total_female: 0,
          no_van: '',
          no_motor: '',
          business_activity: 'Main Office',
          latitude: 0,
          longitude: 0,
        },
        business_addresses: [
          { ...address, type: 'registered' },
          { ...address, type: 'operation' },
        ],
      },
    ],
    departments: [],
  };
}

export function buildSeedDatabase(): DemoDatabase {
  const applications = [...SPECS.map(buildApplication), buildDraftApplication(SPECS.length)];

  const schedules: ScheduleRecord[] = [
    { id: 1, schedule_type: 'Business Permit Renewal Period', schedule_type_other: null, start_date: '2026-01-05', end_date: '2026-01-31', is_active: true },
    { id: 2, schedule_type: 'Others', schedule_type_other: 'Barangay Clearance Validation', start_date: '2026-02-10', end_date: '2026-02-20', is_active: true },
    { id: 3, schedule_type: 'Others', schedule_type_other: 'Fire Safety Inspection Week', start_date: '2026-03-02', end_date: '2026-03-06', is_active: false },
  ];

  const notifications: NotificationRecord[] = [
    { id: 1, title: 'Application Approved', message: `"${SPECS[3].business_name}" has been approved by all departments.`, created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), is_read: false },
    { id: 2, title: 'New Application Submitted', message: `"${SPECS[0].business_name}" was submitted for review.`, created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), is_read: false },
    { id: 3, title: 'Application Declined', message: `"${SPECS[6].business_name}" was declined. See remarks for details.`, created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), is_read: true },
    { id: 4, title: 'Reminder', message: 'Business Permit Renewal Period opens January 5.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), is_read: true },
  ];

  return {
    // Bumped from 1: ApplicationRecord gained user_id/is_draft/history/updated_at.
    // Bumped from 2: ApplicationRecord gained permit_schedule/permit_schedule_other.
    // Bumped from 3: permit_schedule label text changed (New Application to
    // New Business Permit Period, Renewal Period to Business Permit Renewal Period).
    // Bumping forces any pre-existing localStorage without those fields to reseed
    // instead of crashing on the first read that assumes they exist.
    version: 4,
    users: [DEMO_USER, DEMO_BUSINESS_USER],
    applications,
    schedules,
    notifications,
    meta: {
      nextApplicationId: 1000 + SPECS.length + 1,
      nextScheduleId: schedules.length + 1,
      nextNotificationId: notifications.length + 1,
    },
  };
}
