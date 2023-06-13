import { Outlet } from "react-router-dom";
import { useAuthService } from "@packages/services/auth-services";
import { useAuth } from "@packages/contexts/auth";
import { useEffect } from "react";
import { PermissionProvider } from "@/packages/contexts/permission";

export const RequireSession = () => {
  const { loginIgoss } = useAuthService();
  const { auth: { networkId, currentUser } } = useAuth();
  useEffect(() => {
    // get user information
    (async function () {
      if (!currentUser) {
        await loginIgoss(networkId);
      }
    })();
  }, [networkId]);
  return currentUser ? <PermissionProvider>
    <Outlet />
  </PermissionProvider> : null;
};