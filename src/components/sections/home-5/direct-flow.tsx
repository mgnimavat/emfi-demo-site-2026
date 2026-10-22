import { BrandMark, ClientIcon, DepositoryIcon } from "@/components/sections/landing/icons";
import { MotionRegion } from "@/components/sections/landing/motion-region";
import styles from "./landing.module.css";

function FlowLink({ second = false }: { second?: boolean }) {
  return <span className={`${styles.flowLink} ${second ? styles.secondLink : ""}`} aria-hidden="true"><span className={styles.flowTrack} /><span className={styles.flowBeam} /><span className={styles.flowGlow} /></span>;
}
export function DirectFlowSection() {
  return <section id="direct" className={styles.direct} aria-labelledby="direct-heading">
    <div className={styles.directInner}>
      <MotionRegion>
        <h2 id="direct-heading" className={styles.sectionTitle}>Direct</h2>
        <p className="sr-only">Two routes connect Client to Depository. The direct route through EMFI arrives faster than the route through Settlement agent, Sub-custodian and Custodian.</p>
        <div className={styles.flow}>
          <div className={styles.flowLegacy} aria-hidden="true">
            <span className={styles.viaRail}><svg viewBox="0 0 1000 164" preserveAspectRatio="none"><path className={styles.viaTrack} pathLength="100" vectorEffect="non-scaling-stroke" d="M1.5 163V50A48.5 48.5 0 0 1 50 1.5H950A48.5 48.5 0 0 1 998.5 50V163" fill="none" /><path className={styles.viaBeam} pathLength="100" d="M1.5 163V50A48.5 48.5 0 0 1 50 1.5H950A48.5 48.5 0 0 1 998.5 50V163" fill="none" /></svg><span className={styles.viaArrow} /><span className={`${styles.viaArrow} ${styles.viaArrowSecond}`} /></span>
            <div className={styles.viaSteps}>{["Settlement agent", "Sub-custodian", "Custodian"].map((label) => <span key={label} className={styles.viaStep}><span className={styles.viaDot} /><span>{label}</span></span>)}</div>
          </div>
          <div className={`${styles.flowNode} ${styles.clientNode}`} aria-hidden="true"><span className={styles.flowIcon}><ClientIcon /></span><span className={styles.flowName}>Client</span></div>
          <FlowLink />
          <div className={styles.routeMark} tabIndex={0} role="img" aria-label="EMFI"><span className={styles.routeDisc}><BrandMark /></span></div>
          <FlowLink second />
          <div className={`${styles.flowNode} ${styles.depositoryNode}`} aria-hidden="true"><span className={styles.flowIcon}><DepositoryIcon /></span><span className={styles.flowName}>Depository</span></div>
        </div>
      </MotionRegion>
    </div>
  </section>;
}
