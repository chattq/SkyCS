import { protectedRoutes } from "@/app-routes";
import { AdminPageLayout } from "@/layouts";
import { LoginSsoPage, Page404, SelectNetworkPage } from "@/pages";
import { HomePage } from "@/pages/home-page";
import { localeAtom } from "@packages/store/localization-store";
import { PrivateRoutes } from "@packages/ui/private-routes";
import { RequireSession } from "@packages/ui/require-session";
import "devextreme/dist/css/dx.common.css";
import { useAtom } from "jotai";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./dx-styles.scss";
import { AdminDashboardPage } from "./pages/admin-dashboard";
import "./themes/generated/theme.additional.css";
import "./themes/generated/theme.base.css";

export default function Root() {
  // to trigger localization service
  const [value] = useAtom(localeAtom);
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<PrivateRoutes />}>
          <Route element={<RequireSession />}>
            <Route path={"/"} element={<HomePage />} />
            <Route path={":networkId"} element={<AdminPageLayout />}>
              <Route path={"/:networkId/"} element={<AdminDashboardPage />} />
              {protectedRoutes
                .filter((route) => route.key === route.mainMenuKey)
                .map((route) => {
                  return (
                    <Route
                      key={route.key}
                      path={`${route.path}`}
                      element={route.getPageElement()}
                    />
                  );
                })}
              {protectedRoutes
                .filter((route) => route.key !== route.mainMenuKey)
                .map((route) => {
                  return (
                    <Route
                      key={route.key}
                      path={`${route.path}`}
                      element={route.getPageElement()}
                    />
                  );
                })}
            </Route>
          </Route>
        </Route>
        <Route path={"/login"} element={<LoginSsoPage />}></Route>
        <Route path={"/select-network"} element={<SelectNetworkPage />}></Route>
        <Route path={"*"} element={<Page404 />} />
      </Routes>
    </Router>
  );
}
