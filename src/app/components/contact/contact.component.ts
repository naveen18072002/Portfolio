import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  @Input() isActive = false;

  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  readonly currentYear = new Date().getFullYear();

  readonly mapEmbedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d22366.553324100943!2d79.66899841740789!3d11.653280386130259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1751119075982!5m2!1sen!2sin'
  );

  // Signals instead of plain fields: under Angular 22's OnPush-by-default
  // components, a signal write reliably re-renders the template even when
  // it happens inside an async HTTP callback, with no markForCheck() needed.
  readonly submitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.group({
    fullname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required]]
  });

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
