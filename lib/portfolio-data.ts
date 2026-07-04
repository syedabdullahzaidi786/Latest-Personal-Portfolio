export type PortfolioProject = {
  id: number;
  category: string;
  icon: string;
  title: string;
  badge: string;
  what: string;
  screenshot: string;
  architectureSvg?: string;
  links: { demo?: string; github?: string; architecture?: string };
  demoLabel?: string;
  tags: string[];
  accent: 'magenta' | 'teal' | 'purple';
};

export type PortfolioTechGroup = {
  name: string;
  color: string;
  techs: string[];
};

export type PortfolioContent = {
  projects: PortfolioProject[];
  techStack: PortfolioTechGroup[];
};

export const defaultPortfolioContent: PortfolioContent = {
  projects: [],
  techStack: [],
};
