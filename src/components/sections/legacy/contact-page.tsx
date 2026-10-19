"use client";

import { useState } from "react";
import { Check, Mail, MapPin, Phone } from "lucide-react";
import { contact } from "@/content/contact-old";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { PageHero } from "@/components/sections/page-hero";

const inputClass =
  "mt-2 w-full rounded-md border border-line bg-page px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand-focus font-sans normal-case";

export default function LegacyContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero title={contact.headline} body={contact.body} />

      <section className="border-b border-line bg-subtle">
        <Container className="grid gap-10 py-12 lg:grid-cols-[1.1fr_0.75fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="rounded-lg border border-line bg-page p-7 md:p-10"
          >
            <Eyebrow>{contact.formEyebrow}</Eyebrow>
            {sent ? (
              <div className="mt-6 flex gap-3 border-l-2 border-brand bg-soft p-4 text-sm text-ink">
                <Check size={17} className="text-brand" />
                {contact.success}
              </div>
            ) : null}
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {contact.fields.map((field, i) => (
                <label
                  key={field}
                  className={`font-mono text-[11px] uppercase tracking-wide text-ink-muted ${
                    i === 4 ? "md:col-span-2" : ""
                  }`}
                >
                  {field}
                  <input
                    required={i < 4}
                    type={field === "Email" ? "email" : "text"}
                    className={inputClass}
                  />
                </label>
              ))}
              <label className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                {contact.clientType}
                <select className={inputClass}>
                  {contact.clientTypes.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                {contact.serviceInterest}
                <select className={inputClass}>
                  {contact.services.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="mt-5 block font-mono text-[11px] uppercase tracking-wide text-ink-muted">
              {contact.message}
              <textarea required className={`${inputClass} h-32 resize-none`} />
            </label>
            <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs text-ink-muted">
              <input required type="checkbox" className="mt-0.5 accent-[var(--action-primary)]" />
              {contact.confirm}
            </label>
            <div className="mt-7">
              <Button type="submit">{contact.submit}</Button>
            </div>
          </form>

          <aside>
            <Eyebrow>{contact.locationsEyebrow}</Eyebrow>
            {contact.locations.map((location, i) => (
              <FadeIn
                key={location.city}
                delay={i * 0.1}
                className="mt-7 border-t-2 border-brand py-7"
              >
                <MapPin className="text-brand" />
                <h2 className="mt-5 text-2xl font-bold">{location.city}</h2>
                <p className="mt-3 font-mono text-xs">{location.entity}</p>
                <p className="mt-2 text-sm text-ink-secondary">{location.note}</p>
                {location.lines.length > 0 ? (
                  <p className="mt-5 text-sm leading-6 text-ink-muted">
                    {location.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                ) : null}
                <p className="mt-4 text-sm text-brand">
                  <Mail size={13} className="mr-2 inline" />
                  <a href={`mailto:${location.email}`}>{location.email}</a>
                </p>
              </FadeIn>
            ))}
            <div className="mt-4 border-t border-line pt-6 text-sm text-ink-muted">
              <Phone size={15} className="mr-2 inline text-brand" />
              {contact.coverage}
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
