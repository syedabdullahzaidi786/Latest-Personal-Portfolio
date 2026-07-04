import { defaultPortfolioContent } from './portfolio-data';

export { defaultPortfolioContent as workContent } from './portfolio-data';
export type { PortfolioProject as WorkProject } from './portfolio-data';

export const workProjects = defaultPortfolioContent.projects;
export const workCategories = ['All', ...Array.from(new Set(workProjects.map((project) => project.category)))] as const;

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Contact", href: "#contact" },
];
