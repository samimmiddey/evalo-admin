"use client";

import { apiError } from "@/lib/api-error";
import { PaginatedUsers, UsersFilter, UsersResponse } from "../types/users.types";
import { api } from "@/lib/api";
import { GET_USERS } from "@/constants/query-urls";

export const getUsers = async (filters?: UsersFilter): Promise<PaginatedUsers> => {
   try {
      const searchParams = new URLSearchParams();

      if (filters?.page) searchParams.set('page', filters.page.toString());
      if (filters?.pageSize) searchParams.set('pageSize', filters.pageSize.toString());
      if (filters?.startDate) searchParams.set('startDate', filters.startDate.toString());
      if (filters?.endDate) searchParams.set('endDate', filters.endDate.toString());
      if (filters?.search) searchParams.set('search', filters.search.toString());
      if (filters?.role) searchParams.set('role', filters.role.toString());
      if (filters?.status) searchParams.set('status', filters.status.toString());

      const res = await api.get(GET_USERS, { searchParams }).json<UsersResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to get users'
      });
   }
};