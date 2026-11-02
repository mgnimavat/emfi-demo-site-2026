import { ServiceDisclosures } from '@/containers/Sections/ServiceDisclosures';
import { execution } from '@/content/execution';

export const ResearchDisclosures = () => {
  const content = execution.disclosures;

  return (
    <ServiceDisclosures
      headingId="research-disclosures-heading"
      title={content.title}
      action={content.action}
      actionPlacement="panel"
      external
    >
      <p><strong>{content.entity}</strong> {content.regulation}</p>
      {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </ServiceDisclosures>
  );
};
