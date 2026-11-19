import { dictionaries, type CommonCopy } from '@/lib/i18n';
import { serviceDictionaries, type ResearchCopy } from '@/lib/i18n/service-dictionaries';
import { OfficeContactSection } from './OfficeContactSection';

export const ResearchOfficeSection = ({
  copy = dictionaries.en.common,
  disclosures = serviceDictionaries.en.research.disclosures,
  capitalEntityName,
}: { copy?: CommonCopy; disclosures?: ResearchCopy['disclosures']; capitalEntityName: string }) => (
  <OfficeContactSection copy={copy} officeCity="London" sectionId="research-office"
    officeEntityNames={{ London: [capitalEntityName] }}>
    <p><strong>{disclosures.entity}</strong> {disclosures.regulation}</p>
    <p>{disclosures.paragraphs.join(' ')}</p>
  </OfficeContactSection>
);
