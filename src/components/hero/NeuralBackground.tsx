"use client";

import { useEffect, useRef } from "react";

/**
 * Calm neural-graph hero motif: a sparse node cloud with near-neighbour edges,
 * ~6% of nodes pulsing as "active synapses", whole field parallaxing to the
 * cursor via eased lerp. Capped node count, pauses when off-screen, and renders
 * a single static frame under prefers-reduced-motion. Decorative (aria-hidden).
 */
export function NeuralBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const ACCENT = "139,92,246";
    const BLUE = "56,189,248";

    type Node = {
      x: number;
      y: number;
      bx: number;
      by: number;
      phase: number;
      speed: number;
      pulse: number;
    };

    let width = 0;
    let height = 0;
    let thresh = 0;
    let nodes: Node[] = [];
    let edges: Array<[number, number]> = [];
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let t = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function build() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const capMax = dpr < 1.5 || width < 700 ? 70 : 115;
      const count = Math.max(36, Math.min(capMax, Math.floor((width * height) / 14000)));
      nodes = Array.from({ length: count }, () => {
        const x = rand(0, width);
        const y = rand(0, height);
        return {
          x,
          y,
          bx: x,
          by: y,
          phase: rand(0, Math.PI * 2),
          speed: rand(0.2, 0.55),
          pulse: Math.random() < 0.06 ? rand(0, Math.PI * 2) : -1,
        };
      });

      thresh = Math.min(width, height) * 0.17;
      edges = [];
      const t2 = thresh * thresh;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].bx - nodes[j].bx;
          const dy = nodes[i].by - nodes[j].by;
          if (dx * dx + dy * dy < t2) edges.push([i, j]);
        }
      }
    }

    function draw() {
      if (width === 0 || height === 0) return;
      ctx!.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      const ox = pointer.x;
      const oy = pointer.y;

      for (const n of nodes) {
        if (reduced) {
          n.x = n.bx;
          n.y = n.by;
        } else {
          n.x = n.bx + Math.sin(t * n.speed + n.phase) * 3;
          n.y = n.by + Math.cos(t * n.speed + n.phase) * 3;
        }
      }

      ctx!.lineWidth = 1;
      for (const [a, b] of edges) {
        const na = nodes[a];
        const nb = nodes[b];
        const dx = na.x - nb.x;
        const dy = na.y - nb.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const alpha = 0.14 * (1 - d / thresh);
        if (alpha <= 0.005) continue;
        ctx!.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx!.beginPath();
        ctx!.moveTo(na.x + ox, na.y + oy);
        ctx!.lineTo(nb.x + ox, nb.y + oy);
        ctx!.stroke();
      }

      for (const n of nodes) {
        let r = 1.3;
        let color = "rgba(255,255,255,0.32)";
        if (n.pulse >= 0) {
          const p = reduced ? 0.6 : (Math.sin(t * 1.3 + n.pulse) + 1) / 2;
          r = 1.6 + p * 1.7;
          const c = n.pulse % 2 < 1 ? ACCENT : BLUE;
          color = `rgba(${c},${0.4 + p * 0.5})`;
        }
        ctx!.fillStyle = color;
        ctx!.beginPath();
        ctx!.arc(n.x + ox, n.y + oy, r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop() {
      t += 0.016;
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onPointer(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 22;
      pointer.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 22;
    }

    // Defer the O(n^2) build + first paint off the hydration / LCP critical path.
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const startup = () => {
      build();
      draw();
    };
    if (w.requestIdleCallback)
      idleId = w.requestIdleCallback(startup, { timeout: 600 });
    else timeoutId = window.setTimeout(startup, 200);
    const cancelStartup = () => {
      if (idleId !== undefined && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };

    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(canvas);

    if (reduced) {
      return () => {
        cancelStartup();
        ro.disconnect();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (visible && !raf) loop();
        else if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelStartup();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
