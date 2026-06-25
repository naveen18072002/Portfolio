import { Injectable, signal } from '@angular/core';

export type PageId = 'about' | 'resume' | 'projects' | 'contact';

@Injectable({ providedIn: 'root' })
export class PageStateService {
  /** Currently visible section, mirrors the original data-page tab switcher. */
  readonly activePage = signal<PageId>('about');

  setPage(page: PageId): void {
    this.activePage.set(page);
  }
}
