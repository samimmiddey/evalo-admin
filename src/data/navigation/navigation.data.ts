import { Banknote, LayoutDashboard, PictureInPicture2, Settings, User } from "lucide-react";
import { NavigationItem } from "./navigation.types";

export const navigationData: NavigationItem[] = [
   {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
   },
   {
      name: 'Users',
      href: '/users',
      icon: User
   },
   {
      name: 'Sessions',
      href: '/sessions',
      icon: PictureInPicture2
   },
   {
      name: 'Payouts',
      href: '/payouts',
      icon: Banknote
   },
   {
      name: 'Settings',
      href: '/settings',
      icon: Settings
   }
];