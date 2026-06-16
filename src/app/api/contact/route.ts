import { NextResponse } from "next/server";
import { z } from "zod";
import { CONTACT_EMAIL, CALENDLY_URL } from "@/lib/config";
import {
  EMAIL_RE,
  PROJECT_TYPE_LABELS,
  BUDGET_LABELS,
} from "@/lib/brief";

export const runtime = "nodejs";

/* ----------------------------------------------------------- rate limit ---
   Best-effort in-memory limiter: 3 requests / hour / IP. Serverless instances
   are ephemeral, so for hard guarantees move this to Vercel KV / Upstash
   (deferred — see CLAUDE.md / Addendum 1). */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

const ALLOWED_LOCALES = new Set(["en", "fr", "de", "it", "es"]);

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  // Bound memory: sweep stale keys if the map grows large.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      const fresh = v.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) hits.delete(k);
      else hits.set(k, fresh);
    }
  }
  return false;
}

/* ----------------------------------------------------------- validation ---
   zod shape + length caps; the email format reuses the shared EMAIL_RE so the
   client and server agree. Optional fields are length-capped here and mapped to
   known labels later (unknown values are dropped, never echoed → no injection). */
const briefSchema = z.object({
  name: z.string().max(200),
  email: z.string().max(200),
  message: z.string().max(5000),
  projectType: z.string().max(40).optional().default(""),
  budget: z.string().max(40).optional().default(""),
  volume: z.string().max(300).optional().default(""),
  locale: z.string().max(5).optional().default("en"),
  company_url: z.string().max(200).optional().default(""),
});

/** Collapse control chars to spaces — keeps a single-line field from spoofing
    extra "Label: value" lines in the plain-text Telegram/email payload. */
function oneLine(s: string): string {
  return s.replace(/[\r\n\t]+/g, " ").trim();
}

/* ------------------------------------------------------------- channels --- */
async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CLIENTS_CHAT_ID;
  if (!token || !chatId) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[contact] telegram HTTP ${res.status}: ${body}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] telegram error", err);
    return false;
  }
}

const CONFIRMATION: Record<string, { subject: string; body: (n: string) => string }> = {
  en: {
    subject: "Thanks — your proposal is on its way",
    body: (n) =>
      `Hi ${n},\n\nThanks for your brief to NeuroDevLab. I've got it and will reply within ~2 hours, with a tailored proposal within 24h.\n\nPrefer to talk? Book a free 30-min call: ${CALENDLY_URL}\n\n— NeuroDevLab, Lausanne`,
  },
  fr: {
    subject: "Merci — votre proposition arrive",
    body: (n) =>
      `Bonjour ${n},\n\nMerci pour votre brief à NeuroDevLab. Je l'ai bien reçu et je vous réponds d'ici ~2 heures, avec une proposition sur mesure sous 24h.\n\nVous préférez en parler ? Réservez un appel gratuit de 30 min : ${CALENDLY_URL}\n\n— NeuroDevLab, Lausanne`,
  },
  de: {
    subject: "Danke — Ihr Vorschlag ist unterwegs",
    body: (n) =>
      `Hallo ${n},\n\ndanke für Ihren Brief an NeuroDevLab. Ich habe ihn erhalten und melde mich in ~2 Stunden, mit einem massgeschneiderten Vorschlag innert 24h.\n\nLieber sprechen? Kostenloses 30-Min-Gespräch buchen: ${CALENDLY_URL}\n\n— NeuroDevLab, Lausanne`,
  },
  it: {
    subject: "Grazie — la tua proposta sta arrivando",
    body: (n) =>
      `Ciao ${n},\n\ngrazie per il tuo brief a NeuroDevLab. L'ho ricevuto e ti rispondo entro ~2 ore, con una proposta su misura entro 24h.\n\nPreferisci parlarne? Prenota una call gratuita di 30 min: ${CALENDLY_URL}\n\n— NeuroDevLab, Lausanne`,
  },
  es: {
    subject: "Gracias — tu propuesta está en camino",
    body: (n) =>
      `Hola ${n},\n\ngracias por tu brief a NeuroDevLab. Lo he recibido y te respondo en ~2 horas, con una propuesta a medida en 24h.\n\n¿Prefieres hablar? Reserva una llamada gratis de 30 min: ${CALENDLY_URL}\n\n— NeuroDevLab, Lausana`,
  },
};

