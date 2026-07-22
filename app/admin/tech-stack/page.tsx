'use client';
import { useEffect, useState, useCallback } from 'react';
import { Cpu, Edit2, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import PageHeader from '@/components/admin/PageHeader';
import EmptyState from '@/components/admin/EmptyState';
import FormModal from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import FormField, { inputClass } from '@/components/admin/FormField';

interface TechGroup {
  id: number;
  name: string;
  color: string;
  techs: string[];
}

interface FormData { title: string; stacks: string; }
const EMPTY_FORM: FormData = { title: '', stacks: '' };

const BADGE_COLORS = [
  'bg-purple-500/10 border-purple-500/20 text-purple-300',
  'bg-blue-500/10 border-blue-500/20 text-blue-300',
  'bg-teal-500/10 border-teal-500/20 text-teal-300',
  'bg-amber-500/10 border-amber-500/20 text-amber-300',
  'bg-rose-500/10 border-rose-500/20 text-rose-300',
  'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
];

export default function TechStackPage() {
  const { showToast } = useToast();
  const [groups, setGroups] = useState<TechGroup[]>([]);
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
      setGroups(data.techStack || []);
    } catch {
      showToast('error', 'Failed to load tech stack.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (g: TechGroup) => {
    setEditingId(g.id);
    setForm({ title: g.name, stacks: Array.isArray(g.techs) ? g.techs.join(', ') : '' });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        type: 'techStack',
        id: editingId,
        title: form.title.trim(),
        stacks: form.stacks.split(',').map(t => t.trim()).filter(Boolean),
      };
      const res = await fetch('/api/portfolio', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Failed to save group.');
      } else {
        showToast('success', editingId ? 'Group updated!' : 'Group created!');
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
      const res = await fetch(`/api/portfolio?type=techStack&id=${confirmId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Failed to delete group.');
      } else {
        showToast('success', 'Tech group deleted.');
        setConfirmId(null);
        fetchData();
      }
    } catch {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Tech Stack"
        description={`${groups.length} technology group${groups.length !== 1 ? 's' : ''}`}
        icon={Cpu}
        onAdd={openAdd}
        addLabel="Add Group"
        onRefresh={fetchData}
        loading={loading}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <EmptyState
          icon={Cpu}
          title="No tech groups yet"
          description="Add technology groups to showcase your skills on the portfolio."
          actionLabel="Add Group"
          onAction={openAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, gi) => (
            <div
              key={group.id}
              className="bg-[#0e1117] border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200 shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: group.color }} />
                  <h3 className="text-sm font-bold text-white">{group.name}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">{group.techs?.length ?? 0} technologies</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(group)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmId(group.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(group.techs || []).map((tech, ti) => (
                  <span
                    key={ti}
                    className={`text-[10px] border px-2 py-0.5 rounded-md font-medium ${BADGE_COLORS[(gi + ti) % BADGE_COLORS.length]}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.07] flex items-center justify-between">
                <span className="text-[10px] text-gray-600 font-mono">#{group.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal
        open={modalOpen}
        title={editingId ? 'Edit Tech Group' : 'Add Tech Group'}
        onClose={closeModal}
        onSubmit={handleSave}
        loading={saving}
        submitLabel={editingId ? 'Update Group' : 'Create Group'}
      >
        <FormField label="Group Name" required>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="e.g. Frontend, Backend, DevOps"
            required
            className={inputClass}
          />
        </FormField>
        <FormField label="Technologies" hint="Comma-separated list of tech names">
          <input
            type="text"
            value={form.stacks}
            onChange={e => setForm(p => ({ ...p, stacks: e.target.value }))}
            placeholder="React, TypeScript, Next.js, Tailwind CSS"
            className={inputClass}
          />
        </FormField>
      </FormModal>

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Tech Group"
        message="This will permanently remove the tech group and all its technologies. This cannot be undone."
        confirmLabel="Delete Group"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
