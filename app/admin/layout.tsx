"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "../../actions/auth.actions";
import { LayoutDashboard, Bird, CircleDot, Image, Star, MessageSquare, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/birds", label: "Burung", icon: Bird },
  { href: "/admin/rings", label: "Ring", icon: CircleDot },
  { href: "/admin/banners", label: "Banner", icon: Image },
  { href: "/admin/reviews", label: "Ulasan", icon: Star },
  { href: "/admin/inquiries", label: "Inquiry", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-56 flex-col fixed h-full border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl z-30">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800/80">
          <Link href="/admin/dashboard" className="font-bold text-white tracking-tight text-sm">
            Chan Vans <span className="text-emerald-500">Kicau</span>
          </Link>
          <p className="text-[11px] text-slate-500 mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}>
                <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-500"}`} />
                {label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-800/80">
          <form action={logoutAction}>
            <button type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-4 h-14 flex items-center justify-between">
          <Link href="/admin/dashboard" className="font-bold text-white text-sm">
            Chan Vans <span className="text-emerald-500">Kicau</span>
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-xs text-slate-400 hover:text-white transition-colors">
              Keluar
            </button>
          </form>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden sticky bottom-0 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-2 py-2 grid grid-cols-6 gap-1 z-20">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all ${
                  active ? "text-emerald-400 bg-emerald-500/10" : "text-slate-600 hover:text-slate-300"
                }`}>
                <Icon className="w-4.5 h-4.5" />
                <span className="text-[9px] font-medium truncate w-full text-center">{label}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
