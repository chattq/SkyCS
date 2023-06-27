import { adminRoutes } from "./routes/admin-routes";
import { contractRoutes } from "./routes/contact-routes";
import { customerRoutes } from "./routes/customer-routes";
import { dealerSalesRoutes } from "./routes/dealer-sales-routes";
import { eticketRoutes } from "./routes/eticket-routes";
import { logisticsRoutes } from "./routes/logistic-routes";
import { paymentRoutes } from "./routes/payment-routes";
import { purchaseRoutes } from "./routes/purchase-routes";
import { reportRoutes } from "./routes/report-routes";
import { salesRoutes } from "./routes/sales-routes";
import { RouteItem } from "./types";

export const protectedRoutes: RouteItem[] = [
  ...adminRoutes,
  ...reportRoutes,
  ...logisticsRoutes,
  ...contractRoutes,
  ...paymentRoutes,
  ...salesRoutes,
  ...purchaseRoutes,
  ...dealerSalesRoutes,
  ...eticketRoutes,
  ...customerRoutes,
];
