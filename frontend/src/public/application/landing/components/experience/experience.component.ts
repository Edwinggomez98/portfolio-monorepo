import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  type: 'fullstack' | 'frontend' | 'infra';
  current?: boolean;
  projects: {
    name: string;
    description: string;
    tags: string[];
  }[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
})
export class ExperienceComponent {
  readonly experiences: ExperienceItem[] = [
    {
      role: 'Full Stack Developer',
      company: 'Kumisoft & Arrsoft',
      period: '2020 — Presente',
      current: false,
      type: 'fullstack',
      projects: [
        {
          name: 'Plataforma Inmobiliaria',
          description:
            'Desarrollo de plataforma web para gestión de propiedades, integración con pasarelas de pago y módulos de reportes avanzados.',
          tags: ['Angular', 'Node.js', 'PostgreSQL', 'Docker'],
        },
        {
          name: 'Middleware ERP',
          description:
            'Arquitectura de middleware para sincronización bidireccional entre sistemas ERP legacy y nuevas APIs REST.',
          tags: ['PHP/Laravel', 'RabbitMQ', 'MySQL', 'Redis'],
        },
        {
          name: 'Plataforma FinTech',
          description:
            'Aplicación Fintech para gestión de carteras de inversión, visualización de datos financieros en tiempo real.',
          tags: ['Angular', 'NestJS', 'NestJS', 'Docker'],
        },
        {
          name: 'Exchange de Divisas',
          description:
            'Plataforma de intercambio de divisas con módulo de tasas en tiempo real, KYC/AML y panel administrativo.',
          tags: ['Angular', 'NestJS', 'TypeORM', 'AWS'],
        },
      ],
    },
    {
      role: 'Frontend Developer',
      company: 'Kumisoft',
      period: '2019 — 2020',
      type: 'frontend',
      projects: [
        {
          name: 'Integraciones Zendesk',
          description:
            'Desarrollo de apps embebidas en Zendesk usando su SDK, automatización de flujos de soporte y dashboards de agentes.',
          tags: ['JavaScript', 'Zendesk SDK', 'REST APIs', 'CSS3'],
        },
        {
          name: 'Plataforma Web3',
          description:
            'Frontend para plataforma descentralizada con integración a wallets (MetaMask), smart contracts y visualización de transacciones.',
          tags: ['Vue.js', 'Web3.js', 'Ethers.js', 'TailwindCSS'],
        },
      ],
    },
  ];

  readonly typeColors: Record<string, string> = {
    fullstack: 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent',
    frontend:  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
    infra:     'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  };

  readonly typeLabels: Record<string, string> = {
    fullstack: 'Full Stack',
    frontend:  'Frontend',
    infra:     'Infraestructura',
  };
}
