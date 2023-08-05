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
import "./Rpt_SLAController.scss";
import { useClientgateApi } from "@/packages/api";
import { useBankDealerGridColumns } from "../components/use-columns";

import { SearchPanelV2 } from "@/packages/ui/search-panel";

import { nanoid } from "nanoid";
import {
  Button,
  CheckBox,
  DateBox,
  DateRangeBox,
  SelectBox,
} from "devextreme-react";
import PieChart, {
  Series,
  Label,
  Connector,
  Size,
  Export,
  Legend,
} from "devextreme-react/pie-chart";

import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { format, set } from "date-fns";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { match } from "ts-pattern";
import { useToolbar } from "../components/toolbarItem";

import { ReportLayout } from "@/packages/layouts/report-layout/report-content-layout";
import { ReportHeaderLayout } from "@/packages/layouts/report-layout/report-header-layout";
import { calculateSLAStats } from "../components/FormatDataSLA";
import { getFirstDateOfMonth } from "@/components/ulti";

export const Rpt_SLAControllerPage = () => {
  const { t } = useI18n("Rpt_SLAController");
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
    MonthReport: [null, null],
  });
  const msInDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const startDate = new Date(now.getTime() - msInDay * 3);
  const endDate = new Date(now.getTime());

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Rpt_SLAController", JSON.stringify(searchCondition)],
    queryFn: async () => {
      const resp = await api.Rpt_SLAController_Search({
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
        TicketCustomTypeConditionList:
          searchCondition.TicketCustomTypeConditionList
            ? searchCondition.TicketCustomTypeConditionList.join(",")
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
        CreateDTimeUTCFrom: searchCondition.MonthReport[0]
          ? format(searchCondition.MonthReport[0], "yyyy-MM-dd")
          : getFirstDateOfMonth(endDate),
        CreateDTimeUTCTo: searchCondition.MonthReport[1]
          ? format(searchCondition.MonthReport[1], "yyyy-MM-dd")
          : format(endDate, "yyyy-MM-dd"),
      });
      return resp;
    },
  });
  const { data: CampaignList } = useQuery(["listMST"], () =>
    api.Cpn_CampaignAgent_GetActive()
  );
  const { data: listOrgID } = useQuery(["listOrgID"], () =>
    api.Mst_NNTController_GetAllActive()
  );

  const columns = useBankDealerGridColumns({
    data: data?.Data?.Rpt_Cpn_CampaignResultCall || [],
  });

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
  const { data: MstTicketEstablishInfo } = useQuery(
    ["MstTicketEstablishInfoType"],
    api.Mst_TicketEstablishInfoApi_GetAllInfo
  );
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
        dataSource: listOrgID?.Data?.Lst_Mst_NNT ?? [],
        displayExpr: "NNTFullName",
        valueExpr: "OrgID",
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
      caption: t("TicketCustomTypeConditionList"),
      dataField: "TicketCustomTypeConditionList",
      label: {
        text: t("Phân loại tùy chọn"),
      },
      editorType: "dxSelectBox",
      editorOptions: {
        searchEnabled: true,
        dataSource:
          MstTicketEstablishInfo?.Data?.Lst_Mst_TicketCustomType ?? [],
        valueExpr: "TicketCustomType",
        displayExpr: "AgentTicketCustomTypeName",
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
        placeholder: t("Input"),
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
      editorType: "dxDateRangeBox",
      editorOptions: {
        type: "date",
        displayFormat: "yyyy-MM-dd",
      },
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <DateRangeBox
            displayFormat=" yyyy-MM-dd"
            defaultStartDate={
              searchCondition.MonthReport[0] || getFirstDateOfMonth(endDate)
            }
            defaultEndDate={searchCondition.MonthReport[1] || endDate}
            showClearButton={true}
            useMaskBehavior={true}
            openOnFieldClick={true}
            labelMode="hidden"
            onValueChanged={(e: any) => {
              formRef.instance().updateData("MonthReport", e.value);
            }}
          />
        );
      },
    },
  ];

  const handleDeleteRows = async (rows: any) => {
    console.log(175, rows);
  };

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
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

  const handleEditRowChanges = () => {};
  const handleExportExcel = async () => {
    const resp = await api.Rpt_SLAController_ExportExcel({
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
      TicketCustomTypeConditionList:
        searchCondition.TicketCustomTypeConditionList
          ? searchCondition.TicketCustomTypeConditionList.join(",")
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
      CreateDTimeUTCFrom: searchCondition.MonthReport[0]
        ? format(searchCondition.MonthReport[0], "yyyy-MM-dd")
        : getFirstDateOfMonth(endDate),
      CreateDTimeUTCTo: searchCondition.MonthReport[1]
        ? format(searchCondition.MonthReport[1], "yyyy-MM-dd")
        : format(endDate, "yyyy-MM-dd"),
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
    <ReportHeaderLayout className={"Rpt_SLAController"}>
      <ReportHeaderLayout.Slot name={"Header"}>
        <div className={"w-full flex flex-col"}>
          <div className={"page-header w-full flex items-center p-2"}>
            <div className={"before px-4 mr-auto"}>
              <strong>{t("Report KPI SLA")}</strong>
            </div>
          </div>
        </div>
      </ReportHeaderLayout.Slot>
      <ReportHeaderLayout.Slot name={"Content"}>
        <div className="flex h-full pt-1 justify-between">
          <div className="w-[calc(100%_-_288px)] h-full">
            <ContentSearchPanelLayout>
              <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
                <SearchPanelV2
                  storeKey="ReportCall_Search"
                  conditionFields={formItems}
                  data={searchCondition}
                  onSearch={handleSearch}
                />
              </ContentSearchPanelLayout.Slot>
              <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
                <GridViewCustomize
                  cssClass={"Rpt_SLAController"}
                  isHiddenCheckBox={true}
                  isLoading={isLoading}
                  dataSource={
                    data?.isSuccess ? data?.Data?.Lst_Rpt_SLA ?? [] : []
                  }
                  columns={columns}
                  keyExpr={["TicketID"]}
                  popupSettings={popupSettings}
                  formSettings={{}}
                  onReady={(ref) => (gridRef = ref)}
                  allowSelection={true}
                  onSelectionChanged={handleSelectionChanged}
                  onSaveRow={handleSavingRow}
                  onEditorPreparing={handleEditorPreparing}
                  allowInlineEdit={true}
                  onEditRowChanges={handleEditRowChanges}
                  onDeleteRows={handleDeleteRows}
                  isSingleSelection={false}
                  toolbarItems={[
                    {
                      location: "before",
                      widget: "dxButton",
                      options: {
                        icon: "search",
                        onClick: handleToggleSearchPanel,
                      },
                    },
                    {
                      location: "before",
                      widget: "dxButton",
                      options: {
                        text: t("Export"),
                        onClick: handleExportExcel,
                        stylingMode: "contained",
                        type: "default",
                      },
                    },
                  ]}
                  storeKey={"Rpt_SLAController-columns"}
                  locationCustomToolbar="center"
                />
              </ContentSearchPanelLayout.Slot>
            </ContentSearchPanelLayout>
          </div>
          <div className="h-full mt-[38px] w-1 border-t bg-[#f5f5f5] shadow-md" />
          <div className="w-[280px] mt-[38px] shadow-md border-t">
            <div className="mt-[20px] mb-5">
              <p className="text-center font-bold text-[15px] mb-[5px]">
                {t("Pie tỉ lệ % eTicket đạt KPI về")}
              </p>
              <p className="text-center font-bold text-[15px]">
                {t("SLA / Tổng số eTicket")}
              </p>
            </div>
            <div className="flex justify-center">
              <PieChart
                id="pie"
                type="doughnut"
                dataSource={calculateSLAStats(data?.Data?.Lst_Rpt_SLA)}
                palette="Bright"
                innerRadius={0.5}
                className="h-[330px]"
              >
                <Series argumentField="name" valueField="QtySLA" />
                <Size width={200} />
                <Legend
                  orientation="horizontal"
                  itemTextPosition="right"
                  horizontalAlignment="center"
                  verticalAlignment="bottom"
                  columnCount={1}
                />
                {/* <Export enabled={true} /> */}
              </PieChart>
            </div>
          </div>
        </div>
      </ReportHeaderLayout.Slot>
    </ReportHeaderLayout>
  );
};
