import { ApiResponse } from "@packages/types";
import { AxiosInstance } from "axios";
interface Permission {
  GroupCode: string;
  ObjectCode: string;
  LogLUDateTime: string;
  LogLUBy: string;
  so_ObjectCode: string;
  so_ObjectName: string;
  so_ServiceCode: string;
  so_ObjectType: string;
  so_FlagExecModal: "0" | "1";
  so_FlagActive: "0" | "1";
}
interface PermissionRecord {
  Sys_User: any;
  Lst_Sys_Access: Permission[];
}
export const useGetForCurrentUser = (apiBase: AxiosInstance) => {
  return {
    GetForCurrentUser: async () => {
      return await apiBase.post<{}, ApiResponse<PermissionRecord>>(
        "/Api/GetForCurrentUser",
        {}
      );
    },
  };
};
