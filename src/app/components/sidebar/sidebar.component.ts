import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ContactItem {
  title: string;
  icon: string;
  value: string;
  type: 'link' | 'time' | 'address';
  href?: string;
  datetime?: string;
}

interface SocialItem {
  name: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  /** Expands the contact details on mobile, same behaviour as data-sidebar-btn. */
  readonly isOpen = signal(false);

  readonly contacts: ContactItem[] = [
    {
      title: 'Email',
      icon: 'mail-outline',
      value: 'naveenkumarrnk6677@gmail.com',
      type: 'link',
      href: 'mailto:naveenkumarrnk6677@gmail.com'
    },
    {
      title: 'Phone',
      icon: 'phone-portrait-outline',
      value: '+91 7397114035',
      type: 'link',
      href: 'tel:+917397114035'
    },
    {
      title: 'Birthday',
      icon: 'calendar-outline',
      value: 'July 18, 2002',
      type: 'time',
      datetime: '2002-07-18'
    },
    {
      title: 'Location',
      icon: 'location-outline',
      value: 'Cuddalore',
      type: 'address'
    }
  ];

  readonly socials: SocialItem[] = [
    {
      name: 'LinkedIn',
      icon: 'logo-linkedin',
      url: 'https://www.linkedin.com/in/naveenkumar-r-7072a7277'
    },
    {
      name: 'GitHub',
      icon: 'logo-github',
      url: 'https://github.com/naveen18072002'
    },
    {
      name: 'Instagram',
      icon: 'logo-instagram',
      url: 'https://www.instagram.com/_naveen_390'
    }
  ];

  readonly resumeLink =
    'https://drive.google.com/file/d/1_vGkRvCD0sdz3CfMTWPlSlc01VctVjNu/view?usp=drive_link';

  toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
