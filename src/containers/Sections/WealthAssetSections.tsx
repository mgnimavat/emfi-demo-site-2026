import { wealth } from '@/content/wealth';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { ServiceDisclosures } from './ServiceDisclosures';
import styles from './WealthAssetSections.module.css';

const MandateFramework = () => {
  const content = wealth.management;

  return (
    <figure className={styles.framework}>
      <figcaption className={styles.frameworkBar}>{content.brand}</figcaption>
      <div className={styles.frameworkBody}>
        <p className={styles.caption}>{content.visualCaption}</p>
        <h3>{content.visualTitle}</h3>
        <ol className={styles.dimensions}>
          {content.dimensions.map((dimension, index) => (
            <li key={dimension}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{dimension}</strong>
            </li>
          ))}
        </ol>
        <table className={styles.mandateTable}>
          <caption className="sr-only">{content.visualTitle}</caption>
          <thead><tr>{content.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>
            {content.rows.map((row) => (
              <tr key={row.dimension}>
                <th scope="row">{row.dimension}</th>
                <td>{row.approach}</td>
                <td>{row.review}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
};

const WealthManagement = () => {
  const content = wealth.management;

  return (
    <section id="wealth-management" className={`${styles.section} ${styles.navy}`} aria-labelledby="wealth-management-heading">
      <div className={`${styles.container} ${styles.sectionGrid}`}>
        <ExecutionReveal className={styles.copy}>
          <h2 id="wealth-management-heading" className={styles.title}>{content.title}</h2>
          <p className={styles.lead}>{content.lead}</p>
          <div className={styles.paragraphs}>
            {content.paragraphs.map((paragraph) => <p key={paragraph} className={styles.body}>{paragraph}</p>)}
          </div>
        </ExecutionReveal>
        <ExecutionReveal delay={0.12} className={styles.visual}>
          <MandateFramework />
        </ExecutionReveal>
      </div>
    </section>
  );
};

const FundStructure = () => {
  const content = wealth.fund;

  return (
    <figure className={styles.fundStructure}>
      <figcaption className={styles.fundRoot}>
        <h3>{content.name}</h3>
        <p>{content.jurisdiction}</p>
      </figcaption>
      <ul className={styles.branches}>
        {content.portfolios.map((portfolio) => (
          <li key={portfolio}>
            <h4>{portfolio}</h4>
            <p>{content.portfolioDescription}</p>
          </li>
        ))}
      </ul>
    </figure>
  );
};

const AssetManagement = () => {
  const content = wealth.fund;

  return (
    <section id="asset-management" className={styles.section} aria-labelledby="asset-management-heading">
      <div className={`${styles.container} ${styles.sectionGrid}`}>
        <ExecutionReveal className={styles.copy}>
          <h2 id="asset-management-heading" className={styles.title}>{content.title}</h2>
          <p className={styles.lead}>{content.lead}</p>
          <div className={styles.paragraphs}>
            <p className={styles.body}>{content.body}</p>
            <p className={styles.body}><strong>{content.name}</strong> {content.introduction}</p>
            <p className={styles.body}>{content.detail}</p>
          </div>
          <div className={styles.network}>
            <h3 id="fund-provider-heading">{content.networkTitle}</h3>
            <p className={styles.body}>{content.networkBody}</p>
          </div>
        </ExecutionReveal>
        <ExecutionReveal delay={0.12} className={styles.visual}>
          <FundStructure />
          <ul className={styles.providers} aria-labelledby="fund-provider-heading">
            {content.providers.map((provider) => (
              <li key={provider.id}>
                <strong>{provider.name}</strong>
                <span>{provider.role}</span>
              </li>
            ))}
          </ul>
          <p className={styles.providerNotice}>{content.providerNotice}</p>
        </ExecutionReveal>
      </div>
    </section>
  );
};

const FundDisclosures = () => {
  const content = wealth.disclosures;

  return (
    <ServiceDisclosures
      headingId="fund-disclosures-heading"
      title={content.title}
      titleLines={content.titleLines}
      action={content.action}
    >
      <p><strong>{content.entity}</strong> {content.introduction}</p>
      {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </ServiceDisclosures>
  );
};

export const WealthAssetSections = () => (
  <>
    <WealthManagement />
    <AssetManagement />
    <FundDisclosures />
  </>
);
