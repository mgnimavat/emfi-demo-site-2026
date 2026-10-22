import { MotionRegion } from "@/components/sections/landing/motion-region";
import { BrandMark, ClientIcon, DepositoryIcon } from "@/components/sections/landing/icons";
import styles from "./more-direct.module.css";

const MID = ["Settlement agent", "Sub-custodian", "Custodian"] as const;

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

export function MoreDirectV2() {
  return (
    <section id="direct" className={styles.section} aria-labelledby="direct-heading">
      <div className={styles.inner}>
        <MotionRegion>
          <h2 id="direct-heading" className={styles.title}>
            More Direct.
          </h2>
          <p className="sr-only">
            The traditional route runs one way from Client through Settlement agent, Sub-custodian and Custodian to Depository. Those three intermediaries combine into EMFI. The route then starts again from Client and runs one way through EMFI to Depository. The sequence repeats.
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
                <span className={`${styles.label} ${styles.midLabel}`}>{MID[0]}</span>
              </div>
              <div className={`${styles.node} ${styles.sub}`}>
                <span className={`${styles.disc} ${styles.discMid}`} />
                <span className={`${styles.label} ${styles.midLabel}`}>{MID[1]}</span>
              </div>
              <div className={`${styles.node} ${styles.custody}`}>
                <span className={`${styles.disc} ${styles.discMid}`} />
                <span className={`${styles.label} ${styles.midLabel}`}>{MID[2]}</span>
              </div>
              <Endpoint label="Depository" icon="depository" className={styles.depository} />
              <span className={styles.gather} />
              <div className={styles.logo}>
                <span className={styles.logoDisc}>
                  <BrandMark />
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
                    {MID.map((label) => (
                      <div key={label} className={styles.midBlock}>
                        <div className={styles.midRow}>
                          <span className={`${styles.disc} ${styles.discMid}`} />
                          {label}
                        </div>
                        <span className={styles.vline} />
                      </div>
                    ))}
                  </div>
                  <div className={styles.directStack}>
                    <span className={styles.vline} />
                    <span className={styles.mobileLogo}>
                      <BrandMark />
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
