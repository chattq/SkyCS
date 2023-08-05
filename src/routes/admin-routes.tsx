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

import { Sys_GroupPage } from "@/pages/Sys_Group";
import { UserManangerPage } from "@/pages/User_Mananger/list/User_Mananger-page";
import { Cpn_CampaignPage } from "@/pages/admin/Cpn_Campaign";
import Cpn_Campaign_Info from "@/pages/admin/Cpn_Campaign/components/Components/Cpn_Campaign_Info";

import { Mst_CampaignColumnConfig_Setting } from "@/pages/admin/Mst_CampaignColumnConfig/Setting/Mst_CampaignColumnConfig";
import { Mst_CampaignTypePage } from "@/pages/admin/Mst_CampaignType";
import Customize from "@/pages/admin/Mst_CampaignType/components/Components/Customize";
import { RouteItem } from "@/types";
import Cpn_Campaign_List_Customer from "@/pages/admin/Cpn_Campaign/components/Components/Cpn_Campaign_List_Customer/Cpn_Campaign_List_Customer";

import OmiChanelPage from "@/pages/Omi-Chanel/list/Omi_Chanel";
import { Content_ManagentPage } from "@/pages/Content_Managent/list/Content_Managent";
import Content_Edit from "@/pages/Content_Managent/components/components/Content_Edit";
import Content_Detail from "@/pages/Content_Managent/components/components/Content_Detail";
import Post_detail from "@/pages/Post_Manager/components/components/Post_detail";

import Post_Edit from "@/pages/Post_Manager/components/components/Post_Edit";
import { TestFormPage } from "@/pages/admin/test-form";
import { ZaloConnect } from "@/pages/admin/zalo/zalo-connect";
import { Eticket_Custom_Field_Dynamic } from "@/pages/eticket/Manager_Customer/Customer_DynamicField/list";
import Mst_TicketEstablishInfo_Save from "@/pages/eticket/Mst_TicketEstablishInfo/components/Mst_TicketEstablishInfo_Save";
import SLA_List from "@/pages/eticket/SLA/list/SLA_List";
import SLA_Page from "@/pages/eticket/SLA/page/SLA_Page";

