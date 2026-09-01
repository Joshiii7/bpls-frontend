import { Component, Input } from '@angular/core';

// One place that decides how big a card icon is and how it's centered, so
// every icon-led card on the public site (Home, Services, Requirements,
// Contact) uses the same size instead of each card picking its own.
//
// - size 'lg' (default): the primary icon on a feature card (Icon, Title,
//   Description). Centered, with the spacing a title expects underneath it.
// - size 'sm': a smaller icon next to text in a compact row, like the
//   Contact page's info list.
@Component({
  selector: 'app-icon-badge',
  templateUrl: './icon-badge.component.html'
})
export class IconBadgeComponent {
  @Input() icon = '';
  @Input() variant: 'solid' | 'tinted' | 'white' | 'muted' = 'solid';
  @Input() size: 'lg' | 'sm' = 'lg';
}
