import { dictionaries, type CommonCopy } from '@/lib/i18n';
import { serviceDictionaries, type ResearchCopy } from '@/lib/i18n/service-dictionaries';
import { OfficeContactSection } from './OfficeContactSection';

export const ResearchOfficeSection = ({
  copy = dictionaries.en.common,
  disclosures = serviceDictionaries.en.research.disclosures,
}: { copy?: CommonCopy; disclosures?: ResearchCopy['disclosures'] }) => (
  <OfficeContactSection copy={copy} officeCity="London" sectionId="research-office">
    <p><strong>{disclosures.entity}</strong> {disclosures.regulation}</p>
    {disclosures.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
  </OfficeContactSection>
);
