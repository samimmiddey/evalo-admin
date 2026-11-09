export interface SettingsFieldCopy {
   label: string;
   description: string;
   placeholder: string;
   unit: string;
}

export interface SettingsData {
   header: {
      title: string;
      description: string;
   };
   fields: {
      creditPayoutRate: SettingsFieldCopy;
      platformFeePercent: SettingsFieldCopy;
      minPayoutCredits: SettingsFieldCopy;
   };
   actions: {
      save: string;
      saving: string;
   };
   notifications: {
      success: string;
      error: string;
   };
   lastUpdated: string;
}

