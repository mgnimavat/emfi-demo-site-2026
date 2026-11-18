import { getWhyPageMetadata, LocalizedWhyPageSection } from '@/containers/Sections/LocalizedWhyPageSection';

export const metadata = getWhyPageMetadata('direct-access');
const Page = () => <LocalizedWhyPageSection page="direct-access" />;
export default Page;
