import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemoDbService } from '../demo-db.service';
import { ApplicationRecord, BusinessImage } from '../models';
import { fail, formatDate, formDataToObject, genUuid, getCurrentUser, getRawQueryParam, ok } from '../mock-utils';
import { toDetailShape, toListRow } from '../projectors';

export function handleGetApplications(_req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const currentUser = getCurrentUser(db);
  const own = db.data.applications.filter(a => a.user_id === currentUser.id);
  return ok(own.map(toListRow));
}

export function handleGetApplicationDetail(_req: HttpRequest<any>, db: DemoDbService, params: Record<string, string>): Observable<any> {
  const app = db.data.applications.find(a => a.uuid === params['uuid']);
  if (!app) return ok(null, 404);

  const currentUser = getCurrentUser(db);
  if (app.user_id !== currentUser.id && currentUser.role_name !== 'admin') {
    return fail(403, 'You do not have access to this application.');
  }

  return ok(toDetailShape(app));
}

export function handleGetUserProfile(_req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const user = getCurrentUser(db);
  return ok({
    id: user.id,
    first_name: user.first_name,
    middle_name: user.middle_name,
    last_name: user.last_name,
    suffix: user.suffix,
    number: user.number,
    email: user.email,
    signature: user.signature,
  });
}

export function handlePatchUserProfile(req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const user = getCurrentUser(db);
  const body = req.body || {};

  user.first_name = body.first_name ?? user.first_name;
  user.middle_name = body.middle_name ?? user.middle_name;
  user.last_name = body.last_name ?? user.last_name;
  user.suffix = body.suffix ?? user.suffix;
  user.number = body.number ?? user.number;
  user.email = body.email ?? user.email;
  user.signature = body.signature ?? user.signature;

  db.save();
  return ok({ id: user.id, ...body });
}

export function handleGetNotifications(_req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  return ok({ data: db.data.notifications });
}

export function handleMarkAllNotificationsRead(_req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  db.data.notifications.forEach(n => (n.is_read = true));
  db.save();
  return ok({ data: db.data.notifications });
}

const TAKEN_NUMBERS = new Set<string>();

export function handleCheckPhone(req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const number = getRawQueryParam(req.urlWithParams, 'number').trim();
  const ownNumber = getCurrentUser(db).number;

  if (TAKEN_NUMBERS.size === 0) {
    // Seed a couple of already-registered numbers (from existing applications) once, so the
    // "this phone number is already registered" validation has something real to demonstrate.
    db.data.applications.slice(0, 2).forEach(a => TAKEN_NUMBERS.add(a.transactions[0].register_business.number));
  }

  const exists = number !== ownNumber && TAKEN_NUMBERS.has(number);
  return ok({ exists });
}

const ORGANIZATION_TYPE_IDS: Record<string, number> = {
  'Sole Proprietorship': 1,
  'One Person Corporation': 2,
  Partnership: 3,
  Corporation: 4,
  Cooperative: 5,
};

const PAYMENT_OPTION_LABELS: Record<string, ApplicationRecord['transactions'][0]['register_business']['payment_type']> = {
  annual: 'Annual',
  'bi-annual': 'Bi-Annual',
  quarterly: 'Quarterly',
};

const PERMIT_SCHEDULE_LABELS: Record<string, ApplicationRecord['permit_schedule']> = {
  new: 'New Business Permit Period',
  renewal: 'Business Permit Renewal Period',
  amendment: 'Amendment / Update',
  others: 'Others',
};

function resolvePermitSchedule(parsed: any): { permit_schedule: ApplicationRecord['permit_schedule']; permit_schedule_other: string | null } {
  const raw = parsed.permitSchedule || {};
  const permit_schedule = PERMIT_SCHEDULE_LABELS[raw.scheduleType] || 'New Business Permit Period';
  const permit_schedule_other = permit_schedule === 'Others' ? (raw.scheduleOther || '').trim() || null : null;
  return { permit_schedule, permit_schedule_other };
}

const DEPARTMENT_NAMES = [
  'Business Permits and Licensing Office',
  'Bureau of Fire Protection',
  'City Health Office',
  'City Engineering Office (Zoning)',
  'Barangay Office',
];

