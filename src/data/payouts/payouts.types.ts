export interface ConfirmDialogCopy {
   title: string;
   description: string;
   confirmText: string;
}

export interface PayoutsData {
   header: {
      title: string;
      description: string;
   };
   dialogs: {
      approve: ConfirmDialogCopy;
      reject: ConfirmDialogCopy;
      deactivate: ConfirmDialogCopy;
   };
}
