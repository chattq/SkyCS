import { AdminPage } from "@/pages";
import { Rpt_CpnCampaignResultCallPage } from "@/pages/reports/Rpt_CpnCampaignResultCall/list/Rpt_CpnCampaignResultCall";
import { RptCpnCampaignResultCtmFeedbackPage } from "@/pages/reports/Rpt_CpnCampaignResultCtmFeedback/list/RptCpnCampaignResultCtmFeedback";
import { Rpt_CpnCampaignStatisticCallPage } from "@/pages/reports/Rpt_CpnCampaignStatisticCall/list/Rpt_CpnCampaignStatisticCall";
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
];
