import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { getAuthenticatedUser } from "@/services/global.server.service";
import { PaginatedUsers, SignOutUser, ToggleUserStatus, UserItem, UsersFilter } from "../types/users.types";
import { endOfDay, startOfDay } from "date-fns";
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma, UserStatus } from "@/generated/prisma/client";
import { NotFoundError } from "@/lib/app-error";

export const getUsers = async (filters?: UsersFilter): Promise<PaginatedUsers> => {
   try {
      await getAuthenticatedUser();

      const page = Math.max(1, filters?.page ?? 1);
      const pageSize = Math.max(1, Math.min(100, filters?.pageSize ?? 10));
      const skip = (page - 1) * pageSize;

      const normalizedStartDate = filters?.startDate ? startOfDay(filters.startDate) : undefined;
      const normalizedEndDate = filters?.endDate ? endOfDay(filters.endDate) : undefined;

      const where: Prisma.UserWhereInput = {
         ...(filters?.role ? { role: filters.role } : {}),
         ...(filters?.status ? { status: filters.status as UserStatus } : {}),
         ...(normalizedStartDate || normalizedEndDate
            ? {
               createdAt: {
                  ...(normalizedStartDate ? { gte: normalizedStartDate } : {}),
                  ...(normalizedEndDate ? { lte: normalizedEndDate } : {}),
               },
            }
            : {}),
         ...(filters?.search
            ? {
               OR: [
                  { email: { contains: filters.search.trim(), mode: "insensitive" } },
                  { firstName: { contains: filters.search.trim(), mode: "insensitive" } },
                  { lastName: { contains: filters.search.trim(), mode: "insensitive" } },
               ],
            }
            : {}),
      };

      const [totalCount, users] = await Promise.all([
         db.user.count({ where }),
         db.user.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: {
               createdAt: "desc",
            },
            select: {
               id: true,
               clerkUserId: true,
               email: true,
               firstName: true,
               lastName: true,
               imageUrl: true,
               role: true,
               createdAt: true,
               credits: true,
               creditBalance: true,
               status: true
            }
         })
      ]);

      const clerkUserIds = users.map((u) => u.clerkUserId).filter(Boolean);
      const clerkMetadataMap = new Map<string, { isBanned: boolean; lastActive: Date | null; }>();
      const activeSessionUserIds = new Set<string>();

      if (clerkUserIds.length > 0) {
         const client = await clerkClient();

         try {
            const { data: clerkUsers } = await client.users.getUserList({
               userId: clerkUserIds,
               limit: clerkUserIds.length,
            });
            for (const cu of clerkUsers) {
               clerkMetadataMap.set(cu.id, {
                  isBanned: cu.banned,
                  lastActive: cu.lastActiveAt ? new Date(cu.lastActiveAt) : null,
               });
            }
         } catch (error: unknown) {
            // eslint-disable-next-line no-console
            console.error("Failed to fetch Clerk users:", error);
         }

         // Sessions: must be queried per user
         const results = await Promise.allSettled(
            clerkUserIds.map(async (userId) => {
               const { data: sessions } = await client.sessions.getSessionList({
                  userId,
                  status: "active",
               });
               return { userId, hasSession: sessions.length > 0 };
            })
         );

         for (const result of results) {
            if (result.status === "fulfilled") {
               if (result.value.hasSession) activeSessionUserIds.add(result.value.userId);
            } else {
               // eslint-disable-next-line no-console
               console.error("Failed to fetch Clerk sessions:", result.reason);
            }
         }
      }

      const totalPages = Math.ceil(totalCount / pageSize);

      const data: UserItem[] = users.map((user) => {
         const name =
            [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
            "Unknown User";

         const clerkData = clerkMetadataMap.get(user.clerkUserId);
         const lastActive = clerkData?.lastActive ?? null;

         return {
            id: user.id,
            clerkUserId: user.clerkUserId,
            name,
            email: user.email,
            image: user.imageUrl,
            role: user.role,
            status: user.status,
            joined: user.createdAt,
            lastActive,
            credits: user.role === "INTERVIEWER" ? user.creditBalance : user.credits,
            hasActiveSession: activeSessionUserIds.has(user.clerkUserId)
         };
      });

      return {
         data,
         page,
         pageSize,
         totalCount,
         totalPages,
         hasNextPage: page < totalPages,
         hasPrevPage: page > 1,
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch users",
      });
   }
};

export const toggleUserStatus = async (userId: string): Promise<ToggleUserStatus> => {
   try {
      await getAuthenticatedUser();

      const user = await db.user.findFirst({
         where: {
            OR: [
               { id: userId },
               { clerkUserId: userId },
            ],
         },
      });

      if (!user) {
         throw new NotFoundError("User not found");
      }

      // If targetStatus is provided, use it; otherwise, toggle the current status
      const nextStatus = user.status === UserStatus.BANNED ? UserStatus.ACTIVE : UserStatus.BANNED;
      const isBanning = nextStatus === UserStatus.BANNED;

      const client = await clerkClient();
      if (isBanning) {
         await client.users.banUser(user.clerkUserId);
      } else {
         await client.users.unbanUser(user.clerkUserId);
      }

      const updatedUser = await db.user.update({
         where: { id: user.id },
         data: { status: nextStatus },
      });

      return {
         success: true,
         id: updatedUser.id,
         status: updatedUser.status
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to update user status",
      });
   }
};

export const signOutUser = async (userId: string): Promise<SignOutUser> => {
   try {
      await getAuthenticatedUser();

      const user = await db.user.findFirst({
         where: {
            OR: [
               { id: userId },
               { clerkUserId: userId },
            ],
         },
      });

      if (!user) {
         throw new NotFoundError("User not found");
      }

      const client = await clerkClient();
      const { data: sessions } = await client.sessions.getSessionList({
         userId: user.clerkUserId,
         status: "active",
      });

      await Promise.all(
         sessions.map((session) => client.sessions.revokeSession(session.id))
      );

      return {
         success: true,
         revokedSessionsCount: sessions.length,
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to sign out user",
      });
   }
};