import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, GitMerge, Layers, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { ConnectedJourney } from '@/components/sections/execution-v2/connected-journey';
import { OversightCycle } from '@/components/sections/dependable/oversight-cycle';
import { ExecutionHeroTitle } from '@/components/sections/execution/hero-title';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { ResponsiveShowcase } from '@/components/sections/responsive/showcase';
import hero from '@/components/sections/execution/page.module.css';
import band from '@/components/sections/execution/workstation-section.module.css';
import type { WhyPageCopy } from '@/lib/i18n/why-page-dictionaries';
import type { DependableCopy, DirectCopy, ResponsiveCopy } from '@/lib/i18n/marketing-dictionaries';
import type { Locale } from '@/lib/i18n';
import { localizeHref } from '@/lib/i18n';
import { responsiveTechnology } from '@/content/responsive-technology';
import { ExecutionWorkstation } from './ExecutionWorkstation';
import { SettlementDashboard } from './SettlementDashboard';
import { SettlementHeroAnimation } from './SettlementHeroAnimation';
import styles from './WhyServicePages.module.css';

type Intro = { titleLines: string[]; lead?: string; body?: string; note?: string };
type Detail = { title: string; body: string; code?: string; href?: string; link?: string };
type DetailLogo = { src: string; width: number; height: number };

const euroclearLogo = '/images/execution-venues/euroclear-navy.svg';
const allfundsLogo = '/images/execution-venues/allfunds-navy.svg';
const providerLogos: Readonly<Partial<Record<string, string>>> = {
  Euroclear: euroclearLogo,
  FundSettle: euroclearLogo,
  Allfunds: allfundsLogo,
};
const relationshipLogos: Readonly<Partial<Record<string, DetailLogo>>> = {
  FCA: { src: '/brand/regulators/fca-brand.svg', width: 156, height: 89 },
  DFSA: { src: '/brand/regulators/dfsa-brand.png', width: 160, height: 100 },
  Euroclear: { src: euroclearLogo, width: 96, height: 96 },
  Allfunds: { src: allfundsLogo, width: 144, height: 39 },
};
const benefitIcons = [Layers, GitMerge, ShieldCheck];

const WhyHero = ({ headline, prefix, words, spacedLines, children }: {
  headline: string;
  prefix: string;
  words: readonly string[];
  spacedLines?: boolean;
  children: ReactNode;
}) => (
  <section className={`${hero.hero} ${styles.hero}`} aria-labelledby="why-page-heading">
    <div className={hero.container}>
      <div className={hero.heroGrid}>
        <ExecutionReveal className={hero.heroCopy}>
          <ExecutionHeroTitle headlineId="why-page-heading" headline={headline} prefix={prefix}
            words={words} headlineClassName={spacedLines ? hero.spacedLines : undefined} />
        </ExecutionReveal>
        <ExecutionReveal delay={0.12} className={`${hero.heroMedia} ${styles.heroVisual}`}>
          {children}
        </ExecutionReveal>
      </div>
    </div>
  </section>
);

const ContentBand = ({ id, copy, tone = 'white', layout = 'standard', children }: {
  id: string;
  copy: Intro;
  tone?: 'white' | 'soft' | 'navy';
  layout?: 'standard' | 'centered' | 'product';
  children?: ReactNode;
}) => (
  <section id={id} className={`${band.section} ${styles.contentBand}`} data-tone={tone}
    data-layout={layout} aria-labelledby={`${id}-heading`}>
    <div className={`${band.container} ${styles.bandContainer}`}>
      <div className={`${styles.bandIntro} ${copy.lead ? band.introduction : ''}`}>
        <ExecutionReveal>
          <h2 id={`${id}-heading`} className={`${band.title} ${styles.bandTitle}`}>
            {copy.titleLines.map((line, index) => (
              <span key={line}>{index > 0 ? ' ' : ''}{line}</span>
            ))}
          </h2>
        </ExecutionReveal>
        {copy.lead ? (
          <ExecutionReveal delay={0.12} className={styles.introCopy}>
            <p className={styles.lead}>{copy.lead}</p>
            {copy.body ? <p className={styles.body}>{copy.body}</p> : null}
          </ExecutionReveal>
        ) : null}
      </div>
      {children ? <div className={styles.bandContent}>{children}</div> : null}
      {copy.note ? <p className={styles.note}>{copy.note}</p> : null}
    </div>
  </section>
);

