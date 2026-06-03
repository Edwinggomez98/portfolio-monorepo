import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  readonly techStack = [
    'Angular', 'Vue.js', 'TypeScript', 'Node.js',
    'PHP/Laravel', 'Docker', 'PostgreSQL', 'AWS',
  ];
}
