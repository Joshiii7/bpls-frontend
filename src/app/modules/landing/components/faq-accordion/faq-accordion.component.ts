import { Component, Input, OnChanges } from '@angular/core';

export interface FaqItem {
  question: string;
  answer: string;
}

// One question open at a time. The first question starts open so the
// section doesn't look empty, and opening another one closes whichever was
// open before it.
@Component({
  selector: 'app-faq-accordion',
  templateUrl: './faq-accordion.component.html'
})
export class FaqAccordionComponent implements OnChanges {
  @Input() items: FaqItem[] = [];

  openIndex: number | null = 0;

  ngOnChanges(): void {
    this.openIndex = this.items.length ? 0 : null;
  }

  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
