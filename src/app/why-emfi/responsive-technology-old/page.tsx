import { getWhyPageMetadata, LocalizedWhyPageSection } from '@/containers/Sections/LocalizedWhyPageSection';

export const metadata = getWhyPageMetadata('responsive-technology', 'en', true);
const Page = () => <LocalizedWhyPageSection page="responsive-technology" archived />;
export default Page;
