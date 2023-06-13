import { AdminPage } from "@/pages";
import { RouteItem } from "@/types";

export const logisticsRoutes: RouteItem[] = [
  {
    key: "logistic",
    path: "logistic",
    mainMenuTitle: "logistic",
    mainMenuKey: "logistic",
    getPageElement: () => <AdminPage />,
  },
];
