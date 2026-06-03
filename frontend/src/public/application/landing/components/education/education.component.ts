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
      degree: 'Ingeniería en Informática',
      institution: 'Instituto Universitario de Tecnología Agroindustrial Región los Andes (IUT)',
      year: '2020',
      icon: '🎓',
      description: 'Formación integral en sistemas de información, programación, redes, bases de datos y arquitectura de software.',
      highlight: 'TSU + Ingeniería',
    },
    {
      degree: 'Bachiller en Ciencias',
      institution: 'Unidad Educativa Privada',
      year: '2015',
      icon: '🏫',
      description: 'Bachillerato con mención en Ciencias, base matemática y lógica que refuerza el pensamiento analítico.',
    },
  ];

  readonly certifications = [
    { name: 'Angular — Desarrollo de Aplicaciones', provider: 'Udemy', year: '2022', icon: '📜' },
    { name: 'Docker & Kubernetes Essentials', provider: 'Platzi', year: '2023', icon: '📜' },
    { name: 'AWS Cloud Practitioner Essentials', provider: 'AWS Training', year: '2023', icon: '📜' },
    { name: 'Web3 & Blockchain Fundamentals', provider: 'Coursera', year: '2022', icon: '📜' },
  ];
}
