'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderGit2, Cpu, Trophy, BookOpen, Users,
  ArrowRight, Database, RefreshCw,
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';

interface Stats {
  projects: number;
  techGroups: number;
  achievements: number;
  blogs: number;
  users: number;
}

const QUICK_LINKS = [
  { href: '/admin/projects',     label: 'Projects',      icon: FolderGit2, desc: 'Manage your portfolio projects',  color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { href: '/admin/tech-stack',   label: 'Tech Stack',    icon: Cpu,        desc: 'Organize your technology groups',  color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { href: '/admin/achievements', label: 'Achievements',  icon: Trophy,     desc: 'Showcase awards & milestones',     color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { href: '/admin/blogs',        label: 'Blogs',         icon: BookOpen,   desc: 'Publish and manage blog posts',    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { href: '/admin/users',        label: 'Admin Users',   icon: Users,      desc: 'Manage admin access & accounts',   color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
];

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<Stats>({ projects: 0, techGroups: 0, achievements: 0, blogs: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [portRes, achRes, blogRes, userRes] = await Promise.all([
        fetch('/api/portfolio'),
        fetch('/api/achievements'),
        fetch('/api/blogs'),
        fetch('/api/users'),
      ]);

      const [port, ach, blog, usr] = await Promise.all([
        portRes.json(),
        achRes.json(),
        blogRes.json(),
        userRes.json(),
      ]);

      setStats({
        projects:     Array.isArray(port.projects)     ? port.projects.length     : 0,
        techGroups:   Array.isArray(port.techStack)    ? port.techStack.length    : 0,
        achievements: Array.isArray(ach.achievements)  ? ach.achievements.length  : 0,
        blogs:        Array.isArray(blog.blogs)        ? blog.blogs.length        : 0,
        users:        Array.isArray(usr.users)         ? usr.users.length         : 0,
      });
    } catch {
      // silently fail — stats will show 0
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white leading-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-400 mt-1">Welcome back — your portfolio at a glance.</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition disabled:opacity-40"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <StatCard label="Projects"     count={stats.projects}     icon={FolderGit2} color="blue"    href="/admin/projects" />
        <StatCard label="Tech Groups"  count={stats.techGroups}   icon={Cpu}        color="purple"  href="/admin/tech-stack" />
        <StatCard label="Achievements" count={stats.achievements} icon={Trophy}     color="amber"   href="/admin/achievements" />
        <StatCard label="Blog Posts"   count={stats.blogs}        icon={BookOpen}   color="emerald" href="/admin/blogs" />
        <StatCard label="Admin Users"  count={stats.users}        icon={Users}      color="rose"    href="/admin/users" />
      </div>

      {/* DB Status Banner */}
      <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-3.5 mb-10">
        <Database className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-sm text-emerald-300 font-medium">Connected to Neon PostgreSQL</span>
        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
      </div>

      {/* Quick Links */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_LINKS.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 bg-[#0e1117] border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
