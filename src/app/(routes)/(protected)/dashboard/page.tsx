import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import Dashboard from '@/features/dashboard/dashboard';

export const metadata: Metadata = PAGE_METADATA.dashboard;

const DashboardPage = () => {
   return (
      <Dashboard />
   );
};

export default DashboardPage;