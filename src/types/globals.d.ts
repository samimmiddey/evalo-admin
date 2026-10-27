import { UserRole } from "@/types/user.types";

export { };

declare global {
   interface CustomJwtSessionClaims {
      metadata: {
         onboardingComplete?: boolean;
         role?: UserRole;
      };
   }
}
