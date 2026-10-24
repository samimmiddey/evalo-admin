import { getClerkErrorMessage } from "@/utils/clerk-error";
import { AuthResult, ResendSignInCodeParams, ResetSignInParams, SendResetCodeParams, SignInParams, SubmitNewPasswordParams, VerifyResetCodeParams, VerifySignInCodeParams } from "../types/auth.types";

// Sign in with password
export const signInWithPassword = async ({
   signIn,
   emailAddress,
   password,
   errors,
   onNavigate,
}: SignInParams): Promise<AuthResult> => {
   const { error } = await signIn.password({ emailAddress, password });

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   if (signIn.status === "complete") {
      await signIn.finalize({ navigate: onNavigate });
      return { success: true };
   }

   if (signIn.status === "needs_second_factor" || signIn.status === "needs_client_trust") {
      const { error: sendCodeError } = await signIn.mfa.sendEmailCode();
      if (sendCodeError) {
         return { success: false, message: getClerkErrorMessage(sendCodeError) };
      }
      return { success: true };
   }

   return {
      success: false,
      message: errors.global?.[0]?.message ?? "Failed to sign in",
   };
};

// Verify sign-in 2FA OTP
export const verifySignInCode = async ({
   signIn,
   code,
   errors,
   onNavigate,
}: VerifySignInCodeParams): Promise<AuthResult> => {
   const { error } = await signIn.mfa.verifyEmailCode({ code });

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   if (signIn.status === "complete") {
      await signIn.finalize({ navigate: onNavigate });
      return { success: true };
   }

   return {
      success: false,
      message: errors.global?.[0]?.message ?? "Failed to sign in",
   };
};

// Resend sign-in 2FA OTP
export const resendSignInVerificationCode = async ({
   signIn,
}: ResendSignInCodeParams): Promise<AuthResult> => {
   const { error } = await signIn.mfa.sendEmailCode();

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   return { success: true };
};

// Reset sign-in flow (go back to sign-in form)
export const resetSignIn = async ({
   signIn,
}: ResetSignInParams): Promise<AuthResult> => {
   const { error } = await signIn.reset();

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   return { success: true };
};

// Step 1: Send password reset code
export const sendResetCode = async ({
   signIn,
   email,
}: SendResetCodeParams): Promise<AuthResult> => {
   const { error: createError } = await signIn.create({ identifier: email });

   if (createError) {
      return { success: false, message: getClerkErrorMessage(createError) };
   }

   const { error: sendCodeError } = await signIn.resetPasswordEmailCode.sendCode();

   if (sendCodeError) {
      return { success: false, message: getClerkErrorMessage(sendCodeError) };
   }

   return { success: true };
};

// Step 2: Verify reset code
export const verifyResetCode = async ({
   signIn,
   code,
}: VerifyResetCodeParams): Promise<AuthResult> => {
   const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   return { success: true };
};

// Step 3: Submit new password
export const submitNewPassword = async ({
   signIn,
   password,
   onNavigate,
}: SubmitNewPasswordParams): Promise<AuthResult> => {
   const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
   });

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize({ navigate: onNavigate });

      if (finalizeError) {
         return { success: false, message: getClerkErrorMessage(finalizeError) };
      }

      return { success: true };
   }

   return { success: false, message: "Failed to reset password. Please try again" };
};