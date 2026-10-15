"use client";

import { useState } from "react";
import { home3 as home } from "@/content/home-3";
import { Button } from "@/components/ui/button";

const inputClass =
  "mt-2 w-full rounded-md border border-line bg-page px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand-focus font-sans normal-case";

export function Home3ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="rounded-xl border border-line bg-subtle p-7 text-[clamp(1.0625rem,1.7vw,1.25rem)] leading-[1.55] text-ink" role="status">
        {home.contact.success}
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="grid gap-5"
    >
      {home.contact.fields.map((field) => (
        <label key={field} className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
          {field}
          <input
            required
            name={field.toLowerCase().replace(/\s+/g, "-")}
            type={field.toLowerCase().includes("email") ? "email" : "text"}
            autoComplete={field.toLowerCase().includes("email") ? "email" : field === "Company" ? "organization" : "name"}
            className={inputClass}
          />
        </label>
      ))}
      <label className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
        {home.contact.message}
        <textarea name="need" rows={4} className={`${inputClass} resize-none`} />
      </label>
      <div>
        <Button type="submit" className="min-h-0 px-8 py-4.25 text-[15px] font-bold leading-6 tracking-normal">
          {home.contact.submit}
        </Button>
      </div>
    </form>
  );
}
