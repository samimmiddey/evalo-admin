import { useFetch } from '@/hooks/use-fetch';
import { DashboardMetrics, DashboardStatItem } from './types/dashboard.types';
import { getAdminOverviewMetrics } from './services/dashboard.client.service';
import DashboardMetricsLoader from './components/skeletons/dashboard-metrics-loader';
import ErrorCard from '@/components/common/error-card';
import NoDataCard from '@/components/common/no-data-card';
import { Banknote, CircleDollarSign, Users, Video } from 'lucide-react';
import StatCard from './components/stat-card';
import { formatCurrency } from '@/utils/format-currency';
import { formatNumber } from '@/utils/format-number';
import { dashboardData } from '@/data/dashboard/dashboard.data';

interface DashboardStatsProps {
   startDate: Date | undefined;
   endDate: Date | undefined;
}

const DashboardStats = ({ startDate, endDate }: DashboardStatsProps) => {
   const { isLoading, data, error } = useFetch<DashboardMetrics>(
      () => getAdminOverviewMetrics({ startDate, endDate }),
      [startDate, endDate]
   );

   // Loading state
   if (isLoading) {
      return <DashboardMetricsLoader />;
   }

   // Error state
   if (error) {
      return <ErrorCard text={error} />;
   }

   // No-data state
   if (!data) {
      return <NoDataCard
         title={dashboardData.noData.title}
         body={dashboardData.noData.body}
      />;
   }

   const statItems: DashboardStatItem[] = [
      {
         title: dashboardData.statCards.platformFees,
         value: formatCurrency(data.platformFees),
         subValue: `${data.platformFeesGrowth}% vs last period`,
         icon: CircleDollarSign,
         iconStyle: 'text-violet-400 bg-violet-500/15 border-violet-500/30'
      },
      {
         title: dashboardData.statCards.disbursedPayouts,
         value: formatCurrency(data.disbursedAmount),
         subValue: `${formatNumber(data.disbursedCount)} payouts processed`,
         icon: Banknote,
         iconStyle: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
      },
      {
         title: dashboardData.statCards.totalInterviews,
         value: formatNumber(data.totalInterviews),
         subValue: `${data.completionRate}% completion rate`,
         icon: Video,
         iconStyle: 'text-blue-400 bg-blue-500/15 border-blue-500/30'
      },
      {
         title: dashboardData.statCards.activeSubscriptions,
         value: formatNumber(data.activeSubscriptions),
         subValue: `${formatNumber(data.newSubscriptions)} new this period`,
         icon: Users,
         iconStyle: 'text-amber-400 bg-amber-500/15 border-amber-500/30'
      },
   ];

   return (
      <div className="grid xs:grid-cols-2 xl:grid-cols-4 gap-4 2xl:gap-5">
         {statItems.map((item) => (
            <StatCard key={item.title} item={item} />
         ))}
      </div>
   );
};

export default DashboardStats;