export interface UserDetailsModalCopy {
   title: string;
   description: string;
   loadingText: string;
   errorTitle: string;
   noDataTitle: string;
   noDataBody: string;
   sections: {
      overview: string;
      professional: string;
      activity: string;
      subscriptions: string;
   };
   labels: {
      userId: string;
      email: string;
      phone: string;
      role: string;
      status: string;
      joined: string;
      lastActive: string;
      sessionStatus: string;
      credits: string;
      creditBalance: string;
      currentPlan: string;
      designation: string;
      company: string;
      experience: string;
      expertise: string;
      creditRate: string;
      rating: string;
      bio: string;
      bookingsAsCandidate: string;
      bookingsAsInterviewer: string;
      transactions: string;
      payouts: string;
      activeNow: string;
      offline: string;
      noBio: string;
      noSubscriptions: string;
   };
}

export interface UsersData {
   header: {
      title: string;
      description: string;
   };
   detailsModal: UserDetailsModalCopy;
}

