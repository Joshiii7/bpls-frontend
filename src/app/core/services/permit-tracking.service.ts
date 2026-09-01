import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DemoDbService } from 'src/app/demo/demo-db.service';

export interface PermitTrackingStep {
  department: string;
  status: 'Pending' | 'Approved' | 'Declined';
  notes: string | null;
}

export interface PermitTrackingResult {
  trackingNumber: string;
  businessName: string;
  franchiseName: string;
  ownerName: string;
  businessType: string;
  applicationType: 'New' | 'Renewal';
  status: 'Pending' | 'Approved' | 'Declined';
  dateSubmitted: string;
  steps: PermitTrackingStep[];
  nextStepMessage: string;
}

// Public, unauthenticated lookup by tracking number. Reads from the same
// application records the admin side manages (DemoDbService.data.applications)
// instead of a separate hardcoded list, and only ever returns the subset of
// fields that are safe to show without signing in: no contact details, no
// uploaded documents, no addresses or coordinates.
//
// Shaped as a service returning an Observable (with a simulated delay, like
// the rest of the mock backend) so a real HTTP-backed implementation could
// replace the body of `track()` later without the tracking page changing at
// all.
@Injectable({
  providedIn: 'root'
})
export class PermitTrackingService {
  constructor(private demoDb: DemoDbService) {}

  track(trackingNumber: string): Observable<PermitTrackingResult | null> {
    const normalized = trackingNumber.trim().toUpperCase();
    const match = this.demoDb.data.applications.find(
      // Drafts haven't been submitted yet, so they aren't publicly trackable.
      application => !application.is_draft && application.tracking_number.toUpperCase() === normalized
    );

    if (!match) {
      return of(null).pipe(delay(500));
    }

    const result: PermitTrackingResult = {
      trackingNumber: match.tracking_number,
      businessName: match.business_name,
      franchiseName: match.franchise_name,
      ownerName: match.owner,
      businessType: match.business_type,
      applicationType: match.application_type,
      status: match.application_status as 'Pending' | 'Approved' | 'Declined',
      dateSubmitted: match.created_at,
      steps: match.departments,
      nextStepMessage: this.buildNextStepMessage(match.application_status as 'Pending' | 'Approved' | 'Declined', match.departments)
    };

    return of(result).pipe(delay(500));
  }

  private buildNextStepMessage(
    status: 'Pending' | 'Approved' | 'Declined',
    steps: PermitTrackingStep[]
  ): string {
    if (status === 'Approved') {
      return 'Your permit has been approved. Sign in to your account to download it.';
    }

    if (status === 'Declined') {
      const declinedStep = steps.find(step => step.status === 'Declined');
      return declinedStep?.notes
        ? `Your application was declined. ${declinedStep.notes}`
        : 'Your application was declined. Contact the permitting office for details.';
    }

    const pendingStep = steps.find(step => step.status === 'Pending');
    return pendingStep
      ? `Currently under review by the ${pendingStep.department}.`
      : 'Your application is being processed.';
  }
}
