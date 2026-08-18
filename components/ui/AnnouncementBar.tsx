"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  text: string;
};

export default function AnnouncementBar({ text }: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || !text) return null;

  return (
    <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-2 px-4 text-center overflow-hidden">
      <div className="flex items-center justify-center gap-2">
        <div className="overflow-hidden flex-1">
          <span className="inline-block animate-marquee whitespace-nowrap text-xs font-medium">
            {text} &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp; {text} &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp; {text}
          </span>
        </div>
        <button onClick={() => setDismissed(true)}
          className="shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
