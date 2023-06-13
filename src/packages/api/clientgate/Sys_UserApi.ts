import {
  ApiResponse,
  SysUserData,
  SearchUserControlParam,
} from "@packages/types";
import { AxiosInstance } from "axios";

export const useSys_UserApi = (apiBase: AxiosInstance) => {
  return {
    Sys_User_Search: async (
      param: SearchUserControlParam
    ): Promise<ApiResponse<SysUserData>> => {
      return await apiBase.post<
        SearchUserControlParam,
        ApiResponse<SysUserData>
      >("/SysUser/Search", {
        ...param,
      });
    },
    Sys_User_GetAllActive: async (): Promise<ApiResponse<SysUserData>> => {
      return await apiBase.post<
        SearchUserControlParam,
        ApiResponse<SysUserData>
      >("/SysUser/GetAllActive", {});
    },
    Sys_User_Export: async (
      UserCode: any
    ): Promise<ApiResponse<SysUserData>> => {
      return await apiBase.post<
        SearchUserControlParam,
        ApiResponse<SysUserData>
      >("/SysUser/Export", {
        UserCode: UserCode,
      });
    },
    Sys_User_Data_GetByUserCode: async (
      code: any
    ): Promise<ApiResponse<SysUserData>> => {
      return await apiBase.post<
        SearchUserControlParam,
        ApiResponse<SysUserData>
      >("/SysUser/GetByUserCode", {
        UserCode: code,
      });
    },

    Sys_User_Data_Delete: async (
      key: string
    ): Promise<ApiResponse<SysUserData>> => {
      return await apiBase.post<string, ApiResponse<SysUserData>>(
        "/SysUser/Delete",
        {
          UserCode: key,
        }
      );
    },
    Sys_User_Create: async (
      data: Partial<SysUserData>
    ): Promise<ApiResponse<Partial<SysUserData>>> => {
      console.log(47, data);
      return apiBase.post<Partial<SysUserData>, ApiResponse<SysUserData>>(
        "/SysUser/Create",
        {
          strJson: JSON.stringify(data),
        }
      );
    },

    Sys_User_Update: async (
      data: Partial<SysUserData>
    ): Promise<ApiResponse<SysUserData>> => {
      console.log(62, data);
      return await apiBase.post("/SysUser/Update", {
        strJson: JSON.stringify({
          ...data,
        }),
        ColsUpd: Object.keys(data).join(","),
      });
    },

    SysUserData_Upload: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload

      return await apiBase.post<File, ApiResponse<any>>(
        "/MstDealerType/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    SysUserData_UploadFile: async (file: File): Promise<ApiResponse<any>> => {
      // file is the file you want to upload
      const form = new FormData();
      form.append("file", file);
      return await apiBase.post<File, ApiResponse<any>>(
        "/File/UploadFile",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
  };
};
