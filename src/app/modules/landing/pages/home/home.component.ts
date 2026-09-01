import { Component } from '@angular/core';
import { FaqItem } from '../../components/faq-accordion/faq-accordion.component';

interface IconLabel {
  icon: string;
  label: string;
}

interface ServiceHighlight {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  icon: string;
  title: string;
  description: string;
}

interface ContactChannel {
  icon: string;
  label: string;
  value: string;
  href?: string;
  placeholder?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor() {
    document.title = 'Business Permit & Licensing System';
  }

  readonly heroHighlights: IconLabel[] = [
    { icon: 'ti ti-writing-sign', label: 'Apply online, anytime' },
    { icon: 'ti ti-search', label: 'Track your application status' },
    { icon: 'ti ti-bell', label: 'Get notified on updates' }
  ];

  readonly services: ServiceHighlight[] = [
    {
      icon: 'ti ti-writing-sign',
      title: 'New Business Permit Application',
      description: 'Register a new business and submit your permit application online, without visiting the office.'
    },
    {
      icon: 'ti ti-arrow-back-up',
      title: 'Renewal of Business Permit',
      description: 'Renew an existing permit each year and keep your business operating legally, with no long lines.'
    },
    {
      icon: 'ti ti-clipboard-list',
      title: 'Requirements & Guidelines',
      description: 'Check what documents you need and follow a clear, step-by-step registration or renewal process.'
    },
    {
      icon: 'ti ti-printer',
      title: 'Document Printing & Downloads',
      description: 'Print or download your approved permits, receipts, and application forms anytime.'
    }
  ];

  readonly steps: ProcessStep[] = [
    {
      icon: 'ti ti-user-plus',
      title: 'Create your account',
      description: 'Sign up as a business owner to get started in just a few minutes.'
    },
    {
      icon: 'ti ti-writing-sign',
      title: 'Submit your application',
      description: 'Fill out the online form and upload the required documents.'
    },
    {
      icon: 'ti ti-search',
      title: 'Track your status',
      description: 'Follow your application as it moves through review and get notified of updates.'
    },
    {
      icon: 'ti ti-download',
      title: 'Download your permit',
      description: 'Once approved, download or print your permit whenever you need it.'
    }
  ];

  readonly requirementHighlights: IconLabel[] = [
    { icon: 'ti ti-writing-sign', label: 'Accomplished business registration form' },
    { icon: 'ti ti-id', label: 'Valid ID of the owner or authorized representative' },
    { icon: 'ti ti-certificate', label: 'Barangay clearance for the business location' },
    { icon: 'ti ti-certificate', label: 'DTI or SEC registration certificate' }
  ];

  // Matches the contact details already used in the site footer, kept in one
  // place here rather than re-typed, and clearly marked where this is a demo
  // placeholder value rather than a real, published office detail.
  readonly contactChannels: ContactChannel[] = [
    {
      icon: 'ti ti-phone',
      label: 'Call Us',
      value: '(123) 456-7890',
      href: 'tel:+11234567890',
      placeholder: true
    },
    {
      icon: 'ti ti-mail',
      label: 'Email Us',
      value: 'bpls@lgu.gov.ph',
      href: 'mailto:bpls@lgu.gov.ph',
      placeholder: true
    },
    {
      icon: 'ti ti-clock',
      label: 'Office Hours',
      value: 'Mon–Fri, 8:00 AM to 5:00 PM',
      placeholder: true
    },
    {
      icon: 'ti ti-map-pin',
      label: 'Visit Us',
      value: '[Business Permits & Licensing Office address]',
      placeholder: true
    }
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'What can I do here?',
      answer: 'Apply for a new business permit, renew one you already have, or check on an application you\'ve submitted, all online.'
    },
    {
      question: 'Do I need an account?',
      answer: 'Yes. Signing up only takes a minute, and then you can apply, renew, or track your status anytime.'
    },
    {
      question: 'What if I need help?',
      answer: 'Head over to the contact page, or send us a message there and we\'ll get back to you.'
    }
  ];
}