function buildTransactionFromPayload(parsed: any, user: ReturnType<typeof getCurrentUser>) {
  const businessInfo = parsed.businessInfo || {};
  const businessOperation = parsed.businessOperation || {};
  const documents: any[] = Array.isArray(parsed.documents) ? parsed.documents : Object.values(parsed.documents || {});

  const businessTypeId = ORGANIZATION_TYPE_IDS[businessInfo.organizationType] || 1;
  const totalMale = Number(businessOperation?.totalEmployees?.male || 0);
  const totalFemale = Number(businessOperation?.totalEmployees?.female || 0);

  const businessImages: BusinessImage[] = documents
    .filter(doc => doc && doc.previewUrl)
    .map(doc => ({ type: doc.title, file_path: doc.previewUrl }));

  return {
    businessInfo,
    businessTypeId,
    transaction: {
      transaction_type: parsed.applicationType === 'renew' ? 'renew' as const : 'new' as const,
      register_business: {
        dti_number: businessInfo.registrationNumber || '',
        dti_registration_date: businessInfo.registrationDate || '',
        tin_number: businessInfo.tin || '',
        first_name: businessInfo.givenName || user.first_name,
        middle_name: businessInfo.middleName || user.middle_name,
        last_name: businessInfo.surname || user.last_name,
        suffix: businessInfo.suffix || user.suffix,
        email: businessInfo.email || user.email,
        number: businessInfo.contactNumber || user.number,
        payment_type: PAYMENT_OPTION_LABELS[parsed.paymentOption] || 'Annual',
        business_type_id: businessTypeId,
        gender: businessInfo.gender === 'Female' ? 'Female' as const : 'Male' as const,
        signature: user.signature,
        business_images: businessImages,
      },
      business_operation: {
        business_area: businessOperation.businessArea || 0,
        total_floor_area: businessOperation.totalFloorArea || 0,
        no_employee: totalMale + totalFemale,
        total_male: totalMale,
        total_female: totalFemale,
        no_van: Number(businessOperation?.deliveryVehicles?.vanOrTruck) || 0,
        no_motor: Number(businessOperation?.deliveryVehicles?.motorcycle) || 0,
        business_activity: businessOperation.businessActivity || 'Main Office',
        latitude: parsed.location?.lat ? Number(parsed.location.lat) : 8.2175,
        longitude: parsed.location?.lng ? Number(parsed.location.lng) : 126.3162,
      },
      business_addresses: [
        {
          type: 'registered' as const,
          province: businessInfo.province || 'Surigao del Sur',
          city: businessInfo.city || 'Bislig City',
          barangay: businessInfo.barangay || '',
          zip_code: businessInfo.zipCode || '',
          street: businessInfo.streetAddress || '',
          house_no: businessInfo.houseNumber || '',
          building_name: businessInfo.buildingName || '',
          lot_no: businessInfo.lotNumber || '',
          block_no: businessInfo.blockNumber || '',
          subdivision: businessInfo.subdivision || '',
        },
        {
          type: 'operation' as const,
          province: businessOperation.province || 'Surigao del Sur',
          city: businessOperation.city || 'Bislig City',
          barangay: businessOperation.barangay || '',
          zip_code: businessOperation.zipCode || '',
          street: businessOperation.streetAddress || '',
          house_no: businessOperation.houseNumber || '',
          building_name: businessOperation.buildingName || '',
          lot_no: businessOperation.lotNumber || '',
          block_no: businessOperation.blockNumber || '',
          subdivision: businessOperation.subdivision || '',
        },
      ],
    },
  };
}

