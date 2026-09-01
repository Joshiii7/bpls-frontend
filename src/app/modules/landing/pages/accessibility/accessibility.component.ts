import { Component } from '@angular/core';

interface AccessibilityFeature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.css']
})
export class AccessibilityComponent {

  constructor() {
    document.title = 'BPLS | Accessibility';
  }

  readonly features: AccessibilityFeature[] = [
    {
      icon: 'ti ti-keyboard',
      title: 'Keyboard Navigation',
      description: 'Every page can be used with a keyboard alone, including the menu, forms, and FAQ accordions.'
    },
    {
      icon: 'ti ti-player-skip-forward',
      title: 'Skip to Main Content',
      description: 'A skip link lets keyboard and screen reader users jump straight past the header to the page content.'
    },
    {
      icon: 'ti ti-target',
      title: 'Visible Focus States',
      description: 'Buttons, links, and form fields show a clear focus outline, so you always know where you are.'
    },
    {
      icon: 'ti ti-headphones',
      title: 'Screen Reader Support',
      description: 'Headings and labels are structured so screen readers can announce each page in a sensible order.'
    },
    {
      icon: 'ti ti-palette',
      title: 'Color Contrast',
      description: 'Text and interactive elements are checked for sufficient contrast against their backgrounds.'
    },
    {
      icon: 'ti ti-device-mobile',
      title: 'Responsive Design',
      description: 'Layouts adapt cleanly from small phones to large desktop screens, with touch-friendly tap targets.'
    },
    {
      icon: 'ti ti-player-pause',
      title: 'Reduced Motion',
      description: "Animations respect your system's reduced motion setting and stay subtle either way."
    },
    {
      icon: 'ti ti-writing-sign',
      title: 'Accessible Forms',
      description: 'Form fields have visible labels, clear error messages, and ARIA attributes where they help.'
    }
  ];
}
