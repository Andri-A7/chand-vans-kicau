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
};

export default function InquiryForm({
  birdId, birdTitle, birdSlug, ringCode, speciesName, price, waNumber,
}: Props) {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
  });
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
    setLoading(false);
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50">
      <h3 className="font-semibold text-gray-900 mb-1 text-sm">Tanya via WhatsApp</h3>
      <p className="text-xs text-gray-500 mb-4">Isi data kamu, pesan WhatsApp akan disiapkan otomatis.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Nama lengkap"
            value={form.customerName}
            onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.customerName && <p className="text-xs text-red-600 mt-1">{errors.customerName[0]}</p>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Nomor HP / WhatsApp"
            value={form.customerPhone}
            onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.customerPhone && <p className="text-xs text-red-600 mt-1">{errors.customerPhone[0]}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Kota / Alamat (opsional)"
            value={form.customerAddress}
            onChange={(e) => setForm((f) => ({ ...f, customerAddress: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Menyiapkan..." : "🐦 Tanya via WhatsApp"}
        </button>
      </form>
    </div>
  );
}
