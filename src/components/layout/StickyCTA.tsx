"use client";

import { useEffect, useState } from "react";
import { BriefCta } from "@/components/ui/BriefCta";
import { cn } from "@/lib/cn";

/** Mobile-only persistent bottom CTA bar — the single biggest conversion lever. */
export function StickyCTA({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/85 p-3 backdrop-blur-md transition-transform duration-300 ease-out md:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <BriefCta label={label} source="sticky_mobile" className="w-full" />
    </div>
  );
}
