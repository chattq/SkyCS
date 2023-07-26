import { Tid } from "@/utils/hash";
import axios from "axios";
import { CcAgent, CcCall, CcCallingInfo, CcOrgInfo, IOrg, ISession, LocaleData, Response } from "@packages/types";
import { logger } from "@packages/logger";

const callapiDomain: string = `${import.meta.env.VITE_CALL_BASE_URL}`;
const AppAgent: string = `${import.meta.env.VITE_AGENT}`;
const GwUserCode: string = `${import.meta.env.VITE_GW_USER}`;
const GwUserPassword: string = `${import.meta.env.VITE_GW_USER_PW}`;
const defaultHeaders = {
  "Content-Type": "application/json",
  AppAgent: AppAgent,
  GwUserCode: GwUserCode,
  GwPassword: GwUserPassword,
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  Tid: Tid(),
};
const MAX_REQUESTS_COUNT = 10;
const INTERVAL_MS = 10;
let PENDING_REQUESTS = 0;

const callApiBase = axios.create({
  baseURL: callapiDomain,
  headers: defaultHeaders
});



export const callApi = {
  getOrgInfo: async (networkId: string) => {
    const token = localStorage.getItem("token");
    const response = await callApiBase.post<Response<CcOrgInfo>>("/callapi/GetCurrentOrgInfo", {}, {
      headers: { networkId: networkId }
    });

    logger.debug('response', response);
    return response.data;
  },

  getMyCallingInfo: async (networkId: string, data?: any) => {
    if (!data) data = {};
    const token = localStorage.getItem("token");
    const response = await callApiBase.post<Response<CcCallingInfo>>("/callapi/getMyCallingInfo", data, {
      headers: { networkId: networkId }
    });

    logger.debug('response', response);
    return response.data;
  },

  getMyCallHistory: async (networkId: string) => {
    const token = localStorage.getItem("token");
    const response = await callApiBase.post<Response<CcCall[]>>("/callapi/getMyCallHistory", {}, {
      headers: { networkId: networkId }
    });

    logger.debug('response', response);
    return response.data;
  },


  getMyLatestCall: async (networkId: string) => {
    const token = localStorage.getItem("token");
    const response = await callApiBase.post<Response<CcCall>>("/callapi/getMyLatestCall", {}, {
      headers: { networkId: networkId }
    });

    logger.debug('response', response);
    return response.data;
  },

  getOrgAgentList: async (networkId: string) => {
    const token = localStorage.getItem("token");
    const response = await callApiBase.post<Response<CcAgent[]>>("/callapi/getOrgAgentList", {}, {
      headers: { networkId: networkId }
    });

    logger.debug('response', response);
    return response.data;
  },

  setExtAgentStatus: async (networkId: string, data: any) => {
    const token = localStorage.getItem("token");
    const response = await callApiBase.post<Response<CcAgent>>("/callapi/setExtAgentStatus", data, {
      headers: { networkId: networkId }
    });

    logger.debug('response', response);
    return response.data;
  },

  getOrgCallListMonitor: async (networkId: string) => {
    const token = localStorage.getItem("token");
    const response = await callApiBase.post<Response<CcCall[]>>("/callapi/getOrgCallListMonitor", {}, {
      headers: { networkId: networkId }
    });

    logger.debug('response', response);
    return response.data;
  },

  hangup: async (networkId: string, data: any) => {
    const token = localStorage.getItem("token");
    const response = await callApiBase.post<Response<CcCall>>("/callapi/hangup", data, {
      headers: { networkId: networkId }
    });

    logger.debug('response', response);
    return response.data;
  },
  snoop: async (networkId: string, data: any) => {
    const token = localStorage.getItem("token");
    const response = await callApiBase.post<Response<CcCall>>("/callapi/snoop", data, {
      headers: { networkId: networkId }
    });

    logger.debug('response', response);
    return response.data;
  },

  redirect: async (networkId: string, data: any) => {
    const token = localStorage.getItem("token");
    const response = await callApiBase.post<Response<CcCall>>("/callapi/redirect", data, {
      headers: { networkId: networkId }
    });

    logger.debug('response', response);
    return response.data;
  },

};
