export const dynamic = "force-dynamic";

import { verifySession } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "../../../actions/auth.actions";

export default async function DashboardPage() {
  const isAuth = await verifySession();
  if (!isAuth) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">Chan Vans Kicau — Admin</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Keluar
          </button>
        </form>
      </header>
      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/admin/birds" className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
            <p className="text-sm text-gray-500">Burung</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">—</p>
          </a>
          <a href="/admin/rings" className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
            <p className="text-sm text-gray-500">Ring</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">—</p>
          </a>
          <a href="/admin/inquiries" className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
            <p className="text-sm text-gray-500">Inquiry</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">—</p>
          </a>
        </div>
      </main>
    </div>
  );
}
