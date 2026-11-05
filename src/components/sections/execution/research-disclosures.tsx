import { ServiceDisclosures } from '@/containers/Sections/ServiceDisclosures';
import { serviceDictionaries, type ResearchCopy } from '@/lib/i18n/service-dictionaries';

export const ResearchDisclosures = ({ copy = serviceDictionaries.en.research }: { copy?: ResearchCopy }) => {
  const content = copy.disclosures;

  return (
    <ServiceDisclosures
      headingId="research-disclosures-heading"
      title={content.title}
      action={content.action}
      actionPlacement="panel"
      external
      newTabLabel={copy.ui['(opens in a new tab)']}
    >
      <p><strong>{content.entity}</strong> {content.regulation}</p>
      {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </ServiceDisclosures>
  );
};
