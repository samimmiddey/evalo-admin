"use client";

import ModalWrapper from "@/components/wrappers/modal-wrapper";
import { Badge } from "@/components/ui/badge";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import getStatusBadge from "@/components/common/get-status-badge";
import CustomSpinner from "@/components/common/custom-spinner";
import ErrorCard from "@/components/common/error-card";
import NoDataCard from "@/components/common/no-data-card";
import { useFetch } from "@/hooks/use-fetch";
import { getUserDetails } from "../services/user.client.service";
import { usersData } from "@/data/users/users.data";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
   User,
   UserCheck,
   Mail,
   Phone,
   Coins,
   Layers,
   Calendar,
   Clock,
   Briefcase,
   Building2,
   Star,
   Award,
   Activity,
   Video,
   Receipt,
   Banknote,
   CreditCard
} from "lucide-react";

interface UserDetailsModalProps {
   userId: string | null;
   open: boolean;
   onClose: () => void;
}

export const UserDetailsModal = ({ userId, open, onClose }: UserDetailsModalProps) => {
   const { data: user, isLoading, error } = useFetch(
      () => getUserDetails(userId ?? ""),
      [userId, open]
   );

   const copy = usersData.detailsModal;

   const getRoleBadge = (role: string) => {
      switch (role) {
         case "INTERVIEWER":
            return (
               <Badge className="bg-violet-500/15 text-violet-300 border border-violet-500/30 text-xs font-medium">
                  Interviewer
               </Badge>
            );
         case "CANDIDATE":
            return (
               <Badge className="bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs font-medium">
                  Candidate
               </Badge>
            );
         default:
            return (
               <Badge className="bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 text-xs font-medium">
                  Unassigned
               </Badge>
            );
      }
   };

   return (
      <ModalWrapper
         open={open}
         onClose={onClose}
         title={copy.title}
         description={copy.description}
         headerIcon={<User className="w-4 h-4 text-violet-400" />}
         className="max-w-full sm:max-w-5xl"
         bodyClassName="p-5 sm:p-7 flex flex-col gap-5"
      >
         {isLoading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
               <CustomSpinner text={copy.loadingText} />
            </div>
         )}

         {!isLoading && error && (
            <ErrorCard text={error} className="my-4" />
         )}

         {!isLoading && !error && !user && (
            <NoDataCard title={copy.noDataTitle} body={copy.noDataBody} className="my-4" />
         )}

         {!isLoading && !error && user && (
            <div className="flex flex-col gap-5">
               {/* Hero Profile Card */}
               <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5 p-5 sm:p-6 shadow-xl">
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                     <div className="flex max-sm:flex-col items-start sm:items-center gap-4">
                        <div className="relative shrink-0">
                           <Image
                              src={user.image ?? "/user.png"}
                              alt={user.name}
                              height={72}
                              width={72}
                              className="rounded-2xl size-16 sm:size-18 object-cover border-2 border-white/10 shadow-md bg-zinc-800"
                           />
                           <span
                              className={cn(
                                 "absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-zinc-950",
                                 user.hasActiveSession ? "bg-emerald-400" : "bg-zinc-500"
                              )}
                           />
                        </div>

                        <div className="flex flex-col gap-3 sm:gap-2">
                           <div className="flex flex-wrap items-center gap-2">
                              <SecondaryTitle text={user.name} />
                              <div className="flex items-center gap-2">
                                 {getRoleBadge(user.role)}
                                 {getStatusBadge(user.status)}
                              </div>
                           </div>

                           <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400">
                              <div className="flex items-center gap-1.5">
                                 <Mail className="size-3.5 text-zinc-500 shrink-0" />
                                 <span className="text-zinc-300">{user.email}</span>
                              </div>
                              {user.phone && (
                                 <div className="flex items-center gap-1.5">
                                    <Phone className="size-3.5 text-zinc-500 shrink-0" />
                                    <span className="text-zinc-300">{user.phone}</span>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>

                     <Badge
                        className={
                           user.hasActiveSession
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs flex items-center gap-1.5"
                              : "bg-zinc-800 text-zinc-400 border border-zinc-700/60 text-xs flex items-center gap-1.5"
                        }
                     >
                        {user.hasActiveSession ? copy.labels.activeNow : copy.labels.offline}
                     </Badge>

                  </div>
               </div>

               {/* Key Metrics Grid */}
               <div className="grid xs:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* Credits */}
                  <div className="rounded-xl bg-zinc-900/50 border border-white/5 p-4 flex flex-col gap-2 transition-colors">
                     <div className="flex items-center justify-between text-zinc-400">
                        <PrimaryBody
                           text={user.role === "INTERVIEWER" ? copy.labels.creditBalance : copy.labels.credits}
                           className="text-xs! font-semibold! uppercase tracking-wider text-zinc-400!"
                        />
                        <div className="p-1.5 rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                           <Coins className="size-3.5" />
                        </div>
                     </div>
                     <SecondaryTitle
                        text={(user.role === "INTERVIEWER" ? user.creditBalance : user.credits).toLocaleString()}
                        className='text-sm! 2xl:text-base! font-medium!'
                     />
                  </div>

                  {/* Current Plan */}
                  <div className="rounded-xl bg-zinc-900/50 border border-white/5 p-4 flex flex-col gap-2 transition-colors">
                     <div className="flex items-center justify-between text-zinc-400">
                        <PrimaryBody
                           text={copy.labels.currentPlan}
                           className="text-xs! font-semibold! uppercase tracking-wider text-zinc-400!"
                        />
                        <div className="p-1.5 rounded-lg border bg-violet-500/10 border-violet-500/20 text-violet-400">
                           <Layers className="size-3.5" />
                        </div>
                     </div>
                     <SecondaryTitle
                        text={user.currentPlan.charAt(0).toUpperCase() + user.currentPlan.slice(1).toLocaleLowerCase()}
                        className='text-sm! 2xl:text-base! font-medium!'
                     />
                  </div>

                  {/* Joined Date */}
                  <div className="rounded-xl bg-zinc-900/50 border border-white/5 p-4 flex flex-col gap-2 transition-colors">
                     <div className="flex items-center justify-between text-zinc-400">
                        <PrimaryBody
                           text={copy.labels.joined}
                           className="text-xs! font-semibold! uppercase tracking-wider text-zinc-400!"
                        />
                        <div className="p-1.5 rounded-lg border bg-blue-500/10 border-blue-500/20 text-blue-400">
                           <Calendar className="size-3.5" />
                        </div>
                     </div>
                     <SecondaryTitle
                        text={formatDate(user.joined, "PPp")}
                        className='text-sm! 2xl:text-base! font-medium!'
                     />
                  </div>

                  {/* Last Active */}
                  <div className="rounded-xl bg-zinc-900/50 border border-white/5 p-4 flex flex-col gap-2 transition-colors">
                     <div className="flex items-center justify-between text-zinc-400">
                        <PrimaryBody
                           text={copy.labels.lastActive}
                           className="text-xs! font-semibold! uppercase tracking-wider text-zinc-400!"
                        />
                        <div className="p-1.5 rounded-lg border bg-amber-500/10 border-amber-500/20 text-amber-400">
                           <Clock className="size-3.5" />
                        </div>
                     </div>
                     <SecondaryTitle
                        text={user.lastActive ? formatDate(user.lastActive, "PPp") : "Never"}
                        className='text-sm! 2xl:text-base! font-medium!'
                     />
                  </div>
               </div>

               {/* Professional Profile Section */}
               {(user.role === "INTERVIEWER" || user.designation || user.company || user.experience || user.expertise?.length > 0 || user.bio) && (
                  <div className="rounded-2xl bg-zinc-900/50 border border-white/5 p-5 sm:p-6 flex flex-col gap-4">
                     <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                           <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
                              <Briefcase className="size-4" />
                           </div>
                           <SecondaryTitle text={copy.sections.professional} />
                        </div>
                        {user.totalRatings > 0 && (
                           <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                              <Star className="size-3 text-amber-400 fill-amber-400" />
                              <span className="font-semibold text-amber-300">
                                 {user.averageRating?.toFixed(1) ?? "0"}
                              </span>
                              <span className="text-zinc-500">
                                 ({user.totalRatings})
                              </span>
                           </div>
                        )}
                     </div>

                     <div className="grid xs:grid-cols-2 lg:grid-cols-4 gap-3">
                        {user.designation && (
                           <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-white/5 flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-white/5 text-zinc-400 shrink-0">
                                 <Building2 className="size-4 text-sky-400" />
                              </div>
                              <div className="flex flex-col min-w-0 gap-0.5">
                                 <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                                    {copy.labels.designation}
                                 </span>
                                 <span className="text-xs sm:text-sm font-medium text-zinc-200 truncate">
                                    {user.designation}
                                 </span>
                              </div>
                           </div>
                        )}
                        {user.company && (
                           <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-white/5 flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-white/5 text-zinc-400 shrink-0">
                                 <Building2 className="size-4 text-amber-400" />
                              </div>
                              <div className="flex flex-col min-w-0 gap-0.5">
                                 <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                                    {copy.labels.company}
                                 </span>
                                 <span className="text-xs sm:text-sm font-medium text-zinc-200 truncate">
                                    {user.company}
                                 </span>
                              </div>
                           </div>
                        )}
                        {user.experience !== null && user.experience !== undefined && (
                           <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-white/5 flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-white/5 text-zinc-400 shrink-0">
                                 <Award className="size-4 text-violet-400" />
                              </div>
                              <div className="flex flex-col min-w-0 gap-0.5">
                                 <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                                    {copy.labels.experience}
                                 </span>
                                 <span className="text-xs sm:text-sm font-medium text-zinc-200 truncate">
                                    {user.experience} Years
                                 </span>
                              </div>
                           </div>
                        )}
                        {user.creditRate > 0 && (
                           <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-white/5 flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-white/5 text-zinc-400 shrink-0">
                                 <Coins className="size-4 text-emerald-400" />
                              </div>
                              <div className="flex flex-col min-w-0 gap-0.5">
                                 <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                                    {copy.labels.creditRate}
                                 </span>
                                 <span className="text-xs sm:text-sm font-medium text-zinc-200 truncate">
                                    {user.creditRate} Credits / Session
                                 </span>
                              </div>
                           </div>
                        )}
                     </div>

                     {user.expertise?.length > 0 && (
                        <div className="flex flex-col gap-2 pt-3.5 border-t border-white/5">
                           <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
                              {copy.labels.expertise}
                           </span>
                           <div className="flex flex-wrap gap-1.5">
                              {user.expertise.map((item) => (
                                 <Badge
                                    key={item}
                                    className="bg-zinc-800 p-2.5 text-zinc-300"
                                 >
                                    {item}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     )}

                     {user.bio && (
                        <div className="flex flex-col gap-2 pt-3.5 border-t border-white/5">
                           <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
                              {copy.labels.bio}
                           </span>
                           <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5">
                              <PrimaryBody
                                 text={user.bio}
                                 className="text-[13px]! 2xl:text-sm! text-zinc-300"
                              />
                           </div>
                        </div>
                     )}
                  </div>
               )}

               {/* Platform Activity Section */}
               <div className="rounded-2xl bg-zinc-900/50 border border-white/5 p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                     <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Activity className="size-4" />
                     </div>
                     <SecondaryTitle text={copy.sections.activity} />
                  </div>

                  <div className="grid xs:grid-cols-2 lg:grid-cols-3 gap-3">
                     {
                        user.role === 'CANDIDATE' &&
                        <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-white/5 flex flex-col gap-1.5 transition-colors">
                           <div className="flex items-center justify-between text-zinc-400">
                              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                 {copy.labels.bookingsAsCandidate}
                              </span>
                              <UserCheck className="size-3.5 text-blue-400" />
                           </div>
                           <SecondaryTitle
                              text={user.counts.bookingsAsCandidate.toLocaleString()}
                              className="text-base! 2xl:text-lg!"
                           />
                        </div>
                     }

                     {
                        user.role === 'INTERVIEWER' &&
                        <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-white/5 flex flex-col gap-1.5 transition-colors">
                           <div className="flex items-center justify-between text-zinc-400">
                              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                 {copy.labels.bookingsAsInterviewer}
                              </span>
                              <Video className="size-3.5 text-violet-400" />
                           </div>
                           <SecondaryTitle
                              text={user.counts.bookingsAsInterviewer.toLocaleString()}
                              className="text-base! 2xl:text-lg!"
                           />
                        </div>
                     }

                     <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-white/5 flex flex-col gap-1.5 transition-colors">
                        <div className="flex items-center justify-between text-zinc-400">
                           <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                              {copy.labels.transactions}
                           </span>
                           <Receipt className="size-3.5 text-emerald-400" />
                        </div>
                        <SecondaryTitle
                           text={user.counts.transactions.toLocaleString()}
                           className="text-base! 2xl:text-lg!"
                        />
                     </div>

                     <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-white/5 flex flex-col gap-1.5 transition-colors">
                        <div className="flex items-center justify-between text-zinc-400">
                           <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                              {copy.labels.payouts}
                           </span>
                           <Banknote className="size-3.5 text-amber-400" />
                        </div>
                        <SecondaryTitle
                           text={user.counts.payouts.toLocaleString()}
                           className="text-base! 2xl:text-lg!"
                        />
                     </div>
                  </div>
               </div>

               {/* Subscriptions Section */}
               {user.subscriptions?.length > 0 && (
                  <div className="rounded-2xl bg-zinc-900/50 border border-white/5 p-5 sm:p-6 flex flex-col gap-4">
                     <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                           <CreditCard className="size-4" />
                        </div>
                        <SecondaryTitle text={copy.sections.subscriptions} />
                     </div>

                     <div className="flex flex-col gap-2.5">
                        {user.subscriptions.map((sub) => (
                           <div
                              key={sub.id}
                              className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 transition-colors flex items-center justify-between gap-4"
                           >
                              <div className="flex items-center gap-3 min-w-0">
                                 <div className="p-2 rounded-lg bg-white/5 text-zinc-400 shrink-0">
                                    <Layers className="size-4" />
                                 </div>
                                 <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-sm text-zinc-200 capitalize truncate">
                                       {sub.planSlug} Plan
                                    </span>
                                    {sub.createdAt && (
                                       <span className="text-xs text-zinc-500 mt-px truncate">
                                          Started at {formatDate(sub.createdAt, "PP")}
                                       </span>
                                    )}
                                 </div>
                              </div>
                              <div className="shrink-0">
                                 {getStatusBadge(sub.status)}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         )}
      </ModalWrapper>
   );
};
