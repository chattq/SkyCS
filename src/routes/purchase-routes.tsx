import { AdminPage } from "@/pages";
import { RouteItem } from "@/types";

export const purchaseRoutes: RouteItem[] = [
  {
    key: 'purchase',
    path: 'purchase',
    mainMenuTitle: 'purchase',
    mainMenuKey: 'purchase',
    getPageElement: () => <AdminPage />,
  }
];