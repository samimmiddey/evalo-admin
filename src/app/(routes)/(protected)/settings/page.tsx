import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import Settings from '@/features/settings/settings';

export const metadata: Metadata = PAGE_METADATA.settings;

const SettingsPage = () => {
   return (
      <Settings />
   );
};

export default SettingsPage;