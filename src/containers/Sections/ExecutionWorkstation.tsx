'use client';

import { useState } from 'react';
import { workstationSecurities, type ExecutionSymbol } from '@/content/execution-securities';
import { ExecutionChart } from '@/components/sections/execution/execution-chart';
import { InteractiveExecutionTicket } from '@/components/sections/execution/interactive-execution-ticket';
import { ExecutionWatchlists } from '@/components/sections/execution/execution-watchlists';
import { ExecutionTransactions } from '@/components/sections/execution/execution-transactions';
import styles from '@/components/sections/execution/page.module.css';
import previewStyles from './execution-workstation.module.css';
import { WorkstationPrivacyProvider, type WorkstationMaskVariant } from './WorkstationPrivacy';

export const ExecutionWorkstation = ({ maskVariant = 'initial-stars' }: { maskVariant?: WorkstationMaskVariant }) => {
  const [securitySymbol, setSecuritySymbol] = useState<ExecutionSymbol>(workstationSecurities[0].symbol);
  const security = workstationSecurities.find((item) => item.symbol === securitySymbol)
    ?? workstationSecurities[0];

  return (
    <WorkstationPrivacyProvider variant={maskVariant}>
      <fieldset className={previewStyles.preview}>
        <legend className="sr-only">Sample EMFI workstation preview</legend>
        <div className={styles.executionLayout}>
          <ExecutionChart security={security} staticPreview controlsEnabled />
          <div className={styles.executionWindow}>
            <InteractiveExecutionTicket
              fillHeight
              staticPreview
              controlsEnabled
              hideIsin
              securities={workstationSecurities}
              onSecurityChange={setSecuritySymbol}
            />
          </div>
        </div>
        <div className={styles.executionSecondaryLayout}>
          <ExecutionWatchlists staticPreview hideIsin />
          <ExecutionTransactions staticPreview compact referenceStyle="full" />
        </div>
      </fieldset>
    </WorkstationPrivacyProvider>
  );
};
