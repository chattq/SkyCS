import { AuthState } from "@/types";
import { atom } from "jotai";
import {atomsWithQuery} from "jotai-tanstack-query";
import {createClientGateApi} from "@packages/api";
import {logger} from "@packages/logger";
import { atomWithLocalStorage } from "./utils";

const emptyState: AuthState = {
  token: localStorage.getItem("token") || undefined,
  networkId: localStorage.getItem("networkId") || '0',
  clientGateUrl: localStorage.getItem("clientGateUrl") || undefined,
  currentUser: undefined,
  clientGate: undefined,
  permissions: undefined,
};
export const authAtom = atomWithLocalStorage<AuthState>('auth', emptyState);
export const loggedInAtom = atom((get) => {
  return !!get(authAtom).token;
});

const [permissionAtom] = atomsWithQuery<{menu?: string[], buttons?: string[]}>((get) => ({
  queryKey: ['permissions'],
  queryFn: async ({ }) => {
    const auth = get(authAtom);
    logger.debug('auth:', auth)
    if(auth) {
      const { currentUser, networkId, orgData, clientGateUrl } = auth;
      if(!currentUser) {
        return {}
      }
      const api = createClientGateApi(
        currentUser!,
        clientGateUrl!,
        networkId,
        orgData?.Id!
      )
      const res = await api.GetForCurrentUser();
      if (res.isSuccess) {
        // parsing permission data
        const grantedMenu = res.Data?.Lst_Sys_Access.filter((item) => item.so_FlagActive === "1" && item.so_ObjectType === "MENU").map((item) => item.so_ObjectCode);
        const grantedButtons = res.Data?.Lst_Sys_Access.filter((item) => item.so_FlagActive === "1" && item.so_ObjectType === "BUTTON").map((item) => item.so_ObjectCode);
        return {
          menu: grantedMenu,
          buttons: grantedButtons
        }
      } else {
        return {};
      }
    } 
    return {};
  },
  networkMode: 'offlineFirst',
  keepPreviousData: false,
}));

export {
  permissionAtom
}