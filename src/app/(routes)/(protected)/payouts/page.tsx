import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import Payouts from '@/features/payouts/payouts';

export const metadata: Metadata = PAGE_METADATA.payouts;

const PayoutsPage = () => {
   return (
      <Payouts />
   );
};

export default PayoutsPage;