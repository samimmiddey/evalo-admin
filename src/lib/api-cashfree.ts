import "server-only";
import crypto from "crypto";

import ky from "ky";

const clientId = process.env.CASHFREE_CASHGRAM_APP_KEY || "";
const clientSecret = process.env.CASHFREE_CASHGRAM_SECRET_KEY || "";
const baseURL = process.env.CASHFREE_CASHGRAM_URL || "";
const rawPublicKey = process.env.CASHFREE_PAYOUT_PUBLIC_KEY || "";

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

function generateCfSignature(): string | null {
   if (!rawPublicKey) return null;

   const formattedKey = rawPublicKey.includes("-----BEGIN")
      ? rawPublicKey.replace(/\\n/g, "\n")
      : `-----BEGIN PUBLIC KEY-----\n${rawPublicKey.trim()}\n-----END PUBLIC KEY-----`;

   const timestamp = Math.floor(Date.now() / 1000);
   const message = `${clientId}.${timestamp}`;

   const encrypted = crypto.publicEncrypt(
      {
         key: formattedKey,
         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
         oaepHash: "sha1",
      },
      Buffer.from(message, "utf8")
   );

   return encrypted.toString("base64");
}

async function fetchPayoutToken(): Promise<string> {
   const signature = generateCfSignature();

   const headers: Record<string, string> = {
      "X-Client-Id": clientId,
      "X-Client-Secret": clientSecret,
   };

   if (signature) {
      headers["X-Cf-Signature"] = signature;
   }

   const response = await ky
      .post(`${baseURL.replace(/\/+$/, "")}/payout/v1/authorize`, {
         headers,
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