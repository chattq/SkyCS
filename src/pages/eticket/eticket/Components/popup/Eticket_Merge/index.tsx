import { Button, Form, LoadPanel, Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useAtomValue, useSetAtom } from "jotai";
import React, { memo, useRef, useState } from "react";
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
import { toast } from "react-toastify";
interface Props {
  onCancel: () => void;
  onSave: () => void;
  dataRow: ETICKET_REPONSE[];
}

interface data {
  TicketName: string;
  message: string;
  TicketID: string;
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
  const { t } = useI18n("Eticket_Merger");
  const formRef: any = useRef(null);
  const api = useClientgateApi();
  const config = useConfiguration();
  const popupVisible = useAtomValue(popupVisibleAtom);
  const { auth } = useAuth();
  const showError = useSetAtom(showErrorAtom);
  const [formData, setFormData] = useState<any>({});
  console.log("dataRow ", dataRow);
  const defaultData: data[] = [
    {
      TicketName: "Hỗ trợ sửa đơn hàng DMS ngày 20-3",
      message: "Bộ phận chăm sóc khách hàng tiếp nhận yêu cầu",
      TicketID: "ID001091331111",
      date: "3/20/2023 5:41",
      channel: "email",
    },
    {
      TicketName: "Khiếu nại dịch vụ Ex",
      message: "Bộ phận chăm sóc khách hàng tiếp nhận yêu cầu",
      TicketID: "ID001091331111",
      date: "3/20/2023 5:41",
      channel: "call",
    },
    {
      TicketName: "Khiếu nại dịch vụ Ex",
      message: "Bộ phận chăm sóc khách hàng tiếp nhận yêu cầu",
      TicketID: "ID001091331111",
      date: "3/20/2023 5:41",
      channel: "zalo",
    },
    {
      TicketName: "Khiếu nại dịch vụ Ex",
      message: "Bộ phận chăm sóc khách hàng tiếp nhận yêu cầu",
      TicketID: "ID001091331111",
      date: "3/20/2023 5:41",
      channel: "facebook",
    },
    {
      TicketName: "Khiếu nại dịch vụ Ex",
      message: "Bộ phận chăm sóc khách hàng tiếp nhận yêu cầu",
      TicketID: "ID001091331111",
      date: "3/20/2023 5:41",
      channel: "sms",
    },
    {
      TicketName: "Khiếu nại dịch vụ Ex",
      message: "Bộ phận chăm sóc khách hàng tiếp nhận yêu cầu",
      TicketID: "ID001091331111",
      date: "3/20/2023 5:41",
      channel: "livechat",
    },
  ];

  const [formValue, setFormValue] = useState({
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    OrgId: auth.orgData?.Id,
  });
  const handleSave = async () => {
    const { isValid } = formRef.current.instance.validate();
    if (isValid) {
      console.log("dataRow ", dataRow);
      console.log("object", formData);

      const obj = {
        TicketID: formData?.TicketID ?? "",
        OrgID: auth.orgData?.Id ?? "",
        Lst_ET_Ticket: dataRow
          .filter((item) => {
            return item.TicketID !== formData?.TicketID ?? "";
          })
          .map((item) => {
            return {
              TicketID: item.TicketID,
            };
          }),
      };

      const response = await api.ET_Ticket_Merge(obj);
      if (response.isSuccess) {
        toast.success(t("ET_Ticket_Merge merge success! "));
        onCancel();
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    } else {
      return;
    }
  };

  return (
    <Popup
      className="popup"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={t(`Eticket Merge`)}
      width={700}
      height={575}
      visible={popupVisible}
    >
      {/* <LoadPanel
        visible={isLoading}
        showIndicator={true}
        showPane={true}
        container={".dx-viewport"}
        shadingColor="rgba(0,0,0,0.4)"
      /> */}
      <div className="popup-content">
        {dataRow.map((item) => {
          return (
            <div className="flex items-center justify-between mb-2 container-content">
              <div className="left">
                <p className="strong">{item.TicketName}</p>
                <p className="flex items-center">
                  <Icon className="mr-2" size={14} name={"email"} /> eticket
                  message
                </p>
              </div>
              <div className="right">
                <p>{item.TicketID}</p>
                <p>eticket date</p>
              </div>
            </div>
          );
        })}

        <Form
          formData={formData}
          ref={formRef}
          validationGroup="form-transformCustomer"
          labelLocation="left"
        >
          <SimpleItem
            dataField="TicketID"
            validationRules={[requiredType]}
            editorType={"dxSelectBox"}
            editorOptions={{
              dataSource: dataRow,
              displayExpr: "TicketName",
              valueExpr: "TicketID",
            }}
          />
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

export default memo(index);
