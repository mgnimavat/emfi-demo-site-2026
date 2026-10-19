import { demoExecutionSecurities } from "./execution-securities";

export type WatchlistInstrument = {
  id: string; name: string; identifier: string;
  bid: number; ask: number; bidSize: string; askSize: string;
};
export type ExecutionWatchlist = {
  id: string; title: string; precision: number;
  initialIds: readonly string[]; instruments: readonly WatchlistInstrument[];
};

// Fictional placeholders only. No customer records or real instrument identifiers.
const instruments: WatchlistInstrument[] = Array.from({ length: 8 }, (_, index) => {
  const security = demoExecutionSecurities[index];
  const suffix = String(index + 1).padStart(2, "0");
  return {
    id: `XXXX-${suffix}`, name: security?.name ?? `XXXX Equity ${suffix}`,
    identifier: `XXXX000000${suffix}`, bid: security?.bid ?? 10 + index * 1.11,
    ask: security?.ask ?? 10.02 + index * 1.11, bidSize: "100", askSize: "100",
  };
});
export const executionWatchlists: readonly ExecutionWatchlist[] = [{
  id: "equity", title: "Equity", precision: 2,
  initialIds: instruments.slice(0, 6).map((item) => item.id), instruments,
}];
