'use client';
import { useEffect, useState, useCallback } from 'react';
import { Trophy } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import PageHeader from '@/components/admin/PageHeader';
import ItemCard from '@/components/admin/ItemCard';
import EmptyState from '@/components/admin/EmptyState';
import FormModal from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import FormField, { inputClass, textareaClass } from '@/components/admin/FormField';

interface Achievement {
  id: number;
  image: string | null;
  title: string;
  description: string | null;
  url: string | null;
}

interface FormData { title: string; description: string; image: string; url: string; }
const EMPTY_FORM: FormData = { title: '', description: '', image: '', url: '' };

export default function AchievementsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Achievement[]>([]);
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
      const res = await fetch('/api/achievements');
      const data = await res.json();
      setItems(data.achievements || []);
    } catch {
      showToast('error', 'Failed to load achievements.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (item: Achievement) => {
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
      const res = await fetch('/api/achievements', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Failed to save.');
      } else {
        showToast('success', editingId ? 'Achievement updated!' : 'Achievement added!');
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
      const res = await fetch(`/api/achievements?id=${confirmId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Failed to delete.');
      } else {
        showToast('success', 'Achievement deleted.');
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
        title="Achievements"
        description={`${items.length} achievement${items.length !== 1 ? 's' : ''} displayed on your portfolio`}
        icon={Trophy}
        onAdd={openAdd}
        addLabel="Add Achievement"
        onRefresh={fetchData}
        loading={loading}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No achievements yet"
          description="Add awards, certifications, and milestones to your portfolio."
          actionLabel="Add Achievement"
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
              urlLabel="View Certificate"
              accentColor="amber"
              onEdit={() => openEdit(item)}
              onDelete={() => setConfirmId(item.id)}
            />
          ))}
        </div>
      )}

      <FormModal
        open={modalOpen}
        title={editingId ? 'Edit Achievement' : 'Add Achievement'}
        onClose={closeModal}
        onSubmit={handleSave}
        loading={saving}
        submitLabel={editingId ? 'Update Achievement' : 'Add Achievement'}
      >
        <FormField label="Title" required>
          <input type="text" value={form.title} onChange={e => setField('title', e.target.value)}
            placeholder="Best Developer Award 2024" required className={inputClass} />
        </FormField>
        <FormField label="Description">
          <textarea rows={3} value={form.description} onChange={e => setField('description', e.target.value)}
            placeholder="Brief description of this achievement..." className={textareaClass} />
        </FormField>
        <FormField label="Image URL" hint="Certificate or badge image URL">
          <input type="text" value={form.image} onChange={e => setField('image', e.target.value)}
            placeholder="https://example.com/certificate.png" className={inputClass} />
        </FormField>
        <FormField label="Link URL" hint="Link to certificate or proof">
          <input type="url" value={form.url} onChange={e => setField('url', e.target.value)}
            placeholder="https://credly.com/badges/..." className={inputClass} />
        </FormField>
      </FormModal>

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Achievement"
        message="This will permanently remove the achievement from your portfolio."
        confirmLabel="Delete Achievement"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
