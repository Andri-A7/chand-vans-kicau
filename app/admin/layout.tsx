import { verifySession } from "../../lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "../../actions/auth.actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await verifySession();
  if (!isAuth) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-48 bg-white border-r border-gray-100 flex flex-col fixed h-full">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Chan Vans</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <a href="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
            Dashboard
          </a>
          <a href="/admin/birds" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
            Burung
          </a>
          <a href="/admin/rings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
            Ring
          </a>
          <a href="/admin/inquiries" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
            Inquiry
          </a>
        </nav>
        <div className="px-3 py-4 border-t border-gray-100">
          <form action={logoutAction}>
            <button type="submit" className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Keluar
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 ml-48 p-6">
        {children}
      </main>
    </div>
  );
}
