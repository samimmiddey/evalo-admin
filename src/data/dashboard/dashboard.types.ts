export interface DashboardHeaderData {
   title: string;
   description: string;
}

export interface DashboardNoDataState {
   title: string;
   body: string;
}

export interface DashboardStatCards {
   platformFees: string;
   disbursedPayouts: string;
   totalInterviews: string;
   activeSubscriptions: string;
}

export interface DashboardExperienceMetrics {
   title: string;
   noData: string;
}

export interface DashboardInterviewTrends {
   title: string;
   noData: string;
}

export interface DashboardData {
   header: DashboardHeaderData;
   noData: DashboardNoDataState;
   statCards: DashboardStatCards;
   experienceMetrics: DashboardExperienceMetrics;
   interviewTrends: DashboardInterviewTrends;
}
