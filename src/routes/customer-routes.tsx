import { AdminPage } from "@/pages";
import { Mst_CustomerPage } from "@/pages/Mst_Customer";
import Customer_AddNew from "@/pages/Mst_Customer/components/Customer/AddNew";
import DetailComponent from "@/pages/Mst_Customer/components/Customer/Detail/detail";
import { RouteItem } from "@/types";

export const customerRoutes: RouteItem[] = [
  {
    key: "customer",
    path: "customer",
    mainMenuTitle: "customer",
    mainMenuKey: "customer",
    permissionCode: "",
    getPageElement: () => <AdminPage />,
  },
  {
    key: "Mst_CustomerPage",
    path: "customer/Mst_CustomerPage",
    subMenuTitle: "Mst_CustomerPage",
    mainMenuKey: "customer",
    getPageElement: () => <Mst_CustomerPage />,
  },
  {
    key: "Customer_AddNew",
    path: "customer/Customer_AddNew",
    subMenuTitle: "Customer_AddNew",
    mainMenuKey: "customer",
    getPageElement: () => <Customer_AddNew />,
  },
  {
    key: "Customer_AddNew",
    path: "customer/Customer_AddNew/:CustomerCodeSys",
    subMenuTitle: "",
    mainMenuKey: "customer",
    getPageElement: () => <Customer_AddNew />,
  },
  {
    key: "Customer_Detail",
    path: "customer/Customer_Detail/:CustomerCodeSys",
    subMenuTitle: "",
    mainMenuKey: "customer",
    getPageElement: () => <DetailComponent />,
  },
];
