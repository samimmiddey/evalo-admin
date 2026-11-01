import { useFetch } from '@/hooks/use-fetch';
import { getExpertiseDemandMetrics } from './services/dashboard.client.service';
import { ExpertiseDemandItem } from './types/dashboard.types';
import CardLayout from '@/components/layouts/card-layout';
import CustomBarChart from '@/components/common/charts/bar-chart';
import { domainFormatter } from '@/utils/domain-formatter';
import SecondaryTitle from '@/components/common/secondary-title';
import BarChartLoader from './components/skeletons/bar-chart-loader';
import ErrorText from '@/components/common/error-text';
import NoDataText from '@/components/common/no-data-text';

interface DashboardStatsProps {
   startDate: Date | undefined;
   endDate: Date | undefined;
}

const ExperienceMetrics = ({ startDate, endDate }: DashboardStatsProps) => {
   const { isLoading, data, error } = useFetch<ExpertiseDemandItem[]>(
      () => getExpertiseDemandMetrics({ startDate, endDate }),
      [startDate, endDate]
   );

   // Loading state
   if (isLoading) {
      return (
         <BarChartLoader />
      );
   }

   const hasData = data?.some((item) => item.count > 0);

   return (
      <CardLayout className='p-5! 2xl:p-6!'>
         <SecondaryTitle
            text='Most Requested Tech Domains'
            className="text-zinc-300! text-base 2xl:text-lg mb-5 2xl:mb-6"
         />
         <div className="h-62.5 sm:h-75 2xl:h-85 flex items-center justify-center">
            {
               error ? (
                  <ErrorText text={error} />
               ) : !hasData ? (
                  <NoDataText text='No interview data found for this period' />
               ) : (
                  <CustomBarChart
                     data={data ?? []}
                     formatLabel={domainFormatter}
                     labelAngle={-35}
                     dataKey='count'
                     xAxisKey='label'
                     xAxisHeight={50}
                  />
               )
            }
         </div>
      </CardLayout>
   );
};

export default ExperienceMetrics;