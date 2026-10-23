"use client";

import { CurvedBand } from "@/components/layout/curved-band";
import { useState } from "react";
import { execution } from "@/content/execution";
import { demoExecutionSecurities, type ExecutionSymbol } from "@/content/execution-securities";
import { InteractiveExecutionTicket } from "./interactive-execution-ticket";
import { LiveResearch } from "./live-research";
import { ExecutionChart } from "./execution-chart";
import { ExecutionWatchlists } from "./execution-watchlists";
import { ExecutionTransactions } from "./execution-transactions";
import { ExecutionReveal } from "./reveal";
import styles from "./page.module.css";

export function ConnectedExecutionPreviews() {
  const [securitySymbol, setSecuritySymbol] = useState<ExecutionSymbol>("XXXX-01");
  const chartSecurity = demoExecutionSecurities.find((security) => security.symbol === securitySymbol) ?? demoExecutionSecurities[0];

  return <>
    <CurvedBand nextBackground="#fff"><section id="research" aria-labelledby="research-heading" className={`${styles.section} ${styles.soft} ${styles.researchSection} scroll-mt-24`}>
      <div className={styles.container}>
        <ExecutionReveal className={styles.researchIntro}><h2 id="research-heading" className={styles.title}>{execution.research.title}</h2><p className={styles.body}>{execution.research.body}</p></ExecutionReveal>
        <LiveResearch />
      </div>
    </section></CurvedBand>
    <CurvedBand nextBackground="#f4f7fb"><section id="execution-preview" aria-label="Execution window" className={`${styles.section} ${styles.executionStage} scroll-mt-24`}>
      <div className={styles.container}>
        <ExecutionReveal className={styles.executionCaption}><h2>Put Insight Into Action,</h2><p>across relevant markets and securities.</p></ExecutionReveal>
        <ExecutionReveal className={styles.executionLayout}>
          <ExecutionChart security={chartSecurity} />
          <div className={styles.executionWindow}><InteractiveExecutionTicket fillHeight onSecurityChange={setSecuritySymbol} /></div>
        </ExecutionReveal>
        <ExecutionReveal className={styles.executionSecondaryLayout}><ExecutionWatchlists /><ExecutionTransactions /></ExecutionReveal>
      </div>
    </section></CurvedBand>
  </>;
}
