"use client";

import AuthContainer from './components/auth-container';
import { authData } from '@/data/auth/auth.data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, OtpSchemaTypes } from './schemas/auth.schema';
import { useState, useEffect } from 'react';
import useAuthStore from '@/store/auth-store';
import CustomSpinner from '@/components/common/custom-spinner';
import InputError from '@/components/common/input-error';

interface OTPProps {
   handleVerify: (data: OtpSchemaTypes) => Promise<boolean>;
   fetchStatus: string;
   resendCode: () => Promise<unknown> | void;
   onBack: () => Promise<unknown> | void;
}

const OTP = ({ handleVerify, fetchStatus, resendCode, onBack }: OTPProps) => {
   const { otpExpiresAt, setOtpExpiresAt, hasRequestedResend, setHasRequestedResend } = useAuthStore();
   const [now, setNow] = useState(() => Date.now());
   const [isOtpVerifying, setIsOtpVerifying] = useState<boolean>(false);

   const { otp: otpData } = authData;

   const {
      register,
      handleSubmit,
      reset,
      formState:
      { errors: formErrors }
   } = useForm<OtpSchemaTypes>({
      resolver: zodResolver(otpSchema),
      defaultValues: {
         code: '',
      }
   });

   const onSubmit = async (data: OtpSchemaTypes) => {
      setIsOtpVerifying(true);
      const success = await handleVerify(data);
      if (success) {
         setOtpExpiresAt(null);
         setHasRequestedResend(false);
         reset();
      }
      setIsOtpVerifying(false);
   };

   // Derived value from auth store
   const timeLeft = otpExpiresAt
      ? Math.max(0, Math.ceil((otpExpiresAt - now) / 1000))
      : 0;

   // Force re-render every second while otpExpiresAt is not null
   useEffect(() => {
      if (!otpExpiresAt) return;

      const tick = () => {
         const currentNow = Date.now();
         setNow(currentNow);

         if (otpExpiresAt - currentNow <= 0) {
            setOtpExpiresAt(null);
         }
      };

      // Resync immediately - handles delayed rehydration on refresh and keeps ticking every second
      const syncTimeout = setTimeout(tick, 0);
      const interval = setInterval(tick, 1000);

      return () => {
         clearTimeout(syncTimeout);
         clearInterval(interval);
      };
   }, [otpExpiresAt, setOtpExpiresAt]);

   // Reset OTP flow to go back to previous auth page
   const handleBack = async () => {
      await onBack();
      setOtpExpiresAt(null);
      setHasRequestedResend(false);
   };

   return (
      <AuthContainer
         title={otpData.title}
         description={otpData.description}
      >
         <div>
            <form
               className="space-y-5"
               onSubmit={(e) => {
                  void handleSubmit(onSubmit)(e);
               }}
            >
               <div className="flex flex-col gap-2 2xl:gap-2.5">
                  <Label
                     htmlFor={otpData.codeInput.name}
                     className='block text-sm font-medium text-zinc-200'>
                     {otpData.codeInput.label}
                  </Label>
                  <Input
                     type={otpData.codeInput.type}
                     placeholder={otpData.codeInput.placeholder}
                     {...register(otpData.codeInput.name)}
                  />
                  {
                     formErrors.code && (
                        <InputError message={formErrors.code?.message} />
                     )
                  }
               </div>

               {/* Clerk's CAPTCHA widget */}
               <div id="clerk-captcha" />

               <Button
                  className="w-full"
                  size="xxl"
                  disabled={fetchStatus === 'fetching' || isOtpVerifying}
                  type='submit'
               >
                  {
                     isOtpVerifying ?
                        <CustomSpinner
                           text='Verifying...'
                           spinnerClass='text-white'
                           textClass='text-white'
                        />
                        : otpData.submitButtonText
                  }
               </Button>
            </form>

            <div className="flex flex-col items-center gap-6 2xl:gap-8 text-center mt-6 2xl:mt-8">
               <button
                  className='cursor-pointer not-disabled:hover:underline text-sm 2xl:text-base disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={() => {
                     void resendCode();
                     const expiresAt = Date.now() + 60000;
                     setOtpExpiresAt(expiresAt);
                     setNow(Date.now());
                     setHasRequestedResend(true);
                  }}
                  disabled={timeLeft > 0 || fetchStatus === 'fetching'}
               >
                  {timeLeft > 0
                     ? `Resend code (${timeLeft})`
                     : hasRequestedResend
                        ? 'Resend code'
                        : 'I need a new code'}
               </button>
               <Button
                  variant='secondary'
                  className='text-zinc-300'
                  onClick={() => void handleBack()}
                  type='button'
               >
                  Use a different email
               </Button>
            </div>
         </div>
      </AuthContainer>
   );
};

export default OTP;