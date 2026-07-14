import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageId, PageStateService } from '../../services/page-state.service';

interface NavItem {
  id: PageId;
  label: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  readonly pageState = inject(PageStateService);

  isMenuOpen = false;

  readonly items: NavItem[] = [
    { id: 'about', label: 'About' },
    { id: 'resume', label: 'Resume' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  select(page: PageId): void {
    this.pageState.setPage(page);
    this.isMenuOpen = false;
    window.scrollTo(0, 0);
  }
}
