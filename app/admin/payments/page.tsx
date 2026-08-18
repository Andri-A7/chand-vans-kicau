export const dynamic = "force-dynamic";

import { getAllPayments } from "../../../services/payment.service";
import { approvePaymentAction, rejectPaymentAction } from "../../../actions/payment.actions";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default async function AdminPaymentsPage() {
  const payments = await getAllPayments();

  const pending = payments.filter((p) => p.status === "PENDING").length;
  const approved = payments.filter((p) => p.status === "APPROVED").length;
  const rejected = payments.filter((p) => p.status === "REJECTED").length;

  const statusConfig = {
    PENDING: { label: "Menunggu", class: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Clock },
    APPROVED: { label: "Disetujui", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
    REJECTED: { label: "Ditolak", class: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Verifikasi Pembayaran</h1>
        <p className="text-sm text-slate-400 mt-0.5">{payments.length} total · {pending} menunggu</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Menunggu", value: pending, color: "from-amber-500 to-orange-500", glow: "shadow-amber-500/20" },
          { label: "Disetujui", value: approved, color: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/20" },
          { label: "Ditolak", value: rejected, color: "from-red-500 to-rose-500", glow: "shadow-red-500/20" },
        ].map(({ label, value, color, glow }) => (
          <div key={label} className={`rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl ${glow}`}>
            <p className="text-2xl font-extrabold text-white">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {payments.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-12 text-center">
          <p className="text-slate-500 text-sm">Belum ada bukti pembayaran</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => {
            const s = statusConfig[payment.status];
            const Icon = s.icon;
            return (
              <div key={payment.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-4">
                <div className="flex items-start gap-4">
                  {/* Proof image */}
                  <a href={payment.proofImageUrl} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hover:opacity-80 transition-opacity">
                    <img src={payment.proofImageUrl} alt="Bukti" className="w-full h-full object-cover" />
                  </a>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-white text-sm">{payment.buyerName}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${s.class}`}>
                        <Icon className="w-3 h-3" />
                        {s.label}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        payment.paymentType === "FULL"
                          ? "bg-violet-500/20 text-violet-400 border-violet-500/30"
                          : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                      }`}>
                        {payment.paymentType === "FULL" ? "Lunas" : "DP"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">📱 {payment.buyerWhatsapp}</p>
                    <p className="text-sm font-bold text-emerald-400 mt-1">
                      Rp {payment.amountPaid.toLocaleString("id-ID")}
                    </p>
                    {payment.bird && (
                      <p className="text-xs text-slate-500 mt-1">
                        🐦 {payment.bird.title}
                        <span className={`ml-2 inline-flex px-1.5 py-0.5 rounded text-[10px] ${
                          payment.bird.status === "AVAILABLE" ? "bg-emerald-500/20 text-emerald-400" :
                          payment.bird.status === "RESERVED" ? "bg-amber-500/20 text-amber-400" :
                          "bg-slate-700 text-slate-400"
                        }`}>
                          {payment.bird.status}
                        </span>
                      </p>
                    )}
                    <p className="text-[11px] text-slate-600 mt-1">
                      {new Date(payment.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions — only for PENDING */}
                {payment.status === "PENDING" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800/80">
                    <form action={async () => {
                      "use server";
                      await approvePaymentAction(payment.id);
                    }} className="flex-1">
                      <button type="submit"
                        className="w-full flex items-center justify-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 py-2 rounded-xl text-sm font-semibold transition-all">
                        <CheckCircle className="w-4 h-4" /> Setujui
                      </button>
                    </form>
                    <form action={async () => {
                      "use server";
                      await rejectPaymentAction(payment.id);
                    }} className="flex-1">
                      <button type="submit"
                        className="w-full flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-2 rounded-xl text-sm font-semibold transition-all">
                        <XCircle className="w-4 h-4" /> Tolak
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
