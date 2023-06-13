import { ApiResponse, Mst_PaymentTermData, SearchParam } from "@packages/types";
import { AxiosInstance } from "axios";

export const useMst_PaymentTermControllerApi = (apiBase: AxiosInstance) => {
  return {
    Mst_PaymentTermController_Search: async (
      param: SearchParam
    ): Promise<ApiResponse<Mst_PaymentTermData>> => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_PaymentTermData>>(
        "/MstPaymentTerm/Search",
        {
          ...param,
        }
      );
    },
    Mst_PaymentTermController_GetAllActive: async (): Promise<
      ApiResponse<Mst_PaymentTermData>
    > => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_PaymentTermData>>(
        "/MstPaymentTerm/GetAllActive",
        {}
      );
    },
    Mst_PaymentTermController_Create: async (
      data: Mst_PaymentTermData
    ): Promise<ApiResponse<Mst_PaymentTermData>> => {
      console.log(27, data);
      return await apiBase.post("/MstPaymentTerm/Create", {
        strJson: JSON.stringify(data),
      });
    },
    Mst_PaymentTermController_Delete: async (
      data: any[]
    ): Promise<ApiResponse<Mst_PaymentTermData>> => {
      return await apiBase.post("/MstPaymentTerm/Delete", {
        strJson: JSON.stringify(data[0]),
        ColsUpd: Object.keys(data).join(","),
      });
    },
    Mst_PaymentTermController_Update: async (
      data: any
    ): Promise<ApiResponse<any>> => {
      console.log(43, data);
      return await apiBase.post("/MstPaymentTerm/Update", {
        strJson: JSON.stringify(data),
        ColsUpd: "CreditLimit,DepositPercent,Remark",
      });
    },
  };
};
