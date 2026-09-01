import { Component } from '@angular/core';
import { FaqItem } from '../../components/faq-accordion/faq-accordion.component';

interface ServiceOffering {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {

  constructor() {
    document.title = 'BPLS | Services';
  }

  readonly services: ServiceOffering[] = [
    {
      icon: 'ti ti-writing-sign',
      title: 'New Business Permit Application',
      description: 'Register a new business and send in your permit application online, no office visit needed.'
    },
    {
      icon: 'ti ti-arrow-back-up',
      title: 'Renewal of Business Permit',
      description: 'Renew your permit each year without waiting in line at the office.'
    },
    {
      icon: 'ti ti-clipboard-list',
      title: 'Business Registration Guidelines',
      description: 'See what documents you need and the steps to follow for registering or renewing a business.'
    },
    {
      icon: 'ti ti-printer',
      title: 'Document Printing & Downloads',
      description: 'Print or download your approved permits, receipts, and application forms whenever you need them.'
    }
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Can I apply for a new permit and renew an old one at the same time?',
      answer: "Each one is handled as its own application, so you'll need to submit them separately."
    },
    {
      question: 'How long does processing usually take?',
      answer: "It depends on the application and the office's current workload. You'll be notified once there's an update."
    },
    {
      question: 'Do I need an account to use these services?',
      answer: "Yes, you'll need an account to apply for a permit, renew one, or check your status online."
    },
    {
      question: 'Can I download my permit after it\'s approved?',
      answer: 'Yes. Approved permits, receipts, and forms are all available to download from your account.'
    }
  ];
}
