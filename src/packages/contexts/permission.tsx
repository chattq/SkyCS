import React, { createContext, useContext } from "react";
import { useAtomValue } from "jotai";
import { permissionAtom } from "@packages/store";

interface PermissionContextProps {
  hasMenuPermission: (code: string) => boolean;
  hasButtonPermission: (code: string) => boolean;
}
const PermissionContext = createContext({} as PermissionContextProps);

export const usePermissions = () => useContext(PermissionContext);

export function PermissionProvider(props: React.PropsWithChildren<unknown>) {
  const permissionStore = useAtomValue(permissionAtom);

  const hasMenuPermission = (code: string) => {
    return permissionStore.menu?.includes(code) ?? false;
  };
  const hasButtonPermission = (code: string) => {
    return permissionStore.buttons?.includes(code) ?? false;
  };
  return (
    <PermissionContext.Provider
      value={{
        hasMenuPermission,
        hasButtonPermission
      }}
      {...props}
    />
  );
}