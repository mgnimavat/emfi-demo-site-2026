import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { MotionRegion } from "@/components/sections/landing/motion-region";
import { home9 as home } from "@/content/home-9";
import { BrandMark } from "@/components/sections/landing/icons";
import styles from "./landing.module.css";

export function HeroSection() {
  return <section id="home" className={styles.hero} aria-labelledby="home-heading">
      <div className={styles.heroStage}>
        <MotionRegion className={styles.heroLayout} reveal={false}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}><span className={styles.heroEyebrowMark} aria-hidden="true" /><span>{home.hero.eyebrow}</span></p>
            <h1 id="home-heading">
              <span className={styles.heroLead}>Settle for</span>
              <br />
              <span className={styles.heroLess}>Less</span>
            </h1>
            <p className={styles.heroAccent}><strong>Execute</strong> and <strong>Custody</strong> for Less, too.</p>
          </div>
          <div className={styles.heroSymbol} aria-hidden="true">
            <div className={styles.heroSymbolOrbit}>
              <BrandMark />
            </div>
          </div>
        </MotionRegion>
        <MotionRegion className={styles.heroPillars}>
          {home.hero.pillars.map((item) => (
            <article key={item.label} className={styles.heroPillar}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </MotionRegion>
      </div>
    </section>;
}

export function ExpectBand() {
  return (
    <section id="expect" className={styles.expect} aria-labelledby="expect-heading">
      <span className={styles.storyMark} aria-hidden="true"><BrandMark /></span>
      <MotionRegion className={styles.expectInner}>
        <h2 id="expect-heading">Expect More.</h2>
      </MotionRegion>
    </section>
  );
}

export function ResponsiveSection() {
  const copy = home.responsive;
  const highlight = copy.rows.find((row) => row.highlight);
  const before = copy.rows.filter((row) => !row.highlight).slice(0, 2);
  const rest = copy.rows.filter((row) => !row.highlight).slice(2);

  return (
    <section id="responsive" className={styles.responsive} aria-labelledby="responsive-heading">
      <span className={styles.storyMark} aria-hidden="true"><BrandMark /></span>
      <MotionRegion className={styles.responsiveInner}>
        <div className={styles.opsPanel} aria-hidden="true">
          <p className={styles.opsEyebrow}>{copy.panelEyebrow}</p>
          <div className={styles.opsHead}>
            <span className={styles.opsBrand}><BrandMark /> {copy.panelTitle}</span>
            <span className={styles.opsLive}>{copy.live}</span>
          </div>
          {before.map((row) => (
            <div key={row.id} className={styles.opsRow}>
              <span>{row.id}</span>
              <strong>{row.title}</strong>
              <em>{row.status}</em>
            </div>
          ))}
          {highlight ? (
            <div className={styles.opsHighlight}>
              <div className={styles.opsRow}>
                <span>{highlight.id}</span>
                <strong>{highlight.title}</strong>
                <em>{highlight.status}</em>
              </div>
              <p className={styles.opsChartLabel}>Workable solution</p>
              <svg className={styles.opsChart} viewBox="0 0 280 56" fill="none" aria-hidden="true">
                <path d="M8 40h264" stroke="rgb(255 255 255 / 16%)" strokeWidth="1.5" strokeDasharray="4 6" />
                <path d="M36 40v-22h132v22h76" stroke="#59beac" strokeWidth="2.5" />
                <line x1="140" y1="8" x2="140" y2="48" stroke="rgb(255 255 255 / 28%)" strokeWidth="2" />
              </svg>
              <div className={styles.opsTeam}>
                <span className={styles.opsTeamMark}><BrandMark /></span>
                <strong>EMFI team</strong>
                <em>Confirmed</em>
              </div>
              <p className={styles.opsPeople}>Experienced people</p>
            </div>
          ) : null}
          {rest.map((row) => (
            <div key={row.id} className={styles.opsRow}>
              <span>{row.id}</span>
              <strong>{row.title}</strong>
              <em>{row.status}</em>
            </div>
          ))}
        </div>
        <div className={styles.responsiveCopy}>
          <h2 id="responsive-heading" className={styles.sectionTitle}>{copy.title}</h2>
          <p className={styles.sectionLead}>{copy.lead}</p>
          <p className={styles.sectionBody}>{copy.body}</p>
        </div>
      </MotionRegion>
    </section>
  );
}

export function AccountabilitySection() {
  const copy = home.accountable;

  return (
    <section id="accountable" className={styles.accountable} aria-labelledby="accountable-heading">
      <span className={styles.storyMark} aria-hidden="true"><BrandMark /></span>
      <MotionRegion className={styles.storyInner}>
        <h2 id="accountable-heading" className={styles.sectionTitle}>{copy.title}</h2>
        <p className={styles.sectionLead}>{copy.lead}</p>
        <p className={styles.sectionBody}>{copy.body}</p>
        <div className={styles.ownerCard}>
          <div className={styles.ownerInner}>
            <p className={styles.ownerLabel}>{copy.requestLabel}</p>
            <p className={styles.ownerTitle}>{copy.request}</p>
            <p className={styles.ownerLabel}>{copy.ownerLabel}</p>
            <p className={styles.ownerName}>
              <span className={styles.ownerMark}><BrandMark /></span>
              {copy.owner}
            </p>
          </div>
        </div>
      </MotionRegion>
    </section>
  );
}

export function DiscussSection() {
  const copy = home.discuss;
  const titleLines = copy.title.split("\n").filter(Boolean);

  return (
    <section id="discuss" className={`${styles.discuss} pb-10 pt-10 md:pb-14 md:pt-14`} aria-labelledby="discuss-heading">
      <Container>
        <div className={`${styles.discussCard} relative overflow-hidden rounded-xl px-6 py-16 text-center md:px-16 md:py-24`}>
          <div className="relative z-10 mx-auto max-w-3xl">
            <p className={styles.discussEyebrow}>{copy.eyebrow}</p>
            <h2 id="discuss-heading">
              {titleLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </h2>
            <p className={styles.discussBody}>{copy.body}</p>
            <div className="mt-10">
              <Button href="/contact" className={styles.discussAction}>{copy.action}</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
