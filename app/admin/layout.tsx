"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "../../actions/auth.actions";
import {
  LayoutDashboard, Bird, CircleDot, CreditCard,
  Image, Star, FileText, Search, Settings,
  MessageSquare, LogOut, ChevronDown,
} from "lucide-react";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

type NavGroup = {
  label: string;
  emoji: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "IKHTISAR",
    emoji: "📊",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "KOLEKSI & STOK",
    emoji: "🐦",
    items: [
      { href: "/admin/birds", label: "Data Burung", icon: Bird },
      { href: "/admin/rings", label: "Ring Trah", icon: CircleDot },
    ],
  },
  {
    label: "KEUANGAN",
    emoji: "💰",
    items: [
      { href: "/admin/payments", label: "Bukti Transfer", icon: CreditCard },
    ],
  },
  {
    label: "PROMOSI & KONTEN",
    emoji: "📢",
    items: [
      { href: "/admin/banners", label: "Banner Promo", icon: Image },
      { href: "/admin/reviews", label: "Ulasan", icon: Star },
      { href: "/admin/posts", label: "Blog Artikel", icon: FileText },
    ],
  },
  {
    label: "SEO & PENGATURAN",
    emoji: "⚙️",
    items: [
      { href: "/admin/seo", label: "SEO Settings", icon: Search },
      { href: "/admin/settings", label: "Pengaturan Toko", icon: Settings },
      { href: "/admin/inquiries", label: "Inquiry", icon: MessageSquare },
    ],
  },
];

const mobileNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/birds", label: "Burung", icon: Bird },
  { href: "/admin/payments", label: "Bayar", icon: CreditCard },
  { href: "/admin/banners", label: "Banner", icon: Image },
  { href: "/admin/settings", label: "Setting", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (pathname === "/admin/login") return <>{children}</>;

  function toggleGroup(label: string) {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-60 flex-col fixed h-full border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl z-30 overflow-y-auto">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800/80 shrink-0">
          <Link href="/admin/dashboard" className="font-bold text-white tracking-tight text-sm">
            Chan Vans <span className="text-emerald-500">Kicau</span>
          </Link>
          <p className="text-[11px] text-slate-500 mt-0.5">Admin Panel</p>
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 px-3 py-4 space-y-4">
          {navGroups.map((group) => {
            const isCollapsed = collapsed[group.label];
            const hasActive = group.items.some((item) => pathname.startsWith(item.href));

            return (
              <div key={group.label}>
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-2 mb-1.5 group">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {group.emoji} {group.label}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {group.items.map(({ href, label, icon: Icon }) => {
                      const active = pathname.startsWith(href);
                      return (
                        <Link key={href} href={href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            active
                              ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/20"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                          }`}>
                          <Icon className={`w-4 h-4 shrink-0 ${active ? "text-emerald-400" : "text-slate-500"}`} />
                          <span className="truncate">{label}</span>
                          {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-800/80 shrink-0">
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
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
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
        <div className="flex-1 p-4 md:p-6">{children}</div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden sticky bottom-0 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-2 py-2 grid grid-cols-5 gap-1 z-20">
          {mobileNavItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all ${
                  active ? "text-emerald-400 bg-emerald-500/10" : "text-slate-600 hover:text-slate-300"
                }`}>
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-medium truncate w-full text-center">{label}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
