import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import SignIn from '@/features/auth/sign-in';

export const metadata: Metadata = PAGE_METADATA.signIn;

const SignInPage = () => {
   return (
      <SignIn />
   );
};

export default SignInPage;