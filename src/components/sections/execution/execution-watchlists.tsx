import { executionWatchlists, type ExecutionWatchlist } from "@/content/execution-watchlists";
import styles from "./execution-watchlists.module.css";

function WatchlistPanel({ definition }: { definition: ExecutionWatchlist }) {
  const titleId = `watchlist-${definition.id}-heading`;
  const rows = definition.initialIds.flatMap(id => {
    const instrument = definition.instruments.find(item => item.id === id);
    return instrument ? [instrument] : [];
  });
  const price = new Intl.NumberFormat("en-US", { minimumFractionDigits: definition.precision, maximumFractionDigits: definition.precision, useGrouping: false });

  return <article className={styles.panel} aria-labelledby={titleId}>
    <div className={styles.header}>
      <div className={styles.title}><h3 id={titleId}>Equity Monitor</h3></div>
    </div>
    <table className={styles.table} aria-label={`${definition.title} sample quotes`}>
      <colgroup><col /><col className={styles.priceColumn} /><col className={styles.priceColumn} /></colgroup>
      <thead><tr><th scope="col">Name</th><th scope="col">Bid</th><th scope="col">Ask</th></tr></thead>
      <tbody>{rows.map(instrument => <tr key={instrument.id}>
        <th scope="row"><span className={styles.instrument} title={instrument.name}>{instrument.name}</span><span className={styles.identifier} title={instrument.identifier}>{instrument.identifier}</span></th>
        <td className={styles.bid}><span>{price.format(instrument.bid)}</span><small>{instrument.bidSize}</small></td>
        <td className={styles.ask}><span>{price.format(instrument.ask)}</span><small>{instrument.askSize}</small></td>
      </tr>)}</tbody>
    </table>
  </article>;
}

export function ExecutionWatchlists() {
  return <section className={styles.watchlists} aria-label="Equity monitor">
    <div className={styles.categoryPanel}><WatchlistPanel definition={executionWatchlists[0]} /></div>
    <p className={styles.note}>Sample prices and sizes · Not a live market feed.</p>
  </section>;
}
