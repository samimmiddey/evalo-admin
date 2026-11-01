export const domainFormatter = (val: string) => {
   const labels: Record<string, string> = {
      SYSTEM_DESIGN: "Sys Design",
      FULLSTACK: "Fullstack",
      FRONTEND: "Frontend",
      BACKEND: "Backend",
      MOBILE: "Mobile",
      SECURITY: "Security",
      DEVOPS: "DevOps",
      ML_AI: "ML / AI",
      CLOUD: "Cloud",
      DSA: "DSA",
      QA: "QA",
   };
   return labels[val] ?? val;
};