import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import Sessions from '@/features/sessions/sessions';

export const metadata: Metadata = PAGE_METADATA.sessions;

const SessionsPage = () => {
   return (
      <Sessions />
   );
};

export default SessionsPage;