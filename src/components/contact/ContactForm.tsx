"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { track } from "@/lib/track";
import {
  EMAIL_RE,
  PROJECT_TYPE_OPTIONS,
  BUDGET_OPTIONS,
} from "@/lib/brief";

type Status = "idle" | "sending" | "success" | "error" | "rate" | "invalid";

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-subtle outline-none transition-colors focus:border-accent-2";

export function ContactForm() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const projectType = String(data.get("projectType") || "");
    const budget = String(data.get("budget") || "");
    const volume = String(data.get("volume") || "").trim();
    const honeypot = String(data.get("company_url") || "");

    // Bot caught by honeypot → pretend success, send nothing.
    if (honeypot) {
      setStatus("success");
      form.reset();
      return;
    }
    const focusField = (field: string) =>
      (form.elements.namedItem(field) as HTMLElement | null)?.focus();
    if (!name) {
      setStatus("invalid");
      focusField("name");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus("invalid");
      focusField("email");
      return;
    }
    if (message.length < 5) {
      setStatus("invalid");
      focusField("message");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          projectType,
          budget,
          volume,
          locale,
          company_url: honeypot,
        }),
      });
      if (res.ok) {
        setStatus("success");
        track("brief_soumis", { locale });
        form.reset();
      } else if (res.status === 429) {
        setStatus("rate");
      } else if (res.status === 400) {
        setStatus("invalid");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-success/30 bg-success/10 p-6 text-sm leading-relaxed text-fg"
      >
        {t("success")}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {/* Honeypot — hidden from humans, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company URL
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-muted">
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          aria-invalid={status === "invalid" || undefined}
          aria-describedby={status === "invalid" ? "form-error" : undefined}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-muted">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          aria-invalid={status === "invalid" || undefined}
          aria-describedby={status === "invalid" ? "form-error" : undefined}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-muted">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder={t("messagePlaceholder")}
          aria-invalid={status === "invalid" || undefined}
          aria-describedby={status === "invalid" ? "form-error" : undefined}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="projectType" className="mb-1.5 block text-sm font-medium text-muted">
            {t("projectType")}{" "}
            <span className="text-subtle">({t("projectTypeOptional")})</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            defaultValue=""
            className={`${inputClass} appearance-none`}
          >
            <option value="">{t("projectTypeChoose")}</option>
            {PROJECT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.labelKey)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-muted">
            {t("budget")}{" "}
            <span className="text-subtle">({t("budgetOptional")})</span>
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className={`${inputClass} appearance-none`}
          >
            <option value="">{t("budgetChoose")}</option>
            {BUDGET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.labelKey)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="volume" className="mb-1.5 block text-sm font-medium text-muted">
          {t("volume")}{" "}
          <span className="text-subtle">({t("volumeOptional")})</span>
        </label>
        <input
          id="volume"
          name="volume"
          type="text"
          maxLength={300}
          autoComplete="off"
          placeholder={t("volumePlaceholder")}
          className={inputClass}
        />
      </div>

      {(status === "invalid" || status === "error" || status === "rate") && (
        <p id="form-error" role="alert" className="text-sm text-[#f87171]">
          {status === "invalid"
            ? t("validation")
            : status === "rate"
              ? t("rateLimited")
              : t("error")}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center rounded-full bg-accent-strong px-6 py-3 text-[15px] font-medium text-white shadow-[0_10px_34px_-12px_rgba(139,92,246,0.6)] transition-[transform,background-color] duration-200 ease-out hover:bg-accent-strong-hover hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("send")}
      </button>
    </form>
  );
}
