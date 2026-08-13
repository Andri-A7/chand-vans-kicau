export const dynamic = "force-dynamic";

import { getAllInquiries } from "../../../services/inquiry.service";

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Inquiry</h1>
        <p className="text-sm text-gray-500 mt-0.5">{inquiries.length} total</p>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">Belum ada inquiry masuk</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 text-sm">{inquiry.customerName}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${inquiry.waMessageSent ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {inquiry.waMessageSent ? "WA Terkirim" : "Belum dihubungi"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{inquiry.customerPhone}</p>
                  {inquiry.customerAddress && (
                    <p className="text-sm text-gray-500">{inquiry.customerAddress}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">
                    {new Date(inquiry.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {inquiry.bird && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-500">
                    Burung:{" "}
                    <a href={`/admin/birds/${inquiry.bird.id}/edit`} className="text-gray-900 hover:underline font-medium">
                      {inquiry.bird.title}
                    </a>
                    <span className={`ml-2 inline-flex px-1.5 py-0.5 rounded text-xs ${
                      inquiry.bird.status === "AVAILABLE" ? "bg-green-50 text-green-700" :
                      inquiry.bird.status === "RESERVED" ? "bg-yellow-50 text-yellow-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {inquiry.bird.status}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
