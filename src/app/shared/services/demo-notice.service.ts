import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

export interface DemoNoticeOptions {
  /** What just happened, e.g. "Your application ... was received with reference number ...". */
  summary: string;
  title?: string;
  confirmButtonText?: string;
}

// This app has no real backend, every "submission" is written to localStorage only.
// Call this right after an action has already succeeded, so users who would otherwise
// assume they just reached a government server understand what actually happened,
// without it reading as an error or blocking the action itself.
@Injectable({ providedIn: 'root' })
export class DemoNoticeService {
  show(options: DemoNoticeOptions): Promise<void> {
    return Swal.fire({
      icon: 'success',
      title: options.title || 'Success',
      html: `
        <p class="text-left text-sm text-gray-700 mb-3">${options.summary}</p>
        <p class="text-left text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md p-3">
          <strong>Demo system:</strong> this is a demo version of the BPLS. Your information is saved in this
          browser only and is not sent to any government server or database.
        </p>
      `,
      confirmButtonText: options.confirmButtonText || 'Continue',
      confirmButtonColor: '#009800',
      allowOutsideClick: false,
    }).then(() => undefined);
  }
}
