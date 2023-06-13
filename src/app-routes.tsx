import { RouteItem } from "./types";
import { adminRoutes } from "./routes/admin-routes";
import { reportRoutes } from "./routes/report-routes";
import { logisticsRoutes } from "./routes/logistic-routes";
import { contractRoutes } from "./routes/contact-routes";
import { paymentRoutes } from "./routes/payment-routes";
import { salesRoutes } from "./routes/sales-routes";
import { purchaseRoutes } from "./routes/purchase-routes";
import { dealerSalesRoutes } from "./routes/dealer-sales-routes";
import { customerRoutes } from "./routes/customer-routes";

export const protectedRoutes: RouteItem[] = [
  ...adminRoutes,
  ...reportRoutes,
  ...logisticsRoutes,
  ...contractRoutes,
  ...paymentRoutes,
  ...salesRoutes,
  ...purchaseRoutes,
  ...dealerSalesRoutes,
  ...customerRoutes,
];
