import { adminRoutes } from "./routes/admin-routes";
import { customerRoutes } from "./routes/customer-routes";
import { eticketRoutes } from "./routes/eticket-routes";
import { reportRoutes } from "./routes/report-routes";
import { RouteItem } from "./types";

export const protectedRoutes: RouteItem[] = [
  ...adminRoutes,
  ...reportRoutes,
  ...eticketRoutes,
  ...customerRoutes,
];
