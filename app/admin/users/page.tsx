'use client';
import { useEffect, useState, useCallback } from 'react';
import { Users, Shield } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { Column } from '@/components/admin/DataTable';
import EmptyState from '@/components/admin/EmptyState';
import FormModal from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import FormField, { inputClass } from '@/components/admin/FormField';

interface User {
  id: number;
  email: string;
  username: string;
  createdAt: string;
}

interface FormData { email: string; username: string; password: string; }
const EMPTY_FORM: FormData = { email: '', username: '', password: '' };

const COLUMNS: Column<User>[] = [
  {
    key: 'id',
    label: 'ID',
    className: 'w-16 font-mono text-xs text-gray-600',
    render: v => `#${v}`,
  },
  {
    key: 'username',
    label: 'Username',
    render: (v) => (
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-blue-600/25 border border-blue-500/25 flex items-center justify-center text-blue-300 text-xs font-bold shrink-0">
          {String(v).charAt(0).toUpperCase()}
        </div>
        <span className="text-white font-medium text-sm">{String(v)}</span>
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    className: 'text-gray-400 text-sm',
  },
  {
    key: 'createdAt',
    label: 'Created',
    className: 'text-xs text-gray-500',
    render: v => v ? new Date(String(v)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
  },
];

export default function UsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
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
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      showToast('error', 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (user: User) => {
    setEditingId(user.id);
    setForm({ email: user.email, username: user.username, password: '' });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { id: editingId, ...form };
      const res = await fetch('/api/users', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Failed to save user.');
      } else {
        showToast('success', editingId ? 'User updated!' : 'User created!');
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
      const res = await fetch(`/api/users?id=${confirmId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Failed to delete user.');
      } else {
        showToast('success', 'User deleted.');
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
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Admin Users"
        description={`${users.length} user${users.length !== 1 ? 's' : ''} with admin access`}
        icon={Users}
        onAdd={openAdd}
        addLabel="Add User"
        onRefresh={fetchData}
        loading={loading}
      />

      {/* Security Notice */}
      <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl px-5 py-4 mb-6">
        <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-300 leading-relaxed">
          All users listed here have full admin access to the dashboard. Passwords are stored securely using bcrypt hashing. 
          When editing, leave the password field empty to keep the existing password.
        </p>
      </div>

      {users.length === 0 && !loading ? (
        <EmptyState
          icon={Users}
          title="No admin users"
          description="Add admin users who can access and manage this dashboard."
          actionLabel="Add User"
          onAction={openAdd}
        />
      ) : (
        <DataTable
          columns={COLUMNS}
          rows={users}
          onEdit={openEdit}
          onDelete={id => setConfirmId(id)}
          loading={loading}
          emptyMessage="No admin users found."
        />
      )}

      <FormModal
        open={modalOpen}
        title={editingId ? 'Edit Admin User' : 'Add Admin User'}
        onClose={closeModal}
        onSubmit={handleSave}
        loading={saving}
        submitLabel={editingId ? 'Update User' : 'Create User'}
      >
        <FormField label="Email Address" required>
          <input
            type="email"
            value={form.email}
            onChange={e => setField('email', e.target.value)}
            placeholder="admin@example.com"
            required
            autoComplete="email"
            className={inputClass}
          />
        </FormField>
        <FormField label="Username" required>
          <input
            type="text"
            value={form.username}
            onChange={e => setField('username', e.target.value)}
            placeholder="admin"
            required
            className={inputClass}
          />
        </FormField>
        <FormField
          label="Password"
          required={!editingId}
          hint={editingId ? 'Leave blank to keep the current password. Min. 6 characters to change.' : 'Minimum 6 characters.'}
        >
          <input
            type="password"
            value={form.password}
            onChange={e => setField('password', e.target.value)}
            placeholder={editingId ? '••••••  (leave blank to keep current)' : '••••••••'}
            required={!editingId}
            minLength={editingId ? undefined : 6}
            autoComplete="new-password"
            className={inputClass}
          />
        </FormField>
      </FormModal>

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Admin User"
        message="This will permanently remove this user's admin access. They will no longer be able to log in to the dashboard."
        confirmLabel="Delete User"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
