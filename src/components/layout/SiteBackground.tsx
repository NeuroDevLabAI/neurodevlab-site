/**
 * Ambient background: 2-3 blurred aurora blobs at low opacity, behind all
 * content (-z-10). Atmosphere, never the subject. The `.noise` overlay (last
 * child of this layer) sits over the blobs to kill 8-bit gradient banding.
 * The aurora animates translate only (compositor-friendly); the global
 * reduced-motion rule freezes it.
 */
export function SiteBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-[12%] -top-[12%] h-[55vh] w-[55vh] rounded-full bg-accent/20 blur-[90px] animate-aurora" />
      <div className="absolute -bottom-[18%] -right-[10%] h-[60vh] w-[60vh] rounded-full bg-accent-2/15 blur-[100px] animate-aurora [animation-delay:-12s]" />
      <div className="absolute left-1/2 top-1/3 hidden h-[42vh] w-[42vh] -translate-x-1/2 rounded-full bg-[#4c1d95]/20 blur-[90px] animate-aurora [animation-delay:-22s] sm:block" />
      <div className="noise absolute inset-0 opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
