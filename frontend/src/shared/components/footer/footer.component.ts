import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  theme = inject(ThemeService);
  private fb = inject(FormBuilder);

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submitted = false;
  sending = false;

  get currentYear(): number {
    return new Date().getFullYear();
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.sending = true;
    setTimeout(() => {
      this.sending = false;
      this.submitted = true;
      this.contactForm.reset();
    }, 1500);
  }

  hasError(field: string, error: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }
}
