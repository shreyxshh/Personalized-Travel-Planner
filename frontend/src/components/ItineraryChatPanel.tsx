import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Lock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  MessageSquare,
  Wand2,
} from 'lucide-react';
import { api } from '../api/client';
import { Itinerary, RefinementMessage } from '../types';

interface ItineraryChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  destination: string;
  currentItinerary: Itinerary;
  lockedActivityIds: string[];
  onUnlockActivity: (activityId: string) => void;
  onClearLocked: () => void;
  onItineraryUpdated: (updatedItinerary: Itinerary) => void;
}

export const ItineraryChatPanel: React.FC<ItineraryChatPanelProps> = ({
  isOpen,
  onClose,
  tripId,
  destination,
  currentItinerary,
  lockedActivityIds,
  onUnlockActivity,
  onClearLocked,
  onItineraryUpdated,
}) => {
  const [messages, setMessages] = useState<RefinementMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI travel co-pilot for ${destination}. Tell me how you'd like to adjust your trip (e.g., 'Make day 2 more relaxed', 'Swap evening dinner for budget street food', or 'Add sunset photography spots'). Any activities you've locked with the padlock will be strictly preserved!`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [targetDay, setTargetDay] = useState<number | undefined>(undefined);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickPromptChips = [
    'Make Day 2 more relaxed',
    'Add authentic street food dinner',
    'Add an outdoor scenic hike',
    'Find romantic sunset spots',
    'Reduce daily walking distance',
    'Make schedule kid-friendly',
  ];

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputText).trim();
    if (!text || isSending) return;

    setError(null);
    const userMsg: RefinementMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.refineItinerary(tripId, {
        message: text,
        target_day: targetDay,
        preserve_activity_ids: lockedActivityIds,
        conversation_history: historyPayload,
      });

      const explanation = res.assistant_message || res.explanation || 'Refinement complete.';
      const changes = res.summary_of_changes || (res.changes_summary ? [res.changes_summary] : []);

      const assistantMsg: RefinementMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: explanation,
        summary_of_changes: changes,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      onItineraryUpdated(res.itinerary);
    } catch (err: any) {
      setError(err.message || 'Failed to refine itinerary. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const totalDays = currentItinerary?.days?.length || 3;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-forest-500 text-white flex items-center justify-center shadow-xs">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              Conversational Refinement
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                v{currentItinerary.version || 1}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Fine-tune {destination} in real time</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Locked Activities Bar */}
      {lockedActivityIds.length > 0 && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900 font-semibold">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>{lockedActivityIds.length} activity pinned & protected</span>
          </div>
          <button
            type="button"
            onClick={onClearLocked}
            className="text-[11px] font-bold text-amber-800 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Target Day Selector */}
      <div className="px-4 py-2 border-b border-slate-200 bg-white flex items-center gap-2 text-xs text-slate-600 overflow-x-auto">
        <span className="shrink-0 font-bold text-slate-400">Scope:</span>
        <button
          type="button"
          onClick={() => setTargetDay(undefined)}
          className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-colors ${
            targetDay === undefined
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Entire Trip
        </button>
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((dNum) => (
          <button
            key={dNum}
            type="button"
            onClick={() => setTargetDay(dNum)}
            className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              targetDay === dNum
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Day {dNum}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-4 py-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-950 text-white rounded-br-xs shadow-xs'
                  : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-2xs'
              }`}
            >
              <p className="font-normal">{msg.content}</p>

              {msg.summary_of_changes && msg.summary_of_changes.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 space-y-1">
                  <span className="font-black text-[10px] uppercase tracking-wider text-brand-900 block">
                    Modifications made:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                    {msg.summary_of_changes.map((change, idx) => (
                      <li key={idx}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-white border border-slate-200 max-w-[80%] text-xs text-slate-600 shadow-2xs">
            <Sparkles className="w-4 h-4 animate-spin text-brand-600 shrink-0" />
            <span className="font-medium">Refining schedule with AI engine...</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-4 py-2.5 border-t border-slate-200 bg-white">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
          Suggested Prompts
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickPromptChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleSend(chip)}
              disabled={isSending}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-[11px] font-bold text-slate-700 hover:text-brand-900 shrink-0 transition-colors disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              targetDay
                ? `Ask anything about Day ${targetDay}...`
                : 'e.g. Make schedule more relaxed, add wine tasting...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
            className="flex-1 px-4 py-2.5 text-xs rounded-2xl border border-slate-200 focus:border-brand-600 outline-none text-slate-800 disabled:bg-slate-100 shadow-2xs font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-semibold transition-all disabled:opacity-40 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
