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
        const pageFromHash = this.getPageFromHash();
        if (pageFromHash && pageFromHash !== this.activePage()) {
          this.activePage.set(pageFromHash);
          try {
            localStorage.setItem('activePage', pageFromHash);
          } catch (e) {}
        }
      };

      window.addEventListener('hashchange', syncWithUrlHash);
      window.addEventListener('popstate', syncWithUrlHash);
    }
  }

  private getPageFromHash(): PageId | null {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash.replace('#', '').trim().toLowerCase() as PageId;
    return VALID_PAGES.includes(hash) ? hash : null;
  }

  private getInitialPage(): PageId {
    if (typeof window === 'undefined') return 'about';

    // 1. Check URL hash first (e.g. #resume, #projects)
    const hashPage = this.getPageFromHash();
    if (hashPage) {
      try {
        localStorage.setItem('activePage', hashPage);
      } catch (e) {}
      return hashPage;
    }

    // 2. Check localStorage
    try {
      const savedPage = localStorage.getItem('activePage') as PageId;
      if (savedPage && VALID_PAGES.includes(savedPage)) {
        if (window.location.hash !== '#' + savedPage) {
          window.history.replaceState(null, '', '#' + savedPage);
        }
        return savedPage;
      }
    } catch (e) {}

    // Default to 'about' and set hash
    if (window.location.hash !== '#about') {
      window.history.replaceState(null, '', '#about');
    }
    return 'about';
  }

  setPage(page: PageId): void {
    if (!VALID_PAGES.includes(page)) return;
    this.activePage.set(page);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('activePage', page);
      } catch (e) {}
      if (window.location.hash !== '#' + page) {
        window.history.pushState(null, '', '#' + page);
      }
    }
  }
}

