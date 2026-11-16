import { Mail, Phone } from 'lucide-react';
import { LocationMap } from '@/components/sections/about-1-locations';
import { dictionaries, type CommonCopy } from '@/lib/i18n';
import type { ReactNode } from 'react';
import styles from './OfficeContactSection.module.css';

export const OfficeContactSection = ({
  copy = dictionaries.en.common,
  officeCity,
  sectionId,
  children,
}: { copy?: CommonCopy; officeCity: 'London' | 'Dubai'; sectionId: string; children: ReactNode }) => {
  const originalOffice = dictionaries.en.common.locations.places.find((place) => place.city === officeCity);
  const office = copy.locations.places.find((place) => place.mapQuery === originalOffice?.mapQuery);
  if (!office) return null;

  return (
    <section id={sectionId} className={styles.section} aria-labelledby={`${sectionId}-heading`}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.information}>
            <h2 id={`${sectionId}-heading`}>{office.city}</h2>
            <p className={styles.entities}>
              {office.kicker.map((entity) => <span key={entity}>{entity}</span>)}
            </p>
            <div className={styles.officeDetails}>
              <address className={styles.address}>
                {office.lines.map((line) => <span key={line}>{line}</span>)}
              </address>
              <div className={styles.contacts}>
                {'phone' in office ? (
                  <a href={`tel:${String(office.phone).replace(/\s/g, '')}`}>
                    <Phone size={16} aria-hidden="true" />
                    <span dir="ltr">{String(office.phone)}</span>
                  </a>
                ) : null}
                <a href={`mailto:${office.email}`}>
                  <Mail size={16} aria-hidden="true" />
                  <span dir="ltr">{office.email}</span>
                </a>
              </div>
            </div>
            <div className={styles.regulatory}>
              {children}
            </div>
          </div>
          <div className={styles.map}>
            <LocationMap place={office} copy={copy} />
          </div>
        </div>
      </div>
    </section>
  );
};
