import { AdminPage, EticketDetailPageFollow } from "@/pages";
import EticketAdd from "@/pages/eticket/Add/EticketAdd";
import { Eticket_Custom_Field_Dynamic } from "@/pages/eticket/Manager_Customer/Customer_DynamicField/list";
import Mst_TicketEstablishInfo_Save from "@/pages/eticket/Mst_TicketEstablishInfo/components/Mst_TicketEstablishInfo_Save";
import SLA_List from "@/pages/eticket/SLA/list/SLA_List";
import SLA_Page from "@/pages/eticket/SLA/page/SLA_Page";
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
    subMenuTitle: "eticket_deta",
    mainMenuKey: "eticket",
    getPageElement: () => <EticketDetailPageFollow />,
  },
  {
    key: "eticket_manager",
    path: "eticket/eticket_manager",
    subMenuTitle: "eticket_manager",
    mainMenuKey: "eticket",
    getPageElement: () => <Eticket />,
  },
  {
    key: "eticket_Detail",
    path: "eticket/detail/:TicketID",
    mainMenuTitle: "eticket",
    // subMenuTitle: "eticket_Detail",
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
    subMenuTitle: "eticket_add",
    mainMenuKey: "eticket",
    getPageElement: () => <EticketAdd />,
  },
  {
    key: "eticket_add",
    path: "eticket/edit/:TicketID",
    subMenuTitle: "eticket_add",
    mainMenuKey: "eticket",
    getPageElement: () => <EticketAdd />,
  },
  {
    key: "SLA",
    path: "eticket/SLA",
    subMenuTitle: "SLA",
    mainMenuKey: "eticket",
    getPageElement: () => <SLA_List />,
  },
  {
    key: "SLA",
    path: "eticket/SLA-Add",
    subMenuTitle: "",
    mainMenuKey: "eticket",
    getPageElement: () => <SLA_Page />,
  },
  {
    key: "SLA",
    path: "eticket/SLA/:SLAID",
    subMenuTitle: "",
    mainMenuKey: "eticket",
    getPageElement: () => <SLA_Page />,
  },
];
