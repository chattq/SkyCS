import { Tid } from "@/utils/hash";
import { IUser } from "@packages/types";
import axios, { AxiosError } from "axios";
import { useAuth } from "../contexts/auth";
import { useGetForCurrentUser } from "./clientgate/Api_GetForCurrentUser";
// import { useMst_CostTypeApi } from "./clientgate/Mst_CostTypeApi";
import { FlagActiveConvertor } from "@packages/api/interceptors/flag-active-convertor";
import { useMst_DealerType } from "./clientgate/Mst_DealerTypeApi";
import { useMst_Province_api } from "./clientgate/Mst_ProvinceApi";
import { useDealerApi } from "./clientgate/Mst_Dealer-api";
import { useMst_AreaApi } from "./clientgate/Mst_AreaApi";
import { useMst_CarModelApi } from "./clientgate/Mst_CarModelApi";
import { useMdMetaColGroupSpecApi } from "@packages/api/clientgate/MDMetaColGroupSpecApi";
import { useMdMetaColGroupApi } from "@packages/api/clientgate/MdMetaColGroupApi";
import { useCustomFieldApi } from "@packages/api/clientgate/CustomFieldApi";
import { useMst_DepartmentControlApi } from "./clientgate/Mst_DepartmentApi";
import { useSys_UserApi } from "./clientgate/Sys_UserApi";
import { useMst_Customer } from "./clientgate/Mst_CustomerApi";
import { useMst_NNTControllerApi } from "./clientgate/Mst_NNTControllerApi";
import { useMst_CampaignColumnConfig } from "./clientgate/Mst_CampaignColumnConfigApi";
import { useSys_GroupControllerApi } from "./clientgate/SysGroupControllerApi";
import { useSys_AccessApi } from "./clientgate/Sys_AccessApi";
import { useMst_CustomerGroupApi } from "./clientgate/Mst_CustomerGroupApi";
import { useMst_PaymentTermControllerApi } from "./clientgate/Mst_PaymentTermControllerApi";
import { use_MstCampaignTypeApi } from "./clientgate/Mst_CampaignTypeApi";
import { useCpn_CampaignAgentApi } from "./clientgate/Cpn_CampaignAgentApi";
// report end

/**
 * Creates an axios instance for making requests to the ClientGate API.
 * @param {IUser} currentUser - The current user's information.
 * @param {string} clientGateDomain - The base URL for the ClientGate API.
 * @param {string} networkId - The ID of the network.
 * @param {string} orgId - The ID of the organization.
 * @return {AxiosInstance} An axios instance configured for the ClientGate API.
 */
export const createReportApiBase = (
  currentUser: IUser,
  clientGateDomain: string,
  networkId: string,
  orgId: string
) => {
  const api = axios.create({
    baseURL: clientGateDomain,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      AppAgent: import.meta.env.VITE_AGENT,
      GwUserCode: import.meta.env.VITE_GW_USER,
      GwPassword: import.meta.env.VITE_GW_USER_PW,
      AppVerCode: "V1",
      Tid: Tid(),
      AppTid: Tid(),
      AppLanguageCode: currentUser.Language,
      UtcOffset: currentUser.TimeZone,
      NetworkId: networkId,
      OrgId: orgId,
    },
  });
  api.interceptors.request.use(
    FlagActiveConvertor.beforeRequest,
    function (error) {
      return Promise.reject(error);
    }
  );
  api.interceptors.response.use(
    function (response) {
      // with this API, it always falls to this case.
      const data = response.data;
      const result: any = {
        isSuccess: data.Data._strErrCode === "0" && !data.Data._excResult,
        debugInfo: data.Data._dicDebugInfo,
        errorInfo:
          data.Data._strErrCode === "0" ? undefined : data.Data._excResult,
        errorCode: data.Data._strErrCode,
      };
      if (result.isSuccess && !!data.Data._objResult) {
        if (data.Data._objResult.Data) {
          result.Data = data.Data._objResult.Data;
        } else {
          result.Data = data.Data._objResult;
        }
      } else {
      }
      return result;
    },
    function (error: AxiosError) {
      if (error?.response?.status === 401) {
        location.href = "/login";
      }
      return Promise.reject(error.response?.data);
    }
  );
  return api;
};
/**
 * Creates an axios instance for making requests to the ClientGate API.
 * @param {IUser} currentUser - The current user's information.
 * @param {string} clientGateDomain - The base URL for the ClientGate API.
 * @param {string} networkId - The ID of the network.
 * @param {string} orgId - The ID of the organization.
 * @return {AxiosInstance} An axios instance configured for the ClientGate API.
 */
