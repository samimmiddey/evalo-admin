import ky from "ky";

export const api = ky.create({
   prefix: "/api",
   headers: {
      "Content-Type": "application/json",
   },
   throwHttpErrors: false,
   timeout: 10000,
   retry: {
      limit: 0,
      methods: ["get", "post", "put", "patch", "delete"],
   }
});