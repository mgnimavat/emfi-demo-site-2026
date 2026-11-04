"use client";

import { useEffect, useState } from "react";
import styles from "./legal.module.css";
import { cookiesPolicy } from "@/content/legal";

const year = 60 * 60 * 24 * 365;

function readCookie(name: string) {
  return document.cookie.split("; ").some((item) => item === `${name}=true`);
}

export function CookieSettings() {
  const [values, setValues] = useState({ performance: false, userPref: false, technical: true });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValues({
      performance: readCookie("performance"),
      userPref: readCookie("userPref"),
      technical: true,
    });
  }, []);

  const save = () => {
    document.cookie = `performance=${values.performance}; path=/; max-age=${year}`;
    document.cookie = `userPref=${values.userPref}; path=/; max-age=${year}`;
    setSaved(true);
  };

  return (
    <div className={styles.cookies}>
      {cookiesPolicy.map((item) => (
        <section key={item.id} className={item.title ? styles.cookieCard : undefined}>
          {item.title ? (
            <label>
              <input
                type="checkbox"
                checked={item.locked || values[item.id as "performance" | "userPref"]}
                disabled={item.locked}
                onChange={() => {
                  if (item.locked) return;
                  setSaved(false);
                  setValues((current) => ({ ...current, [item.id]: !current[item.id as "performance" | "userPref"] }));
                }}
              />
              <span>{item.title}</span>
            </label>
          ) : null}
          <p>{item.body}</p>
        </section>
      ))}
      <button type="button" onClick={save}>Save</button>
      {saved ? <p className={styles.saved}>Cookie settings saved.</p> : null}
    </div>
  );
}
