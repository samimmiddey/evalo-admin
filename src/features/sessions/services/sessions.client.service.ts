import { api } from "@/lib/api";
import { CancelBooking, CancelBookingResponse, Sessions, SessionsFilter, SessionsResponse } from "../types/sessions.types";
import { GET_SESSIONS, CANCEL_BOOKING } from "@/constants/query-urls";
import { apiError } from "@/lib/api-error";

export const getSessions = async (filters?: SessionsFilter): Promise<Sessions> => {
   try {
      const searchParams = new URLSearchParams();

      if (filters?.page) searchParams.set('page', filters?.page.toString());
      if (filters?.pageSize) searchParams.set('pageSize', filters?.pageSize.toString());
      if (filters?.startDate) searchParams.set('startDate', filters?.startDate.toISOString());
      if (filters?.endDate) searchParams.set('endDate', filters?.endDate.toISOString());
      if (filters?.search) searchParams.set('search', filters?.search);
      if (filters?.status) searchParams.set('status', filters?.status);
      if (filters?.completionReason) searchParams.set('completionReason', filters?.completionReason);

      const res = await api.get(GET_SESSIONS, { searchParams }).json<SessionsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to fetch sessions'
      });
   }
};

export const cancelBooking = async (bookingId: string): Promise<CancelBooking> => {
   try {
      const searchParams = new URLSearchParams();

      if (bookingId) searchParams.set('bookingId', bookingId);

      const res = await api.post(CANCEL_BOOKING, { searchParams }).json<CancelBookingResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return {
         success: true
      };
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to cancel booking'
      });
   }
};