export function handleSubmitApplication(req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const parsed = req.body instanceof FormData ? formDataToObject(req.body) : req.body;
  const isDraft = parsed.isDraft === 'true' || parsed.isDraft === true;

  const user = getCurrentUser(db);
  const id = db.data.meta.nextApplicationId++;
  const uuid = genUuid();
  const now = formatDate();

  const { businessInfo, businessTypeId, transaction } = buildTransactionFromPayload(parsed, user);
  const { permit_schedule, permit_schedule_other } = resolvePermitSchedule(parsed);

  const record: ApplicationRecord = {
    id,
    uuid,
    user_id: user.id,
    business_name: businessInfo.businessName || 'Untitled Business',
    franchise_name: businessInfo.tradeName || '',
    tracking_number: `BPLS-${new Date().getFullYear()}-${String(id).padStart(6, '0')}`,
    business_id_number: `BIZ-${String(id).padStart(6, '0')}`,
    business_type: businessInfo.organizationType || 'Sole Proprietorship',
    business_type_id: businessTypeId,
    application_type: parsed.applicationType === 'renew' ? 'Renewal' : 'New',
    owner: `${businessInfo.givenName || user.first_name} ${businessInfo.surname || user.last_name}`,
    status: isDraft ? 'Draft' : 'Pending',
    application_status: isDraft ? 'Draft' : 'Pending',
    permit_schedule,
    permit_schedule_other,
    is_draft: isDraft,
    created_at: now,
    updated_at: now,
    days_pending: 0,
    history: [{
      status: isDraft ? 'Draft' : 'Submitted',
      date: now,
      note: isDraft ? 'Application saved as a draft. Not yet submitted for review.' : 'Application submitted and received by the permitting office.',
    }],
    transactions: [transaction],
    departments: isDraft ? [] : DEPARTMENT_NAMES.map(department => ({ department, status: 'Pending', notes: null })),
  };

  db.data.applications.unshift(record);

  if (!isDraft) {
    db.data.notifications.unshift({
      id: db.data.meta.nextNotificationId++,
      title: 'Application Submitted',
      message: `"${record.business_name}" was submitted and is awaiting review.`,
      created_at: new Date().toISOString(),
      is_read: false,
    });
  }

  db.save();

  return ok({
    id,
    uuid,
    is_draft: isDraft,
    tracking_number: record.tracking_number,
    business_name: record.business_name,
    application_type: record.application_type,
    status: record.status,
    created_at: record.created_at,
    message: isDraft ? 'Your application has been saved as a draft.' : 'Application submitted successfully.',
  }, 201);
}

export function handleUpdateApplication(req: HttpRequest<any>, db: DemoDbService, params: Record<string, string>): Observable<any> {
  const app = db.data.applications.find(a => a.uuid === params['uuid']);
  if (!app) return fail(404, 'Application not found.');

  const user = getCurrentUser(db);
  if (app.user_id !== user.id) return fail(403, 'You do not have access to this application.');
  if (!app.is_draft) return fail(400, 'This application has already been submitted and can no longer be edited.');

  const parsed = req.body instanceof FormData ? formDataToObject(req.body) : req.body;
  const isDraft = parsed.isDraft === 'true' || parsed.isDraft === true;
  const now = formatDate();

  const { businessInfo, businessTypeId, transaction } = buildTransactionFromPayload(parsed, user);
  const { permit_schedule, permit_schedule_other } = resolvePermitSchedule(parsed);

  app.business_name = businessInfo.businessName || app.business_name;
  app.franchise_name = businessInfo.tradeName ?? app.franchise_name;
  app.business_type = businessInfo.organizationType || app.business_type;
  app.business_type_id = businessTypeId;
  app.application_type = parsed.applicationType === 'renew' ? 'Renewal' : 'New';
  app.owner = `${businessInfo.givenName || user.first_name} ${businessInfo.surname || user.last_name}`;
  app.status = isDraft ? 'Draft' : 'Pending';
  app.application_status = isDraft ? 'Draft' : 'Pending';
  app.permit_schedule = permit_schedule;
  app.permit_schedule_other = permit_schedule_other;
  app.is_draft = isDraft;
  app.updated_at = now;
  app.transactions = [transaction];
  app.departments = isDraft ? [] : DEPARTMENT_NAMES.map(department => ({ department, status: 'Pending', notes: null }));
  app.history.push({
    status: isDraft ? 'Draft' : 'Submitted',
    date: now,
    note: isDraft ? 'Draft updated.' : 'Application submitted and received by the permitting office.',
  });

  if (!isDraft) {
    db.data.notifications.unshift({
      id: db.data.meta.nextNotificationId++,
      title: 'Application Submitted',
      message: `"${app.business_name}" was submitted and is awaiting review.`,
      created_at: new Date().toISOString(),
      is_read: false,
    });
  }

  db.save();

  return ok({
    id: app.id,
    uuid: app.uuid,
    is_draft: isDraft,
    tracking_number: app.tracking_number,
    business_name: app.business_name,
    application_type: app.application_type,
    status: app.status,
    created_at: app.created_at,
    message: isDraft ? 'Your draft has been updated.' : 'Application submitted successfully.',
  });
}
