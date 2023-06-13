import {
  AdminPage,
  CustomFieldListPage,
  DealerManagementPage,
  FormRenderContainer,
  ProvinceManagementPage,
} from "@/pages";
import { Business_InformationPage } from "@/pages/Business_Information/list/Business_Information-page";
import { Cpn_CampaignAgentPage } from "@/pages/Cpn_CampaignAgent/list/Cpn_CampaignAgent";
import { Department_ControlPage } from "@/pages/Department_Control";
import { Mst_AreaControllerPage } from "@/pages/Mst_AreaController/list/Mst_AreaController";
import { Mst_CustomerGroupPage } from "@/pages/Mst_CustomerGroup/list/Mst_CustomerGroup";
import { Mst_PaymentTermControllerPage } from "@/pages/Mst_PaymentTermController/list/Mst_PaymentTermController";
import { Sys_GroupPage } from "@/pages/Sys_Group";
import { UserManangerPage } from "@/pages/User_Mananger/list/User_Mananger-page";
import { Mst_CampaignTypePageClone } from "@/pages/admin/MstCampaignTypeClone/list/MstCampaignType";
import { Mst_CampaignColumnConfig_Setting } from "@/pages/admin/Mst_CampaignColumnConfig/Setting/Mst_CampaignColumnConfig";
import { Mst_CampaignTypePage } from "@/pages/admin/Mst_CampaignType";
import Customize from "@/pages/admin/Mst_CampaignType/components/Components/Customize";
import { RouteItem } from "@/types";

export const adminRoutes: RouteItem[] = [
  {
    key: "admin",
    path: "admin",
    mainMenuTitle: "admin",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <AdminPage />,
  },
  {
    key: "dealerManagement",
    path: "admin/dealer",
    subMenuTitle: "dealerManagement",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <DealerManagementPage />,
  },
  {
    key: "Cpn_CampaignAgent",
    path: "admin/Cpn_CampaignAgent",
    subMenuTitle: "Cpn_CampaignAgent",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <Cpn_CampaignAgentPage />,
  },
  {
    key: "Mst_AreaController",
    path: "admin/Mst_AreaController",
    subMenuTitle: "Mst_AreaController",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <Mst_AreaControllerPage />,
  },
  {
    key: "Mst_PaymentTermController",
    path: "admin/Mst_PaymentTermController",
    subMenuTitle: "Mst_PaymentTermController",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <Mst_PaymentTermControllerPage />,
  },
  {
    key: "Mst_CustomerGroup",
    path: "admin/Mst_CustomerGroup",
    subMenuTitle: "Mst_CustomerGroup",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <Mst_CustomerGroupPage />,
  },
  {
    key: "Sys_GroupPage",
    path: "admin/Sys_GroupPage",
    subMenuTitle: "Sys_Group",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <Sys_GroupPage />,
  },
  {
    key: "UserMananger",
    path: "admin/UserMananger",
    subMenuTitle: "UserMananger",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <UserManangerPage />,
  },
  {
    key: "Department_Control",
    path: "admin/Department_Control",
    subMenuTitle: "Department_Control",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <Department_ControlPage />,
  },
  {
    key: "Business_Information",
    path: "admin/Business_Information",
    subMenuTitle: "Business_Information",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <Business_InformationPage />,
  },
  {
    key: "CustomField",
    path: "admin/custom-fields",
    subMenuTitle: "CustomField",
    mainMenuKey: "admin",
    getPageElement: () => <CustomFieldListPage />,
  },
  {
    key: "FormRender",
    path: "admin/form-render",
    subMenuTitle: "FormRender",
    mainMenuKey: "admin",
    getPageElement: () => <FormRenderContainer />,
  },
  {
    key: "Mst_CampaignColumnConfig_Setting",
    path: "admin/Mst_CampaignColumnConfig_Setting",
    subMenuTitle: "Mst_CampaignColumnConfig_Setting",
    mainMenuKey: "admin",
    getPageElement: () => <Mst_CampaignColumnConfig_Setting />,
  },
  {
    key: "Mst_CampaignTypePage",
    path: "admin/Mst_CampaignTypePage",
    subMenuTitle: "Mst_CampaignTypePage",
    mainMenuKey: "admin",
    getPageElement: () => <Mst_CampaignTypePage />,
  },
  {
    key: "Mst_CampaignTypePageClone",
    path: "admin/Mst_CampaignTypePageClone",
    subMenuTitle: "Mst_CampaignTypePageClone",
    mainMenuKey: "admin",
    getPageElement: () => <Mst_CampaignTypePageClone />,
  },
  {
    key: "Mst_CampaignTypePage/Customize",
    path: "admin/Mst_CampaignTypePage/Customize",
    subMenuTitle: "",
    mainMenuKey: "admin",
    getPageElement: () => <Customize />,
  },
  {
    key: "Mst_CampaignTypePage/Customize",
    path: "admin/Mst_CampaignTypePage/Customize/:id",
    subMenuTitle: "",
    mainMenuKey: "admin",
    getPageElement: () => <Customize />,
  },
];
