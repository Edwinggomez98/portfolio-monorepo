import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeroComponent } from './components/hero/hero.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ProjectsSliderComponent } from './components/projects-slider/projects-slider.component';
import { SkillsComponent } from './components/skills/skills.component';
import { EducationComponent } from './components/education/education.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    ExperienceComponent,
    ProjectsSliderComponent,
    SkillsComponent,
    EducationComponent,
  ],
  template: `
    <app-header />
    <main>
      <app-hero />
      <app-experience />
      <app-projects-slider />
      <app-skills />
      <app-education />
    </main>
    <app-footer />
  `,
})
export class LandingPageComponent {}
