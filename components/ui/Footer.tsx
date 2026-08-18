import Link from "next/link";
import { SiteSetting } from "../../app/generated/prisma";

type Props = {
  settings: SiteSetting;
};

export default function Footer({ settings }: Props) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Chan Vans <span className="text-emerald-500">Kicau</span>
            </p>
            {settings.tagline && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{settings.tagline}</p>
            )}
            {settings.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{settings.description}</p>
            )}
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Navigasi</p>
            <div className="space-y-2">
              {[
                { href: "/", label: "Beranda" },
                { href: "/birds", label: "Katalog Burung" },
                { href: "/blog", label: "Blog & Artikel" },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="block text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Kontak</p>
            <div className="space-y-2">
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  💬 WhatsApp
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-pink-500 transition-colors">
                  📷 Instagram
                </a>
              )}
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
                  👥 Facebook
                </a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors">
                  ▶️ YouTube
                </a>
              )}
              {settings.address && (
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                  📍 {settings.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps */}
        {settings.googleMapsUrl && (
          <div className="mt-6">
            <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
              🗺️ Lihat di Google Maps →
            </a>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">© 2025 {settings.storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
