import { AdminPage } from "@/pages";
import { Mst_CustomerPage } from "@/pages/Mst_Customer";
import Customer_AddNew from "@/pages/Mst_Customer/components/Customer/AddNew";
import Customer from "@/pages/Mst_Customer/components/Customer/Customer/Customer";
import Customer_Detail from "@/pages/Mst_Customer/components/Customer/Detail/Detal_Customer/Customer_Detail";
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
    permissionCode: "",
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
    key: "Customer_Detail",
    path: "customer/Customer_Detail/:CustomerCodeSys",
    subMenuTitle: "",
    mainMenuKey: "customer",
    getPageElement: () => <Customer_Detail />,
  },
  // {
  //   key: "Customer_Detail",
  //   path: "customer/Customer_Detail/:CustomerCodeSys",
  //   subMenuTitle: "",
  //   mainMenuKey: "customer",
  //   getPageElement: () => <DetailComponent />,
  // },

  {
    key: "CustomerDetail",
    path: "customer/Detail",
    subMenuTitle: "Detail",
    mainMenuKey: "customer",
    getPageElement: () => <Customer />,
  },
];
