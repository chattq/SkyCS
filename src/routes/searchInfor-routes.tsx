import { AdminPage } from "@/pages";
import { Category_ManagerPage } from "@/pages/Category_Manager";
import Post_Edit from "@/pages/Post_Manager/components/components/Post_Edit";
import Post_add from "@/pages/Post_Manager/components/components/Post_add";
import Post_detail from "@/pages/Post_Manager/components/components/Post_detail";
import { Post_ManagerPage } from "@/pages/Post_Manager/list/Post_Manager";
import SearchCategory from "@/pages/SearchMST/components/SearchCategory";
import SearchDetail from "@/pages/SearchMST/components/SearchDetail";
import SearchHistory from "@/pages/SearchMST/components/SearchHistory";
import SearchResults from "@/pages/SearchMST/components/SearchResults";
import { SearchMSTPage } from "@/pages/SearchMST/list/SearchMST";
import { RouteItem } from "@/types";

export const searchRoutes: RouteItem[] = [
  {
    key: "SearchMSTPage",
    path: "search/SearchInformation",
    mainMenuKey: "search",
    permissionCode: "",
    getPageElement: () => <SearchMSTPage />,
    children: [
      {
        key: "History",
        path: "History",
        subMenuTitle: "",
        mainMenuKey: "search",
        getPageElement: () => <SearchHistory />,
      },
      {
        key: "Category",
        path: "Category",
        subMenuTitle: "",
        mainMenuKey: "search",
        getPageElement: () => <SearchCategory />,
      },
      {
        key: "Results",
        path: "Results",
        subMenuTitle: "",
        mainMenuKey: "search",
        getPageElement: () => <SearchResults />,
      },
    ],
  },

  {
    key: "SearchDetail",
    path: "search/SearchInformation/Detail/:idInforSearch",
    subMenuTitle: "",
    mainMenuKey: "search",
    permissionCode: "",
    getPageElement: () => <SearchDetail />,
  },
];
