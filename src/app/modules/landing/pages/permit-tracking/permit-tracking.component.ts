import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PermitTrackingResult, PermitTrackingService } from 'src/app/core/services/permit-tracking.service';

type SearchState = 'idle' | 'loading' | 'result' | 'not-found' | 'error';

@Component({
  selector: 'app-permit-tracking',
  templateUrl: './permit-tracking.component.html',
  styleUrls: ['./permit-tracking.component.css']
})
export class PermitTrackingComponent implements OnInit, AfterViewChecked {
  form: FormGroup;
  state: SearchState = 'idle';
  result: PermitTrackingResult | null = null;

  @ViewChild('resultRegion') resultRegion?: ElementRef<HTMLElement>;
  private shouldFocusResult = false;

  constructor(
    private fb: FormBuilder,
    private trackingService: PermitTrackingService,
    private route: ActivatedRoute,
  ) {
    document.title = 'BPLS | Track a Permit';

    this.form = this.fb.group({
      trackingNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Coming from a just-submitted application ("Track This Application") already
    // has the tracking number, so look it up right away instead of making the
    // applicant retype it.
    const tracking = this.route.snapshot.queryParamMap.get('tracking');
    if (tracking) {
      this.form.patchValue({ trackingNumber: tracking });
      this.search();
    }
  }

  get trackingNumber() {
    return this.form.get('trackingNumber');
  }

  search(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state = 'loading';
    this.result = null;

    this.trackingService.track(this.trackingNumber?.value).subscribe({
      next: (result) => {
        this.result = result;
        this.state = result ? 'result' : 'not-found';
        this.shouldFocusResult = true;
      },
      error: () => {
        this.state = 'error';
        this.shouldFocusResult = true;
      }
    });
  }

  searchAgain(): void {
    this.state = 'idle';
    this.result = null;
    this.form.reset();
  }

  // Moves focus to the result/status message once it renders, so keyboard
  // and screen reader users land on the outcome instead of staying on the
  // search button after the page updates.
  ngAfterViewChecked(): void {
    if (this.shouldFocusResult && this.resultRegion) {
      this.shouldFocusResult = false;
      this.resultRegion.nativeElement.focus();
    }
  }

  statusBadgeClass(status: 'Pending' | 'Approved' | 'Declined'): string {
    if (status === 'Approved') {
      return 'bg-primary/10 text-primary';
    }
    if (status === 'Declined') {
      return 'bg-red-50 text-red-600';
    }
    return 'bg-gray-100 text-gray-600';
  }

  stepIcon(status: 'Pending' | 'Approved' | 'Declined'): string {
    if (status === 'Approved') return 'ti ti-check';
    if (status === 'Declined') return 'ti ti-x';
    return 'ti ti-hourglass';
  }
}
