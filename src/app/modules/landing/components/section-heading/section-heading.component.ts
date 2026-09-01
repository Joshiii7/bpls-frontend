import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  templateUrl: './section-heading.component.html',
  styleUrls: ['./section-heading.component.css']
})
export class SectionHeadingComponent {
  // Small uppercase label above the heading, e.g. "Our Services", omit for
  // headings that don't need one.
  @Input() eyebrow?: string;

  // Main heading text. The optional `accent` word(s) render after it in the
  // brand color, mirroring the portfolio reference's heading-accent pattern.
  @Input() heading = '';
  @Input() accent?: string;

  @Input() description?: string;

  @Input() align: 'center' | 'left' = 'center';
}
