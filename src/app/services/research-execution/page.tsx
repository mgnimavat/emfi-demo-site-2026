import { ArrowRight } from "lucide-react";
import { CurvedBand } from "@/components/layout/curved-band";
import { execution } from "@/content/execution";
import { ResearchToTrade } from "@/components/sections/execution/research-to-trade";
import { ExecutionReveal } from "@/components/sections/execution/reveal";
import { ExecutionHeroPhrases } from "@/components/sections/execution/hero-phrases";
import { DirectExecutionWorkflow } from "@/components/sections/execution/direct-workflow";
import { ConnectedExecutionPreviews } from "@/components/sections/execution/connected-previews";
import theme from "@/components/sections/archive/theme.module.css";
import styles from "@/components/sections/execution/page.module.css";

export const metadata = { title: execution.title, description: execution.description };

export default function ResearchExecutionPage() {
  return <div className={theme.page}>
    <CurvedBand nextBackground="#fff"><section className={styles.hero}>
      <div className={styles.container}><div className={styles.heroGrid}>
        <ExecutionReveal className={styles.heroCopy}><h1>{execution.headline.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><ExecutionHeroPhrases /><a href="#research-execution-capabilities" className={styles.heroAction}>Know More <ArrowRight size={14} aria-hidden="true" /></a></ExecutionReveal>
        <ExecutionReveal delay={0.12} className={styles.heroMedia}><ResearchToTrade /></ExecutionReveal>
      </div></div>
    </section></CurvedBand>
    <CurvedBand nextBackground="#071932" background="#fff"><section id="research-execution-capabilities" className={styles.section} aria-label="Research and execution capabilities">
      <div className={`${styles.container} ${styles.capabilities}`}>{execution.capabilities.map((item, i) => <ExecutionReveal key={item.id} delay={i * 0.08}><article className={styles.capability}><p>{item.eyebrow}</p><h2 id={item.id}>{item.title}</h2><p className={styles.body}>{item.body}</p></article></ExecutionReveal>)}</div>
    </section></CurvedBand>
    <CurvedBand nextBackground="#f4f7fb"><section className={styles.flow} aria-labelledby="workflow-heading"><div className={styles.container}><ExecutionReveal><h2 id="workflow-heading" className={styles.title}>{execution.workflow.title}</h2><p className={styles.body}>{execution.workflow.body}</p></ExecutionReveal><DirectExecutionWorkflow /></div></section></CurvedBand>
    <ConnectedExecutionPreviews />
  </div>;
}
