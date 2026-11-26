import { getWhyPageMetadata, LocalizedWhyPageSection } from '@/containers/Sections/LocalizedWhyPageSection';

// Duplicate of /why-emfi/dependable-operations for review. Not indexed.
const base = getWhyPageMetadata('dependable-operations');
export const metadata = {
  ...base,
  title: `${base.title} (v1)`,
  robots: { index: false, follow: true },
};
const Page = () => <LocalizedWhyPageSection page="dependable-operations" variant="v1" />;
export default Page;
