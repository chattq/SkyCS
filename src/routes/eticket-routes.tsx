import { AdminPage, EticketDetailPage } from "@/pages";
import EticketAdd from "@/pages/eticket/Add/EticketAdd";
import { Eticket_Custom_Field_Dynamic } from "@/pages/eticket/Manager_Customer/Customer_DynamicField/list";
import Mst_TicketEstablishInfo_Save from "@/pages/eticket/Mst_TicketEstablishInfo/components/Mst_TicketEstablishInfo_Save";
import SLA_List from "@/pages/eticket/SLA/list/SLA_List";
import SLA_Page from "@/pages/eticket/SLA/page/SLA_Page";
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
    key: "eticket_manager",
    path: "eticket/eticket_manager",
    subMenuTitle: "eticket_manager",
    mainMenuKey: "eticket",
    getPageElement: () => <Eticket />,
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
    key: "eticket_Custom_Field_Dynamic",
    path: "eticket/Eticket_Custom_Field_Dynamic",
    subMenuTitle: "eticket_Custom_Field_Dynamic",
    mainMenuKey: "eticket",
    getPageElement: () => <Eticket_Custom_Field_Dynamic />,
  },
  {
    key: "Mst_TicketEstablishInfo_Save",
    path: "eticket/Mst_TicketEstablishInfo_Save",
    subMenuTitle: "Mst_TicketEstablishInfo_Save",
    mainMenuKey: "eticket",
    getPageElement: () => <Mst_TicketEstablishInfo_Save />,
  },

  {
    key: "eticket_add",
    path: "eticket/Add",
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
