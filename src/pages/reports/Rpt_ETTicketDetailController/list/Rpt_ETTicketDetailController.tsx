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
import "./Rpt_ETTicketDetailController.scss";
import { useClientgateApi } from "@/packages/api";
import { useBankDealerGridColumns } from "../components/use-columns";

import { SearchPanelV2 } from "@/packages/ui/search-panel";

import { nanoid } from "nanoid";
import { CheckBox, DateBox, SelectBox } from "devextreme-react";

import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { format, set } from "date-fns";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { match } from "ts-pattern";
import { useToolbar } from "../components/toolbarItem";

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

export const Rpt_ETTicketDetailControllerPage = () => {
  const { t } = useI18n("Rpt_ETTicketDetailController");
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
    queryKey: ["Rpt_ETTicketDetailController", JSON.stringify(searchCondition)],
    queryFn: async () => {
      const resp = await api.Rpt_ETTicketDetailController_Search({
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
        .with("FlagSLANotResponding", () => {
          if (check) {
            ref.instance?.filter(["FlagSLANotResponding", "=", "1"]);
          } else {
            ref.instance?.clearFilter();
          }
        })
        .with("FlagTicketOutOfDate", () => {
          if (check) {
            ref.instance?.filter(["FlagTicketOutOfDate", "=", "1"]);
          } else {
            ref.instance?.filter(["FlagSLANotResponding", "=", "1"]);
            // ref.instance?.clearFilter();
          }
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
    console.log("a");
    const resp = await api.Rpt_ETTicketDetailController_ExportExcel();
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
    <AdminContentLayout className={"Rpt_ETTicketDetailController"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart
          onAddNew={handleAddNew}
          searchCondition={searchCondition}
        ></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <div className={"w-[230px]"}>
              <SearchPanelV2
                storeKey="Rpt_ETTicketDetailController_Search"
                conditionFields={formItems}
                data={searchCondition}
                onSearch={handleSearch}
              />
            </div>
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewCustomize
              cssClass={"Rpt_ETTicketDetailController_Grid"}
              isHiddenCheckBox={true}
              isLoading={isLoading}
              dataSource={
                data?.isSuccess ? data?.Data?.Rpt_ET_Ticket_Detail ?? [] : []
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
              // inlineEditMode="row"
              // showCheck="always"
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
              storeKey={"Rpt_ETTicketDetailController-columns"}
              locationCustomToolbar="center"
              customToolbarItems={[...toolbar]}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};