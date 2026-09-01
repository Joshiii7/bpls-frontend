import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FaqItem } from '../../components/faq-accordion/faq-accordion.component';

interface ContactChannel {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    document.title = 'BPLS | Contact';

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Matches the contact details already used on the homepage and in the site
  // footer, kept here rather than re-typed elsewhere, and still a demo
  // placeholder rather than a real, published office detail.
  readonly contactChannels: ContactChannel[] = [
    {
      icon: 'ti ti-phone',
      label: 'Call Us',
      value: '(123) 456-7890',
      href: 'tel:+11234567890'
    },
    {
      icon: 'ti ti-mail',
      label: 'Email Us',
      value: 'bpls@lgu.gov.ph',
      href: 'mailto:bpls@lgu.gov.ph'
    },
    {
      icon: 'ti ti-clock',
      label: 'Office Hours',
      value: 'Mon–Fri, 8:00 AM to 5:00 PM'
    },
    {
      icon: 'ti ti-map-pin',
      label: 'Visit Us',
      value: '[Business Permits & Licensing Office address]'
    }
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'How fast will I get a reply?',
      answer: "We try to reply within a business day or two. If it's urgent, calling the office directly is usually quicker."
    },
    {
      question: 'Is the contact form the best way to reach you?',
      answer: "It works well for general questions. For anything urgent about an application you've already submitted, calling is faster."
    },
    {
      question: 'Where can I check on my application instead of contacting you?',
      answer: 'You can check its status anytime by signing in to your account.'
    }
  ];

  // No backend exists for this demo site, submitting just shows a
  // confirmation state instead of actually sending anything.
  submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitted = true;
  }

  resetForm() {
    this.contactForm.reset();
    this.submitted = false;
  }

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get subject() {
    return this.contactForm.get('subject');
  }

  get message() {
    return this.contactForm.get('message');
  }
}
