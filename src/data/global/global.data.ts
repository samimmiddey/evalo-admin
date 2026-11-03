import { GlobalTypes } from "./global.types";

export const globalData: GlobalTypes = {
   statusBadges: {
      success: "Successful",
      failed: "Failed",
      pending: "Pending",
      processing: "Processing",
      processed: "Processed",
      rejected: "Rejected",
      cancelled: "Cancelled",
      active: "Active",
      completed: "Completed",
      onHold: "On Hold",
      scheduled: "Scheduled",
      expired: "Expired",
      bankPending: "Bank Pending",
      free: "Free",
      paused: "Paused"
   },
   tableNoData: {
      title: "No records found",
      body: "There are no entries to display at this time. Once data becomes available, it will appear here."
   }
};

import { endOfMonth, startOfMonth, subDays } from "date-fns";
import { DatePresetItem } from "./global.types";

export const DATE_PRESETS: DatePresetItem[] = [
   {
      label: "This Month",
      getRange: () => ({
         from: startOfMonth(new Date()),
         to: endOfMonth(new Date())
      })
   },
   {
      label: "Last 7 Days",
      getRange: () => ({
         from: subDays(new Date(), 7),
         to: new Date()
      })
   },
   {
      label: "Last 30 Days",
      getRange: () => ({
         from: subDays(new Date(), 30),
         to: new Date()
      })
   },
   {
      label: "All Time",
      getRange: () => undefined
   }
];