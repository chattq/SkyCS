import { AdminPage } from "@/pages";
import { Mst_CustomerList } from "@/pages/Mst_Customer";
import Customer_Detail from "@/pages/Mst_Customer/page/CustomerEditPage/CustomerEditPage";
import { CustomerPrimaryPage } from "@/pages/Mst_Customer/page/CustomerPrimaryPage/CustomerPrimaryPage";
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
    key: "Mst_Customer",
    path: "customer/list",
    subMenuTitle: "Mst_Customer",
    mainMenuKey: "customer",
    permissionCode: "",
    getPageElement: () => <Mst_CustomerList />,
  },
  {
    key: "Mst_Customer",
    path: "customer/detail/:CustomerCodeSys",
    subMenuTitle: "",
    mainMenuKey: "customer",
    getPageElement: () => <CustomerPrimaryPage />,
  },
  {
    key: "Mst_Customer",
    path: "customer/:type/:CustomerCodeSys?",
    subMenuTitle: "",
    mainMenuKey: "customer",
    getPageElement: () => <Customer_Detail />,
  },
];