export const createClientGateApiBase = (
  currentUser: IUser,
  clientGateDomain: string,
  networkId: string,
  orgId: string
) => {
  const api = axios.create({
    baseURL: clientGateDomain,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      AppAgent: import.meta.env.VITE_AGENT,
      GwUserCode: import.meta.env.VITE_GW_USER,
      GwPassword: import.meta.env.VITE_GW_USER_PW,
      AppVerCode: "V1",
      Tid: Tid(),
      AppTid: Tid(),
      AppLanguageCode: currentUser.Language,
      UtcOffset: currentUser.TimeZone,
      NetworkId: networkId,
      OrgId: orgId,
    },
  });
  api.interceptors.request.use(
    FlagActiveConvertor.beforeRequest,
    function (error) {
      return Promise.reject(error);
    }
  );
  api.interceptors.response.use(
    function (response) {
      // with this API, it always falls to this case.
      const data = response.data;
      const result: any = {
        isSuccess: data.Data._strErrCode === "0" && !data.Data._excResult,
        debugInfo: data.Data._dicDebugInfo,
        errorInfo:
          data.Data._strErrCode === "0" ? undefined : data.Data._excResult,
        errorCode: data.Data._strErrCode,
      };
      if (
        result.isSuccess &&
        !!data.Data._objResult &&
        !!data.Data._objResult.DataList
      ) {
        result.DataList = data.Data._objResult.DataList.map((item: any) => {
          // if `item` has `FlagActive` property
          if (Object.keys(item).includes("FlagActive")) {
            item.FlagActive = item.FlagActive === "1";
          }
          return {
            ...item,
          };
        });

        result.ItemCount = data.Data._objResult.ItemCount;
        result.PageCount = data.Data._objResult.PageCount;
        result.PageIndex = data.Data._objResult.PageIndex;
        result.PageSize = data.Data._objResult.PageSize;
      } else {
        if (
          !!data.Data?._objResult &&
          typeof data.Data?._objResult === "object"
        ) {
          result.Data = data.Data?._objResult.Data;
        } else if (typeof data.Data?._objResult !== "string") {
          result.Data = data.Data?._objResult?.map((item: any) => {
            // if `item` has `FlagActive` property
            if (Object.keys(item).includes("FlagActive")) {
              item.FlagActive = item.FlagActive === "1";
            }
            return {
              ...item,
            };
          });
        } else {
          result.Data = data.Data?._objResult;
        }
      }
      return result;
    },
    function (error: AxiosError) {
      if (error?.response?.status === 401) {
        location.href = "/login";
      }
      return Promise.reject(error.response?.data);
    }
  );
  return api;
};

export const createClientGateApi = (
  currentUser: IUser,
  clientgateDomain: string,
  networkId: string,
  orgId: string
) => {
  const apiBase = createClientGateApiBase(
    currentUser,
    clientgateDomain,
    networkId,
    orgId
  );
  const reportApiBase = createReportApiBase(
    currentUser,
    clientgateDomain,
    networkId,
    orgId
  );
  const useDealer = useDealerApi(apiBase);
  const getCurrentUserApis = useGetForCurrentUser(reportApiBase);
  const mstDealerType = useMst_DealerType(apiBase);
  const provinceApis = useMst_Province_api(apiBase);
  const mstAreaApi = useMst_AreaApi(apiBase);
  const mstCarModelApi = useMst_CarModelApi(apiBase);
  const mdMetaColGroupSpecApi = useMdMetaColGroupSpecApi(apiBase);
  const mdMetaColGroupApi = useMdMetaColGroupApi(apiBase);
  const customFieldApi = useCustomFieldApi(apiBase);
  const mstDepartmentControlApi = useMst_DepartmentControlApi(apiBase);
  const sys_UserApi = useSys_UserApi(apiBase);
  const mstNNTControllerApi = useMst_NNTControllerApi(apiBase);
  // const mdMetaColGroupApi = useMdMetaColGroupApi(apiBase)
  // const customFieldApi = useCustomFieldApi(apiBase);
  const useMstCustomer = useMst_Customer(apiBase);
  const useMstCususeMstCampaignColumnConfigtomer =
    useMst_CampaignColumnConfig(apiBase);
  const sysGroupControllerApi = useSys_GroupControllerApi(apiBase);
  const sysAccessApi = useSys_AccessApi(apiBase);
  const mstCustomerGroupApi = useMst_CustomerGroupApi(apiBase);
  const mstPaymentTermControllerApi = useMst_PaymentTermControllerApi(apiBase);
  const mstCampaignTypeApi = use_MstCampaignTypeApi(apiBase);
  const cpnCampaignAgentApi = useCpn_CampaignAgentApi(apiBase);
  return {
    ...cpnCampaignAgentApi,
    ...mstCampaignTypeApi,
    ...mstPaymentTermControllerApi,
    ...mstCustomerGroupApi,
    ...sysAccessApi,
    ...mstNNTControllerApi,
    ...sysGroupControllerApi,
    ...sys_UserApi,
    ...useMstCususeMstCampaignColumnConfigtomer,
    ...mstDepartmentControlApi,
    ...useMstCustomer,
    ...mstCarModelApi,
    ...useDealer,
    ...provinceApis,
    ...mstDealerType,
    ...mstAreaApi,
    ...getCurrentUserApis,
    ...mdMetaColGroupSpecApi,
    ...mdMetaColGroupApi,
    ...customFieldApi,
  };
};

export const useClientgateApi = () => {
  const {
    auth: { currentUser, networkId, orgData, clientGateUrl },
  } = useAuth();
  return createClientGateApi(
    currentUser!,
    clientGateUrl!,
    networkId,
    orgData?.Id!
  );
};
