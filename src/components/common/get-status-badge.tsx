import { Badge } from "@/components/ui/badge";
import { globalData } from "@/data/global/global.data";
import { cn } from "@/lib/utils";

export const getStatusBadge = (status?: string | null, className?: string) => {
   if (!status) return null;

   const commonClasses = {
      success: "text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
      warning: "text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30",
      danger: "text-xs bg-rose-500/15 text-rose-400 border border-rose-500/30",
      neutral: "text-xs bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
      info: "text-xs bg-blue-500/15 text-blue-400 border border-blue-500/30"
   };

   const { statusBadges } = globalData;
   const normalized = status.trim().toUpperCase();

   switch (normalized) {
      // Success / Processed / Completed / Active
      case "SUCCESS":
         return (
            <Badge className={cn(commonClasses.success, className)}>
               {statusBadges.success}
            </Badge>
         );
      case "PROCESSED":
         return (
            <Badge className={cn(commonClasses.success, className)}>
               {statusBadges.processed}
            </Badge>
         );
      case "COMPLETED":
         return (
            <Badge className={cn(commonClasses.success, className)}>
               {statusBadges.completed}
            </Badge>
         );
      case "ACTIVE":
         return (
            <Badge className={cn(commonClasses.success, className)}>
               {statusBadges.active}
            </Badge>
         );

      // Processing / Pending / In-progress / On Hold
      case "PROCESSING":
         return (
            <Badge className={cn(commonClasses.warning, className)}>
               {statusBadges.processing}
            </Badge>
         );
      case "PENDING":
         return (
            <Badge className={cn(commonClasses.warning, className)}>
               {statusBadges.pending}
            </Badge>
         );
      case "ON_HOLD":
         return (
            <Badge className={cn(commonClasses.warning, className)}>
               {statusBadges.onHold}
            </Badge>
         );

      // Failed / Rejected
      case "FAILED":
         return (
            <Badge className={cn(commonClasses.danger, className)}>
               {statusBadges.failed}
            </Badge>
         );
      case "REJECTED":
         return (
            <Badge className={cn(commonClasses.danger, className)}>
               {statusBadges.rejected}
            </Badge>
         );

      // Cancelled / Expired
      case "CANCELLED":
      case "CANCELED":
         return (
            <Badge className={cn(commonClasses.neutral, className)}>
               {statusBadges.cancelled}
            </Badge>
         );
      case "EXPIRED":
         return (
            <Badge className={cn(commonClasses.neutral, className)}>
               {statusBadges.expired}
            </Badge>
         );

      // Scheduled / Approval
      case "SCHEDULED":
         return (
            <Badge className={cn(commonClasses.info, className)}>
               {statusBadges.scheduled}
            </Badge>
         );
      case "BANK_APPROVAL_PENDING":
         return (
            <Badge className={cn(commonClasses.info, className)}>
               {statusBadges.bankPending}
            </Badge>
         );

      // Paused
      case "PAUSED":
         return (
            <Badge className={cn(commonClasses.warning, className)}>
               {statusBadges.paused}
            </Badge>
         );

      // Free Tier
      case "FREE":
         return (
            <Badge className={cn(commonClasses.neutral, className)}>
               {statusBadges.free}
            </Badge>
         );

      default:
         return (
            <Badge className={cn(commonClasses.warning, className)}>
               {status}
            </Badge>
         );
   }
};

export default getStatusBadge;