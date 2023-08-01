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
          // console.log("feedback ", response.Data);
          setListFeedback(response.Data.Lst_Mst_CustomerFeedBack);
          const Lst_Mst_CustomColumnCampaignType: DynamicField_Campaign[] =
            response?.Data?.Lst_Mst_CustomColumnCampaignType ?? [];
          let listField = [];
          const getMasterData: string[] =
            Lst_Mst_CustomColumnCampaignType.filter(
              (item: DynamicField_Campaign) => {
                return item.CampaignColCfgDataType === "MASTERDATA";
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
          CampaignCode: cpnCustomerData.CampaignTypeCode,
          CustomerPhoneNo: phoneNo.trim().split(" ").join(","),
        };

        const response = await api.Cpn_CampaignCustomer_GetCallHist(obj);
        console.log("response ", response);
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

    const arrayNormal: ColumnOptions[] = [
      {
        dataField: "CustomerFeedBack",
        editorType: "dxSelectBox",
        colSpan: 2,
        // cssClass: "w-60",
        editorOptions: {
          dataSource: listFeedBack,
          displayExpr: "CusFBName",
          valueExpr: "CusFBCode",
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
          {/* <label>KH phản hồi</label>
          <div className="input">
            <div className="flex">
              <SelectBox
                width={200}
                dataSource={listFeedBack}
                displayExpr="CusFBName"
                valueExpr="CusFBCode"
              />
              <span
                className="ml-5 mt-1"
                style={{ color: performStatus?.color }}
              >
                <i className={`${performStatus?.icon} mr-1`} />
                {performStatus?.Title}
              </span>
            </div>
          </div> */}
        </div>
        {/* <div className="from-group p-2">
          <label>Ghi chú</label>
          <div className="input">
            <TextBox placeholder="Nhập" />
          </div>
        </div> */}
        {/* <div className="w-full p-2">
          <strong>Thông tin chi tiết</strong>
        </div> */}
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

        {/* <div className="from-group p-2">
        <label>Ghi chú</label>
        <div className="input">
          <TextBox placeholder="Nhập" />
        </div>
      </div>
      <div className="from-group p-2">
        <label>Ghi chú</label>
        <div className="input">
          <TextBox placeholder="Nhập" />
        </div>
      </div>
      <div className="from-group p-2">
        <label>Ghi chú</label>
        <div className="input">
          <TextBox placeholder="Nhập" />
        </div>
      </div>

      <div className="w-full p-2">
        <strong>Lịch sử liên hệ</strong>
      </div> */}
        <div className="w-full p-2">
          <table className="tb-list w-full">
            <thead>
              <tr className="table-row table-row-header">
                <th className="table-header">Thời điểm gọi ra</th>
                <th className="table-header">Agent phụ trách</th>
                <th className="table-header">File ghi âm</th>
                <th className="table-header">Thời gian gọi</th>
                <th className="table-header">Trạng thái</th>
              </tr>
            </thead>
            {listCallHist && listCallHist.length > 0 && (
              <tbody>
                {listCallHist.map((item, idx) => {
                  return (
                    <>
                      {item && (
                        <tr className="table-row table-content" key={idx}>
                          <td className="table-content">
                            {item.CallOutDTimeUTC}
                          </td>
                          <td className="table-content">{item.AgentCode}</td>
                          <td className="table-content"></td>
                          <td className="table-content">{item.CallTime}</td>
                          <td className="table-content">{item.Remark}</td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </ScrollView>
    );
  }
);
