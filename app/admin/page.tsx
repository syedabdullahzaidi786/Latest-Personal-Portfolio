'use client';

import { useEffect, useMemo, useState } from 'react';
import { defaultPortfolioContent, type PortfolioContent, type PortfolioProject, type PortfolioTechGroup } from '@/lib/portfolio-data';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

export default function AdminPage() {
  const [content, setContent] = useState<PortfolioContent>(defaultPortfolioContent);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [auth, setAuth] = useState<{ email: string; password: string; isLoggedIn: boolean }>({ email: '', password: '', isLoggedIn: false });
  const [activeTab, setActiveTab] = useState<'projects' | 'tech'>('projects');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('admin-session');
      if (stored === 'authenticated') {
        setAuth((prev) => ({ ...prev, isLoggedIn: true }));
        setLoading(true);
      }
    }
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (!auth.isLoggedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);

    let isMounted = true;
    const loadContent = async () => {
      try {
        const res = await fetch('/api/portfolio', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (!isMounted) return;

        if (!res.ok) {
          setError(data?.error || 'Unable to load content.');
          setContent(defaultPortfolioContent);
        } else {
          setContent({
            projects: Array.isArray(data?.projects) ? data.projects : [],
            techStack: Array.isArray(data?.techStack) ? data.techStack : [],
          } as PortfolioContent);
          setError(data?.warning || data?.error || '');
        }
      } catch {
        if (!isMounted) return;
        setError('Unable to reach the portfolio API.');
        setContent(defaultPortfolioContent);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContent();
    return () => {
      isMounted = false;
    };
  }, [auth.isLoggedIn]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.email.trim().toLowerCase() === ADMIN_EMAIL && auth.password === ADMIN_PASSWORD) {
      window.localStorage.setItem('admin-session', 'authenticated');
      setAuth((prev) => ({ ...prev, isLoggedIn: true }));
      setLoading(true);
      setError('');
      setStatus('Signing you in...');
    } else {
      setLoading(false);
      setError('Invalid email or password.');
    }
  };

  const logout = () => {
    window.localStorage.removeItem('admin-session');
    setAuth({ email: '', password: '', isLoggedIn: false });
    setLoading(false);
    setStatus('You have been logged out.');
    setError('');
  };

  const updateProject = (index: number, field: keyof PortfolioProject, value: PortfolioProject[keyof PortfolioProject]) => {
    const nextProjects = [...content.projects];
    nextProjects[index] = { ...nextProjects[index], [field]: value } as PortfolioProject;
    setContent({ ...content, projects: nextProjects });
  };

  const updateTechGroup = (index: number, field: keyof PortfolioTechGroup, value: PortfolioTechGroup[keyof PortfolioTechGroup]) => {
    const nextGroups = [...content.techStack];
    nextGroups[index] = { ...nextGroups[index], [field]: value } as PortfolioTechGroup;
    setContent({ ...content, techStack: nextGroups });
  };

  const addProject = () => {
    setContent({
      ...content,
      projects: [
        ...content.projects,
        {
          id: Date.now(),
          category: 'Fullstack',
          icon: 'Sparkles',
          title: 'New Project',
          badge: '',
          what: 'Describe your project',
          screenshot: '/projects/default/screenshot.webp',
          links: { demo: '', github: '' },
          tags: [],
          accent: 'teal',
        },
      ],
    });
  };

  const addTechGroup = () => {
    setContent({
      ...content,
      techStack: [
        ...content.techStack,
        {
          name: 'New Group',
          color: '#378ADD',
          techs: [],
        },
      ],
    });
  };

  const save = async () => {
    setStatus('Saving...');
    setError('');

    const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123';
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(content),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setStatus('Saved successfully to the database.');
    } else {
      setStatus('Save failed.');
      setError(data?.details || data?.error || 'Unable to save content.');
    }
  };

  const stats = useMemo(() => ({
    projects: content.projects.length,
    techGroups: content.techStack.length,
  }), [content]);

  if (!authChecked || !auth.isLoggedIn) {
    return (
      <main style={{ minHeight: '100vh', background: '#05070b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 440, background: '#0e1117', border: '1px solid #232a36', borderRadius: 20, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>Admin Login</h1>
          <p style={{ color: '#8b95a7', marginBottom: 20 }}>Sign in to manage your portfolio content.</p>
          <form onSubmit={login} style={{ display: 'grid', gap: 12 }}>
            <input type="email" value={auth.email} onChange={(e) => setAuth({ ...auth, email: e.target.value })} placeholder="Email" style={{ padding: 12, borderRadius: 10, background: '#11161d', border: '1px solid #2a3240', color: 'white' }} />
            <input type="password" value={auth.password} onChange={(e) => setAuth({ ...auth, password: e.target.value })} placeholder="Password" style={{ padding: 12, borderRadius: 10, background: '#11161d', border: '1px solid #2a3240', color: 'white' }} />
            <button type="submit" style={{ padding: 12, borderRadius: 10, background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Login</button>
          </form>
          {status ? <p style={{ marginTop: 12, color: '#8fd3ff' }}>{status}</p> : null}
          {error ? <p style={{ marginTop: 12, color: '#ff9e9e' }}>{error}</p> : null}
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={{ padding: 24, color: 'white', background: '#05070b', minHeight: '100vh' }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Admin Dashboard</h1>
        <p style={{ marginBottom: 16, color: '#aaa' }}>Loading portfolio content...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#05070b', color: 'white', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Admin Dashboard</h1>
          <p style={{ color: '#8b95a7' }}>Manage projects, tech stacks, and portfolio content from Neon with Prisma.</p>
        </div>
        <button onClick={logout} style={{ padding: '10px 14px', borderRadius: 10, background: '#11161d', color: 'white', border: '1px solid #2a3240', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ background: '#0e1117', border: '1px solid #232a36', borderRadius: 16, padding: 16, minWidth: 180 }}>
          <div style={{ color: '#8b95a7', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Projects</div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{stats.projects}</div>
        </div>
        <div style={{ background: '#0e1117', border: '1px solid #232a36', borderRadius: 16, padding: 16, minWidth: 180 }}>
          <div style={{ color: '#8b95a7', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Tech Groups</div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{stats.techGroups}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('projects')} style={{ padding: '10px 14px', borderRadius: 10, background: activeTab === 'projects' ? '#2563eb' : '#11161d', color: 'white', border: '1px solid #2a3240', cursor: 'pointer' }}>Projects</button>
        <button onClick={() => setActiveTab('tech')} style={{ padding: '10px 14px', borderRadius: 10, background: activeTab === 'tech' ? '#2563eb' : '#11161d', color: 'white', border: '1px solid #2a3240', cursor: 'pointer' }}>Tech Stacks</button>
      </div>

      {status ? <p style={{ marginBottom: 12, color: '#8fd3ff' }}>{status}</p> : null}
      {error ? <p style={{ marginBottom: 12, color: '#ff9e9e' }}>{error}</p> : null}

      {activeTab === 'projects' ? (
        <section style={{ background: '#0e1117', border: '1px solid #232a36', borderRadius: 18, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 20 }}>Projects</h2>
            <button onClick={addProject} style={{ padding: '8px 12px', borderRadius: 10, background: '#11161d', color: 'white', border: '1px solid #2a3240', cursor: 'pointer' }}>+ Add Project</button>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {content.projects.map((project, index) => (
              <div key={project.id} style={{ background: '#11161d', border: '1px solid #232a36', borderRadius: 14, padding: 12 }}>
                <input value={project.title} onChange={(e) => updateProject(index, 'title', e.target.value)} style={{ width: '100%', marginBottom: 8, padding: 10, borderRadius: 8, background: '#0b0f15', color: 'white', border: '1px solid #2a3240' }} />
                <input value={project.screenshot} onChange={(e) => updateProject(index, 'screenshot', e.target.value)} placeholder="Image URL" style={{ width: '100%', marginBottom: 8, padding: 10, borderRadius: 8, background: '#0b0f15', color: 'white', border: '1px solid #2a3240' }} />
                <input value={project.links?.demo ?? ''} onChange={(e) => updateProject(index, 'links', { ...project.links, demo: e.target.value })} placeholder="Live URL" style={{ width: '100%', marginBottom: 8, padding: 10, borderRadius: 8, background: '#0b0f15', color: 'white', border: '1px solid #2a3240' }} />
                <textarea value={project.what} onChange={(e) => updateProject(index, 'what', e.target.value)} placeholder="Description" style={{ width: '100%', minHeight: 90, marginBottom: 8, padding: 10, borderRadius: 8, background: '#0b0f15', color: 'white', border: '1px solid #2a3240' }} />
                <input value={project.tags.join(', ')} onChange={(e) => updateProject(index, 'tags', e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} placeholder="Tags (comma separated)" style={{ width: '100%', padding: 10, borderRadius: 8, background: '#0b0f15', color: 'white', border: '1px solid #2a3240' }} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section style={{ background: '#0e1117', border: '1px solid #232a36', borderRadius: 18, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 20 }}>Tech Stack Groups</h2>
            <button onClick={addTechGroup} style={{ padding: '8px 12px', borderRadius: 10, background: '#11161d', color: 'white', border: '1px solid #2a3240', cursor: 'pointer' }}>+ Add Group</button>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {content.techStack.map((group, index) => (
              <div key={`${group.name}-${index}`} style={{ background: '#11161d', border: '1px solid #232a36', borderRadius: 14, padding: 12 }}>
                <input value={group.name} onChange={(e) => updateTechGroup(index, 'name', e.target.value)} style={{ width: '100%', marginBottom: 8, padding: 10, borderRadius: 8, background: '#0b0f15', color: 'white', border: '1px solid #2a3240' }} />
                <input value={group.techs.join(', ')} onChange={(e) => updateTechGroup(index, 'techs', e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} placeholder="Stacks (comma separated)" style={{ width: '100%', padding: 10, borderRadius: 8, background: '#0b0f15', color: 'white', border: '1px solid #2a3240' }} />
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={save} style={{ padding: '12px 16px', borderRadius: 10, background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Save to Database</button>
      </div>
    </main>
  );
}
