import Image from 'next/image';
import { ArrowUpRight, Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { DependablePeekSlide } from '@/components/home/emfi-sections/accountable-section';
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
import { SettlementHeroAnimation } from './SettlementHeroAnimation';
import styles from './WhyServicePages.module.css';

type Intro = { titleLines: string[]; lead?: string; body?: string; callout?: string; note?: string };
type Detail = { title: string; body: string; code?: string; href?: string; link?: string };
type DetailLogo = { src: string; width: number; height: number };

const euroclearLogo = '/images/execution-venues/euroclear-navy.svg';
const allfundsLogo = '/images/execution-venues/allfunds-navy.svg';
const providerLogos: Readonly<Partial<Record<string, string>>> = {
  Euroclear: euroclearLogo,
  FundSettle: euroclearLogo,
  Allfunds: allfundsLogo,
};
const providerHrefs: Readonly<Partial<Record<string, string>>> = {
  Euroclear: 'https://www.euroclear.com/',
  FundSettle: 'https://www.euroclear.com/services/en/funds/trading-custody.html',
  Allfunds: 'https://allfunds.com/en/',
};
const relationshipLogos: Readonly<Partial<Record<string, DetailLogo>>> = {
  FCA: { src: '/brand/regulators/fca-brand.svg', width: 156, height: 89 },
  DFSA: { src: '/brand/regulators/dfsa-brand.png', width: 160, height: 100 },
  CIMA: { src: '/brand/regulators/cima-brand.png', width: 120, height: 120 },
  BDO: { src: '/brand/auditors/bdo-brand.png', width: 280, height: 108 },
  'Baker Tilly': { src: '/brand/auditors/baker-tilly-brand.png', width: 1023, height: 268 },
  Bloomberg: { src: '/brand/standing/bloomberg.png', width: 280, height: 56 },
  Reuters: { src: '/brand/press/reuters-brand.svg', width: 280, height: 70 },
  'The Wall Street Journal': { src: '/brand/press/wsj-brand.svg', width: 64, height: 64 },
  'The New York Times': { src: '/brand/press/nyt-brand.svg', width: 184, height: 25 },
  "Barron's": { src: '/brand/press/barrons-gray.svg', width: 320, height: 65 },
  'Chatham House': { src: '/brand/press/chanthamhousegrey.svg', width: 280, height: 100 },
  'Al Jazeera': { src: '/brand/press/aljazeeragrey.svg', width: 280, height: 100 },
  'France 24': { src: '/brand/press/france24grey.svg', width: 280, height: 100 },
  VOA: { src: '/brand/press/voagrey.svg', width: 205, height: 88 },
  'El Financiero': { src: '/brand/press/elfinancierocr-gray.svg', width: 280, height: 100 },
  'Le Point': { src: '/brand/press/lepoint-gray.svg', width: 280, height: 100 },
  'El Universal': { src: '/brand/press/eluniversal-gray.svg', width: 280, height: 100 },
  Cbonds: { src: '/brand/press/cbonds-logo.svg', width: 434, height: 91 },
  GlobalCapital: { src: '/brand/press/globalcapital-gray.png', width: 212, height: 39 },
  Zignox: { src: '/brand/press/zignox_logo_gray.png', width: 488, height: 112 },
  Euroclear: { src: euroclearLogo, width: 76, height: 76 },
  Allfunds: { src: allfundsLogo, width: 144, height: 39 },
};
const relationshipHrefs: Readonly<Partial<Record<string, string>>> = {
  Bloomberg: 'https://www.bloomberg.com',
  Reuters: 'https://www.reuters.com',
  'The Wall Street Journal': 'https://www.wsj.com',
  'The New York Times': 'https://www.nytimes.com',
  "Barron's": 'https://www.barrons.com',
  'Chatham House': 'https://www.chathamhouse.org',
  'Al Jazeera': 'https://www.aljazeera.com',
  'France 24': 'https://www.france24.com/en',
  VOA: 'https://www.voanews.com',
  'El Financiero': 'https://www.elfinancierocr.com',
  'Le Point': 'https://www.lepoint.fr',
  'El Universal': 'https://www.eluniversal.com',
  Cbonds: 'https://cbonds.com/company/EMFI',
  GlobalCapital: 'https://www.globalcapital.com',
  Zignox: 'https://app.zignox.com/investment-banks/emfi',
};
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

const ContentBand = ({ id, copy, tone = 'white', layout = 'standard', action, actionPlacement = 'intro', children }: {
  id: string;
  copy: Intro;
  tone?: 'white' | 'soft' | 'navy';
  layout?: 'standard' | 'centered' | 'product' | 'split';
  action?: ReactNode;
  actionPlacement?: 'intro' | 'after';
  children?: ReactNode;
}) => {
  const introAction = actionPlacement === 'intro' ? action : null;
  const afterAction = actionPlacement === 'after' ? action : null;
  const hasIntroCopy = Boolean(copy.lead || copy.body || copy.callout || introAction);

  return (
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
          {hasIntroCopy ? (
            <ExecutionReveal delay={0.12} className={styles.introCopy}>
              {copy.lead ? <p className={styles.lead}>{copy.lead}</p> : null}
              {copy.body ? <p className={layout === 'split' ? styles.callout : styles.body}>{copy.body}</p> : null}
              {copy.callout ? <p className={styles.callout}>{copy.callout}</p> : null}
              {introAction ? <div className={styles.action}>{introAction}</div> : null}
            </ExecutionReveal>
          ) : null}
        </div>
        {children ? <div className={styles.bandContent}>{children}</div> : null}
        {afterAction ? (
          <ExecutionReveal delay={0.16} className={styles.action}>
            {afterAction}
          </ExecutionReveal>
        ) : null}
        {copy.note ? <p className={styles.note}>{copy.note}</p> : null}
      </div>
    </section>
  );
};

const splitDetailLead = (body: string) => {
  const match = body.match(/^(.+?\.)(\s+)([\s\S]+)$/);
  return match ? { lead: match[1], rest: match[3] } : null;
};

const Details = ({ items, layout = 'cards', logos, emphasizeLead = false }: {
  items: readonly Detail[];
  layout?: 'cards' | 'benefits' | 'ledger' | 'entities' | 'rules';
  logos?: Readonly<Partial<Record<string, DetailLogo>>>;
  emphasizeLead?: boolean;
}) => {
  const list = (
    <ul className={styles.details} data-layout={layout} role="list">
      {items.map((item, index) => {
        const logo = logos?.[item.title];
        const lead = emphasizeLead ? splitDetailLead(item.body) : null;
        if (layout === 'entities') {
          return (
            <li key={item.title} className={styles.detail}>
              <h3>{item.title}</h3>
              <p className={styles.body}>
                <span>{item.body}</span>
                {item.href && item.link ? (
                  <>
                    {' · '}
                    <a href={item.href} target="_blank" rel="noreferrer" className={styles.detailLink}>
                      {item.link}<span className="sr-only"> — {item.title}</span>
                    </a>
                  </>
                ) : null}
              </p>
            </li>
          );
        }
        if (layout === 'rules') {
          return (
            <li key={item.title} className={styles.detail}>
              {item.code ? <span className={styles.ruleCode}>{item.code}</span> : null}
              <h3>{item.title}</h3>
              <p className={styles.body}>{item.body}</p>
            </li>
          );
        }
        const body = (
          <>
            {logo ? (
              <div className={styles.detailMark}>
                <Image {...logo} alt="" data-mark={item.title} className={styles.detailLogo} unoptimized />
              </div>
            ) : (
              <div className={layout === 'benefits' ? styles.benefitHead : undefined}>
                {layout === 'benefits' ? (
                  <span className={styles.detailIcon} data-code={item.code ? '' : undefined} aria-hidden="true">
                    {item.code || String(index + 1).padStart(2, '0')}
                  </span>
                ) : item.code ? (
                  <span className={styles.code}>{item.code}</span>
                ) : null}
                <h3>{item.title}</h3>
              </div>
            )}
            <div className={logo || layout === 'benefits' ? styles.detailCopy : undefined}>
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
          </>
        );

        return (
          <li key={item.title} className={styles.detail} data-has-logo={logo ? '' : undefined}>
            {layout === 'benefits' ? (
              <ExecutionReveal delay={0.08 * index} className={styles.benefitCard}>
                {body}
              </ExecutionReveal>
            ) : body}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
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
      {layout === 'benefits' ? list : <ExecutionReveal>{list}</ExecutionReveal>}
    </>
  );
};

const InfrastructureProviders = ({
  title,
  items,
}: {
  title: string;
  items: readonly Detail[];
}) => (
  <ExecutionReveal className={styles.providers}>
    <h3 id="infrastructure-providers-heading">{title}</h3>
    <ul className={styles.providerGrid} role="list" aria-labelledby="infrastructure-providers-heading">
      {items.map(({ title: name, body }) => {
        const logo = providerLogos[name];
        const href = providerHrefs[name];
        const showName = !logo || name === 'FundSettle' || name === 'Euroclear';
        const square = logo === euroclearLogo;
        const cardClassName = `${styles.provider} ${reveal.card} ${reveal.panel}`;
        const card = (
          <>
            <div className={`${styles.providerBrand} ${reveal.brand}`} data-provider={name}>
              {logo ? (
                <Image
                  src={logo}
                  alt={showName ? '' : name}
                  width={square ? 76 : 168}
                  height={square ? 76 : 46}
                  className={square ? styles.squareProviderLogo : styles.providerLogo}
                />
              ) : null}
              {showName ? <strong>{name}</strong> : null}
            </div>
            {body ? <span className={reveal.details}>{body}</span> : null}
          </>
        );

        return (
          <li key={name} className={styles.providerItem}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClassName}
                aria-label={`${name} (opens in a new tab)`}
              >
                {card}
              </a>
            ) : (
              <div className={cardClassName} tabIndex={body ? 0 : undefined}>{card}</div>
            )}
          </li>
        );
      })}
    </ul>
  </ExecutionReveal>
);

const visibleRelationshipTitles = new Set([
  'Bloomberg',
  'Reuters',
  'The Wall Street Journal',
  'The New York Times',
  "Barron's",
  'Chatham House',
  'Al Jazeera',
  'France 24',
  'VOA',
  'El Financiero',
  'Le Point',
  'El Universal',
  'Cbonds',
  'GlobalCapital',
  'Zignox',
]);

const RelationshipProviders = ({ items }: { items: readonly Detail[] }) => {
  const visibleItems = items.filter(({ title }) => visibleRelationshipTitles.has(title));

  return (
    <ExecutionReveal className={styles.relationshipProviders}>
      <svg className={styles.logoFilter} aria-hidden="true" focusable="false">
        <defs>
          <filter id="why-relationship-navy" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -.6378 -2.1456 -.2166 0 3" />
            <feComposite in2="SourceAlpha" operator="in" result="ink" />
            <feFlood floodColor="var(--text-primary, #071832)" />
            <feComposite in2="ink" operator="in" />
          </filter>
        </defs>
      </svg>
      <ul className={styles.relationshipGrid} role="list">
        {visibleItems.map(({ title: name, body }) => {
          const logo = relationshipLogos[name];
          const href = relationshipHrefs[name];
          const card = (
            <>
              <div className={`${styles.providerBrand} ${reveal.brand}`} data-provider={name}>
                {logo ? (
                  <Image
                    {...logo}
                    alt=""
                    className={styles.providerLogo}
                    unoptimized
                  />
                ) : (
                  <strong>{name}</strong>
                )}
              </div>
              {body ? <span className={reveal.details}>{body}</span> : null}
            </>
          );
          const cardClassName = `${styles.provider} ${reveal.card} ${reveal.panel}`;

          return (
            <li key={name} className={styles.providerItem}>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                  aria-label={`${name} (opens in a new tab)`}
                >
                  {card}
                </a>
              ) : (
                <div className={cardClassName} tabIndex={body ? 0 : undefined}>
                  {card}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </ExecutionReveal>
  );
};

export const DirectContentPage = ({ copy, heroCopy, locale }: {
  copy: WhyPageCopy['direct']; heroCopy: Pick<DirectCopy, 'headline' | 'heroTitle'>; locale: Locale;
}) => (
  <div className={styles.page} data-pillar="direct">
    <WhyHero headline={heroCopy.headline} {...heroCopy.heroTitle}><SettlementHeroAnimation lightHero /></WhyHero>
    <ContentBand
      id="direct-benefits"
      copy={copy.benefits}
      tone="soft"
      action={(
        <Button href={localizeHref('/services/settlement-custody', locale)} variant="circle">
          {copy.benefits.action}
        </Button>
      )}
    >
      <Details items={copy.benefits.items} layout="benefits" />
    </ContentBand>
    <ContentBand id="infrastructure" copy={copy.infrastructure}>
      <InfrastructureProviders
        title={copy.infrastructure.providersTitle}
        items={copy.infrastructure.providers}
      />
    </ContentBand>
    <ContentBand
      id="dma"
      copy={{
        titleLines: copy.execution.titleLines,
        lead: copy.execution.lead,
      }}
      tone="soft"
    >
      <div className={styles.conditions}>
        <h3>{copy.execution.conditionsTitle}</h3>
        <ul role="list">
          {copy.execution.conditions.map((condition) => (
            <li key={condition}>
              <span className={styles.conditionMark} aria-hidden="true">
                <Check size={14} strokeWidth={2.5} />
              </span>
              <span>{condition}</span>
            </li>
          ))}
        </ul>
        <p className={styles.conditionsNote}>{copy.execution.body}</p>
      </div>
    </ContentBand>
  </div>
);

export const ResponsiveContentPage = ({ copy, heroCopy }: {
  copy: WhyPageCopy['responsive']; heroCopy: Pick<ResponsiveCopy, 'headline' | 'fixed' | 'phrases'>;
}) => (
  <div className={styles.page} data-pillar="responsive">
    <WhyHero headline={heroCopy.headline} prefix={heroCopy.fixed} words={heroCopy.phrases} spacedLines>
      <ResponsiveShowcase />
    </WhyHero>
    <ContentBand id="workstation" copy={copy.workstation} tone="soft" layout="product">
      <ExecutionReveal className={`${styles.preview} ${styles.mediaFit}`}>
        <div className={styles.workstationStage}>
          <div className={styles.workstationScale}>
            <ExecutionWorkstation maskVariant="blur" />
          </div>
        </div>
      </ExecutionReveal>
    </ContentBand>
    <ContentBand id="dashboard" copy={copy.dashboard} layout="product">
      <ExecutionReveal className={`${styles.preview} ${styles.mediaFit}`}>
        <div className={styles.dashboardBandScale}><SettlementDashboard /></div>
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
  </div>
);

export const DependableContentPage = ({ copy, heroCopy, locale }: {
  copy: WhyPageCopy['dependable']; heroCopy: Pick<DependableCopy, 'headline' | 'fixed' | 'phrases'>; locale: Locale;
}) => (
  <div className={styles.page} data-pillar="dependable">
    <WhyHero headline={heroCopy.headline} prefix={heroCopy.fixed} words={heroCopy.phrases} spacedLines>
      <DependablePeekSlide />
    </WhyHero>
    <ContentBand
      id="client-assets"
      copy={copy.assets}
      tone="soft"
      actionPlacement="after"
      action={(
        <Button href={localizeHref('/services/settlement-custody', locale)} variant="circle">
          {copy.assets.action}
        </Button>
      )}
    >
      <Details items={copy.assets.items} layout="rules" />
    </ContentBand>
    <ContentBand id="regulation" copy={copy.relationships} tone="white">
      <RelationshipProviders items={copy.relationships.items} />
    </ContentBand>
    <ContentBand
      id="fees"
      copy={{ titleLines: copy.fees.titleLines, lead: copy.fees.lead }}
      tone="soft"
      action={(
        <Button href={localizeHref('/contact', locale)} variant="circle">
          {copy.fees.action}
        </Button>
      )}
    >
      <Details items={copy.fees.items} layout="benefits" />
    </ContentBand>
    <ContentBand
      id="entities"
      copy={copy.entities}
      tone="white"
    >
      <Details items={copy.entities.items} layout="entities" />
    </ContentBand>
  </div>
);
