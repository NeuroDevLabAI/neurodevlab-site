import { cn } from "@/lib/cn";

/** Neural-node mark: three connected nodes inside a rounded tile. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-7 w-7", className)}
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9"
        fill="#0f0f14"
        stroke="rgba(255,255,255,0.10)"
      />
      <path
        d="M10 22 L10 13 L22 19 L22 10"
        stroke="#8b5cf6"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx="10" cy="13" r="2.4" fill="#8b5cf6" />
      <circle cx="22" cy="19" r="2.4" fill="#38bdf8" />
      <circle cx="22" cy="10" r="1.8" fill="#fafafa" />
      <circle cx="10" cy="22" r="1.8" fill="#fafafa" />
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {withWordmark && (
        <span className="text-[15px] font-semibold tracking-tight text-fg">
          Neuro<span className="text-muted">Dev</span>Lab
        </span>
      )}
    </span>
  );
}
