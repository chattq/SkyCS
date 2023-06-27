import {
  ApiResponse, UploadedFile,
} from "@packages/types";
import { AxiosInstance } from "axios";

export const useFileApi = (apiBase: AxiosInstance) => {
  return {
    File_UploadFile: async (file: File): Promise<ApiResponse<UploadedFile>> => {
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
