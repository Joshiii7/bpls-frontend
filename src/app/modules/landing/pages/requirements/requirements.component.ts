import { Component } from '@angular/core';
import { FaqItem } from '../../components/faq-accordion/faq-accordion.component';

interface RequiredDocument {
  icon: string;
  title: string;
  description: string;
}

interface GuidelineStep {
  icon: string;
  description: string;
}

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent {

  constructor() {
    document.title = 'BPLS | Requirements'
  }

  readonly documents: RequiredDocument[] = [
    {
      icon: 'ti ti-writing-sign',
      title: 'Business Registration Form',
      description: 'A completed BPLS registration form with your business details.'
    },
    {
      icon: 'ti ti-id',
      title: 'Proof of Identity',
      description: 'A valid ID of the business owner or authorized representative.'
    },
    {
      icon: 'ti ti-certificate',
      title: 'Barangay Clearance',
      description: 'Your most recent barangay clearance for the business location.'
    },
    {
      icon: 'ti ti-certificate',
      title: 'DTI / SEC Registration',
      description: "Your DTI registration (or SEC registration if you're a corporation)."
    },
    {
      icon: 'ti ti-building',
      title: 'Occupancy / Zoning Permit',
      description: 'Proof that your location meets local zoning and occupancy rules.'
    },
    {
      icon: 'ti ti-folder-open',
      title: 'Other Supporting Documents',
      description: 'Anything else your type of business needs, like a health clearance or fire safety inspection.'
    }
  ];

  readonly guidelineSteps: GuidelineStep[] = [
    {
      icon: 'ti ti-clipboard-check',
      description: 'Gather the documents listed above before you start.'
    },
    {
      icon: 'ti ti-checks',
      description: 'Double-check that your personal and business details are correct.'
    },
    {
      icon: 'ti ti-send',
      description: "Submit your application online, or in person at the municipal office if you'd rather."
    },
    {
      icon: 'ti ti-wallet',
      description: 'Pay the fees online or at the office.'
    },
    {
      icon: 'ti ti-hourglass',
      description: "Wait for a notification by email or text once it's been reviewed."
    },
    {
      icon: 'ti ti-download',
      description: "Download or print your permit once it's approved."
    }
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Do I need to submit everything at once?',
      answer: "It's best to bring everything listed above in one visit. Missing documents are the most common reason applications get delayed."
    },
    {
      question: "What if I don't have a barangay clearance yet?",
      answer: "You'll need to get one from your barangay before applying. Try not to get it too far in advance, since it has to be recent."
    },
    {
      question: 'Can someone apply on my behalf?',
      answer: 'Yes. Just make sure they bring a valid ID and any authorization you\'ve given them, along with your documents.'
    },
    {
      question: 'Do home-based businesses need the same requirements?',
      answer: "Most of the same documents apply, though some, like zoning or occupancy proof, can look a bit different depending on your setup. If you're not sure, it's worth asking the office directly."
    }
  ];
}
