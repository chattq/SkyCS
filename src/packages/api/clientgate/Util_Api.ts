import { AxiosInstance } from "axios";

export const useUtil_Api = (apiBase: AxiosInstance) => {
  return {
    Api_GetDTime: async () => {
      return await apiBase.post("Api/GetDTime");
    },
  };
};
