import { atom, useAtomValue, useSetAtom } from "jotai";

export interface ErrorMessage {
  title?: string;
  message: string;
  debugInfo: object;
  errorInfo?: object;
  // errorInfo?: errorInfo;
}

export interface errorInfo {
  ClassName: string;
  Message: string;
  Data: errorInfo_Data;
  InnerException: errorInfo_InnerException;
  HelpURL: string;
  StackTraceString: string;
  RemoteStackTraceString: string;
  RemoteStackIndex: string;
  ExceptionMethod: string;
  HResult: string;
  Source: string;
  WatsonBuckets: string;
}

export interface errorInfo_Data {
  MyDebugInfo_DateTime_Now: string;
  MyDebugInfo_FullStackTrace: string;
}
export interface errorInfo_InnerException {
  c_K_DT_Sys: error_c_K_DT_Sys;
  Exception: errIn_InnerException_Exception;
  Exec: string;
  Message: string;
  InnerException: string;
  TargetSite: err_TargetSite;
  StackTrace: string;
  HelpLink: string;
  Source: string;
  HResult: string;
}
export interface error_c_K_DT_Sys {
  Lst_c_K_DT_SysInfo: error_c_K_DT_SysInfo[];
  Lst_c_K_DT_SysError: error_c_K_DT_SysError[];
  Lst_c_K_DT_SysWarning: error_c_K_DT_SysWarning[];
}
export interface error_c_K_DT_SysInfo {
  Tid: string;
  DigitalSignature: string;
  ErrorCode: string;
  FlagCompress: string;
  FlagEncrypt: string;
  FlagWarning: string;
  Remark: string;
}
// export interface err_Data {
//   PCode: string;
//   PVal: string;
// }
export interface error_c_K_DT_SysError {
  PCode: string;
  PVal: string;
}
export interface error_c_K_DT_SysWarning {
  PCode: string;
  PVal: string;
}

export interface errIn_InnerException_Exception {
  c_K_DT_Sys: error_c_K_DT_Sys;
  Exception: err_InnerEx_Exception;
  TargetSite: err_TargetSite;
  Exec: string;
  Message: string;
  Data: string;
  InnerException: string;
  StackTrace: string;
  HelpLink: string;
  Source: string;
  HResult: string;
}

export interface err_InnerEx_Exception {
  ClassName: string;
  Data: string;
  ExceptionMethod: string;
  HelpURL: string;
  HResult: string;
  InnerException: string;
  Message: string;
  RemoteStackIndex: string;
  RemoteStackTraceString: string;
  Source: string;
  StackTraceString: string;
  WatsonBuckets: string;
}

export interface err_TargetSite {
  AssemblyName: string;
  ClassName: string;
  GenericArguments: string;
  MemberType: string;
  Name: string;
  Signature: string;
  Signature2: string;
}

interface IErrorStore {
  errors: ErrorMessage[];
}
export const errorAtom = atom<IErrorStore>({
  errors: [],
});

export const showErrorAtom = atom(null, (get, set, error: ErrorMessage) => {
  const errors = [...get(errorAtom).errors, error];
  set(errorAtom, {
    errors,
  });
});

export const clearErrorAtom = atom(null, (get, set) => {
  set(errorAtom, {
    errors: [],
  });
});

export const useErrorStore = () => {
  const errorStore = useAtomValue(errorAtom);
  const setErrorStore = useSetAtom(errorAtom);
  const clear = () => {
    setErrorStore({
      errors: [],
    });
  };

  const showError = (error: ErrorMessage) => {
    const errors = [...errorStore.errors, error];
    setErrorStore({
      errors,
    });
  };
  return {
    errors: errorStore.errors,
    clear,
    showError,
  };
};
