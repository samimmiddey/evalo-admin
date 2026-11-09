import { SettingsData } from "./settings.types";

export const settingsData: SettingsData = {
   header: {
      title: "Settings",
      description: "Manage global platform configurations, system preferences, and administrative controls.",
   },
   fields: {
      creditPayoutRate: {
         label: "Credit Payout Rate",
         description: "The fiat payout value in INR credited to interviewers per completed credit.",
         placeholder: "50",
         unit: "₹ / credit",
      },
      platformFeePercent: {
         label: "Platform Fee",
         description: "The percentage commission retained by the platform from each session transaction.",
         placeholder: "10",
         unit: "%",
      },
      minPayoutCredits: {
         label: "Minimum Payout Credits",
         description: "The minimum number of earned credits an interviewer must hold to request a payout.",
         placeholder: "5",
         unit: "Credits",
      },
   },
   actions: {
      save: "Save Changes",
      saving: "Saving...",
   },
   notifications: {
      success: "Platform settings updated successfully",
      error: "Failed to update platform settings",
   },
   lastUpdated: "Last updated on",
};
