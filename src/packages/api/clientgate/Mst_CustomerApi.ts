import {
  ApiResponse,
  Mst_Customer,
  SearchCustomerParam,
} from "@packages/types";
import { AxiosInstance } from "axios";

export const useMst_Customer = (apiBase: AxiosInstance) => {
  return {
    Mst_Customer_Search: async (
      param: Partial<SearchCustomerParam>
    ): Promise<ApiResponse<Mst_Customer[]>> => {
      return await apiBase.post<SearchCustomerParam, ApiResponse<Mst_Customer[]>>(
        "/MstCustomer/Search",
        {
          ...param,
        }
      );
    },

    Mst_Customer_Delete: async (
      key: Partial<Mst_Customer>
    ): Promise<ApiResponse<Mst_Customer>> => {
      return await apiBase.post<string, ApiResponse<Mst_Customer>>(
        "/MstCustomer/Delete",
        {
          strJson: JSON.stringify(key),
        }
      );
    },

    Mst_Customer_Create: async (
      data: Partial<Mst_Customer>,
      ScrTplCodeSys: string
    ): Promise<ApiResponse<Partial<Mst_Customer>>> => {
      return apiBase.post<Partial<any>, ApiResponse<Mst_Customer>>(
        "/MstCustomer/Create",
        {
          strJson: JSON.stringify(data),
          ScrTplCodeSys,
        }
      );
    },

    Mst_Customer_Update: async (
      key: Partial<Mst_Customer>,
      data: any[],
      ScrTplCodeSys: string
    ): Promise<ApiResponse<Mst_Customer>> => {
      return await apiBase.post("/MstCustomer/Update", {
        strJson: JSON.stringify({
          ...key,
        }),
        ColsUpd: data.join(","),
        ScrTplCodeSys,
      });
    },
    Mst_Customer_DeleteMultiple: async (data: string[]) => {
      return await apiBase.post<SearchCustomerParam, ApiResponse<Mst_Customer>>(
        "/MstCustomer/DeleteMultiple",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
  };
};
