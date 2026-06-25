import { Component, signal } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  /** Expands the contact details on mobile, same behaviour as data-sidebar-btn. */
  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
