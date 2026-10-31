import CardLayout from "@/components/layouts/card-layout";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { DashboardStatItem } from "../types/dashboard.types";

export const StatCard = ({ item }: { item: DashboardStatItem; }) => {
   return (
      <CardLayout
         key={item.title}
         className="p-5! space-y-3"
      >
         <div className="flex items-center justify-between gap-3">
            <PrimaryBody
               text={item.title}
               className="text-xs! lg:text-xs! 2xl:text-xs! font-semibold! uppercase tracking-wider text-zinc-400!"
            />
            <div className={`p-2 rounded-lg border w-max ${item.iconStyle}`}>
               <item.icon className="size-4" />
            </div>
         </div>

         <SecondaryTitle
            text={`${item.value}`}
            className="text-2xl! lg:text-3xl! font-bold! text-zinc-100! tracking-tight!"
         />

         <PrimaryBody
            text={item.subValue}
            className="text-[11px]! lg:text-[11px]! 2xl:text-[11px]! text-zinc-500! font-medium! truncate"
         />
      </CardLayout>
   );
};

export default StatCard;
