import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  placeholderColor: string;
  tags: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-projects-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects-slider.component.html',
})
export class ProjectsSliderComponent {
  currentIndex = signal(0);

  readonly projects: Project[] = [
    {
      id: 1,
      title: 'Plataforma Inmobiliaria',
      description: 'Plataforma integral para gestión, búsqueda y compra/alquiler de propiedades con panel administrativo avanzado.',
      category: 'Full Stack',
      placeholderColor: 'from-blue-400 to-blue-600',
      tags: ['Angular', 'Node.js', 'PostgreSQL'],
      imageUrl: 'https://via.placeholder.com/800x450/3B82F6/FFFFFF?text=Plataforma+Inmobiliaria',
    },
    {
      id: 2,
      title: 'Middleware ERP',
      description: 'Arquitectura de middleware empresarial para sincronización de datos entre sistemas legacy y APIs modernas.',
      category: 'Backend',
      placeholderColor: 'from-purple-400 to-purple-600',
      tags: ['PHP', 'Laravel', 'RabbitMQ', 'Redis'],
      imageUrl: 'https://via.placeholder.com/800x450/8B5CF6/FFFFFF?text=Middleware+ERP',
    },
    {
      id: 3,
      title: 'Plataforma Fintech',
      description: 'Aplicación de gestión de carteras de inversión con visualización de datos financieros en tiempo real.',
      category: 'Full Stack',
      placeholderColor: 'from-green-400 to-emerald-600',
      tags: ['Vue.js', 'WebSockets', 'Chart.js'],
      imageUrl: 'https://via.placeholder.com/800x450/10B981/FFFFFF?text=FinUp+Fintech',
    },
    {
      id: 4,
      title: 'Exchange de Divisas',
      description: 'Plataforma de cambio de moneda con tasas en tiempo real, KYC/AML integrado y reportes automáticos.',
      category: 'Full Stack',
      placeholderColor: 'from-orange-400 to-amber-600',
      tags: ['Angular', 'NestJS', 'TypeORM', 'AWS'],
      imageUrl: 'https://via.placeholder.com/800x450/F59E0B/FFFFFF?text=Exchange+Divisas',
    },
    {
      id: 5,
      title: 'Integraciones Zendesk',
      description: 'Apps embebidas en Zendesk para automatización de flujos de soporte y dashboards de métricas de agentes.',
      category: 'Frontend',
      placeholderColor: 'from-cyan-400 to-cyan-600',
      tags: ['JavaScript', 'Zendesk SDK', 'REST APIs'],
      imageUrl: 'https://via.placeholder.com/800x450/06B6D4/FFFFFF?text=Zendesk+Apps',
    },
    {
      id: 6,
      title: 'Plataforma Web3',
      description: 'Frontend descentralizado con integración a wallets cripto, smart contracts y visualización on-chain.',
      category: 'Frontend',
      placeholderColor: 'from-pink-400 to-rose-600',
      tags: ['Vue.js', 'Web3.js', 'Ethers.js', 'MetaMask'],
      imageUrl: 'https://via.placeholder.com/800x450/EC4899/FFFFFF?text=Web3+Platform',
    },
  ];

  readonly totalProjects = computed(() => this.projects.length);
  readonly currentProject = computed(() => this.projects[this.currentIndex()]);

  prev(): void {
    this.currentIndex.update((i) => (i === 0 ? this.projects.length - 1 : i - 1));
  }

  next(): void {
    this.currentIndex.update((i) => (i === this.projects.length - 1 ? 0 : i + 1));
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }

  trackByIndex(_: number, item: Project): number {
    return item.id;
  }
}