async function sendEmails(
  name: string,
  email: string,
  details: string,
  locale: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  // NOTE: Resend rejects a `from` on an unverified domain (gmail.com cannot be
  // verified). Set RESEND_FROM to a verified-domain sender for delivery; the
  // owner notification still reaches CONTACT_EMAIL (gmail) and Telegram is the
  // primary channel, so a rejected `from` degrades gracefully (no silent loss).
  const from = process.env.RESEND_FROM || "NeuroDevLab <neurodevlab.ai@gmail.com>";
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    // Owner notification (the critical delivery).
    const { error } = await resend.emails.send({
      from,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `New brief: ${name}`,
      text: details,
    });
    if (error) {
      console.error("[contact] resend owner error", error);
      return false;
    }

    // Visitor confirmation in their language (best-effort).
    const conf = CONFIRMATION[locale] || CONFIRMATION.en;
    try {
      await resend.emails.send({
        from,
        to: email,
        subject: conf.subject,
        text: conf.body(name),
      });
    } catch (err) {
      console.error("[contact] resend confirmation error", err);
    }
    return true;
  } catch (err) {
    console.error("[contact] resend error", err);
    return false;
  }
}

/* ---------------------------------------------------------------- handler -- */
export async function POST(req: Request) {
  // Prefer the platform-set x-real-ip; otherwise the LAST (closest-trusted)
  // x-forwarded-for hop. The leftmost XFF value is client-controllable, so
  // never key the rate limiter on it.
  const xff = req.headers.get("x-forwarded-for");
  const ip =
    req.headers.get("x-real-ip")?.trim() ||
    xff?.split(",").pop()?.trim() ||
    "unknown";

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = briefSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const data = parsed.data;

  // Bot trap: pretend success, send nothing.
  if (data.company_url) return NextResponse.json({ ok: true });

  const name = oneLine(data.name).slice(0, 200);
  const email = data.email.trim().slice(0, 200);
  const message = data.message.trim().slice(0, 5000);
  const locale = ALLOWED_LOCALES.has(data.locale) ? data.locale : "en";

  // Optional fields: map known keys to labels, drop anything unrecognised.
  const projectType = PROJECT_TYPE_LABELS[data.projectType] || "";
  const budget = BUDGET_LABELS[data.budget] || "";
  const volume = oneLine(data.volume).slice(0, 300);

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const metaLines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Lang: ${locale}`,
    projectType && `Project type: ${projectType}`,
    budget && `Budget: ${budget}`,
    volume && `Volume/frequency: ${volume}`,
  ].filter(Boolean);

  const details = `${metaLines.join("\n")}\n\n${message}`;
  const text = `🌐 New brief — neurodevlab\n${details}`;

  const [tg, mail] = await Promise.all([
    sendTelegram(text),
    sendEmails(name, email, details, locale),
  ]);
  const delivered = tg || mail;

  if (!delivered) {
    // Never drop silently (LOI3): log the full payload so it survives in logs.
    console.error("[contact] NOT DELIVERED — no channel succeeded", {
      hasTelegram: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      hasResend: Boolean(process.env.RESEND_API_KEY),
      name,
      email,
      locale,
      projectType,
      budget,
      volume,
      message,
    });
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "unavailable" }, { status: 500 });
    }
    // Dev: allow the UI flow to complete (message is in the logs above).
    return NextResponse.json({ ok: true, dev: true });
  }

  return NextResponse.json({ ok: true });
}
