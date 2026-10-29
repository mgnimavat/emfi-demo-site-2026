import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Headphones,
  Landmark,
  Layers3,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { wealth } from '@/content/wealth';
import { Button } from '@/components/ui/button';
import { PortfolioView } from '@/components/mockups/portfolio-view';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { ServiceSectionHeading } from './ServiceSectionHeading';
import styles from './ServicePage.module.css';

const pillarIcons = [Wallet, Layers3, Landmark] as const;
const benefitIcons = [ArrowRight, ShieldCheck, Headphones] as const;

export const WealthAssetSections = () => (
  <>
    <section
      className={`${styles.section} ${styles.softBand}`}
      aria-label="Wealth and asset management activities"
    >
      <div className={styles.container}>
        <div className={styles.introGrid}>
          <ServiceSectionHeading title={wealth.headline.replace('\n', ' ')} />
          <p className={styles.introBody}>{wealth.body}</p>
        </div>
        <div className={styles.threeColumns}>
          {wealth.pillars.map((pillar, index) => {
            const Icon = pillarIcons[index] ?? ShieldCheck;
            return (
              <ExecutionReveal key={pillar.title} className={styles.fillHeight}>
                <article className={styles.serviceCard}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardIcon}>
                      <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className={styles.regime}>{pillar.regime}</span>
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                  <p className={styles.cardLegal}>{pillar.entity}</p>
                </article>
              </ExecutionReveal>
            );
          })}
        </div>
      </div>
    </section>

    <section className={styles.section} aria-labelledby="wealth-fund-heading">
      <div className={styles.container}>
        <div className={styles.fundNote}>
          <span className={styles.fundIcon}>
            <Layers3 size={34} strokeWidth={1.25} aria-hidden="true" />
          </span>
          <ServiceSectionHeading
            title={wealth.fundNoteTitle}
            body={wealth.fundNoteBody}
            id="wealth-fund-heading"
          />
        </div>
      </div>
    </section>

    <section
      className={`${styles.section} ${styles.softBand}`}
      aria-labelledby="wealth-distinction-heading"
    >
      <div className={styles.container}>
        <ServiceSectionHeading title={wealth.problemTitle} id="wealth-distinction-heading" />
        <div className={styles.twoColumns}>
          <article className={`${styles.comparisonCard} ${styles.conventional}`}>
            <p className={styles.cardEyebrow}>{wealth.typicallyLabel}</p>
            <ul>
              {wealth.typically.map((item) => (
                <li key={item}>
                  <span className={styles.comparisonDash} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className={`${styles.comparisonCard} ${styles.direct}`}>
            <p className={styles.cardEyebrow}>{wealth.emfiLabel}</p>
            <ul>
              {wealth.emfiProvides.map((item) => (
                <li key={item}>
                  <Check size={18} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section className={styles.section} aria-labelledby="wealth-benefits-heading">
      <div className={styles.container}>
        <ServiceSectionHeading title={wealth.getTitle} id="wealth-benefits-heading" />
        <div className={styles.threeColumns}>
          {wealth.getItems.map((title, index) => {
            const Icon = benefitIcons[index] ?? ShieldCheck;
            return (
              <ExecutionReveal key={title} className={styles.fillHeight}>
                <article className={styles.serviceCard}>
                  <span className={styles.cardIcon}>
                    <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                  <p>{wealth.getBody}</p>
                </article>
              </ExecutionReveal>
            );
          })}
        </div>
      </div>
    </section>

    <section
      className={`${styles.section} ${styles.softBand}`}
      aria-labelledby="wealth-portfolio-heading"
    >
      <div className={styles.container}>
        <div className={styles.portfolioGrid}>
          <div>
            <ServiceSectionHeading
              title={wealth.visTitle}
              body={wealth.visBody}
              id="wealth-portfolio-heading"
            />
            <p className={styles.entityNote}>
              Legal entities for each activity are listed on{' '}
              <Link href="/why-emfi">
                Why EMFI
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
              .
            </p>
          </div>
          <ExecutionReveal className={styles.portfolioPreview}>
            <PortfolioView />
          </ExecutionReveal>
        </div>
      </div>
    </section>

    <section className={styles.section} aria-labelledby="wealth-onboarding-heading">
      <div className={styles.container}>
        <div className={styles.onboarding}>
          <ServiceSectionHeading
            title={wealth.onboardTitle}
            body={wealth.onboardBody}
            id="wealth-onboarding-heading"
          />
          <ul className={styles.criteria}>
            {wealth.criteria.map((item) => (
              <li key={item}>
                <ShieldCheck size={20} strokeWidth={1.5} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <Button href="/contact" variant="inverse">
            {wealth.cta}
          </Button>
        </div>
      </div>
    </section>
  </>
);
