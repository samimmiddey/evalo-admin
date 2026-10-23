export interface StatusBadges {
   success: string;
   failed: string;
   pending: string;
   processing: string;
   processed: string;
   rejected: string;
   cancelled: string;
   active: string;
   completed: string;
   onHold: string;
   scheduled: string;
   expired: string;
   bankPending: string;
   free: string;
   paused: string;
}

export interface GlobalTypes {
   statusBadges: StatusBadges;
}