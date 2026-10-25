import { AuthData } from './auth.types';

export const authData: AuthData = {
   signIn: {
      title: 'Welcome Back',
      description: 'Enter your authorized administrator credentials to manage interview reviews and AI feedback',
      emailInput: {
         name: 'email',
         type: 'email',
         label: 'Email address',
         placeholder: 'admin@evalo.com'
      },
      passwordInput: {
         name: 'password',
         type: 'password',
         label: 'Password',
         placeholder: '**********'
      },
      forgotPassword: 'Forgot password?',
      submitButtonText: 'Sign in',
   },
   otp: {
      title: 'Verify your account',
      description: 'Enter the 6-digit verification code sent to your email address',
      codeInput: {
         name: 'code',
         type: 'text',
         label: 'Verification code',
         placeholder: 'Enter 6-digit code',
      },
      submitButtonText: 'Verify code',
      resendButtonText: 'Resend code',
      useDifferentEmailText: 'Use a different email',
   },
   forgotPassword: {
      stepOne: {
         title: 'Reset your password',
         description: 'Enter your authorized email address to receive a 6-digit password reset verification code',
         emailInput: {
            name: 'email',
            type: 'email',
            label: 'Email address',
            placeholder: 'admin@evalo.com',
         },
         submitButtonText: 'Send reset code',
         backToSignInText: 'Back to sign in',
      },
      stepTwo: {
         title: 'Verify reset code',
         description: 'Enter the 6-digit verification code sent to your email address',
         codeInput: {
            name: 'code',
            type: 'text',
            label: 'Verification code',
            placeholder: 'Enter 6-digit code',
         },
         submitButtonText: 'Verify code',
         resendButtonText: 'Resend code',
         useDifferentEmailText: 'Use a different email',
      },
      stepThree: {
         title: 'Set new password',
         description: 'Create a new secure password to regain access to your account',
         passwordInput: {
            name: 'password',
            type: 'password',
            label: 'New password',
            placeholder: '**********',
         },
         submitButtonText: 'Reset password',
         backToSignInText: 'Back to sign in',
      },
   },
   brand: {
      headline: {
         prefix: 'Intelligent evaluation for every',
         highlight: 'candidate interview.',
      },
      description:
         'Streamline candidate reviews, monitor interviewer feedback consistency, and generate automated AI performance evaluations.',
      card: {
         title: 'Interview Evaluation Volume',
         subtitle: 'Candidate reviews analyzed in real-time',
         primaryMetric: {
            value: '14,280',
            delta: '18.4%',
            comparison: 'vs 7d baseline',
         },
         chartUnit: 'evals/hr',
         chartData: [
            { time: '00:00', current: 8200, baseline: 7400 },
            { time: '04:00', current: 9100, baseline: 7900 },
            { time: '08:00', current: 12400, baseline: 9200 },
            { time: '12:00', current: 14800, baseline: 11100 },
            { time: '16:00', current: 13900, baseline: 10600 },
            { time: '20:00', current: 11600, baseline: 9800 },
            { time: 'Now', current: 14280, baseline: 10400 },
         ],
         metrics: [
            {
               value: '99.85%',
               label: 'Feedback Accuracy',
            },
            {
               value: '112ms',
               label: 'AI Synthesis Latency',
            },
            {
               value: '64',
               label: 'Active Interview Panels',
            },
         ],
      },
      footer: {
         copyright: '© 2026 Evalo Inc.',
         status: 'All systems operational',
      },
   },
};
