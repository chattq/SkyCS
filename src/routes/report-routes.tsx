import { AdminPage } from "@/pages";
import { RouteItem } from "@/types";
export const reportRoutes: RouteItem[] = [
  {
    key: "report",
    path: "report",
    permissionCode: "MNU_REPORT",
    mainMenuTitle: "report",
    mainMenuKey: "report",
    getPageElement: () => <AdminPage />,
  },
];
