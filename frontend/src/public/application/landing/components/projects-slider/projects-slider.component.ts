import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Project {
  id: number;
  title: string;
  description: string;
  details?: string;
  category: string;
  placeholderColor: string;
  tags: string[];
  imageUrl: string;
  gallery?: string[];
}

const FINANZAS_IMAGES = Array.from(
  { length: 8 },
  (_, i) => `/assets/finanzas (${i + 1}).png`,
);

@Component({
  selector: 'app-projects-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects-slider.component.html',
})
export class ProjectsSliderComponent {
  currentIndex = signal(0);
  galleryOpen = signal(false);
  galleryIndex = signal(0);

  readonly projects: Project[] = [
    {
      id: 3,
      title: 'Fintech Platform',
      description: 'Financial education platform with responsive learning flows and high-performance content delivery.',
      details:
        'Key frontend challenges included building a fully responsive experience in Angular 16 (later upgraded to Angular 19), ' +
        'integrating a fast media player, and shipping modern design and user flows. ' +
        'The biggest challenge was backend-led: I managed the migration from SQL to MongoDB, where single responses ' +
        'could exceed 18,000 lines of educational content (chapters, modules, and more). ' +
        'Through aggregation pipelines and API optimization, response times dropped from ~15s to 2–4s per module.',
      category: 'Full Stack',
      placeholderColor: 'from-green-400 to-emerald-600',
      tags: ['Angular 19', 'MongoDB', 'API Optimization'],
      imageUrl: FINANZAS_IMAGES[1],
      gallery: FINANZAS_IMAGES,
    },
    {
      id: 1,
      title: 'Real Estate Platform',
      description: 'Full platform for property management, search, buy/rent listings with an advanced admin panel.',
      category: 'Full Stack',
      placeholderColor: 'from-blue-400 to-blue-600',
      tags: ['Angular', 'Node.js', 'PostgreSQL'],
      imageUrl: 'https://via.placeholder.com/800x450/3B82F6/FFFFFF?text=Real+Estate+Platform',
    },
    {
      id: 2,
      title: 'ERP Middleware',
      description: 'Enterprise middleware architecture for data synchronization between legacy systems and modern APIs.',
      category: 'Backend',
      placeholderColor: 'from-purple-400 to-purple-600',
      tags: ['PHP', 'Laravel', 'RabbitMQ', 'Redis'],
      imageUrl: 'https://via.placeholder.com/800x450/8B5CF6/FFFFFF?text=ERP+Middleware',
    },
    {
      id: 4,
      title: 'Currency Exchange',
      description: 'Currency exchange platform with real-time rates, integrated KYC/AML and automated reports.',
      category: 'Full Stack',
      placeholderColor: 'from-orange-400 to-amber-600',
      tags: ['Angular', 'NestJS', 'TypeORM', 'AWS'],
      imageUrl: 'https://via.placeholder.com/800x450/F59E0B/FFFFFF?text=Currency+Exchange',
    },
    {
      id: 5,
      title: 'Zendesk Integrations',
      description: 'Embedded Zendesk apps for support workflow automation and agent metrics dashboards.',
      category: 'Frontend',
      placeholderColor: 'from-cyan-400 to-cyan-600',
      tags: ['JavaScript', 'Zendesk SDK', 'REST APIs'],
      imageUrl: 'https://via.placeholder.com/800x450/06B6D4/FFFFFF?text=Zendesk+Apps',
    },
    {
      id: 6,
      title: 'Web3 Platform',
      description: 'Decentralized frontend with crypto wallet integration, smart contracts and on-chain visualisation.',
      category: 'Frontend',
      placeholderColor: 'from-pink-400 to-rose-600',
      tags: ['Vue.js', 'Web3.js', 'Ethers.js', 'MetaMask'],
      imageUrl: 'https://via.placeholder.com/800x450/EC4899/FFFFFF?text=Web3+Platform',
    },
  ];

  readonly totalProjects = computed(() => this.projects.length);
  readonly currentProject = computed(() => this.projects[this.currentIndex()]);
  readonly activeGallery = computed(() => this.currentProject().gallery ?? []);
  readonly currentGalleryImage = computed(() => this.activeGallery()[this.galleryIndex()]);

  isPlaceholder(imageUrl: string): boolean {
    return imageUrl.includes('placeholder');
  }

  hasGallery(project: Project): boolean {
    return (project.gallery?.length ?? 0) > 0;
  }

  openGallery(startIndex = 0): void {
    this.galleryIndex.set(startIndex);
    this.galleryOpen.set(true);
  }

  closeGallery(): void {
    this.galleryOpen.set(false);
  }

  galleryPrev(): void {
    const total = this.activeGallery().length;
    this.galleryIndex.update((i) => (i === 0 ? total - 1 : i - 1));
  }

  galleryNext(): void {
    const total = this.activeGallery().length;
    this.galleryIndex.update((i) => (i === total - 1 ? 0 : i + 1));
  }

  goToGalleryImage(index: number): void {
    this.galleryIndex.set(index);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.galleryOpen()) {
      this.closeGallery();
    }
  }

  prev(): void {
    this.currentIndex.update((i) => (i === 0 ? this.projects.length - 1 : i - 1));
  }

  next(): void {
    this.currentIndex.update((i) => (i === this.projects.length - 1 ? 0 : i + 1));
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }

  trackByProjectId(_: number, project: Project): number {
    return project.id;
  }
}
