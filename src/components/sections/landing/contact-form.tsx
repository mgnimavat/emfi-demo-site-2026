"use client";

import { useState } from "react";
import styles from "./landing.module.css";

export function HomeContactForm() {
  const [sent, setSent] = useState(false);
  return <form className={styles.form} onSubmit={(event) => { event.preventDefault(); setSent(true); }} onChange={() => { if (sent) setSent(false); }}>
    <label htmlFor="home-name">Name<input id="home-name" name="name" autoComplete="name" required maxLength={160} /></label>
    <label htmlFor="home-company">Company<input id="home-company" name="company" autoComplete="organization" required maxLength={200} /></label>
    <label htmlFor="home-email">Work email<input id="home-email" name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    <label htmlFor="home-message">What do you need help with?<textarea id="home-message" name="message" rows={4} required maxLength={5000} /></label>
    <button type="submit">Submit</button>
    {sent && <p className={styles.confirmation} role="status">Thank you. This is a preview confirmation only. No message has been sent to EMFI.</p>}
  </form>;
}
