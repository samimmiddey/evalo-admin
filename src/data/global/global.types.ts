import { DateRange } from "react-day-picker";

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
   banned: string;
   approved: string;
}

export interface TableNoDataState {
   title: string;
   body: string;
}

export interface GlobalTypes {
   statusBadges: StatusBadges;
   tableNoData: TableNoDataState;
}

export interface DatePresetItem {
   label: string;
   getRange: () => DateRange | undefined;
}