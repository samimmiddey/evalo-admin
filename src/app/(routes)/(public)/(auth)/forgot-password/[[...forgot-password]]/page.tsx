import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import ForgotPassword from '@/features/auth/forgot-password';

export const metadata: Metadata = PAGE_METADATA.forgotPassword;

const ForgotPasswordPage = () => {
   return (
      <ForgotPassword />
   );
};

export default ForgotPasswordPage;