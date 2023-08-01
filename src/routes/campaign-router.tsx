import { AdminPage } from "@/pages";
import { Cpn_CampaignAgentPage } from "@/pages/Cpn_CampaignAgent/list/Cpn_CampaignAgent";
import { Cpn_CampaignPage } from "@/pages/admin/Cpn_Campaign";
import Cpn_Campaign_Info from "@/pages/admin/Cpn_Campaign/components/Components/Cpn_Campaign_Info";

import { Mst_CampaignColumnConfig_Setting } from "@/pages/admin/Mst_CampaignColumnConfig/Setting/Mst_CampaignColumnConfig";
import { Mst_CampaignTypePage } from "@/pages/admin/Mst_CampaignType";
import Customize from "@/pages/admin/Mst_CampaignType/components/Components/Customize";
import { RouteItem } from "@/types";
import HandleCampaign from "@/pages/campaign/handle_campaign";
import { Cpn_CampaignPerformPage } from "@/pages/Campaign_Perform/campaign-perform-page";
import { Cpn_CampaignPerformPageTuyenBA } from "@/pages/Campaign_Perform_TuyenBA/campaign-perform-page";

export const campaignRoutes: RouteItem[] = [
  {
    key: "campaign",
    path: "campaign",
    mainMenuTitle: "campaign",
    mainMenuKey: "campaign",
    permissionCode: "",
    getPageElement: () => <AdminPage />,
  },
  {
    key: "Campaign",
    path: "",
    mainMenuTitle: "Campaign",
    mainMenuKey: "campaign",
    subMenuTitle: "Campaign",
    permissionCode: "",
    children: [
      {
        key: "Mst_CampaignTypePage/Customize",
        path: "campaign/Mst_CampaignTypePage/Customize",
        subMenuTitle: "",
        mainMenuKey: "campaign",
        getPageElement: () => <Customize />,
      },
      {
        key: "Mst_CampaignTypePage/Customize",
        path: "campaign/Mst_CampaignTypePage/Customize/:flag/:id",
        subMenuTitle: "",
        mainMenuKey: "campaign",
        getPageElement: () => <Customize />,
      },
      {
        key: "Cpn_CampaignPage",
        path: "campaign/Cpn_CampaignPage",
        subMenuTitle: "Cpn_CampaignPage",
        mainMenuKey: "campaign",
        permissionCode: "",
        getPageElement: () => <Cpn_CampaignPage />,
      },
      {
        key: "Cpn_Campaign_Info",
        path: "campaign/Cpn_CampaignPage/Cpn_Campaign_Info",
        subMenuTitle: "",
        mainMenuKey: "campaign",
        getPageElement: () => <Cpn_Campaign_Info />,
      },
      {
        key: "Cpn_Campaign_Info",
        path: "campaign/Cpn_CampaignPage/Cpn_Campaign_Info/:CampaignCode",
        subMenuTitle: "",
        mainMenuKey: "campaign",
        getPageElement: () => <Cpn_Campaign_Info />,
      },
      {
        key: "Cpn_Campaign_Info",
        path: "campaign/Cpn_CampaignPage/Cpn_Campaign_Info/:flag/:CampaignCode",
        subMenuTitle: "",
        mainMenuKey: "campaign",
        getPageElement: () => <Cpn_Campaign_Info />,
      },
      {
        key: "handleCampaign",
        path: "campaign/handleCampaign",
        // subMenuTitle: "handleCampaign",
        mainMenuKey: "campaign",
        getPageElement: () => <HandleCampaign />,
      },
      {
        key: "Cpn_CampaignPerform",
        path: "campaign/perform",
        subMenuTitle: "Cpn_CampaignPerform",
        mainMenuKey: "campaign",
        permissionCode: "",
        getPageElement: () => <Cpn_CampaignPerformPage />,
      },
      {
        key: "Cpn_CampaignPerform_TuyenBA",
        path: "campaign/perform_TuyenBA",
        // subMenuTitle: "Cpn_CampaignPerform_TuyenBA",
        mainMenuKey: "campaign",
        permissionCode: "",
        getPageElement: () => <Cpn_CampaignPerformPageTuyenBA />,
      },
    ],
  },
];
