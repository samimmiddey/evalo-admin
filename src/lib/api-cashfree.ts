import "server-only";

import ky from "ky";

const appId = process.env.CASHFREE_PG_APP_KEY || "";
const secretKey = process.env.CASHFREE_PG_SECRET_KEY || "";

const baseURL = 'https://sandbox.cashfree.com/pg';

export const apiCashfree = ky.create({
   prefix: baseURL,
   headers: {
      'x-api-version': '2026-01-01',
      'x-client-id': appId,
      'x-client-secret': secretKey
   },
   throwHttpErrors: false,
   timeout: 10000,
   retry: {
      limit: 0,
      methods: ["get", "post", "put", "patch", "delete"],
   }
});