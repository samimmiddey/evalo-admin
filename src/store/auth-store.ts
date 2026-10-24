import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthInterface {
   otpExpiresAt: number | null;
   setOtpExpiresAt: (value: number | null) => void;
   hasRequestedResend: boolean;
   setHasRequestedResend: (value: boolean) => void;
};

const useAuthStore = create<AuthInterface>()(
   persist(
      (set) => ({
         otpExpiresAt: null,
         setOtpExpiresAt: (value) => set({ otpExpiresAt: value }),
         hasRequestedResend: false,
         setHasRequestedResend: (value) => set({ hasRequestedResend: value }),
      }),
      {
         name: 'auth',
         storage: createJSONStorage(() => localStorage)
      }
   )
);

export default useAuthStore;