import { Button } from "@/components/ui/button";
import { execution } from "@/content/execution";
import { ResearchToTrade } from "@/components/sections/execution/research-to-trade";
import { ExecutionReveal } from "@/components/sections/execution/reveal";
import { ExecutionHeroPhrases } from "@/components/sections/execution/hero-phrases";
import { DirectExecutionWorkflow } from "@/components/sections/execution/direct-workflow";
import { ConnectedExecutionPreviews } from "@/components/sections/execution/connected-previews";
import { ArchiveCta } from "@/components/sections/archive/cta";
import theme from "@/components/sections/archive/theme.module.css";
import { FileSearch, ArrowRightLeft } from "lucide-react";
import landing from "@/components/sections/landing/landing.module.css";
import styles from "@/components/sections/execution/page.module.css";

export const metadata = { title: execution.title, description: execution.description };

export default function ResearchExecutionPage() {
  return <div className={theme.page}>
    <section className={styles.hero}>
      <div className={styles.container}><div className={styles.heroGrid}>
        <ExecutionReveal className={styles.heroCopy}><h1>{execution.headline.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><ExecutionHeroPhrases /><Button href="#research-execution-capabilities" className={styles.heroAction}>Know More</Button></ExecutionReveal>
        <ExecutionReveal delay={0.12} className={styles.heroMedia}><ResearchToTrade /></ExecutionReveal>
      </div></div>
    </section>
    <section id="research-execution-capabilities" className={styles.section} aria-label="Research and execution capabilities">
      <div className={styles.container}><ExecutionReveal>
        <div className={`${landing.principles} ${styles.capabilities}`}>
          {execution.capabilities.map((item, i) => {
            const Icon = i === 0 ? FileSearch : ArrowRightLeft;
            return <article key={item.id} className={styles.capability} aria-labelledby={item.id}>
              <div className={landing.principleTitle}><span className={landing.principleIcon}><Icon aria-hidden="true" strokeWidth={1.5} /></span><div><p className={styles.capabilityEyebrow}>{item.eyebrow}</p><h2 id={item.id}>{item.title}</h2></div></div>
              <p>{item.body}</p>
            </article>;
          })}
        </div>
      </ExecutionReveal></div>
    </section>
    <section className={styles.flow} aria-labelledby="workflow-heading"><div className={styles.container}><ExecutionReveal><h2 id="workflow-heading" className={styles.title}>{execution.workflow.title}</h2><p className={styles.body}>{execution.workflow.body}</p></ExecutionReveal><DirectExecutionWorkflow /></div></section>
    {/* Execution preview is temporarily disabled; its implementation is retained. */}
    <ConnectedExecutionPreviews flatSections showExecution={false} />
    <ArchiveCta title={execution.contact.title} body={execution.contact.body} action={execution.contact.action} />
  </div>;
}
