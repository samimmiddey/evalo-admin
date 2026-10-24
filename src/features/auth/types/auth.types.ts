import type { useClerk, useSignIn } from "@clerk/nextjs";

type SignInResource = NonNullable<ReturnType<typeof useSignIn>["signIn"]>;
type SignInErrors = ReturnType<typeof useSignIn>["errors"];
type ClerkClient = ReturnType<typeof useClerk>["client"];

export interface SignInParams {
   signIn: SignInResource;
   emailAddress: string;
   password: string;
   errors: SignInErrors;
   onNavigate: () => void;
   client: ClerkClient;
}

export interface AuthResult {
   success: boolean;
   message?: string;
}

export interface VerifySignInCodeParams {
   signIn: SignInResource;
   code: string;
   errors: SignInErrors;
   onNavigate: () => void;
   client: ClerkClient;
}

export interface ResendSignInCodeParams {
   signIn: SignInResource;
}

export interface ResetSignInParams {
   signIn: SignInResource;
}

export interface SendResetCodeParams {
   signIn: SignInResource;
   email: string;
}

export interface VerifyResetCodeParams {
   signIn: SignInResource;
   code: string;
}

export interface SubmitNewPasswordParams {
   signIn: SignInResource;
   password: string;
   onNavigate: () => void;
}