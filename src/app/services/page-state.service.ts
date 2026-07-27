import { Injectable, signal } from '@angular/core';

export type PageId = 'about' | 'resume' | 'projects' | 'contact';
const VALID_PAGES: PageId[] = ['about', 'resume', 'projects', 'contact'];

@Injectable({ providedIn: 'root' })
export class PageStateService {
  /** Currently visible section, mirrors the original data-page tab switcher. */
  readonly activePage = signal<PageId>(this.getInitialPage());

  constructor() {
    if (typeof window !== 'undefined') {
      const syncWithUrlHash = () => {
        this.syncState();
      };

      window.addEventListener('hashchange', syncWithUrlHash);
      window.addEventListener('popstate', syncWithUrlHash);
    }
  }

  getPageFromHash(): PageId | null {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash.replace('#', '').trim().toLowerCase() as PageId;
    return VALID_PAGES.includes(hash) ? hash : null;
  }

  private getInitialPage(): PageId {
    if (typeof window === 'undefined') return 'about';

    const hashPage = this.getPageFromHash();
    if (hashPage) {
      return hashPage;
    }

    if (window.location.hash !== '#about') {
      window.history.replaceState(null, '', '#about');
    }
    return 'about';
  }

  syncState(): void {
    if (typeof window === 'undefined') return;
    const pageFromHash = this.getPageFromHash() || 'about';
    if (this.activePage() !== pageFromHash) {
      this.activePage.set(pageFromHash);
    }
    if (!window.location.hash || window.location.hash === '#') {
      window.history.replaceState(null, '', '#about');
    }
  }

  setPage(page: PageId): void {
    if (!VALID_PAGES.includes(page)) return;
    this.activePage.set(page);
    if (typeof window !== 'undefined') {
      if (window.location.hash !== '#' + page) {
        window.history.pushState(null, '', '#' + page);
      }
    }
  }
}

