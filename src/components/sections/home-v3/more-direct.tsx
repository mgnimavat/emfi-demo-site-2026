import navigation from "@/content/site-navigation.json";
import { MotionRegion } from "@/components/sections/landing/motion-region";
import { ClientIcon, DepositoryIcon } from "@/components/sections/landing/icons";
import styles from "./more-direct.module.css";

function GradientMark({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 145 145" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="145" y2="145" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A2C2FD" />
          <stop offset="48%" stopColor="#8098CC" />
          <stop offset="100%" stopColor="#00C9A7" />
        </linearGradient>
      </defs>
      <path d={navigation.markPath} fill={`url(#${id})`} />
    </svg>
  );
}

const MID = [
  { label: "Settlement agent", tone: "toneStart" },
  { label: "Sub-custodian", tone: "toneMid" },
  { label: "Custodian", tone: "toneEnd" },
] as const;

function Endpoint({
  label,
  icon,
  className,
}: {
  label: string;
  icon: "client" | "depository";
  className: string;
}) {
  return (
    <div className={`${styles.node} ${className}`}>
      <span className={`${styles.disc} ${styles.discEnd}`}>
        {icon === "client" ? <ClientIcon /> : <DepositoryIcon />}
      </span>
      <span className={`${styles.label} ${styles.endLabel}`}>{label}</span>
    </div>
  );
}

export function MoreDirectV3() {
  return (
    <section id="direct" className={styles.section} aria-labelledby="direct-heading">
      <div className={styles.inner}>
        <MotionRegion>
          <h2 id="direct-heading" className={styles.title}>
            More Direct.
          </h2>
          <p className={styles.lede}>
            <span>Less handovers</span>
            <span>Less complexity</span>
            <span>Less operational friction</span>
          </p>
          <p className="sr-only">
            The traditional route connects one way from Client to Settlement agent, then Sub-custodian, then Custodian, then Depository. Each stop holds so it can be read. Those three intermediaries then combine into EMFI. The route starts again from Client and runs one way through EMFI to Depository. The sequence repeats.
          </p>
          <div className={styles.stage}>
            <div className={styles.desktop} aria-hidden="true">
              <span className={styles.track} />
              <span className={styles.beamTrad} />
              <span className={styles.beamDirect} />
              <span className={styles.spark} />
              <Endpoint label="Client" icon="client" className={styles.client} />
              <div className={`${styles.node} ${styles.settle}`}>
                <span className={`${styles.disc} ${styles.discMid}`} />
                <span className={`${styles.label} ${styles.midLabel}`}>{MID[0].label}</span>
              </div>
              <div className={`${styles.node} ${styles.sub}`}>
                <span className={`${styles.disc} ${styles.discMid}`} />
                <span className={`${styles.label} ${styles.midLabel}`}>{MID[1].label}</span>
              </div>
              <div className={`${styles.node} ${styles.custody}`}>
                <span className={`${styles.disc} ${styles.discMid}`} />
                <span className={`${styles.label} ${styles.midLabel}`}>{MID[2].label}</span>
              </div>
              <Endpoint label="Depository" icon="depository" className={styles.depository} />
              <span className={styles.gather} />
              <div className={styles.logo}>
                <span className={styles.logoDisc}>
                  <GradientMark id="emfi-v3-mark" />
                </span>
              </div>
            </div>

            <div className={styles.mobile} aria-hidden="true">
              <div className={styles.mobileCol}>
                <div className={`${styles.mobileEnd} ${styles.mobileClient}`}>
                  <span className={styles.mobileDisc}>
                    <ClientIcon />
                  </span>
                  Client
                </div>
                <div className={styles.mobileSlot}>
                  <span className={styles.mobileSpark} />
                  <div className={styles.tradStack}>
                    <span className={styles.vline} />
                    {MID.map((step) => (
                      <div key={step.label} className={`${styles.midBlock} ${styles[step.tone]}`}>
                        <div className={styles.midRow}>
                          <span className={`${styles.disc} ${styles.discMid}`} />
                          {step.label}
                        </div>
                        <span className={styles.vline} />
                      </div>
                    ))}
                  </div>
                  <div className={styles.directStack}>
                    <span className={styles.vline} />
                    <span className={styles.mobileLogo}>
                      <GradientMark id="emfi-v3-mark-mobile" />
                    </span>
                    <span className={styles.vline} />
                  </div>
                </div>
                <div className={`${styles.mobileEnd} ${styles.mobileDepository}`}>
                  <span className={styles.mobileDisc}>
                    <DepositoryIcon />
                  </span>
                  Depository
                </div>
              </div>
            </div>
          </div>
        </MotionRegion>
      </div>
    </section>
  );
}
