import { AdminPage } from "@/pages";
import { Rpt_CallPage } from "@/pages/reports/Rpt_Call/list/Rpt_Call";
import { Rpt_CpnCampaignResultCallPage } from "@/pages/reports/Rpt_CpnCampaignResultCall/list/Rpt_CpnCampaignResultCall";
import { RptCpnCampaignResultCtmFeedbackPage } from "@/pages/reports/Rpt_CpnCampaignResultCtmFeedback/list/RptCpnCampaignResultCtmFeedback";
import { Rpt_CpnCampaignStatisticCallPage } from "@/pages/reports/Rpt_CpnCampaignStatisticCall/list/Rpt_CpnCampaignStatisticCall";
import { Rpt_ETTicketDetailControllerPage } from "@/pages/reports/Rpt_ETTicketDetailController/list/Rpt_ETTicketDetailController";
import { Rpt_ETTicketSynthesisControllerPage } from "@/pages/reports/Rpt_ETTicketSynthesisController/list/Rpt_ETTicketSynthesisController";
import { RouteItem } from "@/types";
export const reportRoutes: RouteItem[] = [
  {
    key: "report",
    path: "report",
    permissionCode: "",
    mainMenuTitle: "report",
    mainMenuKey: "report",
    getPageElement: () => <AdminPage />,
  },
  {
    key: "Rpt_CpnCampaignResultCall",
    path: "report/RptCpnCampaignResultCall",
    permissionCode: "",
    subMenuTitle: "Rpt_CpnCampaignResultCall",
    mainMenuKey: "report",
    getPageElement: () => <Rpt_CpnCampaignResultCallPage />,
  },
  {
    key: "Rpt_CpnCampaignStatisticCall",
    path: "report/RptCpnCampaignStatisticCall",
    permissionCode: "",
    subMenuTitle: "Rpt_CpnCampaignStatisticCall",
    mainMenuKey: "report",
    getPageElement: () => <Rpt_CpnCampaignStatisticCallPage />,
  },
  {
    key: "RptCpnCampaignResultCtmFeedback",
    path: "report/RptCpnCampaignResultCtmFeedback",
    permissionCode: "",
    subMenuTitle: "RptCpnCampaignResultCtmFeedback",
    mainMenuKey: "report",
    getPageElement: () => <RptCpnCampaignResultCtmFeedbackPage />,
  },
  {
    key: "baocaocuocgoi",
    path: "report/baocaocuocgoi",
    permissionCode: "",
    subMenuTitle: "baocaocuocgoi",
    mainMenuKey: "report",
    getPageElement: () => <Rpt_CallPage />,
  },
  {
    key: "Rpt_ETTicketDetailController",
    path: "report/Rpt_ETTicketDetailController",
    permissionCode: "",
    subMenuTitle: "Rpt_ETTicketDetailController",
    mainMenuKey: "report",
    getPageElement: () => <Rpt_ETTicketDetailControllerPage />,
  },
  {
    key: "RptETTicketSynthesis",
    path: "report/RptETTicketSynthesis",
    permissionCode: "",
    subMenuTitle: "RptETTicketSynthesis",
    mainMenuKey: "report",
    getPageElement: () => <Rpt_ETTicketSynthesisControllerPage />,
  },
];
