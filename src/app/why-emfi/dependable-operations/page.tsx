import { getWhyPageMetadata, LocalizedWhyPageSection } from '@/containers/Sections/LocalizedWhyPageSection';

export const metadata = getWhyPageMetadata('dependable-operations');
const Page = () => <LocalizedWhyPageSection page="dependable-operations" />;
export default Page;
