'use client';
import { useEffect, useState, useCallback } from 'react';
import { FolderGit2 } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import PageHeader from '@/components/admin/PageHeader';
import ItemCard from '@/components/admin/ItemCard';
import EmptyState from '@/components/admin/EmptyState';
import FormModal from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import FormField, { inputClass, textareaClass } from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

interface Project {
  id: number;
  title: string;
  what: string;       // description from API
  screenshot: string; // projectImage from API
  links: { demo: string; github: string };
  tags: string[];
}

interface FormData {
  title: string;
  description: string;
  projectImage: string;
  liveUrl: string;
  tags: string;
}

const EMPTY_FORM: FormData = { title: '', description: '', projectImage: '', liveUrl: '', tags: '' };

export default function ProjectsPage() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      showToast('error', 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (proj: Project) => {
    setEditingId(proj.id);
    setForm({
      title: proj.title,
      description: proj.what || '',
      projectImage: proj.screenshot || '',
      liveUrl: proj.links?.demo || '',
      tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : '',
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setForm(EMPTY_FORM); setEditingId(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        type: 'project',
        id: editingId,
        title: form.title.trim(),
        description: form.description.trim(),
        projectImage: form.projectImage.trim(),
        liveUrl: form.liveUrl.trim(),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const res = await fetch('/api/portfolio', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast('error', data.error || 'Failed to save project.');
      } else {
        showToast('success', editingId ? 'Project updated!' : 'Project created!');
        closeModal();
        fetchData();
      }
    } catch {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirmId === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/portfolio?type=project&id=${confirmId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Failed to delete project.');
      } else {
        showToast('success', 'Project deleted.');
        setConfirmId(null);
        fetchData();
      }
    } catch {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const setField = (key: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Projects"
        description={`${projects.length} project${projects.length !== 1 ? 's' : ''} in your portfolio`}
        icon={FolderGit2}
        onAdd={openAdd}
        addLabel="Add Project"
        onRefresh={fetchData}
        loading={loading}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-72 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects yet"
          description="Add your first portfolio project to get started."
          actionLabel="Add Project"
          onAction={openAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => (
            <ItemCard
              key={proj.id}
              id={proj.id}
              image={proj.screenshot}
              title={proj.title}
              description={proj.what}
              url={proj.links?.demo !== '#' ? proj.links?.demo : undefined}
              urlLabel="Live Demo"
              tags={proj.tags}
              accentColor="blue"
              onEdit={() => openEdit(proj)}
              onDelete={() => setConfirmId(proj.id)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <FormModal
        open={modalOpen}
        title={editingId ? 'Edit Project' : 'Add New Project'}
        onClose={closeModal}
        onSubmit={handleSave}
        loading={saving}
        submitLabel={editingId ? 'Update Project' : 'Create Project'}
      >
        <FormField label="Title" required>
          <input
            type="text"
            value={form.title}
            onChange={e => setField('title', e.target.value)}
            placeholder="My Awesome Project"
            required
            className={inputClass}
          />
        </FormField>
        <FormField label="Description">
          <textarea
            rows={3}
            value={form.description}
            onChange={e => setField('description', e.target.value)}
            placeholder="Brief description of what this project does..."
            className={textareaClass}
          />
        </FormField>
        <FormField label="Screenshot / Image" hint="Upload project screenshot or demo image (max 2MB)">
          <ImageUpload
            value={form.projectImage}
            onChange={(url) => setField('projectImage', url)}
            onError={(msg) => showToast('error', msg)}
          />
        </FormField>
        <FormField label="Live URL">
          <input
            type="url"
            value={form.liveUrl}
            onChange={e => setField('liveUrl', e.target.value)}
            placeholder="https://myproject.com"
            className={inputClass}
          />
        </FormField>
        <FormField label="Tags" hint="Comma-separated list of technologies">
          <input
            type="text"
            value={form.tags}
            onChange={e => setField('tags', e.target.value)}
            placeholder="React, Next.js, TypeScript, Tailwind"
            className={inputClass}
          />
        </FormField>
      </FormModal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Project"
        message="This will permanently remove the project from your portfolio. This action cannot be undone."
        confirmLabel="Delete Project"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
