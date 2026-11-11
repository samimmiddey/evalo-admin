import { api } from "@/lib/api";
import { PaginatedPayouts, PayoutsFilter, PayoutsResponse } from "../types/payouts.types";
import { GET_PAYOUTS } from "@/constants/query-urls";
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