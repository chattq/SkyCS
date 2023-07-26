import { Outlet } from "react-router-dom";
import { useAuthService } from "@packages/services/auth-services";
import { useAuth } from "@packages/contexts/auth";
import { useEffect } from "react";
import { PermissionProvider } from "@/packages/contexts/permission";

export const RequireSession = () => {
  const { loginIgoss, signOut } = useAuthService();
  const { auth: { networkId, currentUser, createDTime } } = useAuth();
  useEffect(() => {
    // get user information


    (async function () {

      if(!createDTime)
      {
        await signOut();
      }

      else if (!currentUser) {
        await loginIgoss(networkId);
      }
      else {
        var dateOffset = 12 * 60 * 60 * 1000; //12h
        var latestDate = new Date();
        latestDate.setTime(latestDate.getTime() - dateOffset);
        var ssDate = createDTime ? new Date(createDTime) : new Date('2000-01-01');
        if (ssDate < latestDate) {
          await signOut();
        }

      }
    })();
  }, [networkId]);
  return currentUser ? <PermissionProvider>
    <Outlet />
  </PermissionProvider> : null;
};