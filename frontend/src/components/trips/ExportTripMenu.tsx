import React, { useState } from 'react';
import { Download, FileText, Calendar, Code, Check, Sparkles, X, ChevronDown } from 'lucide-react';
import { api } from '../../api/client';

interface ExportTripMenuProps {
  itineraryId: string;
  tripTitle: string;
}

export const ExportTripMenu: React.FC<ExportTripMenuProps> = ({ itineraryId, tripTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const [successFormat, setSuccessFormat] = useState<string | null>(null);

  const exportOptions = [
    {
      format: 'pdf' as const,
      label: 'PDF Publication Dossier',
      ext: '.pdf',
      icon: FileText,
      description: 'Publication-ready dossier with structured schedule, budgets, and travel tips.',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      format: 'markdown' as const,
      label: 'Markdown Notes',
      ext: '.md',
      icon: FileText,
      description: 'Clean Markdown tables and checklist format for Notion, Obsidian, or GitHub.',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      format: 'ics' as const,
      label: 'iCalendar (.ics)',
      ext: '.ics',
      icon: Calendar,
      description: 'Import activities directly into Apple Calendar, Google Calendar, or Outlook.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      format: 'json' as const,
      label: 'Structured JSON',
      ext: '.json',
      icon: Code,
      description: 'Machine-readable raw data payload for developers and custom integrations.',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  const handleExport = async (format: 'pdf' | 'markdown' | 'ics' | 'json') => {
    try {
      setExportingFormat(format);
      const safeFilename = `${tripTitle.replace(/\s+/g, '_')}_Itinerary.${format === 'markdown' ? 'md' : format}`;
      await api.exportItinerary(itineraryId, format, safeFilename);
      setSuccessFormat(format);
      setTimeout(() => setSuccessFormat(null), 2500);
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs hover:shadow-xs transition-all"
        title="Download itinerary dossier in multiple formats"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>Export</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-3xl bg-white border border-slate-200 shadow-2xl z-50 p-2.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Download Itinerary
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">Choose your preferred format</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              {exportOptions.map((opt) => {
                const Icon = opt.icon;
                const isExporting = exportingFormat === opt.format;
                const isSuccess = successFormat === opt.format;

                return (
                  <button
                    key={opt.format}
                    onClick={() => handleExport(opt.format)}
                    disabled={Boolean(exportingFormat)}
                    className="w-full text-left p-2.5 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3 border border-transparent hover:border-slate-200/80 group"
                  >
                    <div className={`p-2 rounded-xl border ${opt.color} shrink-0`}>
                      {isSuccess ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : isExporting ? (
                        <Sparkles className="w-4 h-4 animate-spin text-brand-600" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                          {opt.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{opt.ext}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-2">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
