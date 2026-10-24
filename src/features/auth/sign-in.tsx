"use client";

import ScreenLoader from '@/components/common/screen-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authData } from '@/data/auth/auth.data';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { useState } from 'react';
import { toast } from 'sonner';
import { authSchema, AuthSchemaTypes, OtpSchemaTypes } from './schemas/auth.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sanitizeRedirectUrl } from '@/utils/redirect-url-sanitizer';
import { resendSignInVerificationCode, resetSignIn, signInWithPassword, verifySignInCode } from './services/auth.client.service';
import AuthContainer from './components/auth-container';
import OTP from './otp';
import InputError from '@/components/common/input-error';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import CustomSpinner from '@/components/common/custom-spinner';

const SignIn = () => {
   const [showPassword, setShowPassword] = useState<boolean>(false);
   const { signIn: signInData } = authData;

   const { signIn, errors, fetchStatus } = useSignIn();
   const { isSignedIn } = useAuth();
   const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

   const router = useRouter();
   const searchParams = useSearchParams();
   const redirectUrl = searchParams.get('redirect_url');

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors: formErrors },
   } = useForm<AuthSchemaTypes>({
      resolver: zodResolver(authSchema),
      defaultValues: {
         email: '',
         password: '',
      }
   });

   const onNavigate = () => {
      const sanitizedRedirectUrl = sanitizeRedirectUrl(redirectUrl);
      if (sanitizedRedirectUrl) {
         router.replace(sanitizedRedirectUrl);
      } else {
         router.push('/dashboard');
      }
   };

   // Sign in with email and password
   const onSubmit = async (data: AuthSchemaTypes) => {
      setIsSigningIn(true);

      const result = await signInWithPassword({
         signIn,
         emailAddress: data.email,
         password: data.password,
         errors,
         onNavigate,
      });

      if (result.success) {
         if (signIn.status === 'complete') {
            toast.success('Signed in successfully');
            reset();
         }
      } else {
         toast.error(result.message);
      }

      setIsSigningIn(false);
   };

   // Verify OTP
   const handleVerify = async (data: OtpSchemaTypes) => {
      const result = await verifySignInCode({
         signIn,
         code: data.code,
         errors,
         onNavigate,
      });

      if (result.success) {
         toast.success('Signed in successfully');
      } else {
         toast.error(result.message);
      }

      return result.success;
   };

   // Resend OTP
   const resendCode = async () => {
      const result = await resendSignInVerificationCode({ signIn });

      if (result.success) {
         toast.success('A new code has been sent');
      } else {
         toast.error(result.message);
      }
   };

   // Reset OTP flow to go back to sign in page
   const onBack = async () => {
      const result = await resetSignIn({ signIn });

      if (!result.success) {
         toast.error(result.message);
      }
   };

   // Show loader if clerk isn't loaded
   if (!signIn) {
      return <ScreenLoader text="Loading..." />;
   }

   // Show loader if sign in is complete or user is already signed in
   if (signIn.status === 'complete' || isSignedIn) {
      return (
         <ScreenLoader
            text="Redirecting..."
            className="min-h-screen fixed inset-0 z-99999 overflow-hidden bg-zinc-950"
         />
      );
   }

   // Show OTP form when second factor or device trust is needed
   if (signIn.status === 'needs_second_factor' || signIn.status === 'needs_client_trust') {
      return (
         <OTP
            handleVerify={handleVerify}
            fetchStatus={fetchStatus}
            resendCode={resendCode}
            onBack={onBack}
         />
      );
   }

   return (
      <AuthContainer
         title={signInData.title}
         description={signInData.description}
      >
         <form
            onSubmit={(e) => {
               void handleSubmit(onSubmit)(e);
            }}
            className="space-y-4 w-full"
         >
            {/* Email Field */}
            <div className="space-y-1.5">
               <Label
                  htmlFor={signInData.emailInput.name}
                  className="block text-sm font-medium text-zinc-200"
               >
                  {signInData.emailInput.label}
               </Label>
               <Input
                  type={signInData.emailInput.type}
                  placeholder={signInData.emailInput.placeholder}
                  {...register(signInData.emailInput.name)}
               />
               {
                  formErrors[signInData.emailInput.name] && (
                     <InputError message={formErrors[signInData.emailInput.name]?.message} />
                  )
               }
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
               <div className="flex items-center justify-between">
                  <Label
                     htmlFor={signInData.passwordInput.name}
                     className="block text-sm font-medium text-zinc-200"
                  >
                     {signInData.passwordInput.label}
                  </Label>
                  <Link
                     href='/forgot-password'
                     className="text-xs text-violet-300 hover:text-violet-400 transition-colors font-medium"
                  >
                     {signInData.forgotPassword}
                  </Link>
               </div>
               <div className="relative space-y-1.5">
                  <Input
                     type={showPassword ? 'text' : signInData.passwordInput.type}
                     placeholder={signInData.passwordInput.placeholder}
                     {...register(signInData.passwordInput.name)}
                  />
                  <button
                     type="button"
                     onClick={() => setShowPassword((prev) => !prev)}
                     aria-label={showPassword ? 'Hide password' : 'Show password'}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 p-0.5 cursor-pointer"
                  >
                     {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                     ) : (
                        <Eye className="w-4 h-4" />
                     )}
                  </button>
                  {
                     formErrors[signInData.passwordInput.name] && (
                        <InputError message={formErrors[signInData.passwordInput.name]?.message} />
                     )
                  }
               </div>
            </div>

            {/* Submit Button */}
            <Button
               type="submit"
               size='xxl'
               className="w-full bg-violet-600 hover:bg-violet-500 text-white"
            >
               {
                  isSigningIn ?
                     <CustomSpinner
                        text='Signing In...'
                        spinnerClass='text-white'
                        textClass='text-white'
                     /> :
                     signInData.submitButtonText
               }
            </Button>
         </form>
      </AuthContainer>
   );
};

export default SignIn;