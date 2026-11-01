import { useFetch } from '@/hooks/use-fetch';
import { getInterviewVolumeTrends } from './services/dashboard.client.service';
import { InterviewVolumeTrendItem } from './types/dashboard.types';
import CardLayout from '@/components/layouts/card-layout';
import CustomLineChart from '@/components/common/charts/line-chart';
import SecondaryTitle from '@/components/common/secondary-title';
import ErrorText from '@/components/common/error-text';
import NoDataText from '@/components/common/no-data-text';
import { dashboardData, TREND_SERIES } from '@/data/dashboard/dashboard.data';
import { formatDate } from '@/utils/format-date';
import LineChartLoader from './components/skeletons/line-chart-loader';

interface DashboardStatsProps {
   startDate: Date | undefined;
   endDate: Date | undefined;
}

const InterviewTrends = ({ startDate, endDate }: DashboardStatsProps) => {
   const { isLoading, data, error } = useFetch<InterviewVolumeTrendItem[]>(
      () => getInterviewVolumeTrends({ startDate, endDate }),
      [startDate, endDate]
   );

   // Loading state
   if (isLoading) {
      return (
         <LineChartLoader />
      );
   }

   const hasData = data?.some((item) => item.total > 0);

   return (
      <CardLayout className='p-5! 2xl:p-6!'>
         <SecondaryTitle
            text={dashboardData.interviewTrends.title}
            className="text-zinc-300! text-base 2xl:text-lg mb-5 2xl:mb-6"
         />
         <div className="h-62.5 sm:h-75 2xl:h-85 flex items-center justify-center">
            {
               error ? (
                  <ErrorText text={error} />
               ) : !hasData ? (
                  <NoDataText text={dashboardData.interviewTrends.noData} />
               ) : (
                  <CustomLineChart
                     data={data ?? []}
                     series={TREND_SERIES}
                     xAxisKey='date'
                     formatLabel={(val) => formatDate(val, 'MMM d')}
                     xAxisInterval={2}
                     labelAngle={-35}
                     xAxisHeight={50}
                     showDots={true}
                  />
               )
            }
         </div>
      </CardLayout>
   );
};

export default InterviewTrends;