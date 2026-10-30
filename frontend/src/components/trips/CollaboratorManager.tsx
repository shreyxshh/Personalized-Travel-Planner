import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Trash2, Mail, Check, AlertCircle, RotateCcw } from 'lucide-react';
import { Modal } from '../Modal';
import { Badge } from '../Badge';
import { api } from '../../api/client';
import { Collaborator } from '../../types';

interface CollaboratorManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

export const CollaboratorManager: React.FC<CollaboratorManagerProps> = ({
  isOpen,
  onClose,
  tripId,
}) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState<'viewer' | 'editor'>('viewer');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && tripId) {
      loadCollaborators();
    }
  }, [isOpen, tripId]);

  const loadCollaborators = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const list = await api.getCollaborators(tripId);
      setCollaborators(list || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load collaborators.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    try {
      setIsAdding(true);
      setError(null);
      const created = await api.addCollaborator(tripId, emailInput.trim(), roleInput);
      setCollaborators((prev) => [...prev.filter((c) => c.id !== created.id), created]);
      setEmailInput('');
      setSuccessMsg(`Added ${created.email} as ${created.role}!`);
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to add collaborator.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRoleChange = async (collabId: string, newRole: 'viewer' | 'editor') => {
    try {
      setError(null);
      const updated = await api.updateCollaborator(tripId, collabId, newRole);
      setCollaborators((prev) =>
        prev.map((c) => (c.id === collabId ? { ...c, role: updated.role } : c))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update role.');
    }
  };

  const handleRemove = async (collabId: string, email: string) => {
    if (!window.confirm(`Remove ${email} from this trip?`)) return;
    try {
      setError(null);
      await api.removeCollaborator(tripId, collabId);
      setCollaborators((prev) => prev.filter((c) => c.id !== collabId));
    } catch (err: any) {
      setError(err.message || 'Failed to remove collaborator.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trip Collaborators & Friends" maxWidth="max-w-xl">
      <div className="space-y-6">
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Invite travel companions to plan this trip together. <strong>Editors</strong> can refine schedules, lock activities, and adjust stops. <strong>Viewers</strong> have private read access to all itinerary details.
        </p>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Invite Form */}
        <form onSubmit={handleAdd} className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Invite New Collaborator
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="friend@voyex.app"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-brand-600 outline-none text-slate-800 bg-white shadow-2xs font-medium"
              />
            </div>
            <select
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value as any)}
              className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white shrink-0 w-full sm:w-auto shadow-2xs"
            >
              <option value="viewer">Viewer (Read-only)</option>
              <option value="editor">Editor (Can refine)</option>
            </select>
            <button
              type="submit"
              disabled={isAdding}
              className="py-2 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 w-full sm:w-auto disabled:opacity-50 hover:scale-[1.02]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              {isAdding ? 'Inviting...' : 'Invite'}
            </button>
          </div>
        </form>

        {/* Collaborators List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Current Collaborators ({collaborators.length})
          </h4>

          {isLoading ? (
            <div className="py-8 text-center text-slate-400">
              <RotateCcw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-600" />
              <p className="text-xs">Loading collaborators...</p>
            </div>
          ) : collaborators.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50/60 rounded-3xl border border-dashed border-slate-300">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No collaborators invited yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Invite travel companions to plan schedules together in real-time.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {collaborators.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-brand-200 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-bold uppercase border border-brand-200">
                      {c.email[0]}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">{c.email}</span>
                      <span className="text-[10px] text-slate-400">Added {new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={c.role}
                      onChange={(e) => handleRoleChange(c.id, e.target.value as any)}
                      className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </select>

                    <button
                      onClick={() => handleRemove(c.id, c.email)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove collaborator"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
