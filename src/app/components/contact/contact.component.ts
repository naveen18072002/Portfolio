import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContactService } from '../../services/contact.service';
import { PortfolioDataService } from '../../services/portfolio-data.service';

interface ContactDetail {
  icon: string;
  title: string;
  subtitle?: string;
  text: string;
  link?: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  @Input() isActive = false;

  private readonly portfolioService = inject(PortfolioDataService);
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  readonly profile = computed(() => this.portfolioService.profile());

  readonly contactTopics = ['General Inquiry', 'Project Collaboration', 'Hire Me'];
  readonly activeTopic = signal('General Inquiry');

  readonly templates: Record<string, string> = {
    'General Inquiry': 'Hello, I wanted to reach out to you regarding...',
    'Project Collaboration': 'Hello, I am working on a project and would love to collaborate on...',
    'Hire Me': 'Hello, I am interested in discussing an opportunity for...'
  };

  readonly currentYear = new Date().getFullYear();

  readonly mapEmbedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31317.067332219086!2d79.74235284852926!3d11.755490457639524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a533bc42dfcfb69%3A0xc07a98db2579dfd9!2sCuddalore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1751119075982!5m2!1sen!2sin'
  );

  readonly submitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.group({
    fullname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: [this.templates['General Inquiry'], [Validators.required]]
  });

  setTopic(topic: string): void {
    const oldTopic = this.activeTopic();
    this.activeTopic.set(topic);

    const messageControl = this.form.get('message');
    if (messageControl) {
      const currentValue = messageControl.value || '';
      const oldTemplate = this.templates[oldTopic] || '';
      if (!currentValue.trim() || currentValue === oldTemplate) {
        messageControl.setValue(this.templates[topic]);
      }
    }
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Please fill in every field with a valid email address.');
      return;
    }

    this.submitting.set(true);

    const { fullname, email, message } = this.form.getRawValue();

    this.contactService
      .submit({ fullname: fullname!, email: email!, message: message! })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.form.reset();
          this.router.navigate(['/thank-you']);
        },
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set('Something went wrong sending your message. Please try again.');
        }
      });
  }
}
