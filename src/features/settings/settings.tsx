"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Coins, Percent, Banknote, Save } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { useMutation } from "@/hooks/use-mutation";
import { getPlatformConfig, updatePlatformConfig } from "./services/settings.client.service";
import { settingsSchema, SettingsSchemaType } from "./schemas/settings.schema";
import { settingsData } from "@/data/settings/settings.data";
import HeaderLayout from "@/components/layouts/header-layout";
import PageHeaderLayout from "@/components/layouts/page-header-layout";
import CardLayout from "@/components/layouts/card-layout";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";
import ErrorCard from "@/components/common/error-card";
import InputError from "@/components/common/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import SettingsLoader from "./components/skeletons/settings-loader";
import { formatDate } from "@/utils/format-date";

const Settings = () => {
   const { data, isLoading, error } = useFetch(getPlatformConfig, []);
   const { isPending: isSaving, mutate: mutateUpdateConfig } = useMutation(updatePlatformConfig);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isDirty },
   } = useForm<SettingsSchemaType>({
      resolver: zodResolver(settingsSchema),
      defaultValues: {
         creditPayoutRate: 50,
         platformFeePercent: 10,
         minPayoutCredits: 5,
      },
   });

   useEffect(() => {
      if (data) {
         reset({
            creditPayoutRate: data.creditPayoutRate,
            platformFeePercent: data.platformFeePercent,
            minPayoutCredits: data.minPayoutCredits,
         });
      }
   }, [data, reset]);

   const onSubmit = async (values: SettingsSchemaType) => {
      const res = await mutateUpdateConfig(values);

      if (res) {
         toast.success(settingsData.notifications.success);
         reset(values);
      } else {
         toast.error(settingsData.notifications.error);
      }
   };

   return (
      <div className="s-margin-t container">
         {/* Page Header */}
         <PageHeaderLayout>
            <HeaderLayout className="mb-0!">
               <PrimaryTitle text={settingsData.header.title} />
               <PrimaryBody
                  text={settingsData.header.description}
                  className="max-w-2xl"
               />
            </HeaderLayout>
         </PageHeaderLayout>

         {/* Tri-state content handling */}
         {isLoading && <SettingsLoader />}

         {!isLoading && error && (
            <ErrorCard text={error} />
         )}

         {!isLoading && !error && data && (
            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
               <CardLayout className="space-y-6">
                  {/* Form Fields */}
                  <div className="space-y-4">
                     {/* Credit Payout Rate */}
                     <div className="rounded-xl bg-zinc-950/40 border border-white/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                        <div className="flex max-sm:flex-col items-start gap-3 max-w-xl">
                           <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.75">
                              <Coins className="size-4" />
                           </div>
                           <div className="space-y-1">
                              <Label htmlFor="creditPayoutRate" className="text-sm 2xl:text-base font-medium text-zinc-200">
                                 {settingsData.fields.creditPayoutRate.label}
                              </Label>
                              <PrimaryBody
                                 text={settingsData.fields.creditPayoutRate.description}
                                 className="text-[13px]!"
                              />
                           </div>
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-40 2xl:w-45 shrink-0">
                           <div className="relative">
                              <Input
                                 id="creditPayoutRate"
                                 type="number"
                                 onWheel={(e) => e.currentTarget.blur()}
                                 step="any"
                                 min="0"
                                 placeholder={settingsData.fields.creditPayoutRate.placeholder}
                                 {...register("creditPayoutRate", { valueAsNumber: true })}
                                 className="pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 pointer-events-none select-none">
                                 {settingsData.fields.creditPayoutRate.unit}
                              </span>
                           </div>
                           <InputError message={errors.creditPayoutRate?.message} />
                        </div>
                     </div>

                     {/* Platform Fee Percentage */}
                     <div className="rounded-xl bg-zinc-950/40 border border-white/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                        <div className="flex max-sm:flex-col items-start gap-3 max-w-xl">
                           <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0 mt-0.75">
                              <Percent className="size-4" />
                           </div>
                           <div className="space-y-1">
                              <Label htmlFor="platformFeePercent" className="text-sm 2xl:text-base font-medium text-zinc-200">
                                 {settingsData.fields.platformFeePercent.label}
                              </Label>
                              <PrimaryBody
                                 text={settingsData.fields.platformFeePercent.description}
                                 className="text-[13px]!"
                              />
                           </div>
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-40 2xl:w-45 shrink-0">
                           <div className="relative">
                              <Input
                                 id="platformFeePercent"
                                 type="number"
                                 onWheel={(e) => e.currentTarget.blur()}
                                 step="any"
                                 min="0"
                                 max="100"
                                 placeholder={settingsData.fields.platformFeePercent.placeholder}
                                 {...register("platformFeePercent", { valueAsNumber: true })}
                                 className="pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 pointer-events-none select-none">
                                 {settingsData.fields.platformFeePercent.unit}
                              </span>
                           </div>
                           <InputError message={errors.platformFeePercent?.message} />
                        </div>
                     </div>

                     {/* Minimum Payout Credits */}
                     <div className="rounded-xl bg-zinc-950/40 border border-white/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                        <div className="flex max-sm:flex-col items-start gap-3 max-w-xl">
                           <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.75">
                              <Banknote className="size-4" />
                           </div>
                           <div className="space-y-1">
                              <Label htmlFor="minPayoutCredits" className="text-sm 2xl:text-base font-medium text-zinc-200">
                                 {settingsData.fields.minPayoutCredits.label}
                              </Label>
                              <PrimaryBody
                                 text={settingsData.fields.minPayoutCredits.description}
                                 className="text-[13px]!"
                              />
                           </div>
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-40 2xl:w-45 shrink-0">
                           <div className="relative">
                              <Input
                                 id="minPayoutCredits"
                                 type="number"
                                 onWheel={(e) => e.currentTarget.blur()}
                                 step="1"
                                 min="1"
                                 placeholder={settingsData.fields.minPayoutCredits.placeholder}
                                 {...register("minPayoutCredits", { valueAsNumber: true })}
                                 className="pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 pointer-events-none select-none">
                                 {settingsData.fields.minPayoutCredits.unit}
                              </span>
                           </div>
                           <InputError message={errors.minPayoutCredits?.message} />
                        </div>
                     </div>
                  </div>

                  {/* Footer & Submit Action */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <span className="text-xs text-zinc-500">
                        {settingsData.lastUpdated} {formatDate(data.updatedAt, "PPp")}
                     </span>

                     <Button
                        type="submit"
                        size='xl'
                        disabled={isSaving || !isDirty}
                        className="w-full sm:w-auto"
                     >
                        {isSaving ? (
                           <>
                              <Spinner className="size-4" />
                              {settingsData.actions.saving}
                           </>
                        ) : (
                           <>
                              <Save className="size-4" />
                              {settingsData.actions.save}
                           </>
                        )}
                     </Button>
                  </div>
               </CardLayout>
            </form>
         )}
      </div>
   );
};

export default Settings;
