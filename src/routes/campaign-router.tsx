import {
  AdminPage,
  CustomFieldListPage,
  DealerManagementPage,
  FormRenderContainer,
  ProvinceManagementPage,
  Tab1Page,
  Tab2Page,
  TestGridPage,
  TestTabsPage,
  TestUploadPage,
  TreeLikeGridPage,
} from "@/pages";
import { Business_InformationPage } from "@/pages/Business_Information/list/Business_Information-page";
import { Category_ManagerPage } from "@/pages/Category_Manager";
import { Cpn_CampaignAgentPage } from "@/pages/Cpn_CampaignAgent/list/Cpn_CampaignAgent";
import { Department_ControlPage } from "@/pages/Department_Control";
import { Mst_AreaControllerPage } from "@/pages/Mst_AreaController/list/Mst_AreaController";
import { Mst_CustomerGroupPage } from "@/pages/Mst_CustomerGroup/list/Mst_CustomerGroup";
import { Mst_PaymentTermControllerPage } from "@/pages/Mst_PaymentTermController/list/Mst_PaymentTermController";
import Post_add from "@/pages/Post_Manager/components/components/Post_add";
import { Post_ManagerPage } from "@/pages/Post_Manager/list/Post_Manager";
import { SearchMSTPage } from "@/pages/SearchMST/list/SearchMST";
import { Sys_GroupPage } from "@/pages/Sys_Group";
import { UserManangerPage } from "@/pages/User_Mananger/list/User_Mananger-page";
import { Cpn_CampaignPage } from "@/pages/admin/Cpn_Campaign";
import Cpn_Campaign_Info from "@/pages/admin/Cpn_Campaign/components/Components/Cpn_Campaign_Info";

import { Mst_CampaignColumnConfig_Setting } from "@/pages/admin/Mst_CampaignColumnConfig/Setting/Mst_CampaignColumnConfig";
import { Mst_CampaignTypePage } from "@/pages/admin/Mst_CampaignType";
import Customize from "@/pages/admin/Mst_CampaignType/components/Components/Customize";
import { RouteItem } from "@/types";
import Cpn_Campaign_List_Customer from "@/pages/admin/Cpn_Campaign/components/Components/Cpn_Campaign_List_Customer/Cpn_Campaign_List_Customer";
import SearchHistory from "@/pages/SearchMST/components/SearchHistory";
import SearchCategory from "@/pages/SearchMST/components/SearchCategory";
import SearchDetail from "@/pages/SearchMST/components/SearchDetail";
import OmiChanelPage from "@/pages/Omi-Chanel/list/Omi_Chanel";
import { Content_ManagentPage } from "@/pages/Content_Managent/list/Content_Managent";
import Content_Edit from "@/pages/Content_Managent/components/components/Content_Edit";
import Content_Detail from "@/pages/Content_Managent/components/components/Content_Detail";
import Post_detail from "@/pages/Post_Manager/components/components/Post_detail";
import SearchResults from "@/pages/SearchMST/components/SearchResults";
import Post_Edit from "@/pages/Post_Manager/components/components/Post_Edit";
import HandleCampaign from "@/pages/campaign/handle_campaign";
import { Cpn_CampaignPerformPage } from "@/pages/Campaign_Perform/campaign-perform-page";
import { Cpn_CampaignPerformPageTuyenBA } from "@/pages/Campaign_Perform_TuyenBA/campaign-perform-page";

export const campaignRoutes: RouteItem[] = [
  {
    key: "campaign",
    path: "campaign",
    mainMenuTitle: "campaign",
    mainMenuKey: "campaign",
    permissionCode: "MENU_QUAN_TRI",
    getPageElement: () => <AdminPage />,
  },
  {
    key: "Cpn_CampaignAgent",
    path: "campaign/Cpn_CampaignAgent",
    subMenuTitle: "Cpn_CampaignAgent",
    mainMenuKey: "campaign",
    permissionCode: "",
    getPageElement: () => <Cpn_CampaignAgentPage />,
  },
  {
    key: "Mst_CampaignColumnConfig_Setting",
    path: "campaign/Mst_CampaignColumnConfig_Setting",
    subMenuTitle: "Mst_CampaignColumnConfig_Setting",
    mainMenuKey: "campaign",
    getPageElement: () => <Mst_CampaignColumnConfig_Setting />,
  },
  {
    key: "Mst_CampaignTypePage",
    path: "campaign/Mst_CampaignTypePage",
    subMenuTitle: "Mst_CampaignTypePage",
    mainMenuKey: "campaign",
    getPageElement: () => <Mst_CampaignTypePage />,
  },

  {
    key: "Mst_CampaignTypePage/Customize",
    path: "campaign/Mst_CampaignTypePage/Customize",
    subMenuTitle: "",
    mainMenuKey: "campaign",
    getPageElement: () => <Customize />,
  },
  {
    key: "Mst_CampaignTypePage/Customize",
    path: "campaign/Mst_CampaignTypePage/Customize/:id",
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
    subMenuTitle: "handleCampaign",
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
    subMenuTitle: "Cpn_CampaignPerform_TuyenBA",
    mainMenuKey: "campaign",
    permissionCode: "",
    getPageElement: () => <Cpn_CampaignPerformPageTuyenBA />,
  },
];
