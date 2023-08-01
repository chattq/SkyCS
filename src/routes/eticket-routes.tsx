import { AdminPage, EticketDetailPageFollow } from "@/pages";
import EticketAdd from "@/pages/eticket/Add/EticketAdd";
import EticketDetailPage from "@/pages/eticket/eticket/Components/Info/Detail/eticket-detail-page";
import Eticket from "@/pages/eticket/eticket/eticket";

import { RouteItem } from "@/types";

export const eticketRoutes: RouteItem[] = [
  {
    key: "eticket_Main",
    path: "eticket",
    mainMenuTitle: "eticket",
    mainMenuKey: "eticket",
    permissionCode: "",
    getPageElement: () => <AdminPage />,
  },
  {
    key: "Detail",
    path: "eticket/DetailFollow",
    // subMenuTitle: "eticket_deta",
    mainMenuKey: "eticket",
    getPageElement: () => <EticketDetailPageFollow />,
  },
  {
    key: "eticket_manager",
    path: "eticket/eticket_manager",
    subMenuTitle: "",
    mainMenuKey: "eticket",
    getPageElement: () => <Eticket />,
  },
  {
    key: "eticket_Detail",
    path: "eticket/detail/:TicketID",
    mainMenuTitle: "eticket",
    mainMenuKey: "eticket",
    permissionCode: "",
    getPageElement: () => <EticketDetailPage />,
  },
  {
    key: "eticket",
    path: "eticket/detail",
    mainMenuTitle: "eticket",
    mainMenuKey: "eticket",
    permissionCode: "",
    getPageElement: () => <EticketDetailPage />,
  },
  {
    key: "eticket_add",
    path: "eticket/Add",
    // subMenuTitle: "eticket_add",
    mainMenuKey: "eticket",
    getPageElement: () => <EticketAdd />,
  },
  {
    key: "eticket_add",
    path: "eticket/edit/:TicketID",
    // subMenuTitle: "eticket_add",
    mainMenuKey: "eticket",
    getPageElement: () => <EticketAdd />,
  },
];