const Details = ({ items, layout = 'cards', logos }: {
  items: readonly Detail[];
  layout?: 'cards' | 'benefits' | 'ledger' | 'entities';
  logos?: Readonly<Partial<Record<string, DetailLogo>>>;
}) => (
  <ExecutionReveal>
    <ul className={styles.details} data-layout={layout} role="list">
      {items.map((item, index) => {
        const Icon = layout === 'benefits' ? benefitIcons[index] : undefined;
        const logo = logos?.[item.title];

        return (
          <li key={item.title} className={styles.detail}>
            <div>
              {Icon ? <span className={styles.detailIcon}><Icon size={22} aria-hidden="true" /></span> : null}
              {item.code ? <span className={styles.code}>{item.code}</span> : null}
              <h3>
                {logo ? <Image {...logo} alt={item.title} className={styles.detailLogo} /> : item.title}
              </h3>
            </div>
            <div>
              <p className={styles.body}>{item.body}</p>
              {item.href && item.link ? (
                <a href={item.href} target="_blank" rel="noreferrer" className={styles.detailLink}>
                  {item.link}<span className="sr-only"> — {item.title}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  </ExecutionReveal>
);

const InfrastructureProviders = ({ items }: { items: readonly Detail[] }) => (
  <ExecutionReveal>
    <ul className={styles.providerGrid} role="list">
      {items.map(({ title, body }) => {
        const logo = providerLogos[title];
        const fundSettle = title === 'FundSettle';
        const showName = !logo || fundSettle;
        const square = logo === euroclearLogo;

        return (
          <li key={title} className={styles.provider}>
            <h4 className={styles.providerMark} data-fund-settle={fundSettle}>
              {logo ? <Image src={logo} alt={showName ? '' : title}
                width={square ? 76 : 168} height={square ? 76 : 46} /> : null}
              {showName ? <span>{title}</span> : null}
            </h4>
            <p className={`${styles.body} ${styles.providerDescription}`}>{body}</p>
          </li>
        );
      })}
    </ul>
  </ExecutionReveal>
);

export const DirectContentPage = ({ copy, heroCopy, locale }: {
  copy: WhyPageCopy['direct']; heroCopy: Pick<DirectCopy, 'headline' | 'heroTitle'>; locale: Locale;
}) => (
  <div className={styles.page} data-pillar="direct">
    <WhyHero headline={heroCopy.headline} {...heroCopy.heroTitle}><SettlementHeroAnimation /></WhyHero>
    <ContentBand id="infrastructure" copy={copy.infrastructure} tone="soft">
      <ExecutionReveal className={styles.journey}>
        <ConnectedJourney label={copy.infrastructure.titleLines.join(' ')} steps={copy.infrastructure.steps} />
      </ExecutionReveal>
      <h3 className={styles.groupTitle}>{copy.infrastructure.providersTitle}</h3>
      <InfrastructureProviders items={copy.infrastructure.providers} />
    </ContentBand>
    <ContentBand id="direct-benefits" copy={copy.benefits} tone="navy">
      <Details items={copy.benefits.items} layout="benefits" />
      <Link className={styles.action} href={localizeHref('/services/settlement-custody', locale)}>
        {copy.benefits.action}<ArrowRight size={18} aria-hidden="true" />
      </Link>
    </ContentBand>
    <ContentBand id="dma" copy={copy.execution} />
  </div>
);

export const ResponsiveContentPage = ({ copy, heroCopy, workflowSteps }: {
  copy: WhyPageCopy['responsive']; heroCopy: Pick<ResponsiveCopy, 'headline' | 'fixed' | 'phrases'>;
  workflowSteps: ResponsiveCopy['specialist']['steps'];
}) => (
  <div className={styles.page}>
    <WhyHero headline={heroCopy.headline} prefix={heroCopy.fixed} words={heroCopy.phrases} spacedLines>
      <ResponsiveShowcase />
    </WhyHero>
    <ContentBand id="workstation" copy={copy.workstation} tone="navy" layout="product">
      <ExecutionReveal className={styles.preview}>
        <ExecutionWorkstation maskVariant="blur" />
      </ExecutionReveal>
    </ContentBand>
    <ContentBand id="dashboard" copy={copy.dashboard} layout="product">
      <ExecutionReveal className={styles.preview}>
        <SettlementDashboard borderless />
      </ExecutionReveal>
    </ContentBand>
    <ContentBand id="mobile" copy={copy.mobile} tone="soft" layout="product">
      <ExecutionReveal className={styles.phones}>
        {responsiveTechnology.showcase.screens.map((screen, index) => (
          <Image key={screen.src} src={screen.src} alt={screen.alt}
            width={screen.width} height={screen.height}
            sizes={index === 1 ? '(max-width: 850px) 34vw, 264px' : '(max-width: 850px) 29vw, 228px'} />
        ))}
      </ExecutionReveal>
    </ContentBand>
    <ContentBand id="specialist" layout="centered" copy={{
      titleLines: copy.specialist.titleLines,
      lead: copy.specialist.lead,
      note: copy.specialist.note,
    }}>
      <ExecutionReveal className={styles.journey}>
        <ConnectedJourney label={copy.specialist.titleLines.join(' ')}
          steps={workflowSteps.map(({ title }) => ({ label: title }))}
          icons={['search', 'shield', 'handshake']} />
      </ExecutionReveal>
      <ExecutionReveal className={styles.specialistSummary}>
        <p className={styles.body}>{copy.specialist.body}</p>
        <p className={styles.callout}>{copy.specialist.callout}</p>
      </ExecutionReveal>
    </ContentBand>
  </div>
);

export const DependableContentPage = ({ copy, heroCopy }: {
  copy: WhyPageCopy['dependable']; heroCopy: Pick<DependableCopy, 'headline' | 'fixed' | 'phrases'>;
}) => (
  <div className={styles.page}>
    <WhyHero headline={heroCopy.headline} prefix={heroCopy.fixed} words={heroCopy.phrases} spacedLines>
      <OversightCycle />
    </WhyHero>
    <ContentBand id="regulation" copy={copy.relationships} tone="soft">
      <Details items={copy.relationships.items} layout="ledger" logos={relationshipLogos} />
    </ContentBand>
    <ContentBand id="client-assets" copy={copy.assets}>
      <Details items={copy.assets.items} />
    </ContentBand>
    <ContentBand id="fees" copy={copy.fees} tone="navy">
      <Details items={copy.fees.items} layout="ledger" />
    </ContentBand>
    <ContentBand id="entities" copy={copy.entities} tone="soft" layout="centered">
      <Details items={copy.entities.items} layout="entities" />
    </ContentBand>
  </div>
);
