import { ForbiddenError, UnauthorizedError } from "@/lib/app-error";
import { currentUser, User } from "@clerk/nextjs/server";

export const getAuthenticatedUser = async (): Promise<User> => {
   const user = await currentUser();

   if (!user) {
      throw new UnauthorizedError('Unauthenticated user');
   }

   if (user.publicMetadata?.role !== 'ADMIN') {
      throw new ForbiddenError('Only admin can access this data');
   }

   return user;
};