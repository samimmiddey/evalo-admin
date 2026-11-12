import type { Metadata } from 'next';

export const PAGE_METADATA = {
   signIn: {
      title: 'Sign In',
      description:
         'Sign in with your authorized administrator credentials to manage interview reviews, users, and platform operations.'
   },
   forgotPassword: {
      title: 'Reset Password',
      description:
         'Reset your administrator account password securely to regain access to the admin dashboard.'
   },
   dashboard: {
      title: 'Dashboard',
      description:
         'A comprehensive overview of platform revenue, interviews, and subscriber growth.'
   },
   users: {
      title: 'Users',
      description:
         'View and manage all registered users, roles, account statuses, and platform activity.'
   },
   sessions: {
      title: 'Sessions',
      description:
         'Monitor and manage all mock interview sessions across the platform, track statuses, and issue refunds.'
   },
   payouts: {
      title: 'Payouts',
      description:
         'Review, track, and manage interviewer payout requests, platform fees, and disbursements.'
   },
   settings: {
      title: 'Settings',
      description:
         'Manage global platform configurations, credit payout rates, fee percentages, and system preferences.'
   },
} as const satisfies Record<string, Metadata>;

