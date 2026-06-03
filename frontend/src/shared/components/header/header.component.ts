import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  theme = inject(ThemeService);

  downloadCV(): void {
    const link = document.createElement('a');
    link.href = '/assets/cv-edwing-gomez.pdf';
    link.download = 'CV-Edwing-Gomez.pdf';
    link.click();
  }
}
