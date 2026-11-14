import { api } from "@/lib/api";
import {
   PaginatedPayouts,
   PayoutsFilter,
   PayoutsResponse,
   ExportPayoutsCsv,
   ExportPayoutsCsvFilter,
   ExportPayoutsCsvResponse,
   ApprovePayoutParams,
   ApprovePayoutResult,
   ApprovePayoutResponse,
} from "../types/payouts.types";
import { GET_PAYOUTS, EXPORT_PAYOUTS_CSV, APPROVE_PAYOUT } from "@/constants/query-urls";
import { apiError } from "@/lib/api-error";

// Get payouts list with filters and pagination
export const getPayouts = async (filters?: PayoutsFilter): Promise<PaginatedPayouts> => {
   try {
      const searchParams = new URLSearchParams();

      if (filters?.search) searchParams.set('search', filters.search);
      if (filters?.status) searchParams.set('status', filters.status);
      if (filters?.startDate) searchParams.set('startDate', filters.startDate.toISOString());
      if (filters?.endDate) searchParams.set('endDate', filters.endDate.toISOString());
      if (filters?.page) searchParams.set('page', filters.page.toString());
      if (filters?.pageSize) searchParams.set('pageSize', filters.pageSize.toString());

      const res = await api.get(GET_PAYOUTS, { searchParams }).json<PayoutsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to fetch payouts'
      });
   }
};

// Export payouts list to CSV
export const exportPayoutsCsv = async (filters?: ExportPayoutsCsvFilter): Promise<ExportPayoutsCsv> => {
   try {
      const searchParams = new URLSearchParams();

      if (filters?.startDate) {
         searchParams.set('startDate', filters.startDate instanceof Date ? filters.startDate.toISOString() : String(filters.startDate));
      }
      if (filters?.endDate) {
         searchParams.set('endDate', filters.endDate instanceof Date ? filters.endDate.toISOString() : String(filters.endDate));
      }
      if (filters?.search) searchParams.set('search', filters.search);
      if (filters?.status) searchParams.set('status', filters.status);

      const res = await api.get(EXPORT_PAYOUTS_CSV, { searchParams }).json<ExportPayoutsCsvResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to export payouts to CSV',
      });
   }
};

// Approve a payout request and generate Cashgram
export const approvePayout = async (params: ApprovePayoutParams): Promise<ApprovePayoutResult> => {
   try {
      const res = await api
         .post(APPROVE_PAYOUT, {
            json: params,
         })
         .json<ApprovePayoutResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to approve payout',
      });
   }
};
