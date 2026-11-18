import { getWhyPageMetadata, LocalizedWhyPageSection } from '@/containers/Sections/LocalizedWhyPageSection';

export const metadata = getWhyPageMetadata('dependable-operations', 'en', true);
const Page = () => <LocalizedWhyPageSection page="dependable-operations" archived />;
export default Page;
