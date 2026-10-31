import { LayoutDashboard, User } from "lucide-react";
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
];