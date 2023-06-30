import { useI18n } from "@/i18n/useI18n";
import { ColumnOptions } from "@/types";
import { Form, SelectBox, TextBox } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CampaignTypeAtom,
  currentInfo,
  flagSelectorAtom,
  listCampaignAgentAtom,
  listCampaignAtom,
} from "../../store";
import "./../../../style.scss";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { showErrorAtom } from "@/packages/store";
import { FlagActiveEnum } from "@/packages/types";
import { useAuth } from "@/packages/contexts/auth";
import { requiredType } from "@/packages/common/Validation_Rules";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { useParams } from "react-router-dom";

const Cpn_Campaign_Info_Common = forwardRef(
  ({ listCustomerRef }: any, ref: ForwardedRef<any>) => {
    const { t } = useI18n("Cpn_Campaign_Info_Common");
    const formData = useAtomValue(currentInfo);
    const flagSelector = useAtomValue(flagSelectorAtom);
    const param = useParams();
    const { auth } = useAuth();
    const api = useClientgateApi();
    const showError = useSetAtom(showErrorAtom);
    const campaignType = useAtomValue(CampaignTypeAtom);
    const setListCampaignAgent = useSetAtom(listCampaignAgentAtom);
    const currentCampaign = useAtomValue(currentInfo);

    const { data: listCampaignType, isLoading: isLoadingCapaignType } =
      useQuery({
        queryKey: ["listCampaginType"],
        queryFn: async () => {
          const response = await api.Mst_CampaignType_Search({
            CampaignTypeDesc: "",
            CampaignTypeName: "",
            Ft_PageIndex: 0,
            KeyWord: "",
            FlagActive: FlagActiveEnum.Active,
            Ft_PageSize: 999999,
          });

          if (response.isSuccess) {
            return response.DataList ?? [];
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

    const { data: listCampaignAgent, isLoading: isLoadingCapaignAgent } =
      useQuery({
        queryKey: ["listCampaginAgent"],
        queryFn: async () => {
          const response = await api.Sys_User_GetAllActive();
          if (response.isSuccess) {
            setListCampaignAgent(
              (response.DataList ?? []).filter((item) =>
                currentCampaign.CampaignAgent.includes(item.UserCode)
              )
            );
            return response.DataList;
          } else {
            showError({
              message: t(response.errorCode),
              debugInfo: response.debugInfo,
              errorInfo: response.errorInfo,
            });
          }
        },
      });

    useEffect(() => {
      // if (!isLoadingCapaignAgent) {
      //   const customerListCampaignCustomer = listCampaign.map((item) => {
      //     let userName = "";
      //     const check = listCampaignAgent?.find((itemAgent) => {
      //       return itemAgent.UserCode === item.AgentCode;
      //     });
      //     if (check) {
      //       userName = check.UserName;
      //     }
      //     return {
      //       ...item,
      //       AgentName: userName,
      //     };
      //   });
      //   // setListCampaign(customerListCampaignCustomer)
      // }
    }, [param?.CampaignCode]);

    const { data: listFeedBack, isLoading: isLoadingFeedBack } = useQuery({
      queryKey: ["listFeedBack", campaignType],
      queryFn: async () => {
        if (campaignType !== "") {
          const response = await api.Mst_CampaignType_GetByCode(
            campaignType,
            auth.orgData?.Id ?? ""
          );
          if (response.isSuccess) {
            return response.Data?.Lst_Mst_CustomerFeedBack;
          } else {
            showError({
              message: t(response.errorCode),
              debugInfo: response.debugInfo,
              errorInfo: response.errorInfo,
            });
          }
        } else {
          return [];
        }
      },
    });

    const showComponent = () => {
      if (
        isLoadingCapaignAgent ||
        isLoadingCapaignType ||
        !listCampaignType ||
        !listCampaignAgent
      ) {
        return <>loading</>;
      } else {
        return (
          <FormInfoCommon
            ref={listCustomerRef}
            listCampaignType={listCampaignType ?? []}
            listCampaignAgent={listCampaignAgent ?? []}
            formData={formData}
          />
        );
      }
    };

    return (
      <>
        {showComponent()}
        {!isLoadingFeedBack && listFeedBack?.length && (
          <div className="mt-5">
            <p className="mb-2">{t("FeedBack of Customer")}</p>
            {listFeedBack.map((item, index: number) => {
              return (
                <TextBox
                  key={`feedback-${index}`}
                  style={{ width: "300px", marginBottom: "10px" }}
                  defaultValue={item.CusFBName}
                  disabled={true}
                ></TextBox>
              );
            })}
          </div>
        )}
      </>
    );
  }
);

interface FormInfoCommonProps {
  formData: any;
  listCampaignType: any[];
  listCustomerRef: any[];
  listCampaignAgent: any[];
}

const FormInfoCommon = forwardRef(
  (
    { formData, listCampaignType, listCampaignAgent }: FormInfoCommonProps,
    ref: any
  ) => {
    const { t } = useI18n("Cpn_Campaign_Info_Common");
    const setCampaignTypeAtom = useSetAtom(CampaignTypeAtom);
    const setListCampaignAgent = useSetAtom(listCampaignAgentAtom);
    const flagSelector = useAtomValue(flagSelectorAtom);
    const [isShow, setIsShow] = useState(false);
    const arrayStatus = [
      {
        item: t("PENDING"),
        value: "PENDING",
      },
      {
        item: t("APPROVE"),
        value: "APPROVE",
      },
      {
        item: t("STARTED"),
        value: "STARTED",
      },
      {
        item: t("PAUSED"),
        value: "PAUSED",
      },
      {
        item: t("CONTINUED"),
        value: "CONTINUED",
      },
      {
        item: t("FINISH"),
        value: "FINISH",
      },
    ];

    const columns: ColumnOptions[] = [
      {
        dataField: "CampaignCode", // mã chiến dịch
        caption: t("CampaignCode"),
        editorType: "dxTextBox",
        colSpan: 2,
        cssClass: "w-50",
        visible: flagSelector !== "add",
        editorOptions: {
          readOnly: true,
        },
      },
      {
        dataField: "CampaignTypeCode", // Loại chiến dich
        caption: t("CampaignTypeCode"),
        editorType: "dxSelectBox",
        colSpan: 2,
        cssClass: "w-50",
        editorOptions: {
          readOnly: flagSelector === "detail",
          placeholder: t("Input"),
          dataSource: listCampaignType,
          displayExpr: "CampaignTypeName",
          valueExpr: "CampaignTypeCode",
          onSelectionChanged: (newValue: any) => {
            setCampaignTypeAtom(newValue.selectedItem.CampaignTypeCode);
          },
        },
        validationRules: [requiredType],
      },
      {
        dataField: "CampaignName", // tên chiến dịch
        caption: t("CampaignName"),
        editorType: "dxTextBox",
        editorOptions: {
          readOnly: flagSelector === "detail",
          placeholder: t("Input"),
        },
        colSpan: 2,
        validationRules: [requiredType],
      },
      {
        dataField: "CampaignDesc", // Mô tả
        caption: t("CampaignDesc"),
        editorType: "dxTextBox",
        editorOptions: {
          readOnly: flagSelector === "detail",
          placeholder: t("Input"),
        },
        colSpan: 2,
      },
      {
        dataField: "uploadFiles", // file đính kèm
        caption: t("uploadFiles"),
        colSpan: 2,
        label: {
          location: "left",
          text: "Upload files",
        },
        editorOptions: {
          readOnly: flagSelector === "detail",
        },
        render: (param: any) => {
          const { component: formComponent, dataField } = param;
          return (
            <UploadFilesField
              formInstance={formComponent}
              readonly={flagSelector === "detail"}
              controlFileInput={["DOCX", "PDF", "JPG", "PNG", "XLSX"]}
              onValueChanged={(files: any) => {
                formComponent.updateData(dataField, files);
              }}
            />
          );
        },
      },
      {
        dataField: "CampaignAgent", // Agent Phụ trách
        caption: t("CampaignAgent"),
        editorType: "dxTagBox",
        colSpan: 2,
        editorOptions: {
          readOnly: flagSelector === "detail",
          dataSource: listCampaignAgent,
          displayExpr: "UserName",
          valueExpr: "UserCode",
          showSelectionControls: true,
          searchEnabled: true,
          onValueChanged: ({ value }: any) => {
            const selectedItems = listCampaignAgent?.filter((item: any) => {
              const found = value.filter(
                (item2: any) => item2 === item.UserCode
              );
              return found && found.length > 0;
            });
            setListCampaignAgent(selectedItems ?? []);
            ref.current.instance.repaint();
          },
        },
        validationRules: [requiredType],
      },
      {
        dataField: "CallRate", // Định mức gọi ra
        caption: t("CallRate"),
        colSpan: 1,
        editorType: "dxSelectBox",
        editorOptions: {
          readOnly: flagSelector === "detail",
          placeholder: t("Select"),
          dataSource: [
            {
              value: "1",
              label: t("All Agent"),
            },
            {
              value: "0",
              label: t("Select Single"),
            },
          ],
          displayExpr: "label",
          valueExpr: "value",
          onValueChanged: (newValue: any) => {
            setIsShow(newValue.value === "1");
          },
        },
      },
      {
        dataField: "DTimeStart", // Thời gian bắt đầu
        caption: t("DTimeStart"),
        editorType: "dxDateBox",
        colSpan: 1,
        editorOptions: {
          readOnly: flagSelector === "detail",
          type: "date",
          displayFormat: "yyyy-MM-dd",
        },
        validationRules: [requiredType],
      },
      {
        dataField: "MaxCall", // Số lần gọi tối đa
        caption: t("MaxCall"),
        colSpan: 1,
        editorType: "dxNumberBox",
        editorOptions: {
          readOnly: flagSelector === "detail",
          placeholder: t("Input"),
        },
      },
      {
        dataField: "DTimeEnd", // Thời gian kết thúc
        caption: t("DTimeEnd"),
        editorType: "dxDateBox",
        colSpan: 1,
        editorOptions: {
          readOnly: flagSelector === "detail",
          type: "date",
          displayFormat: "yyyy-MM-dd",
        },
        validationRules: [requiredType],
      },
      {
        dataField: "CampaignStatus", // Trạng thái
        caption: t("CampaignStatus"),
        editorType: "dxSelectBox",
        colSpan: 1,
        visible: flagSelector !== "add",
        editorOptions: {
          readOnly: flagSelector === "detail",
          dataSource: arrayStatus,
          displayExpr: "item",
          placeholder: t("Select"),
          valueExpr: "value",
        },
      },
    ];

    const formRef = useRef(null);

    let newColumn = [
      ...columns,
      {
        dataField: "CustomerRate", // Số lần KH định mức
        caption: t("CustomerRate"),
        editorType: "dxNumberBox",
        colSpan: 1,
        visible: isShow,
        editorOptions: {
          readOnly: flagSelector === "detail" ? true : false,
          placeholder: t("Input"),
        },
      },
    ];

    return (
      <Form
        onFieldDataChanged={() => {}}
        formData={formData}
        ref={formRef}
        validationGroup="campaignForm"
      >
        <GroupItem colCount={2} caption="">
          {newColumn.map((item: ColumnOptions, index: number) => {
            return <SimpleItem key={index} {...item} />;
          })}
        </GroupItem>
      </Form>
    );
  }
);

export default Cpn_Campaign_Info_Common;
