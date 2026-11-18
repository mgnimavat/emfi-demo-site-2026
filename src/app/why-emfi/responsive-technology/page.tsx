import { getWhyPageMetadata, LocalizedWhyPageSection } from '@/containers/Sections/LocalizedWhyPageSection';

export const metadata = getWhyPageMetadata('responsive-technology');
const Page = () => <LocalizedWhyPageSection page="responsive-technology" />;
export default Page;
