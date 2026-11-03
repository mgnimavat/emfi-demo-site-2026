'use client';

import { useState } from 'react';
import {
  BatteryFull, Bell, ChevronDown, DollarSign, LayoutGrid,
  List, Menu, Plus, Search, Signal, TrendingUp, Wifi,
} from 'lucide-react';
import { settlementMobileHoldings as content } from '@/content/settlement-mobile-holdings';
import { MaskedWorkstationValue, WorkstationPrivacyProvider } from './WorkstationPrivacy';
import styles from './SettlementMobileHoldings.module.css';

export const SettlementMobileHoldings = () => {
  const [view, setView] = useState<'overview' | 'list'>('overview');

  return (
    <WorkstationPrivacyProvider variant="initial-stars">
      <div className={styles.device} role="region" aria-label="Illustrative mobile holdings preview">
        <div className={styles.screen}>
          <div className={styles.statusBar} aria-hidden="true">
            <span>{content.time}</span>
            <span className={styles.island} />
            <span className={styles.statusIcons}><Signal /><Wifi /><BatteryFull /></span>
          </div>
          <div className={styles.toolbar}>
            <Menu aria-hidden="true" />
            <strong>{content.title}</strong>
            <ChevronDown aria-hidden="true" />
            <span className={styles.toolbarActions} aria-hidden="true"><Search /><Bell /></span>
          </div>
          <div className={styles.marketValue}>
            {content.labels.marketValue}: <MaskedWorkstationValue value={content.marketValue} />
          </div>
          <div className={styles.viewToggle} role="group" aria-label="Holdings display">
            <button type="button" aria-pressed={view === 'overview'} onClick={() => setView('overview')}>
              <LayoutGrid aria-hidden="true" />{content.labels.overview}
            </button>
            <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>
              <List aria-hidden="true" />{content.labels.list}
            </button>
          </div>
          <div className={styles.content} key={view}>
            {view === 'overview' ? (
              <div className={styles.treemap} role="img" aria-label="Illustrative holdings treemap with masked security names">
                {content.positions.map((position) => (
                  <div className={styles.tile} data-tone={position.tone} key={position.id}>
                    <MaskedWorkstationValue value={position.name} />
                  </div>
                ))}
                <div className={styles.smallTiles}>
                  {content.otherHoldings.map((name) => (
                    <div className={styles.smallTile} key={name}>
                      <MaskedWorkstationValue value={name} />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className={styles.positions} aria-label="Masked position details">
              {content.positions.map((position) => (
                <article className={styles.positionCard} key={position.id} aria-label="Sample holding">
                  <dl>
                    <div><dt>{content.labels.security}</dt><dd><MaskedWorkstationValue value={position.name} /></dd></div>
                    <div><dt>{content.labels.marketValue}</dt><dd><MaskedWorkstationValue value={position.marketValue} /></dd></div>
                    <div><dt>{content.labels.price}</dt><dd><MaskedWorkstationValue value={position.price} /></dd></div>
                    <div><dt>{content.labels.amount}</dt><dd><MaskedWorkstationValue value={position.amount} /></dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.bottomNav} aria-hidden="true">
            <DollarSign /><span className={styles.activeNav}><LayoutGrid /></span><List /><TrendingUp /><Plus />
          </div>
        </div>
      </div>
    </WorkstationPrivacyProvider>
  );
};
