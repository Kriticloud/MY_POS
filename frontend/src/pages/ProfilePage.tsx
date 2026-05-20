import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Camera, Save, Key } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useChangePassword } from '../hooks/useApi';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { validate, validateRequired, validateMinLength } from '../utils/validation';

export function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const changePassword = useChangePassword();
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', avatar: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ firstName: user.firstName || '', lastName: user.lastName || '', phone: (user as any).phone || '', avatar: (user as any).avatar || '' });
  }, [user]);

  const handleSave = async () => {
    if (!validate([validateRequired(form.firstName, 'firstName', 'First name')])) return;
    setSaving(true);
    try {
      const { data } = await api.put('/auth/me', form);
      if (data.data) setUser(data.data);
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    if (!validate([
      validateRequired(passwordForm.currentPassword, 'currentPassword', 'Current password'),
      validateRequired(passwordForm.newPassword, 'newPassword', 'New password'),
      validateMinLength(passwordForm.newPassword, 6, 'newPassword', 'New password'),
    ])) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    try {
      await changePassword.mutateAsync({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch { toast.error('Failed to change password'); }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, avatar: reader.result as string });
    reader.readAsDataURL(file);
  };

  const initials = `${(form.firstName || '?')[0]}${(form.lastName || '')[0] || ''}`.toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Profile</h1>

      {/* Avatar & Basic Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            {form.avatar ? (
              <img src={form.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-blue-100 dark:border-blue-900">
                {initials}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-bold">{form.firstName} {form.lastName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <Shield className="w-3 h-3" /> {user?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <User className="w-3 h-3 inline mr-1" />First Name *
            </label>
            <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <User className="w-3 h-3 inline mr-1" />Last Name
            </label>
            <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <Mail className="w-3 h-3 inline mr-1" />Email
            </label>
            <input value={user?.email || ''} disabled
              className="w-full px-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 text-sm text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <Phone className="w-3 h-3 inline mr-1" />Phone
            </label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 text-sm" />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-amber-500" /> Change Password</h3>
        <div className="space-y-3 max-w-md">
          <input type="password" placeholder="Current Password" value={passwordForm.currentPassword}
            onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 text-sm" />
          <input type="password" placeholder="New Password (min 6 chars)" value={passwordForm.newPassword}
            onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 text-sm" />
          <input type="password" placeholder="Confirm New Password" value={passwordForm.confirmPassword}
            onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 text-sm" />
          <button onClick={handlePasswordChange} disabled={changePassword.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 disabled:opacity-50">
            <Key className="w-4 h-4" /> Change Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}
