import { AdminPage } from "@/pages";
import { RouteItem } from "@/types";

export const salesRoutes: RouteItem[] = [
  {
    key: 'sales',
    path: 'sales',
    mainMenuTitle: 'sales',
    mainMenuKey: 'sales',
    getPageElement: () => <AdminPage />,
  }
];