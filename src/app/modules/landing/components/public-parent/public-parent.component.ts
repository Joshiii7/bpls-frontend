import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-public-parent',
  templateUrl: './public-parent.component.html',
  styleUrls: ['./public-parent.component.css']
})
export class PublicParentComponent {
  showScrollTop = false;
  
  @HostListener('window:scroll')
  onScroll() {
    this.showScrollTop = window.scrollY > 200;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
