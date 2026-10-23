import { format, parseISO } from "date-fns";

export function formatDate(
   date?: string | Date | null,
   pattern = "PPp"
): string {
   if (!date) return "-";

   try {
      if (date instanceof Date) {
         return isNaN(date.getTime()) ? "-" : format(date, pattern);
      }

      // Normalizes "YYYY-MM-DD HH:mm:ss" (from Cashfree) to ISO "YYYY-MM-DDTHH:mm:ss"
      const normalized = date.includes("T") ? date : date.replace(" ", "T");
      const parsed = parseISO(normalized);

      return isNaN(parsed.getTime()) ? date : format(parsed, pattern);
   } catch {
      return typeof date === "string" ? date : "-";
   }
}
