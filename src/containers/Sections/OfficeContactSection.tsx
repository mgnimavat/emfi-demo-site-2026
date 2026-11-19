import { Mail, Phone } from 'lucide-react';
import { LocationMap } from '@/components/sections/about-1-locations';
import { dictionaries, type CommonCopy } from '@/lib/i18n';
import type { ReactNode } from 'react';
import styles from './OfficeContactSection.module.css';

type OfficeCity = 'London' | 'Dubai' | 'Cayman';

export const OfficeContactSection = ({
  copy = dictionaries.en.common,
  officeCity,
  sectionId,
  children,
  layout = 'horizontal',
  officeCities,
  officeEntityNames,
  officeDisclosures,
}: {
  copy?: CommonCopy;
  officeCity: OfficeCity;
  sectionId: string;
  children?: ReactNode;
  layout?: 'horizontal' | 'columns';
  officeCities?: readonly OfficeCity[];
  officeEntityNames?: Partial<Record<OfficeCity, readonly string[]>>;
  officeDisclosures?: Partial<Record<OfficeCity, ReactNode>>;
}) => {
  const findOffice = (city: OfficeCity) => {
    const originalOffice = dictionaries.en.common.locations.places.find((place) => place.city === city);
    return copy.locations.places.find((place) => place.mapQuery === originalOffice?.mapQuery);
  };
  const office = findOffice(officeCity);
  const columnOffices = (officeCities ?? [officeCity]).flatMap((city) => {
    const place = findOffice(city);
    return place ? [{ city, place }] : [];
  });
  if (!office) return null;

  const officeInformation = (
    place: CommonCopy['locations']['places'][number],
    headingId: string,
    entityNames: readonly string[] = place.kicker,
  ) => (
    <>
      <h2 id={headingId}>{place.city}</h2>
      <p className={styles.entities}>
        {entityNames.map((entity) => <span key={entity}>{entity}</span>)}
      </p>
      <div className={styles.officeDetails}>
        <address className={styles.address}>
          {place.lines.map((line) => <span key={line}>{line}</span>)}
        </address>
        <div className={styles.contacts}>
          {place.phone ? (
            <a href={`tel:${place.phone.replace(/\s/g, '')}`}>
              <Phone size={16} aria-hidden="true" />
              <span dir="ltr">{place.phone}</span>
            </a>
          ) : null}
          <a href={`mailto:${place.email}`}>
            <Mail size={16} aria-hidden="true" />
            <span dir="ltr">{place.email}</span>
          </a>
        </div>
      </div>
    </>
  );

  return (
    <section id={sectionId} data-layout={layout} className={`${styles.section} ${officeDisclosures ? styles.integrated : ''}`} aria-labelledby={layout === 'columns' ? undefined : `${sectionId}-heading`}
      aria-label={layout === 'columns' ? columnOffices.map(({ place }) => place.city).join(' · ') : undefined}>
      <div className={`${styles.container} ${layout === 'columns' ? styles.columns : ''}`}>
        {layout === 'columns' ? (
          <>
            {columnOffices.map(({ city, place }, index) => (
              <div key={place.mapQuery} className={styles.officeColumn}>
                <article className={styles.locationCard}>
                  <div className={styles.locationMap}><LocationMap place={place} copy={copy} /></div>
                  <div className={styles.information}>
                    {officeInformation(place, `${sectionId}-${index}-heading`, officeEntityNames?.[city])}
                    {officeDisclosures?.[city] ? (
                      <div className={styles.officeDisclosure}>{officeDisclosures[city]}</div>
                    ) : null}
                  </div>
                </article>
              </div>
            ))}
            {children ? <div className={styles.regulatoryCard}>{children}</div> : null}
          </>
        ) : <div className={styles.card}>
          <div className={styles.information}>
            {officeInformation(office, `${sectionId}-heading`, officeEntityNames?.[officeCity])}
            <div className={styles.regulatory}>
              {children}
            </div>
          </div>
          <div className={styles.map}>
            <LocationMap place={office} copy={copy} />
          </div>
        </div>}
      </div>
    </section>
  );
};
