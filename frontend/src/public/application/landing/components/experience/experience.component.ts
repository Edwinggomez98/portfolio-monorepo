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
      period: '2023 — 2026',
      current: true,
      type: 'fullstack',
      projects: [
        {
          name: 'Real Estate Platform',
          description:
            'Web platform for property management, payment gateway integration and advanced reporting modules.',
          tags: ['Angular', 'Node.js', 'PostgreSQL', 'Docker'],
        },
        {
          name: 'ERP Middleware',
          description:
            'Middleware architecture for bidirectional data synchronization between legacy ERP systems and new REST APIs.',
          tags: ['PHP/Laravel', 'RabbitMQ', 'MySQL', 'Redis'],
        },
        {
          name: 'FinTech Platform',
          description:
            'Fintech application for investment portfolio management with real-time financial data visualization.',
          tags: ['Angular', 'NestJS', 'Docker'],
        },
        {
          name: 'Currency Exchange',
          description:
            'Currency exchange platform with real-time rate module, KYC/AML compliance and admin dashboard.',
          tags: ['Angular', 'NestJS', 'TypeORM', 'AWS'],
        },
      ],
    },
    {
      role: 'Frontend Developer',
      company: 'Kumisoft',
      period: '2022 — 2023',
      type: 'frontend',
      projects: [
        {
          name: 'Zendesk Integrations',
          description:
            'Embedded apps built on the Zendesk SDK, support workflow automation and agent performance dashboards.',
          tags: ['JavaScript', 'Zendesk SDK', 'REST APIs', 'CSS3'],
        },
        {
          name: 'Web3 Platform',
          description:
            'Decentralized frontend with wallet integration (MetaMask), smart contract interaction and on-chain transaction visualisation.',
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
    infra:     'Infrastructure',
  };
}
