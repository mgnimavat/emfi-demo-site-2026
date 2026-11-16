import { WealthAssetManagementPageSection } from '@/containers/Sections/ArchivedServices/0cb4270/WealthAssetManagementPageSection';
import copy from '@/containers/Sections/ArchivedServices/0cb4270/wealth.json';

export const metadata = {
  title: copy.title,
  description: copy.description,
  robots: { index: false, follow: true },
};

const WealthAssetManagementOldPage = () => <WealthAssetManagementPageSection />;

export default WealthAssetManagementOldPage;
