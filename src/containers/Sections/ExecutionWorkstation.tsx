'use client';

import { executionSecurities } from '@/content/execution-securities';
import { ExecutionChart } from '@/components/sections/execution/execution-chart';
import { InteractiveExecutionTicket } from '@/components/sections/execution/interactive-execution-ticket';
import { ExecutionWatchlists } from '@/components/sections/execution/execution-watchlists';
import { ExecutionTransactions } from '@/components/sections/execution/execution-transactions';
import styles from '@/components/sections/execution/page.module.css';
import previewStyles from './execution-workstation.module.css';

export const ExecutionWorkstation = () => {
  return (
    <fieldset disabled className={previewStyles.preview}>
      <legend className="sr-only">Sample EMFI workstation preview</legend>
      <div className={styles.executionLayout}>
        <ExecutionChart security={executionSecurities[0]} staticPreview />
        <div className={styles.executionWindow}>
          <InteractiveExecutionTicket fillHeight staticPreview />
        </div>
      </div>
      <div className={styles.executionSecondaryLayout}>
        <ExecutionWatchlists staticPreview />
        <ExecutionTransactions staticPreview />
      </div>
    </fieldset>
  );
};
