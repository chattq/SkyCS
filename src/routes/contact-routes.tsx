import { AdminPage } from "@/pages";
import { Skycs } from "@/pages/Skycs";
import SkyForm from "@/pages/Skycs/List/Add";
import SkyDetail from "@/pages/Skycs/List/detailValue";
import { RouteItem } from "@/types";
// export * from "./Skycs/List/Skycs";

export const contractRoutes: RouteItem[] = [
  {
    key: "contract",
    path: "contract",
    mainMenuTitle: "contract",
    mainMenuKey: "contract",
    getPageElement: () => <AdminPage />,
  },
  
];
