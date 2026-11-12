import "server-only";

import ky from "ky";

const clientId = process.env.CASHFREE_PAYOUT_CLIENT_ID || "";
const clientSecret = process.env.CASHFREE_PAYOUT_CLIENT_SECRET || "";
const baseURL = process.env.CASHFREE_PAYOUT_URL || "";

let cachedToken: string | null = null;
let tokenExpiryTime = 0;
let tokenPromise: Promise<string> | null = null;

interface CashfreeAuthResponse {
   status: string;
   subCode: string;
   message: string;
   data?: {
      token: string;
      expiry: number;
   };
}

async function fetchPayoutToken(): Promise<string> {
   const response = await ky
      .post(`${baseURL.replace(/\/+$/, "")}/payout/v1/authorize`, {
         headers: {
            "X-Client-Id": clientId,
            "X-Client-Secret": clientSecret,
         },
         throwHttpErrors: true,
         timeout: 10000,
      })
      .json<CashfreeAuthResponse>();

   if (response.status !== "SUCCESS" || !response.data?.token) {
      throw new Error(response.message || "Failed to generate Cashfree Payout authorization token");
   }

   cachedToken = response.data.token;
   tokenExpiryTime = response.data.expiry;

   return cachedToken;
}

function getPayoutToken(): Promise<string> {
   const now = Math.floor(Date.now() / 1000);

   if (cachedToken && tokenExpiryTime - now > 30) {
      return Promise.resolve(cachedToken);
   }

   tokenPromise ??= fetchPayoutToken().finally(() => {
      tokenPromise = null;
   });

   return tokenPromise;
}

export const apiCashfree = ky.create({
   prefix: baseURL,
   headers: {
      "Content-Type": "application/json",
   },
   hooks: {
      beforeRequest: [
         async ({ request }) => {
            const token = await getPayoutToken();
            request.headers.set("Authorization", `Bearer ${token}`);
         },
      ],
   },
   throwHttpErrors: false,
   timeout: 10000,
   retry: {
      limit: 0,
      methods: ["get", "post", "put", "patch", "delete"],
   }
});