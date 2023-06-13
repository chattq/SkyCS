import { logger } from "@/packages/logger";
import { Navigate } from "react-router-dom";

export const AdminDashboardPage = () => {
  logger.debug('AdminDashboardPage');
  return (
    <Navigate to={`admin`} />
  );
};