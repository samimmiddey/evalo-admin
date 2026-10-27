export const userButtonAppearance = {
   elements: {
      avatarBox: '!size-7.5 !ring-2 !ring-white/15 hover:!ring-violet-500/75 transition-all !shadow-sm',
      userButtonPopoverRoot: '!z-50',
      userButtonPopoverCard:
         '!bg-zinc-800 !border !border-white/5 !shadow-2xl !shadow-black !rounded-xl !overflow-hidden min-w-[280px]',
      userButtonPopoverMain: '!bg-zinc-800',
      userPreview:
         '!p-4 !border-b !border-white/8 !bg-zinc-800 flex !items-center !gap-3',
      userPreviewAvatarBox:
         '!size-10 !ring-2 !ring-violet-500/40 !rounded-full !shadow-inner',
      userPreviewTextContainer: '!gap-1',
      userPreviewMainIdentifier:
         '!text-zinc-100 !font-semibold !text-sm',
      userPreviewSecondaryIdentifier:
         '!text-zinc-400 !text-xs',
      userButtonPopoverActions: '!p-2 !space-y-1 !bg-zinc-800 border-none!',
      userButtonPopoverActionButton:
         '!rounded-lg !text-zinc-200 hover:!text-white hover:!bg-white/6 !transition-all !text-[13px] !font-medium !py-3 !px-2 !w-full flex !items-center !gap-2 cursor-pointer border-none!',
      userButtonPopoverActionButtonIcon:
         '!text-violet-400 group-hover:!text-violet-300 !w-4 !h-4 shrink-0',
      userButtonPopoverActionButtonText:
         '!text-zinc-200 group-hover:!text-white !text-xs !font-medium',
      userButtonPopoverFooter: '!hidden',
      userButtonPopoverFooterPages: '!hidden',
   },
};

export const userProfileAppearance = {
   elements: {
      modalBackdrop: '!backdrop-blur-sm',
      modalContent:
         '!bg-zinc-900 !border !border-white/5 !rounded-2xl !shadow-2xl !shadow-black !overflow-hidden max-h-[85vh] max-w-4xl',
      modalCloseButton:
         '!text-zinc-400 hover:!text-zinc-100 !bg-white/5 hover:!bg-white/10 !rounded-lg !transition-all !p-1.5 cursor-pointer',
      card: '!bg-zinc-900 !border-none !shadow-none',
      navbar: '!bg-zinc-950 !border-r !border-white/10',
      navbarButtons: '!space-y-1',
      navbarButton:
         'group !rounded-lg !text-zinc-300 hover:!text-zinc-100 data-[active=true]:!text-zinc-100 data-[active=true]:!bg-white/8 hover:!bg-white/8 !transition-all !text-xs !font-medium !py-2.5 !px-3',
      navbarButtonIcon: 'group-data-[active=true]:!text-violet-400',
      scrollBox: 'rounded-none!',
      pageScrollBox:
         '!bg-zinc-900/40 [scrollbar-width:thin] [scrollbar-color:rgba(113,113,122,0.3)_transparent]',
      headerTitle: '!text-zinc-100 !font-semibold !text-lg',
      headerSubtitle: '!text-zinc-400 !text-xs',
      profileSection: '!py-5',
      profileSectionTitle: '!text-zinc-200 !font-medium !text-sm',
      profileSectionTitleText: '!text-zinc-200 !font-medium !text-sm',
      profileSectionContent: '!text-zinc-300 !text-xs',
      // Form submit / save buttons
      formButtonPrimary:
         '!bg-violet-600 hover:!bg-violet-500 !text-white !rounded-lg !font-medium !text-xs !px-4 !py-2 !transition-all !border-0 !shadow-sm cursor-pointer',
      // Cancel / reset buttons
      formButtonReset:
         '!bg-white/5 hover:!bg-white/10 !text-zinc-300 hover:!text-white !rounded-lg !font-medium !text-xs !px-3.5 !py-2 !transition-all !border !border-white/10 cursor-pointer',
      formFieldInput:
         '!bg-zinc-800/60 !text-zinc-100 placeholder:!text-zinc-500 !rounded-lg !text-sm !py-2 !px-3 transition-colors',
      formFieldInputShowPasswordButton:
         '!text-zinc-400 hover:!text-zinc-200',
      formFieldLabel: '!text-zinc-300 !text-xs !font-medium',
      avatarBox: '!size-10 !ring-2 !ring-violet-500/40 !rounded-full',
      avatarImageActionsUpload:
         '!text-violet-400 hover:!text-violet-300 !text-xs !font-medium cursor-pointer',
      avatarImageActionsRemove:
         '!text-rose-400 hover:!text-rose-300 !text-xs !font-medium cursor-pointer',
      breadcrumbsItem: '!text-zinc-400 !text-xs',
      breadcrumbsItemCurrent: '!text-zinc-100 !text-xs !font-medium'
   }
};
