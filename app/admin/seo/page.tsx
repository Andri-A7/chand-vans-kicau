export const dynamic = "force-dynamic";

import { prisma } from "../../../lib/prisma";
import SeoForm from "./_components/SeoForm";

const pages = [
  { slug: "home", label: "Beranda (/)" },
  { slug: "birds", label: "Katalog (/birds)" },
  { slug: "blog", label: "Blog (/blog)" },
];

export default async function AdminSeoPage() {
  const seoSettings = await prisma.seoSetting.findMany();
  const seoMap = Object.fromEntries(seoSettings.map((s) => [s.pageSlug, s]));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">SEO Settings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Meta title, description, dan Open Graph per halaman</p>
      </div>

      <div className="space-y-4">
        {pages.map((page) => (
          <div key={page.slug} className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
            <h2 className="text-sm font-bold text-slate-200 mb-4">📄 {page.label}</h2>
            <SeoForm
              pageSlug={page.slug}
              initialData={seoMap[page.slug] ?? null}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
