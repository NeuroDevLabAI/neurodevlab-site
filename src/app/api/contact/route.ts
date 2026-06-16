import { NextResponse } from "next/server";
import { CONTACT_EMAIL, CALENDLY_URL } from "@/lib/config";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ----------------------------------------------------------- rate limit ---
   Best-effort in-memory limiter: 3 requests / hour / IP. Serverless instances
   are ephemeral, so for hard guarantees move this to Vercel KV / Upstash. */
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
    subject: "Thanks — I'll be in touch shortly",
    body: (n) =>
      `Hi ${n},\n\nThanks for reaching out to NeuroDevLab. I've got your message and will reply within ~2 hours.\n\nWant to go faster? Book a free 30-min call: ${CALENDLY_URL}\n\n— NeuroDevLab, Lausanne`,
  },
  fr: {
    subject: "Merci — je reviens vers vous très vite",
    body: (n) =>
      `Bonjour ${n},\n\nMerci d'avoir contacté NeuroDevLab. J'ai bien reçu votre message et je vous réponds d'ici ~2 heures.\n\nPour aller plus vite, réservez un appel gratuit de 30 min : ${CALENDLY_URL}\n\n— NeuroDevLab, Lausanne`,
  },
  de: {
    subject: "Danke — ich melde mich in Kürze",
    body: (n) =>
      `Hallo ${n},\n\ndanke für Ihre Nachricht an NeuroDevLab. Ich habe sie erhalten und melde mich in ~2 Stunden.\n\nSchneller geht's per kostenlosem 30-Min-Gespräch: ${CALENDLY_URL}\n\n— NeuroDevLab, Lausanne`,
  },
  it: {
    subject: "Grazie — ti ricontatto a breve",
    body: (n) =>
      `Ciao ${n},\n\ngrazie per aver contattato NeuroDevLab. Ho ricevuto il tuo messaggio e ti rispondo entro ~2 ore.\n\nVuoi fare prima? Prenota una call gratuita di 30 min: ${CALENDLY_URL}\n\n— NeuroDevLab, Lausanne`,
  },
  es: {
    subject: "Gracias — te escribo en breve",
    body: (n) =>
      `Hola ${n},\n\ngracias por contactar con NeuroDevLab. He recibido tu mensaje y te respondo en ~2 horas.\n\n¿Quieres ir más rápido? Reserva una llamada gratis de 30 min: ${CALENDLY_URL}\n\n— NeuroDevLab, Lausana`,
  },
};

async function sendEmails(
  name: string,
  email: string,
  message: string,
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
      subject: `New contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nLang: ${locale}\n\n${message}`,
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

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const name = String(payload.name || "")
    .replace(/[\r\n\t]+/g, " ")
    .trim()
    .slice(0, 200);
  const email = String(payload.email || "").trim().slice(0, 200);
  const message = String(payload.message || "").trim().slice(0, 5000);
  const rawLocale = String(payload.locale || "en").slice(0, 5);
  const locale = ALLOWED_LOCALES.has(rawLocale) ? rawLocale : "en";
  const honeypot = String(payload.company_url || "");

  // Bot trap: pretend success, send nothing.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const text = `🌐 New contact — neurodevlab\nName: ${name}\nEmail: ${email}\nLang: ${locale}\n\n${message}`;

  const [tg, mail] = await Promise.all([
    sendTelegram(text),
    sendEmails(name, email, message, locale),
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
