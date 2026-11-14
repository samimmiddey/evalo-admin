import { PayoutsData } from "./payouts.types";

export const payoutsData: PayoutsData = {
   header: {
      title: "Payouts",
      description: "Review, track, and manage interviewer payout requests and disbursements",
   },
   dialogs: {
      approve: {
         title: "Approve payout request",
         description: "Are you sure you want to approve this payout request? This action is permanent and cannot be undone.",
         confirmText: "Approve",
      },
      reject: {
         title: "Reject payout request",
         description: "Are you sure you want to reject this payout request? This action is permanent and cannot be undone.",
         confirmText: "Reject",
      },
      deactivate: {
         title: "Deactivate Cashgram",
         description: "Are you sure you want to deactivate this Cashgram link? This action is permanent and cannot be undone.",
         confirmText: "Deactivate",
      },
   },
};
