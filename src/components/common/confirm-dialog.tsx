"use client";

import { useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, AlertCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmDialogVariant = "destructive" | "warning" | "default";

export interface ConfirmDialogProps {
   open: boolean;
   onClose?: () => void;
   onOpenChange?: (open: boolean) => void;
   onConfirm: () => void | Promise<void>;
   title: string;
   description: React.ReactNode;
   confirmText?: string;
   cancelText?: string;
   variant?: ConfirmDialogVariant;
   isLoading?: boolean;
   icon?: React.ReactNode;
   className?: string;
}

const variantStyles: Record<
   ConfirmDialogVariant,
   {
      iconWrapper: string;
      glow: string;
      confirmButton: string;
      defaultIcon: React.ReactNode;
   }
> = {
   destructive: {
      iconWrapper: "bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-rose-950/40",
      glow: "from-rose-500/15 via-rose-500/5 to-transparent",
      confirmButton:
         "bg-rose-600 hover:bg-rose-700 text-white border border-rose-500/30",
      defaultIcon: <AlertTriangle className="size-4.5" />,
   },
   warning: {
      iconWrapper: "bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-amber-950/40",
      glow: "from-amber-500/15 via-amber-500/5 to-transparent",
      confirmButton:
         "bg-amber-600 hover:bg-amber-700 text-white border border-amber-500/30",
      defaultIcon: <AlertCircle className="size-4.5" />,
   },
   default: {
      iconWrapper: "bg-violet-500/15 border-violet-500/30 text-violet-400 shadow-violet-950/40",
      glow: "from-violet-500/15 via-violet-500/5 to-transparent",
      confirmButton:
         "bg-violet-600 hover:bg-violet-700 text-white border border-violet-500/30",
      defaultIcon: <HelpCircle className="size-4.5" />,
   }
};

export const ConfirmDialog = ({
   open,
   onClose,
   onOpenChange,
   onConfirm,
   title,
   description,
   confirmText,
   cancelText = "Cancel",
   variant = "default",
   isLoading = false,
   icon,
   className,
}: ConfirmDialogProps) => {
   const [internalLoading, setInternalLoading] = useState(false);
   const loading = isLoading || internalLoading;

   const activeVariant = variantStyles[variant] || variantStyles.default;
   const defaultConfirmText =
      variant === "destructive" ? "Delete" : variant === "warning" ? "Proceed" : "Confirm";

   const handleOpenChange = (nextOpen: boolean) => {
      if (loading) return;
      onOpenChange?.(nextOpen);
      if (!nextOpen) {
         onClose?.();
      }
   };

   const handleConfirm = async () => {
      try {
         const result = onConfirm();
         if (result instanceof Promise) {
            setInternalLoading(true);
            await result;
         }
      } finally {
         setInternalLoading(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogContent
            showCloseButton={false}
            className={cn(
               "overflow-hidden z-9999 max-w-md w-[calc(100%-2rem)] p-0",
               "bg-zinc-950 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl gap-0!",
               className
            )}
         >

            <div className="relative z-10 px-6 2xl:px-7 py-7 2xl:py-8">
               {/* Icon & Title Row */}
               <DialogHeader className="gap-3 sm:gap-3.5 text-center">
                  <div className="flex flex-col items-center gap-3.5">
                     <div
                        className={cn(
                           "flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-transform",
                           activeVariant.iconWrapper
                        )}
                     >
                        {icon ?? activeVariant.defaultIcon}
                     </div>

                     <div className="space-y-1.5 pt-0.5">
                        <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight text-zinc-100 font-geist">
                           {title}
                        </DialogTitle>
                        <DialogDescription className="text-[13px] sm:text-sm text-zinc-400 leading-relaxed font-normal">
                           {description}
                        </DialogDescription>
                     </div>
                  </div>
               </DialogHeader>
            </div>

            {/* Action Buttons Footer */}
            <DialogFooter className="z-10 flex items-center justify-end gap-2.5 bg-surface-dark border-t border-white/5 mx-0! mb-0!">
               <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => handleOpenChange(false)}
                  disabled={loading}
                  className='max-sm:w-full'
               >
                  {cancelText}
               </Button>

               <Button
                  type="button"
                  size="lg"
                  onClick={() => void handleConfirm()}
                  disabled={loading}
                  className={cn('max-sm:w-full', activeVariant.confirmButton)}
               >
                  {loading ? (
                     <>
                        <Spinner className="size-4 text-white" />
                        <span>Processing...</span>
                     </>
                  ) : (
                     confirmText ?? defaultConfirmText
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default ConfirmDialog;
