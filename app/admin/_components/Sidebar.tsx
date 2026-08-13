"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bird,
  CircleDot,
  MessageSquare,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { logoutAction } from "../../../actions/auth.actions";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/birds", label: "Data Burung", icon: Bird },
  { href: "/admin/rings", label: "Data Ring", icon: CircleDot },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 text-slate-300">
      <div className="flex items-center gap-2 px-6 py-5">
        <span className="text-2xl leading-none" aria-hidden="true">
          🐦
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Kicau Admin</p>
          <p className="text-xs text-slate-400">Chand Vans Kicau</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Navigasi utama">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">Admin</p>
            <p className="truncate text-xs text-slate-400">Administrator</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Keluar"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