export const adminRoutes: RouteItem[] = [
  {
    key: "admin",
    path: "admin",
    mainMenuTitle: "admin",
    mainMenuKey: "admin",
    permissionCode: "MENU_QUAN_TRI",
    getPageElement: () => <AdminPage />,
  },
  // {
  //   key: "dealerManagement",
  //   path: "admin/dealer",
  //   subMenuTitle: "dealerManagement",
  //   mainMenuKey: "admin",
  //   permissionCode: "",
  //   getPageElement: () => <DealerManagementPage />,
  // },
  // ======================
  {
    key: "Organization_Settings",
    path: "",
    permissionCode: "",
    subMenuTitle: "Thiết lập doanh nghiệp",
    mainMenuKey: "admin",
    children: [
      {
        key: "Business_Information",
        path: "admin/Business_Information",
        subMenuTitle: "Business_Information",
        mainMenuKey: "admin",
        permissionCode: "",
        getPageElement: () => <Business_InformationPage />,
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
        key: "Sys_GroupPage",
        path: "admin/Sys_GroupPage",
        subMenuTitle: "Sys_Group",
        mainMenuKey: "admin",
        permissionCode: "",
        getPageElement: () => <Sys_GroupPage />,
      },
    ],
  },
  {
    key: "Content_Managent",
    path: "admin/Content_Managent",
    subMenuTitle: "Content_Managent",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <Content_ManagentPage />,
  },
  {
    key: "Content_Edit",
    path: "admin/Content_Managent/Content_Edit",
    subMenuTitle: "",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <Content_Edit />,
  },
  {
    key: "Content_Detail",
    path: "admin/Content_Managent/:idContent",
    subMenuTitle: "",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <Content_Detail />,
  },
  //=========================
  {
    key: "OmniChanel",
    path: "admin/OmniChanel",
    subMenuTitle: "Omni Chanel",
    mainMenuKey: "admin",
    permissionCode: "",
    getPageElement: () => <OmiChanelPage />,
  },

  {
    key: "Customer_Settings",
    path: "",
    permissionCode: "",
    subMenuTitle: "Thiết lập thông tin khách hàng",
    mainMenuKey: "admin",
    children: [
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
        key: "CustomField",
        path: "admin/custom-fields",
        subMenuTitle: "CustomField",
        mainMenuKey: "admin",
        getPageElement: () => <CustomFieldListPage />,
      },
    ],
  },
  {
    key: "eTicket_Settings",
    path: "",
    permissionCode: "",
    subMenuTitle: "Thông tin eTicket",
    mainMenuKey: "admin",
    children: [
      {
        key: "eticket_Custom_Field_Dynamic",
        path: "admin/Eticket_Custom_Field_Dynamic",
        subMenuTitle: "admin_Custom_Field_Dynamic",
        mainMenuKey: "admin",
        getPageElement: () => <Eticket_Custom_Field_Dynamic />,
      },
      {
        key: "Mst_TicketEstablishInfo_Save",
        path: "admin/Mst_TicketEstablishInfo_Save",
        subMenuTitle: "Mst_TicketEstablishInfo_Save",
        mainMenuKey: "admin",
        getPageElement: () => <Mst_TicketEstablishInfo_Save />,
      },
      {
        key: "SLA",
        path: "admin/SLA",
        subMenuTitle: "SLA",
        mainMenuKey: "admin",
        getPageElement: () => <SLA_List />,
      },
      {
        key: "SLA",
        path: "admin/SLA-Add",
        subMenuTitle: "",
        mainMenuKey: "admin",
        getPageElement: () => <SLA_Page />,
      },
      {
        key: "SLA",
        path: "admin/SLA/:SLAID",
        subMenuTitle: "",
        mainMenuKey: "admin",
        getPageElement: () => <SLA_Page />,
      },
    ],
  },

  {
    key: "Campaign Settings",
    path: "",
    mainMenuTitle: "Campaign Settings",
    mainMenuKey: "admin",
    subMenuTitle: "Thiết lập chiến dịch",
    permissionCode: "",
    children: [
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
      {
        key: "Cpn_CampaignPage",
        path: "admin/Cpn_CampaignPage",
        subMenuTitle: "Cpn_CampaignPage",
        mainMenuKey: "admin",
        permissionCode: "",
        getPageElement: () => <Cpn_CampaignPage />,
      },

      {
        key: "Cpn_Campaign_Info",
        path: "admin/Cpn_CampaignPage/Cpn_Campaign_Info",
        subMenuTitle: "",
        mainMenuKey: "admin",
        getPageElement: () => <Cpn_Campaign_Info />,
      },
      {
        key: "Mst_CampaignTypePage",
        path: "campaign/Mst_CampaignTypePage",
        subMenuTitle: "Mst_CampaignTypePage",
        mainMenuKey: "admin",
        getPageElement: () => <Mst_CampaignTypePage />,
      },
    ],
  },
  {
    key: "knowledge_store",
    path: "",
    permissionCode: "",
    subMenuTitle: "Kho tri thức",
    mainMenuKey: "admin",
    children: [
      {
        key: "Post_Manager",
        path: "admin/Post_Manager",
        subMenuTitle: "Post_Manager",
        mainMenuKey: "admin",
        permissionCode: "",
        getPageElement: () => <Post_ManagerPage />,
      },
      {
        key: "Post_detail",
        path: "admin/Post_detail/:idPost",
        subMenuTitle: "",
        mainMenuKey: "admin",
        permissionCode: "",
        getPageElement: () => <Post_detail />,
      },
      {
        key: "Post_Edit",
        path: "admin/Post_Edit/:idPostEdit",
        subMenuTitle: "",
        mainMenuKey: "admin",
        permissionCode: "",
        getPageElement: () => <Post_Edit />,
      },
      {
        key: "Post_Manager",
        path: "admin/Post_Manager/addNew",
        subMenuTitle: "",
        mainMenuKey: "admin",
        permissionCode: "",
        getPageElement: () => <Post_add />,
      },
      {
        key: "Category_Manager",
        path: "admin/Category_Manager",
        subMenuTitle: "Category_Manager",
        mainMenuKey: "admin",
        permissionCode: "",
        getPageElement: () => <Category_ManagerPage />,
      },
    ],
  },
  // {
  //   key: "FormRender",
  //   path: "admin/form-render",
  //   subMenuTitle: "FormRender",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <FormRenderContainer />,
  // },

  // {
  //   key: "Cpn_Campaign_Info",
  //   path: "admin/Cpn_CampaignPage/Cpn_Campaign_Info/:CampaignCode",
  //   subMenuTitle: "",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <Cpn_Campaign_Info />,
  // },
  // {
  //   key: "Cpn_CampaignAgent",
  //   path: "admin/Cpn_CampaignAgent",
  //   subMenuTitle: "Cpn_CampaignAgent",
  //   mainMenuKey: "admin",
  //   permissionCode: "",
  //   getPageElement: () => <Cpn_CampaignAgentPage />,
  // },
  // {
  //   key: "Mst_CampaignColumnConfig_Setting",
  //   path: "campaign/Mst_CampaignColumnConfig_Setting",
  //   subMenuTitle: "Mst_CampaignColumnConfig_Setting",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <Mst_CampaignColumnConfig_Setting />,
  // },

  // {
  //   key: "testPopup",
  //   path: "admin/testPopup",
  //   subMenuTitle: "testPopup",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <Cpn_Campaign_List_Customer />,
  // },
  // {
  //   key: "testUpload",
  //   path: "admin/testUpload",
  //   subMenuTitle: "testUpload",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <TestUploadPage />,
  // },
  // {
  //   key: "testTabs",
  //   path: "admin/testTabs",
  //   subMenuTitle: "testTabs",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <TestTabsPage />,
  //   children: [
  //     {
  //       key: "testTabsTab2",
  //       path: "tab2",
  //       subMenuTitle: "testTabsTab2",
  //       mainMenuKey: "admin",
  //       getPageElement: () => <Tab2Page />,
  //     },
  //     {
  //       key: "testTabsTab1",
  //       path: "tab1",
  //       subMenuTitle: "testTabsTab1",
  //       mainMenuKey: "admin",
  //       getPageElement: () => <Tab1Page />,
  //     },
  //   ],
  // },
  // {
  //   key: "testGrid",
  //   path: "admin/testGrid",
  //   subMenuTitle: "testGrid",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <TreeLikeGridPage />,
  // },
  // {
  //   key: "testGridSelect",
  //   path: "admin/testGridSelect",
  //   subMenuTitle: "testGridSelect",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <TestGridPage />,
  // },
  // {
  //   key: "testHtmlEditor",
  //   path: "admin/testHtmlEditor",
  //   subMenuTitle: "testHtmlEditor",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <TestFormPage />,
  // },
  // {
  //   key: "zaloconnect",
  //   path: "admin/zaloconnect",
  //   subMenuTitle: "ZaloConnect",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <ZaloConnect />,
  // },
];
