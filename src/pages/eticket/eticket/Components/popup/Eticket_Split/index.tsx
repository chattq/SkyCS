import {
  Button,
  CheckBox,
  Form,
  LoadPanel,
  Popup,
  RadioGroup,
} from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useAtomValue, useSetAtom } from "jotai";
import React, { memo, useMemo, useRef, useState } from "react";
import { popupVisibleAtom } from "../store";
import { useI18n } from "@/i18n/useI18n";
import { ButtonItem, SimpleItem } from "devextreme-react/form";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { useConfiguration } from "@/packages/hooks";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import "./style.scss";
import { Icon } from "@/packages/ui/icons";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { P, match } from "ts-pattern";
import { toast } from "react-toastify";
interface Props {
  onCancel: () => void;
  onSave: () => void;
  dataRow: ETICKET_REPONSE[];
}

interface data {
  title: string;
  message: string;
  id: string;
  date: string;
  channel:
    | "remove"
    | "add"
    | "edit"
    | "trash"
    | "plus"
    | "pdf"
    | "xlsx"
    | "jpg"
    | "docx"
    | "expandDown"
    | "png"
    | "email"
    | "call"
    | "zalo"
    | "facebook"
    | "sms"
    | "livechat";
}

const index = ({ onCancel, onSave, dataRow }: Props) => {
  const { t } = useI18n("TransformCustomer");
  const api = useClientgateApi();
  const config = useConfiguration();
  const popupVisible = useAtomValue(popupVisibleAtom);
  const { auth } = useAuth();
  const showError = useSetAtom(showErrorAtom);
  const formRef: any = useRef(null);
  const [formData, setFormData] = useState({});

  const getIcon = (type: string) => {
    // NONE = 0;
    // EMAIL = 1;
    // CALL = 2;
    // SMS = 3;
    // CHAT = 4;
    // FACEBOOK = 5;
    // ZALO = 6;
    // YOUTUBE = 7;
    // PORTAL = 8;
    return match(type)
      .with("0", () => {
        return "NONE";
      })
      .with("1", () => {
        return "EMAIL";
      })
      .with("2", () => {
        return "CALL";
      })
      .with("3", () => {
        return "SMS";
      })
      .with("4", () => {
        return "livechat"; // CHAT
      })
      .with("5", () => {
        return "FACEBOOK";
      })
      .with("6", () => {
        return "ZALO";
      })
      .with("7", () => {
        return "YOUTUBE";
      })
      .with("8", () => {
        return "PORTAL";
      })
      .otherwise(() => {
        return "NONE";
      });
  };
  const { data, isLoading } = useQuery({
    queryKey: ["GetEticketById", dataRow],
    queryFn: async () => {
      const response = await api.ET_Ticket_GetByTicketID({
        TicketID: dataRow[0]?.TicketID ?? "",
        OrgID: auth.orgData?.Id ?? "",
      });
      if (response.isSuccess) {
        return response.Data;
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    },
  });

  const handleSave = async () => {
    const formData = formRef.current.instance.option("formData");
    const newData = Object.keys(formData)
      .filter((item) => {
        return formData[item];
      })
      .map((item: string) => {
        return parseFloat(item.split("-")[item.split("-").length - 1]);
      });
    //AutoId-14
    const getData = data?.Lst_ET_TicketMessage.filter((item: any) => {
      return newData.includes(item.AutoId);
    }).map((item: any) => {
      return {
        TicketID: item.TicketID,
        AutoID: item.AutoId,
      };
    });

    const obj = {
      TicketIDRoot: dataRow[0]?.TicketID ?? "",
      OrgID: auth.orgData?.Id ?? "",
      Lst_ET_TicketMessage: getData,
    };

    const response = await api.ET_Ticket_Split(obj);
    if (response.isSuccess) {
      toast.success(t("Split SuccessFully"));
      onCancel();
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const handleShowIcon = (data: any): string => {
    let type = "email";
    return getIcon(data.ChannelId).toLocaleLowerCase();
  };

  const [formValue, setFormValue] = useState({
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    OrgId: auth.orgData?.Id,
  });

  const dataRender = data ? data.Lst_ET_TicketMessage : [];

  return (
    <Popup
      className="popup"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={t(`Eticket Split`)}
      width={700}
      height={575}
      visible={popupVisible}
    >
      <LoadPanel
        visible={isLoading}
        showIndicator={true}
        showPane={true}
        container={".popup"}
        shadingColor="rgba(0,0,0,0.4)"
      />
      <div className="tag flex items-center justify-between mb-4">
        <div className="left">
          <p className="strong">
            {t(
              `Hộ trợ tạo đơn hàng DMS cho khách hàng ${dataRow[0].CustomerCodeSys}`
            )}
          </p>
        </div>
        <div className="right">{/* <p>{`${dataRow[0].TicketID}`}</p> */}</div>
      </div>
      <p className="mb-2">
        {t("Select one of contents below to transport to new eTickets:")}
      </p>
      <div className="popup-content">
        <Form labelMode="hidden" formData={formData} ref={formRef}>
          {dataRender.map((itemValue: any, index: number) => {
            return (
              <SimpleItem
                key={index}
                dataField={`${itemValue.AutoId}`}
                name={t("AutoId")}
                editorType="dxCheckBox"
                render={(param) => {
                  const {
                    component: formComponent,
                    dataField,
                    editorOptions,
                  } = param;
                  return (
                    <div className="flex items-center">
                      <CheckBox
                        onValueChanged={(e) => {
                          formComponent.updateData(
                            `AutoId-${dataField}`,
                            e.value
                          );
                        }}
                      ></CheckBox>
                      <div className="flex item-center justify-between mb-2 container-content">
                        <div className="left">
                          <p className="strong">{"title"}</p>
                          <p className="flex item-center">
                            {handleShowIcon(itemValue) === "none" ? (
                              ""
                            ) : (
                              <Icon
                                className="mr-2"
                                size={14}
                                name={handleShowIcon(itemValue)}
                              />
                            )}
                            <MessageDesciption value={itemValue} />
                          </p>
                        </div>
                        <div className="right">
                          <p>{itemValue.TicketID ?? ""}</p>
                          <p>{itemValue.CreateDTimeUTC ?? ""}</p>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            );
          })}
        </Form>
      </div>
      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Save")}
          type={"default"}
          stylingMode={"contained"}
          onClick={handleSave}
        />
        <Button
          text={t("Close")}
          stylingMode={"contained"}
          onClick={onCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default index;

export const MessageDesciption = memo(({ value }: any) => {
  const handleConvertMessage = (value: any) => {
    let type1 = "";
    if (value?.ConvMessageType === "1" && value?.ChannelId === "0") {
      type1 = "remark";
    } else if (value?.ConvMessageType === "3" && value?.ChannelId === "1") {
      type1 = "email";
    } else if (
      (value?.ConvMessageType === "8" || value?.ConvMessageType === "10") &&
      value?.ChannelId === "6"
    ) {
      type1 = "zalo";
    } else if (value?.ConvMessageType === "4" && value?.ChannelId === "2") {
      type1 = "call";
    }
    if (type1 === "email" || type1 === "call") {
      return `${type1} ${value.IsIncoming === "1" ? "in" : "out"}`;
    }
    if (type1 == "call") {
      return `${type1} ${value.Call?.Type?.toLocaleLowerCase()}`;
    }
    return <p>Message</p>;
  };

  return handleConvertMessage(value);
});
