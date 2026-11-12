import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import Users from '@/features/users/users';

export const metadata: Metadata = PAGE_METADATA.users;

const UsersPage = () => {
   return (
      <Users />
   );
};

export default UsersPage;