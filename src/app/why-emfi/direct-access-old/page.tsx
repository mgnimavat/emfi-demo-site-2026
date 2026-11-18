import { getWhyPageMetadata, LocalizedWhyPageSection } from '@/containers/Sections/LocalizedWhyPageSection';

export const metadata = getWhyPageMetadata('direct-access', 'en', true);
const Page = () => <LocalizedWhyPageSection page="direct-access" archived />;
export default Page;
