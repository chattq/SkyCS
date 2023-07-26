import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  BaseGridView,
  ColumnOptions,
  GridViewPopup,
} from "@packages/ui/base-gridview";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useI18n } from "@/i18n/useI18n";
import { useAtom, useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import {
  FlagActiveEnum,
  Mst_CustomerGroupData,
  Mst_Area,
  SearchParam,
} from "@packages/types";
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
import { groupTicketsByDate } from "../components/FormatDataTicket";

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

  const [searchCondition] = useState<any>({
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
          ? searchCondition.AgentCodeConditionList
          : "",
        DepartmentCodeConditionList: searchCondition.DepartmentCodeConditionList
          ? searchCondition.DepartmentCodeConditionList
          : "",
        OrgIDConditionList: searchCondition.OrgIDConditionList
          ? searchCondition.OrgIDConditionList
          : "",
        TicketTypeConditionList: searchCondition.TicketTypeConditionList
          ? searchCondition.TicketTypeConditionList
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
          ? searchCondition.TicketStatusConditionList
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

  const columns = useBankDealerGridColumns({
    data: data?.Data?.Rpt_Cpn_CampaignResultCall || [],
  });

  const formItems: IItemProps[] = useMemo(() => {
    return [
      {
        dataField: "CreateDTimeUTCFrom",
        caption: t("CreateDTimeUTCFrom"),
        label: {
          text: t("CreateDTimeUTCFrom"),
        },
        editorType: "dxDateBox",
        editorOptions: {
          type: "date",
          format: "yyyy-MM-dd",
        },
      },
      {
        caption: t("CampaignCodeConditionList"),
        dataField: "CampaignCodeConditionList",
        label: {
          text: t("Campaign list"),
        },
        editorType: "dxTagBox",
        editorOptions: {
          dataSource: CampaignList?.Data ?? [],
          displayExpr: "CampaignName",
          valueExpr: "CampaignCode",
          placeholder: t("Input"),
          searchEnabled: true,
        },
      },
      {
        caption: t("AgentCodeConditionList"),
        dataField: "AgentCodeConditionList",
        label: {
          text: t("Agent list"),
        },
        editorType: "dxTagBox",
        editorOptions: {
          placeholder: t("Input"),
          searchEnabled: true,
          dataSource: listUser?.DataList ?? [],
          displayExpr: "UserName",
          valueExpr: "UserCode",
        },
      },
    ];
  }, []);

  const handleDeleteRows = async (rows: any) => {
    console.log(175, rows);
  };
  const [checkTab, setCheckTab] = useState(false);

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    // gridRef.current._instance.addRow();
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    console.log("handleToggleSearchPanel", gridRef?.instance);
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleCancel = () => {
    // console.log("cancel viewing item");
    gridRef.current?.instance?.cancelEditData();
  };
  const handleEdit = (rowIndex: number) => {
    gridRef.current?.instance?.editRow(rowIndex);
  };
  const handleSubmit = () => {
    gridRef.current?.instance?.saveEditData();
  };

  const handleEditorPreparing = (e: EditorPreparingEvent) => {
    // use this function to control how the editor looks like

    if (e.dataField) {
      if (["OrgID", "AreaCode"].includes(e.dataField!)) {
        e.editorOptions.readOnly = !e.row?.isNewRow;
      }
    }
  };
  const handleSetField = useCallback(
    (titleButton: string, ref: any, check: any) => {
      match(titleButton)
        .with("All", () => {
          ref.instance?.clearFilter();
        })
        .with("FlagSLANotResponding", () => {
          // console.log(242, check);
          // if(check.component.storedClasses === "FlagTicketOutOfDate" &&) {

          // }
          ref.instance?.filter(["FlagSLANotResponding", "=", "1"]);
        })
        .with("FlagTicketOutOfDate", () => {
          // console.log(246, check);
          ref.instance?.filter(["FlagTicketOutOfDate", "=", "1"]);
        })
        .otherwise(() => {});
    },
    [isLoading]
  );
  const toolbar = useToolbar({
    data: data?.Data?.Rpt_ET_Ticket_Detail ?? [],
    onSetStatus: handleSetField,
  });
  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Rpt_CpnCampaignStatisticCall Information"),
    className: "bank-dealer-information-popup",
    toolbarItems: [
      {
        toolbar: "bottom",
        location: "after",
        widget: "dxButton",
        options: {
          text: t("Save"),
          stylingMode: "contained",
          type: "default",
          onClick: handleSubmit,
        },
      },
      {
        toolbar: "bottom",
        location: "after",
        widget: "dxButton",
        options: {
          text: t("Cancel"),
          type: "default",
          onClick: handleCancel,
        },
      },
    ],
  };

  const onModify = async (id: any, data: Partial<Mst_Area>) => {};
  // Section: CRUD operations
  const onCreate = async (data: Mst_Area & { __KEY__: string }) => {};

  const onDelete = async (id: any) => {
    // const resp = await api.Mst_BankDealer_Delete(id);
    // if (resp.isSuccess) {
    //   toast.success(t("Delete Successfully"));
    //   await refetch();
    //   return true;
    // }
    // showError({
    //   message: t(resp.errorCode),
    //   debugInfo: resp.debugInfo,
    //   errorInfo: resp.errorInfo,
    // });
    // throw new Error(resp.errorCode);
  };
  const handleSavingRow = (e: any) => {
    // console.log(e);
    // stop grid behaviour
    if (e.changes && e.changes.length > 0) {
      // we don't enable batch mode, so only 1 change at a time.
      const { type } = e.changes[0];
      if (type === "remove") {
        const id = e.changes[0].key;
        e.promise = onDelete(id);
      } else if (type === "insert") {
        const data = e.changes[0].data!;
        e.promise = onCreate(data);
      } else if (type === "update") {
        e.promise = onModify(e.changes[0].key, e.changes[0].data!);
      }
    }
    e.cancel = true;
  };
  // End Section: CRUD operations

  const handleSearch = async () => {
    await refetch();
  };
  const handleOnEditRow = (e: any) => {
    const { row, column } = e;
    handleEdit(row.rowIndex);
  };
  const handleEditRowChanges = () => {};
  const handleExportExcel = async () => {
    const resp = await api.Rpt_ETTicketSynthesisController_ExportExcel();
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
  const architectureSources = [
    { value: "New", name: "Create" },
    { value: "Closed", name: "Closed" },
    { value: "Open", name: "Open" },
  ];

  return (
    <AdminContentLayout className={"Rpt_ETTicketSynthesisController"}>
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
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
                <div className="border bg-[#eeececb0] px-2 py-1 leading-6 rounded-md">
                  <p className="text-center text-[15px] font-bold">
                    {t("Tỉ lệ eTicket đáp ứng SLA")}
                  </p>
                  <p className="text-center text-[20px] py-[15px] font-bold text-[#d7ca39]">
                    {
                      data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                        ?.Rpt_ET_Ticket_Synthesis?.SLAResponseRate
                    }
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
                      <li className="list-disc">{t("Trung bình")}</li>
                    </div>
                    <div>
                      <div className="text-[17px] mb-[4px] pl-1 font-bold text-[#d7ca39]">
                        {
                          data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                            ?.Rpt_ET_Ticket_Synthesis?.AvgFirstResponse
                        }
                      </div>
                      <div className="text-[17px] pl-1 font-bold text-[#d7ca39]">
                        {
                          data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                            ?.Rpt_ET_Ticket_Synthesis?.AvgProcessTime
                        }
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
                        {
                          data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                            ?.Rpt_ET_Ticket_Synthesis?.MinProcessTime
                        }
                      </div>
                      <div className="text-[17px] pl-1 font-bold text-[#d7ca39]">
                        {
                          data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                            ?.Rpt_ET_Ticket_Synthesis?.MaxProcessTime
                        }
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
                      key={item.value}
                      valueField={item.value}
                      name={item.name}
                    />
                  ))}
                  <CommonSeriesSettings
                    argumentField="CreateDate"
                    type={"spline"}
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
