import AdminPage from "@/pages/admin-page/admin-page";
import ReportPage from "@dms-pages/report-page/report-page";
import {ProvinceManagementPage} from "@/pages/province-management/province-management";

export const topBarItems = [
  {
    key: 'sales',
    path: '/sales',
    element: AdminPage
  },
  {
    key: 'payment',
    path: '/payment',
    element: AdminPage
  },
  {
    key: 'contract',
    path: '/contract',
    element: AdminPage
  },
  {
    key: 'logistic',
    path: '/logistic',
    element: AdminPage
  },
  {
    key: 'report',
    path: '/report',
    element: ReportPage
  },
  {
    path: '/admin',
    key: 'admin',
    element: AdminPage,
    children: [
      {
        key: 'cityManagement',
        path: 'city',
        element: ProvinceManagementPage
      }
    ]
  }
]

export const adminSideBarItems = [
  {
    key: 'cityManagement',
    path: '/admin/city',
    element: ProvinceManagementPage
  }
]
