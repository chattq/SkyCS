import { AdminContentLayout } from "@layouts/admin-content-layout";

import { useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import { useAtom, useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";

import { useConfiguration } from "@packages/hooks";
import { IPopupOptions } from "devextreme-react/popup";
import { IFormOptions, IItemProps } from "devextreme-react/form";
import { flagEditorOptionsSearch, zip } from "@packages/common";
import { logger } from "@packages/logger";
import { toast } from "react-toastify";
import { showErrorAtom } from "@packages/store";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { HeaderPart } from "../components/header-part";
import { selectedItemsAtom } from "../components/store";
import "./Rpt_ETTicketSynthesisController.scss";
import { useClientgateApi } from "@/packages/api";
import { useBankDealerGridColumns } from "../components/use-columns";

import { SearchPanelV2 } from "@/packages/ui/search-panel";
import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  CommonAxisSettings,
  Grid,
  Export,
  Legend,
  Margin,
  Tooltip,
  Label,
  Format,
  ValueAxis,
} from "devextreme-react/chart";
import { nanoid } from "nanoid";
import { Button, CheckBox, DateBox, SelectBox } from "devextreme-react";

import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { format, set } from "date-fns";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { match } from "ts-pattern";
import { useToolbar } from "../components/toolbarItem";
import {
  architectureSources,
  groupTicketsByDate,
} from "../components/FormatDataTicket";

function generateMonthData(): Date[] {
  const startYear = 1990;
  const startMonth = 0; // January (0-based index)
  const currentYear = new Date().getFullYear();
  const monthData: Date[] = [];

  for (let year = currentYear; year >= startYear; year--) {
    const start = year === startYear ? startMonth : 11;
    for (let month = start; month >= 0; month--) {
      const date = set(new Date(), {
        year: year,
        month: month,
        date: 1,
      });
      if (date <= new Date()) {
        monthData.push(date);
      }
    }
  }
  return monthData;
}

const monthYearDs = generateMonthData();

export const Rpt_ETTicketSynthesisControllerPage = () => {
  const { t } = useI18n("Rpt_ETTicketSynthesisController");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);

  const [searchCondition, setSearchCondition] = useState<any>({
    AgentCodeConditionList: "",
    DepartmentCodeConditionList: "",
    OrgIDConditionList: "",
    TicketTypeConditionList: "",
    CustomerName: "",
    CustomerPhoneNo: "",
    CustomerEmail: "",
    CustomerCompany: "",
    TicketStatusConditionList: "",
    CreateDTimeUTCFrom: "",
    CreateDTimeUTCTo: "",
    LogLUDTimeUTCFrom: "",
    LogLUDTimeUTCTo: "",
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "Rpt_ETTicketSynthesisController",
      JSON.stringify(searchCondition),
    ],
    queryFn: async () => {
      const resp = await api.Rpt_ETTicketSynthesisController_Search({
        AgentCodeConditionList: searchCondition.AgentCodeConditionList
          ? searchCondition.AgentCodeConditionList.join(",")
          : "",
        DepartmentCodeConditionList: searchCondition.DepartmentCodeConditionList
          ? searchCondition.DepartmentCodeConditionList.join(",")
          : "",
        OrgIDConditionList: searchCondition.OrgIDConditionList
          ? searchCondition.OrgIDConditionList.join(",")
          : "",
        TicketTypeConditionList: searchCondition.TicketTypeConditionList
          ? searchCondition.TicketTypeConditionList.join(",")
          : "",
        CustomerName: searchCondition.CustomerName
          ? searchCondition.CustomerName
          : "",
        CustomerPhoneNo: searchCondition.CustomerPhoneNo
          ? searchCondition.CustomerPhoneNo
          : "",
        CustomerEmail: searchCondition.CustomerEmail
          ? searchCondition.CustomerEmail
          : "",
        CustomerCompany: searchCondition.CustomerCompany
          ? searchCondition.CustomerCompany
          : "",
        TicketStatusConditionList: searchCondition.TicketStatusConditionList
          ? searchCondition.TicketStatusConditionList.join(",")
          : "",
        CreateDTimeUTCFrom: searchCondition.CreateDTimeUTCFrom
          ? format(searchCondition.CreateDTimeUTCFrom, "yyyy-MM-dd")
          : "",
        CreateDTimeUTCTo: searchCondition.CreateDTimeUTCTo
          ? format(searchCondition.CreateDTimeUTCTo, "yyyy-MM-dd")
          : "",
        LogLUDTimeUTCFrom: searchCondition.ReportDTimeFrom
          ? format(searchCondition.ReportDTimeFrom, "yyyy-MM-dd")
          : "",
        LogLUDTimeUTCTo: searchCondition.LogLUDTimeUTCTo
          ? format(searchCondition.LogLUDTimeUTCTo, "yyyy-MM-dd")
          : "",
      });
      return resp;
    },
  });
  const { data: CampaignList } = useQuery(["listMST"], () =>
    api.Cpn_CampaignAgent_GetActive()
  );

  const { data: listUser } = useQuery(
    ["listAgent"],
    () => api.Sys_User_GetAllActive() as any
  );

  const { data: getListDepart, isLoading: isLoadingListDepart } = useQuery({
    queryKey: ["Mst_DepartmentControl_GetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_DepartmentControl_GetAllActive();
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
  const { data: getListEticketType, isLoading: isLoadingListEticketType } =
    useQuery({
      queryKey: ["Mst_TicketEstablishInfoApi_GetTicketType"],
      queryFn: async () => {
        const response = await api.Mst_TicketEstablishInfoApi_GetTicketType();
        if (response.isSuccess) {
          return response.Data.Lst_Mst_TicketType;
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

  const listStatus = [
    {
      label: t("NEW"),
      value: "NEW",
    },
    {
      label: t("OPEN"),
      value: "OPEN",
    },
    {
      label: t("PROCESSING"),
      value: "PROCESSING",
    },
    {
      label: t("ON HOLD"),
      value: "ON HOLD",
    },
    {
      label: t("WATING ON CUSTOMER"),
      value: "WATING ON CUSTOMER",
    },
    {
      label: t("WAITING ON THIRD PARTY"),
      value: "WAITING ON THIRD PARTY",
    },
    {
      label: t("SOLVED"),
      value: "SOLVED",
    },
    {
      label: t("CLOSED"),
      value: "CLOSED",
    },
  ];
  const formItems: any[] = [
    {
      dataField: "AgentCodeConditionList",
      caption: t("AgentCodeConditionList"),
      label: {
        text: t("Agent list"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        readOnly: false,
        searchEnabled: true,
        dataSource: listUser?.DataList ?? [],
        displayExpr: "UserName",
        valueExpr: "UserCode",
      },
    },
    {
      caption: t("DepartmentCodeConditionList"),
      dataField: "DepartmentCodeConditionList",
      label: {
        text: t("Team"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: getListDepart ?? [],
        valueExpr: "DepartmentCode",
        displayExpr: "DepartmentName",
        searchEnabled: true,
      },
    },
    {
      caption: t("OrgIDConditionList"),
      dataField: "OrgIDConditionList",
      label: {
        text: t("Chi nhánh"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        searchEnabled: true,
        dataSource: listUser?.DataList ?? [],
        displayExpr: "UserName",
        valueExpr: "UserCode",
      },
    },
    {
      caption: t("TicketTypeConditionList"),
      dataField: "TicketTypeConditionList",
      label: {
        text: t("Loại eTicket"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        searchEnabled: true,
        dataSource: getListEticketType ?? [],
        displayExpr: "CustomerTicketTypeName",
        valueExpr: "TicketType",
      },
    },
    {
      caption: t("TicketStatusConditionList"),
      dataField: "TicketStatusConditionList",
      label: {
        text: t("Trạng thái eTicket"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: listStatus,
        valueExpr: "value",
        displayExpr: "label",
        readOnly: false,
        placeholder: t("Select"),
      },
    },
    {
      caption: t("CustomerName"),
      dataField: "CustomerName",
      label: {
        text: t("Khách hàng"),
      },
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
    },
    {
      caption: t("CustomerCompany"),
      dataField: "CustomerCompany",
      label: {
        text: t("Công ty"),
      },
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
    },

    {
      dataField: "MonthReport",
      visible: true,
      caption: t("MonthReport"),
      label: {
        text: t("Thời gian tạo"),
      },
      editorType: "dxDateBox",
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <div className={"flex items-center"}>
            <DateBox
              className="pr-[3px]"
              {...editorOptions}
              type="date"
              displayFormat="yyyy-MM-dd"
              defaultValue={searchCondition.CreateDTimeUTCFrom}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("CreateDTimeUTCFrom", e.value);
              }}
            ></DateBox>
            -
            <DateBox
              {...editorOptions}
              type="date"
              displayFormat="yyyy-MM-dd"
              defaultValue={searchCondition.CreateDTimeUTCTo}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("CreateDTimeUTCTo", e.value);
              }}
            ></DateBox>
          </div>
        );
      },
      editorOptions: {
        placeholder: t("Input"),
        type: "date",
        displayFormat: "yyyy-MM-dd",
        dataSource: monthYearDs,
        displayExpr: (item: Date | null) => {
          if (!!item) {
            return format(item, "yyyy-MM-dd");
          }
          return "";
        },
      },
    },
    {
      dataField: "MonthUpdate",
      visible: true,
      caption: t("MonthUpdate"),
      label: {
        text: t("Thời gian cập nhật"),
      },
      editorType: "dxDateBox",
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <div className={"flex items-center"}>
            <DateBox
              className="pr-[3px]"
              {...editorOptions}
              type="date"
              displayFormat="yyyy-MM-dd"
              defaultValue={searchCondition.LogLUDTimeUTCFrom}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("LogLUDTimeUTCFrom", e.value);
              }}
            ></DateBox>
            -
            <DateBox
              {...editorOptions}
              type="date"
              displayFormat="yyyy-MM-dd"
              defaultValue={searchCondition.LogLUDTimeUTCTo}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("LogLUDTimeUTCTo", e.value);
              }}
            ></DateBox>
          </div>
        );
      },
      editorOptions: {
        placeholder: t("Input"),
        type: "date",
        displayFormat: "yyyy-MM-dd",
        dataSource: monthYearDs,
        displayExpr: (item: Date | null) => {
          if (!!item) {
            return format(item, "yyyy-MM-dd");
          }
          return "";
        },
      },
    },
  ];
  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    console.log("handleToggleSearchPanel", gridRef?.instance);
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleSearch = async (data: any) => {
    await refetch();
  };

  const handleExportExcel = async () => {
    const resp = await api.Rpt_ETTicketSynthesisController_ExportExcel({
      AgentCodeConditionList: searchCondition.AgentCodeConditionList
        ? searchCondition.AgentCodeConditionList.join(",")
        : "",
      DepartmentCodeConditionList: searchCondition.DepartmentCodeConditionList
        ? searchCondition.DepartmentCodeConditionList.join(",")
        : "",
      OrgIDConditionList: searchCondition.OrgIDConditionList
        ? searchCondition.OrgIDConditionList.join(",")
        : "",
      TicketTypeConditionList: searchCondition.TicketTypeConditionList
        ? searchCondition.TicketTypeConditionList.join(",")
        : "",
      CustomerName: searchCondition.CustomerName
        ? searchCondition.CustomerName
        : "",
      CustomerPhoneNo: searchCondition.CustomerPhoneNo
        ? searchCondition.CustomerPhoneNo
        : "",
      CustomerEmail: searchCondition.CustomerEmail
        ? searchCondition.CustomerEmail
        : "",
      CustomerCompany: searchCondition.CustomerCompany
        ? searchCondition.CustomerCompany
        : "",
      TicketStatusConditionList: searchCondition.TicketStatusConditionList
        ? searchCondition.TicketStatusConditionList.join(",")
        : "",
      CreateDTimeUTCFrom: searchCondition.CreateDTimeUTCFrom
        ? format(searchCondition.CreateDTimeUTCFrom, "yyyy-MM-dd")
        : "",
      CreateDTimeUTCTo: searchCondition.CreateDTimeUTCTo
        ? format(searchCondition.CreateDTimeUTCTo, "yyyy-MM-dd")
        : "",
      LogLUDTimeUTCFrom: searchCondition.ReportDTimeFrom
        ? format(searchCondition.ReportDTimeFrom, "yyyy-MM-dd")
        : "",
      LogLUDTimeUTCTo: searchCondition.LogLUDTimeUTCTo
        ? format(searchCondition.LogLUDTimeUTCTo, "yyyy-MM-dd")
        : "",
    });
    if (resp.isSuccess) {
      toast.success(t("Download Successfully"));
      window.location.href = resp.Data;
      return true;
    }
    showError({
      message: t(resp.errorCode),
      debugInfo: resp.debugInfo,
      errorInfo: resp.errorInfo,
    });
    throw new Error(resp.errorCode);
  };
  return (
    <AdminContentLayout className={"Rpt_ETTicketSynthesisController"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className={"w-full flex flex-col"}>
          <div className={"page-header w-full flex items-center p-2"}>
            <div className={"before px-4 mr-auto"}>
              <strong>{t("Report ETTicketSynthesis")}</strong>
            </div>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <div className={"w-[230px]"}>
              <SearchPanelV2
                storeKey="Rpt_ETTicketSynthesisController_Search"
                conditionFields={formItems}
                data={searchCondition}
                onSearch={handleSearch}
              />
            </div>
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <div>
              <div className="px-3 flex items-center py-3 gap-2">
                <Button
                  className="button_Search"
                  icon={"/images/icons/search.svg"}
                  onClick={handleToggleSearchPanel}
                />
                <div>
                  <Button
                    className="button_export"
                    text={t("EXPORT")}
                    onClick={handleExportExcel}
                  />
                </div>
              </div>
              <div className="flex justify-center gap-4 my-4">
                <div className="border bg-[#eeececb0] px-3 py-1 leading-6 rounded-md">
                  <p className="text-center text-[15px] font-bold">
                    {t("Tỉ lệ eTicket")}
                  </p>
                  <p className="text-center text-[15px] font-bold">
                    {t("đáp ứng SLA")}
                  </p>
                  <p className="text-center text-[20px] py-[15px] font-bold text-[#d7ca39]">
                    {data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                      ?.Rpt_ET_Ticket_Synthesis?.SLAResponseRate ?? 0}
                  </p>
                </div>
                <div className="border bg-[#eeececb0] px-2 py-1 leading-6 rounded-md">
                  <p className="text-[15px] font-bold">
                    {t("Thời gian phản hồi")}
                  </p>
                  <div className="flex items-center mt-[6px] gap-[3px]">
                    <div>
                      <li className="list-disc mb-[4px]">
                        {t("Lần đầu trung bình")}
                      </li>
                    </div>
                    <div>
                      <div className="text-[17px] mb-[4px] pl-1 font-bold text-[#d7ca39]">
                        {data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                          ?.Rpt_ET_Ticket_Synthesis?.AvgFirstResponse ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border bg-[#eeececb0] px-2 py-1 leading-6 rounded-md">
                  <p className="text-[15px] font-bold">
                    {t("Thời gian xử lý")}
                  </p>
                  <div className="flex items-center mt-[6px] gap-4">
                    <div>
                      <li className="list-disc mb-[4px]">{t("Ngắn nhất")}</li>
                      <li className="list-disc">{t("Trung bình")}</li>
                    </div>
                    <div>
                      <div className="text-[17px] mb-[4px] pl-1 font-bold text-[#d7ca39]">
                        {data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                          ?.Rpt_ET_Ticket_Synthesis?.MinProcessTime ?? 0}
                      </div>
                      <div className="text-[17px] pl-1 font-bold text-[#d7ca39]">
                        {data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                          ?.Rpt_ET_Ticket_Synthesis?.AvgProcessTime ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full px-4">
                <Chart
                  palette="Green Mist"
                  dataSource={groupTicketsByDate(
                    data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                      ?.Lst_Rpt_ET_Ticket_SynthesisDtl
                  )}
                >
                  {architectureSources.map((item) => (
                    <Series
                      color={item.color}
                      key={item.value}
                      valueField={item.value}
                      name={item.name}
                    />
                  ))}
                  <CommonSeriesSettings
                    argumentField="CreateDate"
                    type={"line"}
                  />
                  <CommonAxisSettings>
                    <Grid visible={true} />
                  </CommonAxisSettings>
                  <Margin bottom={20} />
                  <ArgumentAxis
                    allowDecimals={false}
                    axisDivisionFactor={60}
                    discreteAxisDivisionMode="crossLabels"
                  >
                    <Label>
                      <Format type="decimal" />
                    </Label>
                  </ArgumentAxis>
                  <Legend
                    verticalAlignment="top"
                    horizontalAlignment="center"
                    itemTextPosition="right"
                    columnItemSpacing={50}
                  />
                  <Export enabled={true} />
                  <Tooltip enabled={true} />
                </Chart>
              </div>
            </div>
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
