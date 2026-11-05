'use client';

import { executionWatchlists, type ExecutionWatchlist } from "@/content/execution-watchlists";
import { useServiceLocale } from "@/ui/hooks/useServiceLocale";
import { MaskedWorkstationValue } from '@/containers/Sections/WorkstationPrivacy';
import styles from "./execution-watchlists.module.css";
import { workstationWatchlist } from '@/content/workstation-preview';

function WatchlistPanel({ definition, hideIsin = false, title = 'Equity Monitor', maskNames = false }: { definition: ExecutionWatchlist; hideIsin?: boolean; title?: string; maskNames?: boolean }) {
  const { t } = useServiceLocale();
  const titleId = `watchlist-${definition.id}-heading`;
  const rows = definition.initialIds.flatMap(id => {
    const instrument = definition.instruments.find(item => item.id === id);
    return instrument ? [instrument] : [];
  });
  const price = new Intl.NumberFormat("en-US", { minimumFractionDigits: definition.precision, maximumFractionDigits: definition.precision, useGrouping: false });

  return <article className={styles.panel} aria-labelledby={titleId}>
    <div className={styles.header}>
      <div className={styles.title}><h3 id={titleId}>{t(title)}</h3></div>
    </div>
    <table className={styles.table} aria-label={`${definition.title} sample quotes`}>
      <colgroup><col /><col className={styles.priceColumn} /><col className={styles.priceColumn} /></colgroup>
      <thead><tr><th scope="col">{t("Name")}</th><th scope="col">{t("Bid")}</th><th scope="col">{t("Ask")}</th></tr></thead>
      <tbody>{rows.map(instrument => <tr key={instrument.id}>
        <th scope="row"><span className={styles.instrument} title={hideIsin || maskNames ? undefined : instrument.name}>{maskNames ? <MaskedWorkstationValue value={instrument.name} /> : instrument.name}</span>{!hideIsin ? <span className={styles.identifier} title={instrument.identifier}>{instrument.identifier}</span> : null}</th>
        <td className={styles.bid}><span>{price.format(instrument.bid)}</span><small>{instrument.bidSize}</small></td>
        <td className={styles.ask}><span>{price.format(instrument.ask)}</span><small>{instrument.askSize}</small></td>
      </tr>)}</tbody>
    </table>
  </article>;
}

export function ExecutionWatchlists({ staticPreview = false, hideIsin = false }: { staticPreview?: boolean; hideIsin?: boolean }) {
  const { t } = useServiceLocale();
  return <section className={styles.watchlists} aria-label={t("Equity monitor")}>
    <div className={styles.categoryPanel}><WatchlistPanel definition={staticPreview ? workstationWatchlist : executionWatchlists[0]} hideIsin={hideIsin} title={staticPreview ? t("Monitor") : t("Equity Monitor")} maskNames={staticPreview} /></div>
    {!staticPreview ? <p className={styles.note}>{t("Sample prices and sizes · Not a live market feed.")}</p> : null}
  </section>;
}
