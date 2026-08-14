"use client";

import { useState } from "react";
import { createInquiryAction } from "../../../../actions/inquiry.actions";
import { generateWhatsAppUrl } from "../../../../lib/whatsapp";

type Props = {
  birdId: string;
  birdTitle: string;
  birdSlug: string;
  ringCode: string;
  speciesName: string;
  price: number | null;
  waNumber: string;
  compact?: boolean;
};

export default function InquiryForm({
  birdId, birdTitle, birdSlug, ringCode, speciesName, price, waNumber, compact = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerAddress: "" });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await createInquiryAction({
      birdId,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerAddress: form.customerAddress || undefined,
    });

    if (!result.success) {
      setErrors(result.errors ?? {});
      setLoading(false);
      return;
    }

    const waUrl = generateWhatsAppUrl({
      phone: waNumber,
      birdTitle,
      ringCode,
      speciesName,
      price,
      birdSlug,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerAddress: form.customerAddress || undefined,
    });

    window.open(waUrl, "_blank");
    setOpen(false);
    setLoading(false);
  }

  // Compact mode — just a button (for sticky bottom bar)
  if (compact) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 min-h-[48px] inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 active:scale-95 text-sm"
        >
          💬 Tanya WA
        </button>

        {/* Bottom sheet modal */}
        {open && (
          <div className="fixed inset-0 z-[60] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl p-6 shadow-2xl">
              <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Tanya via WhatsApp</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Isi data kamu, pesan WA disiapkan otomatis.</p>
              <FormFields form={form} setForm={setForm} errors={errors} loading={loading} onSubmit={handleSubmit} />
            </div>
          </div>
        )}
      </>
    );
  }

  // Full mode — inline form (for desktop)
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">🐦 Tanya via WhatsApp</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Isi data kamu, pesan WA disiapkan otomatis.</p>
      <FormFields form={form} setForm={setForm} errors={errors} loading={loading} onSubmit={handleSubmit} />
    </div>
  );
}

function FormFields({
  form, setForm, errors, loading, onSubmit,
}: {
  form: { customerName: string; customerPhone: string; customerAddress: string };
  setForm: React.Dispatch<React.SetStateAction<{ customerName: string; customerPhone: string; customerAddress: string }>>;
  errors: Record<string, string[]>;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <input type="text" placeholder="Nama lengkap" value={form.customerName}
          onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} required
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" />
        {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName[0]}</p>}
      </div>
      <div>
        <input type="tel" placeholder="Nomor HP / WhatsApp" value={form.customerPhone}
          onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))} required
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" />
        {errors.customerPhone && <p className="text-xs text-red-500 mt-1">{errors.customerPhone[0]}</p>}
      </div>
      <div>
        <input type="text" placeholder="Kota / Alamat (opsional)" value={form.customerAddress}
          onChange={(e) => setForm((f) => ({ ...f, customerAddress: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full min-h-[48px] bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 disabled:opacity-50 active:scale-95">
        {loading ? "Menyiapkan..." : "💬 Hubungi via WhatsApp"}
      </button>
    </form>
  );
}
