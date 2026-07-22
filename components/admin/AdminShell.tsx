'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FolderGit2, Cpu, Trophy, BookOpen,
  Users, LogOut, ExternalLink, Menu, X, Shield,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard',    label: 'Overview',      icon: LayoutDashboard },
  { href: '/admin/projects',     label: 'Projects',      icon: FolderGit2 },
  { href: '/admin/tech-stack',   label: 'Tech Stack',    icon: Cpu },
  { href: '/admin/achievements', label: 'Achievements',  icon: Trophy },
  { href: '/admin/blogs',        label: 'Blogs',         icon: BookOpen },
  { href: '/admin/users',        label: 'Users',         icon: Users },
];

interface CurrentUser { email: string; username: string; }

function SidebarContent({
  user,
  pathname,
  onLogout,
  onLinkClick,
}: {
  user: CurrentUser | null;
  pathname: string;
  onLogout: () => void;
  onLinkClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full w-60 bg-[#0a0d12] border-r border-white/[0.07]">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/[0.07] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Admin Panel</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-gray-500">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2 mt-1">
          Navigation
        </p>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-blue-400' : 'group-hover:text-gray-200'}`} />
              <span>{item.label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: User + Actions */}
      <div className="p-3 border-t border-white/[0.07] shrink-0 space-y-1.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/[0.05] transition"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          View Live Portfolio
        </a>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600/50 to-indigo-600/50 border border-blue-500/30 flex items-center justify-center text-blue-300 text-xs font-bold shrink-0">
            {user?.email?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate leading-tight">{user?.username ?? 'Admin'}</p>
            <p className="text-[10px] text-gray-500 truncate mt-0.5">{user?.email ?? ''}</p>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.authenticated) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => router.push('/admin/login'))
      .finally(() => setAuthLoading(false));
  }, [router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#05070b] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-sm">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#05070b] text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <SidebarContent user={user} pathname={pathname} onLogout={handleLogout} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 animate-in slide-in-from-left-full duration-300">
            <SidebarContent
              user={user}
              pathname={pathname}
              onLogout={handleLogout}
              onLinkClick={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-[#0a0d12] shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white">Admin Panel</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
