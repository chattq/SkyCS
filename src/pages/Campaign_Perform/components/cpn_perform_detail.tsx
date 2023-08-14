import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { mapEditorOption, mapEditorType } from "@/utils/customer-common";
import { showErrorAtom } from "@/packages/store";
import {
  Cpn_CampaignCustomerData,
  DynamicField_Campaign,
  FlagActiveEnum,
} from "@/packages/types";
import {
  Button,
  DropDownBox,
  Form,
  ScrollView,
  SelectBox,
  TextBox,
} from "devextreme-react";
import { useSetAtom } from "jotai";
import { forwardRef, useEffect, useMemo, useState } from "react";
import "../styles.scss";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { Group } from "devextreme-react/diagram";
import { ColumnOptions } from "@/types";
import { match } from "ts-pattern";
import HistoryCallTable from "./history-call-table";

export const Cpn_CampaignPerformDetail = forwardRef(
  (
    {
      cpnCustomerData,
      normalRef,
    }: { cpnCustomerData: Cpn_CampaignCustomerData; normalRef: any },
    ref: any
  ) => {
    useEffect(() => {
      if (cpnCustomerData.JsonCustomerInfo) {
        const formJson = JSON.parse(cpnCustomerData.JsonCustomerInfo);
        setFormData(formJson);
      }
      setFormNormal(cpnCustomerData);
    }, [cpnCustomerData]);

    const windowSize = useWindowSize();
    const { t } = useI18n("Cpn_CampaignPerformPage");
    const config = useConfiguration();
    const showError = useSetAtom(showErrorAtom);
    const { auth } = useAuth();

    const api = useClientgateApi();
    const [formData, setFormData] = useState({});
    const [formNormal, setFormNormal] = useState({});
    const [listFeedBack, setListFeedback] = useState<any[]>([]);
    const [listCallHist, setListCallHist] = useState<any[]>([]);
    const [dynamicFields, setDynamicFields] = useState<any[]>([]);

    const refetchDynamicFields = async () => {
      if (cpnCustomerData.CampaignTypeCode && !!auth.orgData) {
        const response = await api.Mst_CampaignType_GetByCode(
          cpnCustomerData.CampaignTypeCode,
          auth.orgData?.Id ?? ""
        );

        if (
          response.isSuccess &&
          response.Data &&
          response.Data.Lst_Mst_CustomColumnCampaignType
        ) {
          setListFeedback(response.Data.Lst_Mst_CustomerFeedBack);
          const Lst_Mst_CustomColumnCampaignType: DynamicField_Campaign[] =
            response?.Data?.Lst_Mst_CustomColumnCampaignType ?? [];
          let listField = [];
          const getMasterData: string[] =
            Lst_Mst_CustomColumnCampaignType.filter(
              (item: DynamicField_Campaign) => {
                return (
                  item.CampaignColCfgDataType === "MASTERDATASELECTMULTIPLE" ||
                  item.CampaignColCfgDataType === "MASTERDATA"
                );
              }
            ).map((item) => {
              return item.CampaignColCfgCodeSys ?? "";
            });

          const responseDynamicField =
            await api.Mst_CampaignColumnConfig_GetListOption(
              getMasterData ?? []
            );

          if (responseDynamicField.isSuccess) {
            if (
              responseDynamicField.DataList &&
              Array.isArray(responseDynamicField.DataList) &&
              responseDynamicField.DataList.length
            ) {
              const buildList = Lst_Mst_CustomColumnCampaignType.map((item) => {
                const check = responseDynamicField?.DataList.find(
                  (itemFieldDataMaster: any) => {
                    return (
                      itemFieldDataMaster.CampaignColCfgCodeSys ===
                      item.CampaignColCfgCodeSys
                    );
                  }
                );

                if (check) {
                  const checkValue = {
                    ...item,
                    dataSource: check.Lst_MD_OptionValue,
                    ColDataType: item.CampaignColCfgDataType,
                    ColCodeSys: item.CampaignColCfgCodeSys,
                    caption: item.CampaignColCfgName,
                    dataField: item.CampaignColCfgCodeSys,
                    visible: true,
                  };

                  return checkValue;
                } else {
                  return {
                    ...item,
                    ColDataType: item.CampaignColCfgDataType,
                    ColCodeSys: item.CampaignColCfgCodeSys,
                    caption: item.CampaignColCfgName,
                    dataField: item.CampaignColCfgCodeSys,
                  };
                }
              }).map((item) => {
                const dynamic =
                  responseDynamicField.DataList.reduce(
                    (acc: any, item: any) => {
                      return {
                        ...acc,
                        [`${item.CampaignColCfgCodeSys}`]:
                          item.Lst_MD_OptionValue,
                      };
                    },
                    {}
                  ) ?? [];
                return {
                  ...item,
                  editorType: mapEditorType(item.ColDataType),
                  editorOptions: {
                    ...mapEditorOption({
                      field: item,
                      listDynamic: dynamic,
                    }),
                    placeholder: "",
                  },
                  visible: true,
                };
              });

              setDynamicFields(buildList);
            }
          } else {
            showError({
              message: t(responseDynamicField.errorCode),
              debugInfo: responseDynamicField.debugInfo,
              errorInfo: responseDynamicField.errorInfo,
            });
          }
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
        }
      }
    };

    const refetchCallHist = async () => {
      if (cpnCustomerData.CampaignTypeCode && !!auth.orgData) {
        let phoneNo = "";
        if (cpnCustomerData.CustomerPhoneNo) {
          phoneNo = cpnCustomerData.CustomerPhoneNo;
        }
        if (cpnCustomerData.CustomerPhoneNo1) {
          phoneNo = phoneNo + " " + cpnCustomerData.CustomerPhoneNo1;
        }
        if (cpnCustomerData.CustomerPhoneNo2) {
          phoneNo = phoneNo + " " + cpnCustomerData.CustomerPhoneNo2;
        }

        const obj = {
          CampaignCode: cpnCustomerData.CampaignCode,
          CustomerPhoneNo: phoneNo.trim().split(" ").join(","),
        };

        const response = await api.Cpn_CampaignCustomer_GetCallHist(obj);
        // if (response.isSuccess && response.Data) {
        //   setListCallHist(response.Data);
        // }
        if (response.isSuccess) {
          setListCallHist(response.Data);
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
        }
      }
    };

    useEffect(() => {
      refetchCallHist();
      refetchDynamicFields();
    }, []);

    const CustomizeCampaign = ({ code }: { code: string }) => {
      let icon = "";
      let color = "#CFB929";
      match(code)
        .with("PENDING", () => {
          icon = "";
          color = "#CFB929";
        })
        .with("DONE", () => {
          icon = "ic-status-done";
          color = "#0FBC2B";
        })
        .with("FAILED", () => {
          icon = "ic-status-failed";
          color = "#D62D2D";
        })
        .with("NOANSWER", () => {
          icon = "ic-status-noanswer";
          color = "#00BEA7";
        })
        .with("CALLAGAIN", () => {
          icon = "ic-status-callagain";
          color = "#8C62D1";
        })
        .with("NOANSWERRETRY", () => {
          icon = "ic-status-noanswerretry";
          color = "#E48203";
        })
        .with("DONOTCALL", () => {
          icon = "ic-status-donotcall";
          color = "#777";
        })
        .with("FAILEDRETRY", () => {
          icon = "ic-status-failedretry";
          color = "#298EF2";
        })
        .otherwise(() => {});

      return (
        <span
          style={{
            color: color,
          }}
        >
          <i className={`${icon}`} />{" "}
          {code === "" || !code ? t("PENDING") : t(code)}
        </span>
      );
    };

    const arrayNormal: ColumnOptions[] = [
      {
        dataField: "CustomerFeedBack",
        editorType: "dxSelectBox",
        colSpan: 2,
        editorOptions: {
          dataSource: listFeedBack,
          displayExpr: "CusFBName",
          valueExpr: "CusFBCode",
        },
        render: (param: any) => {
          const { component: formComponent, dataField } = param;
          return (
            <div className="flex align-items-center">
              <SelectBox
                dataSource={listFeedBack}
                defaultValue={formNormal?.CustomerFeedBack ?? ""}
                displayExpr="CusFBName"
                valueExpr="CusFBCode"
                onValueChanged={(data: any) => {
                  formComponent.updateData(dataField, data.value);
                }}
              ></SelectBox>
              <span
                style={{
                  color: "#E48203",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
                className="pl-5"
              >
                <CustomizeCampaign
                  code={formNormal?.CampaignCustomerStatus ?? ""}
                />
                {/* {formNormal?.CampaignCustomerStatus ?? ""} */}
              </span>
            </div>
          );
        },
      },
      {
        dataField: "Remark",
        editorType: "dxTextBox",
        editorOptions: {},
        colSpan: 2,
      },
    ];

    return (
      <ScrollView style={{ height: windowSize.height - 150 }}>
        <div className="from-group p-2">
          <Form
            ref={normalRef}
            formData={formNormal}
            labelLocation="left"
            colCount={2}
          >
            {arrayNormal.map((item: any, index: number) => {
              if (item.dataField === "CustomerFeedBack") {
                return <SimpleItem {...item} key={`normal-${index}`} />;
              }
              return <SimpleItem {...item} key={`normal-${index}`} />;
            })}
          </Form>
        </div>
        <Form ref={ref} formData={formData} labelLocation="left">
          <GroupItem caption={`${t("Info's Detail")}`} cssClass="pl-2 pr-2">
            {dynamicFields.map((item: any, index: any) => {
              return (
                <SimpleItem
                  cssClass=""
                  dataField={item.ColCodeSys}
                  label={{
                    text: t(`${item.CampaignColCfgName}`),
                  }}
                  {...item}
                  key={index}
                />
              );
            })}
          </GroupItem>
        </Form>
        <HistoryCallTable
          listCallHist={listCallHist}
          dynamicFields={dynamicFields}
          dataDynamic={formData}
        />
      </ScrollView>
    );
  }
);
