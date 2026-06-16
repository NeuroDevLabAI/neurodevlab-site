import { cn } from "@/lib/cn";

/**
 * Honest availability signal. The dot is green + pulsing when accepting work.
 * Source of truth is env (NEXT_PUBLIC_ACCEPTING_CLIENTS) — must stay truthful;
 * fake scarcity is both a trust-killer and an EU DSA/digital-fairness risk.
 */
export function AvailabilityBadge({
  available,
  label,
  className,
}: {
  available: boolean;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-[13px] text-muted backdrop-blur-sm",
        className,
      )}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {available && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            available ? "bg-success" : "bg-subtle",
          )}
        />
      </span>
      {label}
    </span>
  );
}
