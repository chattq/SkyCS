import { AdminPage } from "@/pages";
import { RouteItem } from "@/types";

export const paymentRoutes: RouteItem[] = [
  {
    key: 'payment',
    path: 'payment',
    mainMenuTitle: 'payment',
    mainMenuKey: 'payment',
    getPageElement: () => <AdminPage />,
  }
];