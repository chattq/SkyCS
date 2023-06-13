import { AdminPage } from "@/pages";
import { RouteItem } from "@/types";

export const dealerSalesRoutes: RouteItem[] = [
  {
    key: 'dealer-sales',
    path: 'dealer-sales',
    mainMenuTitle: 'dealer-sales',
    mainMenuKey: 'dealer-sales',
    getPageElement: () => <AdminPage />,
  }
];