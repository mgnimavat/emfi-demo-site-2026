import Image from 'next/image';
import { ArrowUpRight, GitMerge, Layers, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { OversightCycle } from '@/components/sections/dependable/oversight-cycle';
import { ExecutionHeroTitle } from '@/components/sections/execution/hero-title';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { ResponsiveShowcase } from '@/components/sections/responsive/showcase';
import { PhoneDevice } from '@/components/mockups/phone-device';
import { Button } from '@/components/ui/button';
import hero from '@/components/sections/execution/page.module.css';
import band from '@/components/sections/execution/workstation-section.module.css';
import type { WhyPageCopy } from '@/lib/i18n/why-page-dictionaries';
import type { DependableCopy, DirectCopy, ResponsiveCopy } from '@/lib/i18n/marketing-dictionaries';
import type { Locale } from '@/lib/i18n';
import { localizeHref } from '@/lib/i18n';
import reveal from './ProviderCardReveal.module.css';
import { responsiveTechnology } from '@/content/responsive-technology';
import { ExecutionWorkstation } from './ExecutionWorkstation';
import { SettlementDashboard } from './SettlementDashboard';
import { InfrastructureRouteDiagram } from './InfrastructureRouteDiagram';
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
  CIMA: { src: '/brand/regulators/cima-brand.png', width: 120, height: 120 },
  BDO: { src: '/brand/auditors/bdo-brand.png', width: 280, height: 108 },
  'Baker Tilly': { src: '/brand/auditors/baker-tilly-brand.png', width: 1023, height: 268 },
  Apex: { src: '/images/fund-providers/apex.svg', width: 550, height: 514 },
  Walkers: { src: '/images/fund-providers/walkers.jpg', width: 1797, height: 614 },
  Dechert: { src: '/images/fund-providers/dechert.png', width: 1024, height: 1024 },
  Euroclear: { src: '/brand/standing/euroclear-white.png', width: 140, height: 135 },
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
  layout?: 'standard' | 'centered' | 'product' | 'split';
  children?: ReactNode;
}) => (
  <section id={id} className={`${band.section} ${styles.contentBand}`} data-tone={tone}
    data-layout={layout} aria-labelledby={`${id}-heading`}>
    <div className={`${band.container} ${styles.bandContainer}`}>
      <div className={`${styles.bandIntro} ${copy.lead || copy.body ? band.introduction : ''}`}>
        <ExecutionReveal>
          <h2 id={`${id}-heading`} className={`${band.title} ${styles.bandTitle}`}>
            {copy.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
        </ExecutionReveal>
        {copy.lead || copy.body ? (
          <ExecutionReveal delay={0.12} className={styles.introCopy}>
            {copy.lead ? <p className={styles.lead}>{copy.lead}</p> : null}
            {copy.body ? <p className={layout === 'split' ? styles.callout : styles.body}>{copy.body}</p> : null}
          </ExecutionReveal>
        ) : null}
      </div>
      {children ? <div className={styles.bandContent}>{children}</div> : null}
      {copy.note ? <p className={styles.note}>{copy.note}</p> : null}
    </div>
  </section>
);

const splitDetailLead = (body: string) => {
  const match = body.match(/^(.+?\.)(\s+)([\s\S]+)$/);
  return match ? { lead: match[1], rest: match[3] } : null;
};

const Details = ({ items, layout = 'cards', logos, emphasizeLead = false }: {
  items: readonly Detail[];
  layout?: 'cards' | 'benefits' | 'ledger' | 'entities';
  logos?: Readonly<Partial<Record<string, DetailLogo>>>;
  emphasizeLead?: boolean;
}) => (
  <ExecutionReveal>
    {logos ? (
      <svg className={styles.logoFilter} aria-hidden="true" focusable="false">
        <defs>
          <filter id="why-logo-navy" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -.6378 -2.1456 -.2166 0 3" />
            <feComposite in2="SourceAlpha" operator="in" result="ink" />
            <feFlood floodColor="var(--text-primary, #071832)" />
            <feComposite in2="ink" operator="in" />
          </filter>
        </defs>
      </svg>
    ) : null}
    <ul className={styles.details} data-layout={layout} role="list">
      {items.map((item, index) => {
        const Icon = layout === 'benefits' ? benefitIcons[index] : undefined;
        const logo = logos?.[item.title];
        const lead = emphasizeLead ? splitDetailLead(item.body) : null;

        return (
          <li key={item.title} className={styles.detail} data-has-logo={logo ? '' : undefined}>
            {logo ? (
              <div className={styles.detailMark}>
                <Image {...logo} alt="" data-mark={item.title} className={styles.detailLogo} unoptimized />
              </div>
            ) : (
              <div>
                {Icon ? <span className={styles.detailIcon}><Icon size={22} aria-hidden="true" /></span> : null}
                {item.code ? <span className={styles.code}>{item.code}</span> : null}
                <h3>{item.title}</h3>
              </div>
            )}
            <div className={logo ? styles.detailCopy : undefined}>
              {logo ? <h3>{item.title}</h3> : null}
              <p className={styles.body}>
                {lead ? <><strong className={styles.detailLead}>{lead.lead}</strong> {lead.rest}</> : item.body}
              </p>
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
          <li key={title} className={`${styles.provider} ${reveal.card}`} tabIndex={body ? 0 : undefined}>
            <h4 className={styles.providerMark} data-fund-settle={fundSettle}>
              {logo ? <Image src={logo} alt={showName ? '' : title}
                width={square ? 76 : 168} height={square ? 76 : 46} /> : null}
              {showName ? <span>{title}</span> : null}
            </h4>
            {body ? <p className={`${styles.body} ${styles.providerDescription} ${reveal.details}`}>{body}</p> : null}
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
    <WhyHero headline={heroCopy.headline} {...heroCopy.heroTitle}><SettlementHeroAnimation lightHero /></WhyHero>
    <ContentBand id="infrastructure" copy={copy.infrastructure} tone="soft">
      <ExecutionReveal className={styles.journey}>
        <InfrastructureRouteDiagram
          label={copy.infrastructure.titleLines.join(' ')}
          steps={copy.infrastructure.steps}
        />
      </ExecutionReveal>
      <h3 className={styles.groupTitle}>{copy.infrastructure.providersTitle}</h3>
      <InfrastructureProviders items={copy.infrastructure.providers} />
    </ContentBand>
    <ContentBand id="direct-benefits" copy={copy.benefits}>
      <Details items={copy.benefits.items} layout="benefits" />
      <div className={styles.action}>
        <Button href={localizeHref('/services/settlement-custody', locale)}>
          {copy.benefits.action}
        </Button>
      </div>
    </ContentBand>
    <ContentBand id="dma" copy={copy.execution} tone="soft" />
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
    <ContentBand id="workstation" copy={copy.workstation} tone="soft" layout="product">
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
          <PhoneDevice key={screen.src} src={`${screen.src}?v=8`} alt={screen.alt}
            width={screen.width} height={screen.height} featured={index === 1} />
        ))}
      </ExecutionReveal>
    </ContentBand>
    <ContentBand id="specialist" layout="split" copy={{
      titleLines: copy.specialist.titleLines,
      body: copy.specialist.callout,
      note: copy.specialist.note,
    }}>
      <ExecutionReveal className={styles.journey}>
        <InfrastructureRouteDiagram
          label={copy.specialist.titleLines.join(' ')}
          steps={workflowSteps.map(({ title, body }) => ({ label: title, detail: body }))}
        />
      </ExecutionReveal>
    </ContentBand>
  </div>
);

export const DependableContentPage = ({ copy, heroCopy }: {
  copy: WhyPageCopy['dependable']; heroCopy: Pick<DependableCopy, 'headline' | 'fixed' | 'phrases'>;
}) => (
  <div className={styles.page} data-pillar="dependable">
    <WhyHero headline={heroCopy.headline} prefix={heroCopy.fixed} words={heroCopy.phrases} spacedLines>
      <OversightCycle />
    </WhyHero>
    <ContentBand id="regulation" copy={copy.relationships} tone="soft">
      <Details items={copy.relationships.items} layout="ledger" logos={relationshipLogos} emphasizeLead />
    </ContentBand>
    <ContentBand id="client-assets" copy={copy.assets}>
      <Details items={copy.assets.items} />
    </ContentBand>
    <ContentBand id="fees" copy={copy.fees} tone="soft">
      <Details items={copy.fees.items} layout="ledger" />
    </ContentBand>
    <ContentBand id="entities" copy={copy.entities} tone="white">
      <Details items={copy.entities.items} layout="entities" />
    </ContentBand>
  </div>
);
