'use client';

import React, { useState } from 'react';
import { useAuth, useClerk, useSignIn } from '@clerk/nextjs';
import AuthContainer from './components/auth-container';
import { authData } from '@/data/auth/auth.data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CustomSpinner from '@/components/common/custom-spinner';
import { useForm } from 'react-hook-form';
import { forgotPasswordEmailSchema, ForgotPasswordSchemaEmailTypes } from './schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import ScreenLoader from '@/components/common/screen-loader';
import { sendResetCode, submitNewPassword, verifyResetCode } from './services/auth.client.service';
import InputError from '@/components/common/input-error';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { sanitizeRedirectUrl } from '@/utils/redirect-url-sanitizer';

export default function ForgotPassword() {
   const { signIn, fetchStatus } = useSignIn();
   const { isSignedIn } = useAuth();
   const { client } = useClerk();

   const [codeSent, setCodeSent] = useState(false);
   const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
   const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
   const [isSubmittingPassword, setIsSubmittingPassword] = useState<boolean>(false);

   const router = useRouter();
   const searchParams = useSearchParams();
   const redirectUrl = searchParams.get('redirect_url');

   const { forgotPassword } = authData;

   const {
      register,
      trigger,
      getValues,
      formState: { errors: formErrors }
   } = useForm<ForgotPasswordSchemaEmailTypes>({
      resolver: zodResolver(forgotPasswordEmailSchema),
      defaultValues: {
         email: '',
         code: '',
         password: ''
      }
   });

   // Step 1: Send the password reset code to the user's email
   async function handleSendCode(e: React.FormEvent) {
      e.preventDefault();

      const valid = await trigger('email');
      if (!valid) return;

      setIsSendingCode(true);

      const data = getValues();

      const result = await sendResetCode({ signIn, email: data.email });

      if (!result.success) {
         toast.error(result.message);
         setIsSendingCode(false);
         return;
      }

      setCodeSent(true);
      setIsSendingCode(false);
   }

   // Step 2: Verify the code provided by the user
   async function handleVerifyCode(e: React.FormEvent) {
      e.preventDefault();

      const valid = await trigger('code');
      if (!valid) return;

      setIsVerifyingCode(true);

      const data = getValues();

      const result = await verifyResetCode({ signIn, code: data.code });

      if (!result.success) {
         toast.error(result.message);
      }

      setIsVerifyingCode(false);
   }

   // Step 3: Submit the new password
   async function handleSubmitNewPassword(e: React.FormEvent) {
      e.preventDefault();

      const valid = await trigger('password');
      if (!valid) return;

      setIsSubmittingPassword(true);

      const data = getValues();

      const result = await submitNewPassword({
         signIn,
         password: data.password,
         client,
         onNavigate: () => {
            const sanitizedRedirectUrl = sanitizeRedirectUrl(redirectUrl);
            if (sanitizedRedirectUrl) {
               router.replace(sanitizedRedirectUrl);
            } else {
               router.push('/dashboard');
            }
         }
      });

      if (!result.success) {
         toast.error(result.message);
         setIsSubmittingPassword(false);
         return;
      }

      toast.success('Password reset successfully and signed you in');
      setIsSubmittingPassword(false);
   }

   // Check if clerk is loaded
   if (!signIn || !client) {
      return <ScreenLoader text="Loading..." />;
   }

   const currentSession = client.sessions.find((s) => s.id === signIn.createdSessionId);
   const isAdmin = currentSession?.user?.publicMetadata?.role === 'ADMIN';

   // Show loader if sign in is complete or user is already signed in
   if ((signIn.status === 'complete' || isSignedIn) && isAdmin) {
      return (
         <ScreenLoader
            text="Redirecting..."
            className="min-h-screen fixed inset-0 z-99999 overflow-hidden bg-zinc-950"
         />
      );
   }

   // Determine the current step based on the sign-in status and whether the code has been sent
   const currentStep: "stepOne" | "stepTwo" | "stepThree" =
      signIn.status === 'needs_new_password'
         ? 'stepThree'
         : codeSent
            ? 'stepTwo'
            : 'stepOne';

   return (
      <AuthContainer
         title={forgotPassword[currentStep].title}
         description={forgotPassword[currentStep].description}
      >

               <>
                  {/* Step 1 UI: Collect the user's email so you can send them a password reset code */}
                  {!codeSent && (
                     <form onSubmit={e => void handleSendCode(e)} className="space-y-5">
                        <div className="flex flex-col gap-2 2xl:gap-2.5">
                           <Label htmlFor={forgotPassword.stepOne.emailInput.name}>
                              {forgotPassword.stepOne.emailInput.label}
                           </Label>
                           <Input
                              type={forgotPassword.stepOne.emailInput.type}
                              placeholder={forgotPassword.stepOne.emailInput.placeholder}
                              {...register(forgotPassword.stepOne.emailInput.name)}
                           />
                           {
                              formErrors[forgotPassword.stepOne.emailInput.name] && (
                                 <InputError
                                    message={formErrors[forgotPassword.stepOne.emailInput.name]?.message}
                                    className='-mt-0.5 2xl:-mt-1.5'
                                 />
                              )
                           }
                        </div>
                        <Button
                           className="w-full"
                           size="xxl"
                           type='submit'
                           disabled={fetchStatus === 'fetching' || isSendingCode}
                        >
                           {
                              isSendingCode ?
                                 <CustomSpinner
                                    text='Sending Code...'
                                    spinnerClass='text-white'
                                    textClass='text-white'
                                 /> :
                                 forgotPassword.stepOne.submitButtonText
                           }
                        </Button>
                     </form>
                  )}

                  {/* Step 2 UI: Collect the code provided by the user */}
                  {codeSent && signIn.status !== 'needs_new_password' && (
                     <form onSubmit={e => void handleVerifyCode(e)} className="space-y-5">
                        <div className="flex flex-col gap-2 2xl:gap-2.5">
                           <Label htmlFor={forgotPassword.stepTwo.codeInput.name}>
                              {forgotPassword.stepTwo.codeInput.label}
                           </Label>
                           <Input
                              type={forgotPassword.stepTwo.codeInput.type}
                              placeholder={forgotPassword.stepTwo.codeInput.placeholder}
                              {...register(forgotPassword.stepTwo.codeInput.name)}
                           />
                           {
                              formErrors[forgotPassword.stepTwo.codeInput.name] && (
                                 <InputError
                                    message={formErrors[forgotPassword.stepTwo.codeInput.name]?.message}
                                    className='-mt-0.5 2xl:-mt-1.5'
                                 />
                              )
                           }
                        </div>
                        <Button
                           className="w-full"
                           size="xxl"
                           type='submit'
                           disabled={fetchStatus === 'fetching' || isVerifyingCode}
                        >
                           {
                              isVerifyingCode ?
                                 <CustomSpinner
                                    text='Sending Code...'
                                    spinnerClass='text-white'
                                    textClass='text-white'
                                 /> :
                                 forgotPassword.stepTwo.submitButtonText
                           }
                        </Button>
                     </form>
                  )}

                  {/* Step 3 UI: Collect the new password from the user */}
                  {signIn.status === 'needs_new_password' && (
                     <form onSubmit={e => void handleSubmitNewPassword(e)} className="space-y-5">
                        <div className="flex flex-col gap-2 2xl:gap-2.5">
                           <Label htmlFor={forgotPassword.stepThree.passwordInput.name}>
                              {forgotPassword.stepThree.passwordInput.label}
                           </Label>
                           <Input
                              type={forgotPassword.stepThree.passwordInput.type}
                              placeholder={forgotPassword.stepThree.passwordInput.placeholder}
                              {...register(forgotPassword.stepThree.passwordInput.name)}
                           />
                           {
                              formErrors[forgotPassword.stepThree.passwordInput.name] && (
                                 <InputError
                                    message={formErrors[forgotPassword.stepThree.passwordInput.name]?.message}
                                    className='-mt-0.5 2xl:-mt-1.5'
                                 />
                              )
                           }
                        </div>
                        <Button
                           className="w-full"
                           size="xxl"
                           type='submit'
                           disabled={fetchStatus === 'fetching' || isSubmittingPassword}
                        >
                           {
                              isSubmittingPassword ?
                                 <CustomSpinner
                                    text='Updating Password...'
                                    spinnerClass='text-white'
                                    textClass='text-white'
                                 /> :
                                 forgotPassword.stepThree.submitButtonText
                           }
                        </Button>
                     </form>
                  )}
               </>
            </AuthContainer>
   );
}