export const linkedSettlementTiming = {
  cycle: 9000,
  buySettlement: 2000,
  sellAttempt: 3200,
  outcome: 6200,
} as const;

const linkedSettlementScenes = [
  { unlinked: { buy: 'pending', sell: 'pending' }, linked: { buy: 'held', sell: 'pending' } },
  { unlinked: { buy: 'settled', sell: 'pending' }, linked: { buy: 'held', sell: 'pending' } },
  { unlinked: { buy: 'settled', sell: 'settling' }, linked: { buy: 'held', sell: 'settling' } },
  { unlinked: { buy: 'settled', sell: 'failed' }, linked: { buy: 'settled', sell: 'settled' } },
] as const;

export const linkedSettlementOutcome = linkedSettlementScenes[3];

export const getLinkedSettlementScene = (elapsed: number) => {
  const time = elapsed % linkedSettlementTiming.cycle;
  if (time >= linkedSettlementTiming.outcome) return linkedSettlementOutcome;
  if (time >= linkedSettlementTiming.sellAttempt) return linkedSettlementScenes[2];
  if (time >= linkedSettlementTiming.buySettlement) return linkedSettlementScenes[1];
  return linkedSettlementScenes[0];
};

export const getLinkedSettlementComparisonFrame = (elapsed: number) => {
  const { cycle, sellAttempt, outcome } = linkedSettlementTiming;
  const comparisonTime = elapsed % (cycle * 2);
  const linked = comparisonTime >= cycle;
  const sceneTime = comparisonTime % cycle;
  const scene = getLinkedSettlementScene(sceneTime);
  const travel = Math.min(1, Math.max(0, (sceneTime - sellAttempt) / (outcome - sellAttempt)));
  return {
    linked,
    ...(linked ? scene.linked : scene.unlinked),
    progress: travel * travel * (3 - 2 * travel),
  };
};

export const getLinkedSettlementStoryProgress = (elapsed: number) => {
  const { cycle, sellAttempt, outcome } = linkedSettlementTiming;
  const time = elapsed % cycle;
  if (time < sellAttempt) return time / sellAttempt;
  if (time < outcome) return (time - sellAttempt) / (outcome - sellAttempt);
  return 1;
};
