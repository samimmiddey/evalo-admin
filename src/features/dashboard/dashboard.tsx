"use client";

import PageHeaderLayout from '@/components/layouts/page-header-layout';
import HeaderLayout from '@/components/layouts/header-layout';
import PrimaryTitle from '@/components/common/primary-title';
import PrimaryBody from '@/components/common/primary-body';
import DashboardStats from './dashboard-stats';
import DateRangePicker from '@/components/common/date-range-picker';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { endOfMonth, startOfMonth } from 'date-fns';
import { dashboardData } from '@/data/dashboard/dashboard.data';

const Dashboard = () => {
   const [date, setDate] = useState<DateRange | undefined>({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
   });
   const [appliedDate, setAppliedDate] = useState<DateRange | undefined>(date);

   const handleDateChange = (newRange: DateRange | undefined) => {
      setDate(newRange);

      // Only update appliedDate if:
      // 1. Cleared / "All Time" (!newRange)
      // 2. Both from and to are selected (newRange.from && newRange.to)
      if (!newRange || (newRange.from && newRange.to)) {
         setAppliedDate(newRange);
      }
   };

   return (
      <div className='s-margin-t container'>
         <PageHeaderLayout>

            {/* Header Text */}
            <HeaderLayout className="mb-0!">
               <PrimaryTitle text={dashboardData.header.title} />
               <PrimaryBody
                  text={dashboardData.header.description}
                  className="max-w-2xl"
               />
            </HeaderLayout>

            {/* Filter */}
            <DateRangePicker
               date={date}
               setDate={handleDateChange}
            />

         </PageHeaderLayout>

         {/* Stat Cards */}
         <DashboardStats
            startDate={appliedDate?.from}
            endDate={appliedDate?.to}
         />
      </div>
   );
};

export default Dashboard;