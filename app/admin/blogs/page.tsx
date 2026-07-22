'use client';
import { useEffect, useState, useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import PageHeader from '@/components/admin/PageHeader';
import ItemCard from '@/components/admin/ItemCard';
import EmptyState from '@/components/admin/EmptyState';
import FormModal from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import FormField, { inputClass, textareaClass } from '@/components/admin/FormField';

interface Blog {
  id: number;
  image: string | null;
  title: string;
  description: string | null;
  url: string | null;
}

interface FormData { title: string; description: string; image: string; url: string; }
const EMPTY_FORM: FormData = { title: '', description: '', image: '', url: '' };

export default function BlogsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Blog[]>([]);
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
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setItems(data.blogs || []);
    } catch {
      showToast('error', 'Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (item: Blog) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description || '', image: item.image || '', url: item.url || '' });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { id: editingId, ...form, title: form.title.trim() };
      const res = await fetch('/api/blogs', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Failed to save blog post.');
      } else {
        showToast('success', editingId ? 'Blog post updated!' : 'Blog post created!');
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
      const res = await fetch(`/api/blogs?id=${confirmId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Failed to delete blog post.');
      } else {
        showToast('success', 'Blog post deleted.');
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
        title="Blog Posts"
        description={`${items.length} blog post${items.length !== 1 ? 's' : ''} published`}
        icon={BookOpen}
        onAdd={openAdd}
        addLabel="Add Blog Post"
        onRefresh={fetchData}
        loading={loading}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No blog posts yet"
          description="Share your knowledge and experiences by publishing blog posts."
          actionLabel="Add Blog Post"
          onAction={openAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <ItemCard
              key={item.id}
              id={item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              url={item.url}
              urlLabel="Read Article"
              accentColor="emerald"
              onEdit={() => openEdit(item)}
              onDelete={() => setConfirmId(item.id)}
            />
          ))}
        </div>
      )}

      <FormModal
        open={modalOpen}
        title={editingId ? 'Edit Blog Post' : 'Add Blog Post'}
        onClose={closeModal}
        onSubmit={handleSave}
        loading={saving}
        submitLabel={editingId ? 'Update Post' : 'Publish Post'}
      >
        <FormField label="Title" required>
          <input type="text" value={form.title} onChange={e => setField('title', e.target.value)}
            placeholder="How I built my portfolio with Next.js" required className={inputClass} />
        </FormField>
        <FormField label="Summary / Description">
          <textarea rows={3} value={form.description} onChange={e => setField('description', e.target.value)}
            placeholder="A short summary of what this post covers..." className={textareaClass} />
        </FormField>
        <FormField label="Cover Image URL">
          <input type="text" value={form.image} onChange={e => setField('image', e.target.value)}
            placeholder="https://example.com/cover.jpg" className={inputClass} />
        </FormField>
        <FormField label="Article URL" hint="Link to the full article (e.g. Medium, Dev.to, your blog)">
          <input type="url" value={form.url} onChange={e => setField('url', e.target.value)}
            placeholder="https://medium.com/@you/article-slug" className={inputClass} />
        </FormField>
      </FormModal>

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Blog Post"
        message="This will permanently remove the blog post. This action cannot be undone."
        confirmLabel="Delete Post"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
