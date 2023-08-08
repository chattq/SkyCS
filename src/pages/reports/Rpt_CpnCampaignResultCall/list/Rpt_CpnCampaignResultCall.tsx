import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  BaseGridView,
  ColumnOptions,
  GridViewPopup,
} from "@packages/ui/base-gridview";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
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
import "./Rpt_CpnCampaignResultCall.scss";
import { useClientgateApi } from "@/packages/api";
import { useBankDealerGridColumns } from "../components/use-columns";

import { SearchPanelV2 } from "@/packages/ui/search-panel";

import { nanoid } from "nanoid";
import { CheckBox, DateBox, DateRangeBox, SelectBox } from "devextreme-react";

import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { format, set } from "date-fns";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { getFirstDateOfMonth } from "@/components/ulti";

export const Rpt_CpnCampaignResultCallPage = () => {
  const { t } = useI18n("Rpt_CpnCampaignResultCall");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const msInDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const startDate = new Date(now.getTime() - msInDay * 3);
  const endDate = new Date(now.getTime());
  const [searchCondition] = useState<any>({
    AgentCodeConditionList: "",
    CampaignCodeConditionList: "",
    MonthReport: [null, null],
  } as any);

  //tạo thời gian
  var currentDate = new Date();

  // Lấy năm hiện tại
  var currentYear = currentDate.getFullYear();

  // Tạo một đối tượng Date mới với ngày đầu tiên của năm
  var firstDayOfYear = new Date(currentYear, 0, 1);

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Rpt_CpnCampaignResultCall", JSON.stringify(searchCondition)],
    queryFn: async () => {
      const resp = await api.Rpt_CpnCampaignResultCall_Search({
        AgentCodeConditionList: searchCondition.AgentCodeConditionList
          ? searchCondition.AgentCodeConditionList.join(",")
          : "",
        CampaignCodeConditionList: searchCondition.CampaignCodeConditionList
          ? searchCondition.CampaignCodeConditionList.join(",")
          : "",
        ReportDTimeFrom: searchCondition.MonthReport[0]
          ? format(searchCondition.MonthReport[0], "yyyy-MM-dd")
          : format(firstDayOfYear, "yyyy-MM-dd"),
        ReportDTimeTo: searchCondition.MonthReport[1]
          ? format(searchCondition.MonthReport[1], "yyyy-MM-dd")
          : format(endDate, "yyyy-MM-dd"),
      });
      return resp;
    },
  });

  const { data: CampaignList } = useQuery(["listCam"], () =>
    api.Cpn_CampaignAgent_GetActive()
  );

  const { data: listUser } = useQuery(
    ["listAgent"],
    () => api.Sys_User_GetAllActive() as any
  );

  const columns = useBankDealerGridColumns({
    data: data?.Data?.Rpt_Cpn_CampaignResultCall || [],
  });

  const formItems: any[] = useMemo(() => {
    return [
      {
        dataField: "MonthReport",
        visible: true,
        caption: t("MonthReport"),
        label: {
          text: t("Time create"),
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
                searchCondition.MonthReport[0] ||
                format(firstDayOfYear, "yyyy-MM-dd")
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
  }, [listUser, CampaignList]);

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

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Rpt_CpnCampaignResultCall Information"),
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
    const resp = await api.Rpt_CpnCampaignResultCall_ExportExcel({
      AgentCodeConditionList: searchCondition.AgentCodeConditionList
        ? searchCondition.AgentCodeConditionList.join(",")
        : "",
      CampaignCodeConditionList: searchCondition.CampaignCodeConditionList
        ? searchCondition.CampaignCodeConditionList.join(",")
        : "",
      ReportDTimeFrom: searchCondition.MonthReport[0]
        ? format(searchCondition.MonthReport[0], "yyyy-MM-dd")
        : format(firstDayOfYear, "yyyy-MM-dd"),
      ReportDTimeTo: searchCondition.MonthReport[1]
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
    <AdminContentLayout className={"Rpt_CpnCampaignResultCall"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart
          onAddNew={handleAddNew}
          searchCondition={searchCondition}
        ></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              storeKey="Rpt_CpnCampaignResultCall_Search"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewCustomize
              cssClass="Rpt_CpnCampaignResultCall_Grid"
              // isHidenHeaderFilter={false}
              isLoading={isLoading}
              dataSource={
                data?.isSuccess
                  ? data?.Data?.Rpt_Cpn_CampaignResultCall ?? []
                  : []
              }
              columns={columns}
              keyExpr={"CampaignCode"}
              popupSettings={popupSettings}
              formSettings={{}}
              onReady={(ref) => (gridRef = ref)}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              onEditRowChanges={handleEditRowChanges}
              onDeleteRows={handleDeleteRows}
              onEditRow={handleOnEditRow}
              storeKey={"Rpt_CpnCampaignResultCall-columns"}
              customToolbarItems={[]}
              isHiddenCheckBox={true}
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
                    text: t("EXPORT"),
                    onClick: handleExportExcel,
                  },
                },
              ]}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
