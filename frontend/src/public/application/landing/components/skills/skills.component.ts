import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SkillCategory {
  title: string;
  icon: string;
  color: string;
  darkColor: string;
  skills: { name: string; level: number }[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
})
export class SkillsComponent {
  readonly categories: SkillCategory[] = [
    {
      title: 'Core Development',
      icon: '💻',
      color: 'bg-blue-50 border-blue-200',
      darkColor: 'dark:bg-blue-900/10 dark:border-blue-800',
      skills: [
        { name: 'Angular (v12–19)', level: 92 },
        { name: 'TypeScript', level: 90 },
        { name: 'Node.js / NestJS', level: 88 },
        { name: 'REST APIs / GraphQL', level: 87 },
        { name: 'PostgreSQL / MySQL', level: 80 },
        { name: 'PHP / Laravel', level: 74 },
        { name: 'Vue.js / Nuxt.js', level: 55 },
      ],
    },
    {
      title: 'Mobile & Devices',
      icon: '📱',
      color: 'bg-emerald-50 border-emerald-200',
      darkColor: 'dark:bg-emerald-900/10 dark:border-emerald-800',
      skills: [
        { name: 'Responsive Design', level: 95 },
        { name: 'PWA', level: 78 },
        { name: 'React Native', level: 70 },
        { name: 'Ionic Framework', level: 65 },
      ],
    },
    {
      title: 'Software & Architecture',
      icon: '🏗️',
      color: 'bg-purple-50 border-purple-200',
      darkColor: 'dark:bg-purple-900/10 dark:border-purple-800',
      skills: [
        { name: 'Clean Architecture', level: 80 },
        { name: 'Microservices', level: 78 },
        { name: 'CI/CD (GitHub Actions)', level: 75 },
        { name: 'Docker / Compose', level: 70 },
        { name: 'Web3 / Ethers.js', level: 68 },
      ],
    },
    {
      title: 'Hardware & Systems',
      icon: '⚙️',
      color: 'bg-orange-50 border-orange-200',
      darkColor: 'dark:bg-orange-900/10 dark:border-orange-800',
      skills: [
        { name: 'Git / GitFlow', level: 92 },
        { name: 'Linux / Ubuntu Server', level: 78 },
        { name: 'Nginx / Apache', level: 75 },
        { name: 'AWS (EC2, S3, RDS)', level: 70 },
        { name: 'Bash / PowerShell', level: 65 },
      ],
    },
  ].map((category) => ({
    ...category,
    skills: [...category.skills].sort((a, b) => b.level - a.level),
  }));

  getLevelLabel(level: number): string {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Advanced';
    if (level >= 60) return 'Intermediate';
    return 'Beginner';
  }

  getLevelColor(level: number): string {
    if (level >= 90) return 'bg-primary dark:bg-accent';
    if (level >= 75) return 'bg-accent dark:bg-primary';
    if (level >= 60) return 'bg-yellow-400 dark:bg-yellow-500';
    return 'bg-gray-400 dark:bg-gray-500';
  }
}
