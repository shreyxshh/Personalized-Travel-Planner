import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Globe,
  Clock,
  AlertCircle,
  ShieldCheck,
  Send,
  MessageCircle,
  Mail,
  Trash2
} from 'lucide-react';
import { Modal } from '../Modal';
import { api } from '../../api/client';

interface ShareTripDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripTitle: string;
  destination: string;
}

export const ShareTripDialog: React.FC<ShareTripDialogProps> = ({
  isOpen,
  onClose,
  tripId,
  tripTitle,
  destination,
}) => {
  const [expiresInDays, setExpiresInDays] = useState<number>(30);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [shareId, setShareId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateShare = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.createShare(tripId, expiresInDays);
      const fullUrl = `${window.location.origin}${res.share_url}`;
      setShareUrl(fullUrl);
      setShareId(res.id);
    } catch (err: any) {
      setError(err.message || 'Failed to create share link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRevoke = async () => {
    if (!shareId) return;
    if (!window.confirm('Revoke this share link? Anyone holding this link will lose access immediately.')) return;
    try {
      setIsLoading(true);
      await api.revokeShare(shareId);
      setShareUrl('');
      setShareId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to revoke link.');
    } finally {
      setIsLoading(false);
    }
  };

  const shareText = encodeURIComponent(`Check out our travel itinerary for ${destination}: ${shareUrl}`);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Trip Summary" maxWidth="max-w-lg">
      <div className="space-y-6">
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Create an unguessable read-only link to share your {destination} itinerary with friends, family, or travel companions.
        </p>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!shareUrl ? (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Link Expiration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '7 Days', val: 7 },
                  { label: '30 Days', val: 30 },
                  { label: '90 Days', val: 90 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setExpiresInDays(item.val)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      expiresInDays === item.val
                        ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateShare}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-bold shadow-md shadow-brand-700/20 transition-all disabled:opacity-50 hover:scale-[1.01]"
            >
              <Share2 className="w-4 h-4" />
              {isLoading ? 'Generating Link...' : 'Generate Shareable Link'}
            </button>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Shareable Link
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Expires in {expiresInDays} days
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full text-xs font-mono text-slate-800 px-2 outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white transition-colors shrink-0 shadow-xs"
                title="Copy link to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {copied && (
              <p className="text-xs font-semibold text-emerald-600 text-center animate-in fade-in">
                Link copied to clipboard!
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleRevoke}
                disabled={isLoading}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold hover:underline"
              >
                Revoke Link
              </button>
              <button
                type="button"
                onClick={() => {
                  setShareUrl('');
                  setShareId(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Create New Link
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
