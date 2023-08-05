import { Button, Form, LoadPanel, Popup } from "devextreme-react";
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
import { ColumnOptions } from "@/packages/ui/base-gridview";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { toast } from "react-toastify";
interface Props {
  onCancel: () => void;
  onSave: () => void;
  dataRow: ETICKET_REPONSE[];
}

interface PayloadInterface {
  TicketID: string;
  OrgIDNew: string;
  DepartmentCode: string;
  AgentCode: string;
}

const index = ({ onCancel, onSave, dataRow }: Props) => {
  const { t } = useI18n("TransformCustomer");
  const formRef: any = useRef(null);
  const api = useClientgateApi();
  const config = useConfiguration();
  const popupVisible = useAtomValue(popupVisibleAtom);
  const { auth } = useAuth();
  const showError = useSetAtom(showErrorAtom);
  const [formValue, setFormValue] = useState({
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    OrgId: auth.orgData?.Id,
  });

  const [org, setOrg] = useState("");

  const [formPayload, setFormPayload] = useState<Partial<PayloadInterface>>({});

  const { data: getListDepartment, isLoading: isLoadingListDepartment } =
    useQuery({
      queryKey: ["Mst_DepartmentControl_GetAllActive", org],
      queryFn: async () => {
        if (org !== "") {
          const response = await api.Mst_DepartmentControl_GetByOrgID(org);
          if (response.isSuccess) {
            return response?.Data?.Lst_Mst_Department ?? [];
          } else {
            showError({
              message: t(response.errorCode),
              debugInfo: response.debugInfo,
              errorInfo: response.errorInfo,
            });
            return [];
          }
        } else {
          return [];
        }
      },
    });

  const { data: getListOrg, isLoading: isLoadingListOrg } = useQuery({
    queryKey: ["Mst_NNTController_GetAllActive_Value"],
    queryFn: async () => {
      const response = await api.Mst_NNTController_GetAllActive();
      if (response.isSuccess) {
        return response.Data.Lst_Mst_NNT ?? [];
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
        return [];
      }
    },
  });

  // const { data, isLoading, refetch } = useQuery({
  //   queryKey: [""],
  //   queryFn: async () => {
  //     const response = await api.Mst_Customer_Search(formValue);
  //     if (response.isSuccess) {
  //       return response.DataList;
  //     } else {
  //       showError({
  //         message: t(response.errorCode),
  //         debugInfo: response.debugInfo,
  //         errorInfo: response.errorInfo,
  //       });
  //     }
  //   },
  // });
  const { data: getListAgent, isLoading: isLoadingListAgent } = useQuery({
    queryKey: ["Sys_User_GetAllActive"],
    queryFn: async () => {
      const response = await api.Sys_User_GetAllActive();
      if (response.isSuccess) {
        return response.DataList;
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
        return [];
      }
    },
  });

  const array: ColumnOptions[] = useMemo(() => {
    return [
      {
        dataField: "OrgIDNew",
        caption: t("OrgIDNew"),
        editorType: "dxSelectBox",
        label: {
          text: t("OrgIDNew"),
        },
        editorOptions: {
          dataSource: getListOrg,
          displayExpr: "NNTFullName",
          valueExpr: "OrgID",
          onValueChanged: (param: any) => {
            setOrg(param.value);
          },
        },
        validationRules: [requiredType],
      },
      {
        dataField: "DepartmentCode",
        caption: t("DepartmentCode"),
        editorType: "dxSelectBox",
        label: {
          text: t("DepartmentCode"),
        },
        editorOptions: {
          dataSource: getListDepartment ?? [],
          valueExpr: "DepartmentCode",
          displayExpr: "DepartmentName",
        },
        validationRules: [requiredType],
      },
      {
        dataField: "AgentCode",
        caption: t("AgentCode"),
        editorType: "dxSelectBox",
        label: {
          text: t("AgentCode"),
        },
        editorOptions: {
          dataSource: getListAgent,
          valueExpr: "UserCode",
          displayExpr: "UserName",
        },
      },
    ];
  }, [
    isLoadingListOrg,
    isLoadingListAgent,
    isLoadingListDepartment,
    getListDepartment,
  ]);

  const handleSave = async () => {
    const resp = formRef.current.instance.validate();
    if (resp.isValid) {
      const obj = {
        TicketID: dataRow[0].TicketID,
        OrgIDNew: formPayload?.OrgIDNew ?? "",
        DepartmentCode: formPayload?.DepartmentCode ?? "",
        AgentCode: formPayload?.AgentCode ?? "",
      };

      const response = await api.ET_Ticket_UpdateAgentCode(obj);
      if (response.isSuccess) {
        toast.success(t("ET_Ticket_UpdateAgentCode success! "));
        onCancel();
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    }
  };

  return (
    <Popup
      className="popup"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={`In_Charge_Of_Tranfer`}
      width={700}
      height={350}
      visible={popupVisible}
    >
      <LoadPanel
        visible={
          isLoadingListOrg || isLoadingListAgent || isLoadingListDepartment
        }
        showIndicator={true}
        showPane={true}
        container={".dx-viewport"}
        shadingColor="rgba(0,0,0,0.4)"
      />
      <div className="popup-content" style={{ height: 200 }}>
        <div className="tag flex items-center justify-between mb-4">
          <div className="left">
            <p className="strong">
              {t(
                `Hộ trợ tạo đơn hàng DMS cho khách hàng ${dataRow[0].CustomerCodeSys}`
              )}
            </p>
          </div>
          <div className="right">
            <p>{dataRow[0].TicketID}</p>
          </div>
        </div>
        <div className="form">
          <Form
            formData={formPayload}
            ref={formRef}
            labelLocation="left"
            // showRequiredMark={true}
            validationGroup="form-transformCustomer"
            className="form-transformCustomer flex items-center"
          >
            {array.map((item: any, index: number) => {
              return <SimpleItem key={`t-${index}`} {...item} />;
            })}
          </Form>
        </div>
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
