import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  icon: string;
  description: string;
  highlight?: string;
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
})
export class EducationComponent {
  readonly educations: EducationItem[] = [
    {
      degree: 'Computer Engineering',
      institution: 'Instituto Universitario de Tecnología Agroindustrial Región los Andes (IUT)',
      year: '2020',
      icon: '🎓',
      description: 'Comprehensive training in information systems, programming, networking, databases and software architecture.',
      highlight: 'TSU + Engineering',
    },
    {
      degree: 'High School Diploma — Sciences',
      institution: 'Private Educational Institution',
      year: '2015',
      icon: '🏫',
      description: 'Science track with a strong mathematical and logical foundation that reinforces analytical thinking.',
    },
  ];

  readonly certifications = [
    { name: 'Angular — Application Development', provider: 'Udemy', year: '2022', icon: '📜' },
    { name: 'Docker & Kubernetes Essentials', provider: 'Platzi', year: '2023', icon: '📜' },
    { name: 'AWS Cloud Practitioner Essentials', provider: 'AWS Training', year: '2023', icon: '📜' },
    { name: 'Web3 & Blockchain Fundamentals', provider: 'Coursera', year: '2022', icon: '📜' },
  ];
}
