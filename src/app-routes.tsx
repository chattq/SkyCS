import { adminRoutes } from "./routes/admin-routes";
import { campaignRoutes } from "./routes/campaign-router";
import { customerRoutes } from "./routes/customer-routes";
import { eticketRoutes } from "./routes/eticket-routes";
import { monitorRoutes } from "./routes/monitor-routes";
import { reportRoutes } from "./routes/report-routes";
import { RouteItem } from "./types";

export const protectedRoutes: RouteItem[] = [
  ...adminRoutes,
  ...reportRoutes,
  ...eticketRoutes,
  ...customerRoutes,
  ...monitorRoutes,
  ...campaignRoutes,
];

export const noSidebarRoutes: RouteItem[] = [...customerRoutes];
