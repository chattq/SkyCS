import { useI18n } from "@/i18n/useI18n";
import { logger } from "@/packages/logger";
import { ErrorMessage, clearErrorAtom, useErrorStore } from "@/packages/store";
import { ScrollView } from "devextreme-react";
import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import { useSetAtom } from "jotai";

import { useState } from "react";
import Button from "devextreme-react/button";

const ErrorDetail = ({ error }: { error: ErrorMessage }) => {
  logger.debug("error:", error);
  console.log("20230721 - error", error);
  const { t } = useI18n("Error");
  const objDebugInfo = error.debugInfo;
  const objErrorInfo = error.errorInfo;

  const objc_K_DT_Sys = objErrorInfo?.InnerException?.c_K_DT_Sys;
  const Lst_c_K_DT_SysInfo = objc_K_DT_Sys?.Lst_c_K_DT_SysInfo;
  const Lst_c_K_DT_SysError = objc_K_DT_Sys?.Lst_c_K_DT_SysError;
  const Lst_c_K_DT_SysWarning = objc_K_DT_Sys?.Lst_c_K_DT_SysWarning;
  const objException = objErrorInfo?.InnerException?.Exception;
  const objEx_c_K_DT_Sys = objException?.c_K_DT_Sys;
  const objEx_Exception = objException?.Exception;
  const objEx_TargetSite = objException?.TargetSite;

  const Lst_c_K_DT_SysInfo_Exception = objEx_c_K_DT_Sys?.Lst_c_K_DT_SysInfo;
  const Lst_c_K_DT_SysError_Exception = objEx_c_K_DT_Sys?.Lst_c_K_DT_SysError;
  const Lst_c_K_DT_SysWarning_Exception =
    objEx_c_K_DT_Sys?.Lst_c_K_DT_SysWarning;

  const errorCode =
    Lst_c_K_DT_SysInfo != null && Lst_c_K_DT_SysInfo.length > 0
      ? Lst_c_K_DT_SysInfo[0].ErrorCode
      : "";
  const errorMessage = t(errorCode);

  return (
    // <div
    //   id="editable"
    //   contenteditable="false"
    //   onfocus="document.execCommand('selectAll',true,null);"
    // >
    <div>
      {!!objErrorInfo && (
        <div className="error__excresult">
          <div className="error__excresult-title">{t("Exception result")}</div>
          <div className="error__excresult__key">ErrorCode: {errorCode}</div>
          <div className="error__excresult__key">
            ErrorMessage: {errorMessage}
          </div>
          -----------------------------------------
          <div className="error__excresult__key">Lst_c_K_DT_SysInfo:</div>
          {Lst_c_K_DT_SysInfo != null && Lst_c_K_DT_SysInfo.length > 0 ? (
            Lst_c_K_DT_SysInfo.map((item, index) => {
              return (
                <div key={item.Tid}>
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div key={`${key}_${index}`}>
                        <div className="error__debuginfo__key">
                          {key}: {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <></>
          )}
          <div className="error__excresult__key">Lst_c_K_DT_SysError:</div>
          {Lst_c_K_DT_SysError != null && Lst_c_K_DT_SysError.length > 0 ? (
            Lst_c_K_DT_SysError.map((item, index) => {
              return (
                <div key={item.PCode}>
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div key={`${key}_${index}`}>
                        <div className="error__debuginfo__key">
                          {key}: {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <></>
          )}
          <div className="error__excresult__key">Lst_c_K_DT_SysWarning:</div>
          {Lst_c_K_DT_SysWarning != null && Lst_c_K_DT_SysWarning.length > 0 ? (
            Lst_c_K_DT_SysWarning.map((item, index) => {
              return (
                <div key={item.PCode}>
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div key={`${key}_${index}`}>
                        <div className="error__debuginfo__key">
                          {key}: {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <></>
          )}
          -----------------------------------------
          <div className="error__excresult__key">Exception:</div>
          <div className="error__excresult__key">
            Exception Lst_c_K_DT_SysInfo:
          </div>
          {Lst_c_K_DT_SysInfo_Exception != null &&
          Lst_c_K_DT_SysInfo_Exception.length > 0 ? (
            Lst_c_K_DT_SysInfo_Exception.map((item, index) => {
              return (
                <div key={item.Tid}>
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div key={`${key}_${index}`}>
                        <div className="error__debuginfo__key">
                          {key}: {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <></>
          )}
          <div className="error__excresult__key">
            Exception Lst_c_K_DT_SysError:
          </div>
          {Lst_c_K_DT_SysError_Exception != null &&
          Lst_c_K_DT_SysError_Exception.length > 0 ? (
            Lst_c_K_DT_SysError_Exception.map((item, index) => {
              return (
                <div key={item.PCode}>
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div key={`${key}_${index}`}>
                        <div className="error__debuginfo__key">
                          {key}: {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <></>
          )}
          <div className="error__excresult__key">
            Exception Lst_c_K_DT_SysWarning:
          </div>
          {Lst_c_K_DT_SysWarning_Exception != null &&
          Lst_c_K_DT_SysWarning_Exception.length > 0 ? (
            Lst_c_K_DT_SysWarning_Exception.map((item, index) => {
              return (
                <div key={item.PCode}>
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div key={`${key}_${index}`}>
                        <div className="error__debuginfo__key">
                          {key}: {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <></>
          )}
          -----------------------------------------
          <div className="error__excresult__key">Exception TargetSite:</div>
          {objEx_TargetSite != null ? (
            <div
              key={`${objEx_TargetSite.Name}_${objEx_TargetSite.MemberType}`}
            >
              {Object.entries(objEx_TargetSite).map(([key, value]) => {
                return (
                  <div
                    key={`${objEx_TargetSite.Name}_${objEx_TargetSite.MemberType}_${key}`}
                  >
                    <div className="error__debuginfo__key">
                      {key}:{JSON.stringify(value, null, 2)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <></>
          )}
          -----------------------------------------
          <div className="error__excresult__key">Exception Exception:</div>
          {objEx_Exception != null ? (
            <div>
              {Object.entries(objEx_Exception).map(([key, value]) => {
                return (
                  <div key={key}>
                    <div className="error__debuginfo__key">
                      {key}:{JSON.stringify(value, null, 2)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
      {!!objDebugInfo && (
        <div className="error__debuginfo">
          <div className="error__debuginfo-title">{t("Debug information")}</div>
          {Object.entries(objDebugInfo).map(([key, value]) => {
            return (
              <div key={key}>
                <div className="error__debuginfo__key">
                  {key}:{JSON.stringify(value, null, 2)}
                </div>
              </div>
            );
          })}
          -----------------------------------------
        </div>
      )}
      {JSON.stringify(error)}
    </div>
  );
};

const ErrorDetail_BK = ({ error }: { error: ErrorMessage }) => {
  logger.debug("error:", error);
  console.log("20230721 - error", error);
  const { t } = useI18n("Error");
  return (
    <div>
      {!!error.debugInfo && (
        <div className="error__debuginfo">
          <div className="error__debuginfo-title">{t("Debug information")}</div>
          {Object.entries(error.debugInfo).map(([key, value]) => {
            return (
              <div key={key}>
                <div className="error__debuginfo__key">
                  {key}:{JSON.stringify(value, null, 2)}
                </div>
              </div>
            );
          })}
          -----------------------------------------
        </div>
      )}
      {!!error.errorInfo && (
        <div className="error__excresult">
          <div className="error__excresult-title">{t("Exception result")}</div>
          {Object.entries(error.errorInfo).map(([key, value]) => {
            return (
              <div key={key}>
                <div className="error__excresult__key">
                  {key}:{JSON.stringify(value, null, 2)}
                </div>
              </div>
            );
          })}
          -----------------------------------------
        </div>
      )}
      {/* {JSON.stringify(error)} */}
    </div>
  );
};

export default function Error() {
  const [size, setSize] = useState<"short" | "full">("short");
  const viewModeSizes = {
    short: {
      width: 400,
      height: 200,
    },
    full: {
      width: 550,
      height: 600,
    },
  };

  const { t } = useI18n("Error");
  const { errors } = useErrorStore();
  const clear = useSetAtom(clearErrorAtom);
  const hasErrors = !!errors && errors.length > 0;

  const handleClose = () => {
    clear();
  };

  const handleZoom = () => {
    setSize(size === "short" ? "full" : "short");
  };

  const title = t("ErrorTitle");

  return (
    <Popup
      titleRender={(item: any) => (
        <div className="error-title">
          <Button
            icon={"/images/icons/warning.svg"}
            hoverStateEnabled={false}
            activeStateEnabled={false}
            focusStateEnabled={false}
            stylingMode={"text"}
          />
          {title}
        </div>
      )}
      // container=".dx-viewport"
      visible={hasErrors}
      position={"center"}
      width={viewModeSizes[size].width}
      height={viewModeSizes[size].height}
      onHiding={() => setSize("short")}
    >
      <Position at="bottom" my="center" />
      <ToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="after"
        options={{
          text: t(size === "short" ? "ViewDetail" : "Collapse"),
          onClick: handleZoom,
          stylingMode: "contained",
        }}
      />
      <ToolbarItem toolbar="bottom" location="after">
        <Button text={t("Close")} onClick={handleClose} />
      </ToolbarItem>
      <ScrollView width={520} showScrollbar={"always"}>
        <div className="error-body overflow-scroll">
          {errors.map((item, index) => {
            if (item) {
              console.log("error ", item);

              return (
                <div className="error-item" key={index}>
                  {/* <div
                    className="error__main"
                    onClick={() => {
                      document.getElementById("editable").focus();
                    }}
                  > */}
                  <div className="error__main">
                    {item?.errorInfo?.Message ?? item.message}
                  </div>
                  {size === "full" && (
                    <div className="error__detail">
                      <ErrorDetail error={item} />
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      </ScrollView>
    </Popup>
  );
}
