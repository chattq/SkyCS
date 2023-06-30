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
import "./RptCpnCampaignResultCtmFeedback.scss";
import { useClientgateApi } from "@/packages/api";
import { useBankDealerGridColumns } from "../components/use-columns";

import { SearchPanelV2 } from "@/packages/ui/search-panel";

import { nanoid } from "nanoid";
import { CheckBox, DateBox, SelectBox } from "devextreme-react";

import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { format, set } from "date-fns";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";

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

export const RptCpnCampaignResultCtmFeedbackPage = () => {
  const { t } = useI18n("RptCpnCampaignResultCtmFeedback");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const [searchCondition] = useState<any>({} as any);
  const setSelectedItems = useSetAtom(selectedItemsAtom);
  const [CampaignTypeCode, setCampaignTypeCode] = useState<string>();
  const api = useClientgateApi();

  const [searchConditionListType, setSearchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    CampaignTypeName: "",
    CampaignTypeDesc: "",
  });

  const { data: listMst_CampaignType } = useQuery(
    ["listMst_CampaignType", JSON.stringify(searchCondition)],
    () =>
      api.Mst_CampaignType_Search({
        ...searchConditionListType,
      })
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "RptCpnCampaignResultCtmFeedback",
      JSON.stringify(searchCondition),
    ],
    queryFn: async () => {
      const resp = await api.Rpt_CpnCampaignResultCtmFeedback_Search({
        CampaignCodeConditionList: searchCondition.CampaignCodeConditionList
          ? searchCondition.CampaignCodeConditionList
          : "",
        CampaignTypeCode: searchCondition.CampaignTypeCode
          ? searchCondition.CampaignTypeCode
          : "",
        ReportDTimeTo: searchCondition.ReportDTimeTo
          ? format(searchCondition.ReportDTimeTo, "yyyy-MM-dd")
          : "",
        ReportDTimeFrom: searchCondition.ReportDTimeFrom
          ? format(searchCondition.ReportDTimeFrom, "yyyy-MM-dd")
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
    data:
      data?.Data?.Rpt_Cpn_CampaignResultCtmFeedback.map(
        ({
          CAMPAIGNCODE,
          ORGID,
          CAMPAIGNNAME,
          CREATEDTIMEUTC,
          CAMPAIGNSTATUS,
          QTYSUMCTM,
          QTYDONE,
          ...rest
        }: any) => rest
      ) || [],
  });

  const formItems: IItemProps[] = useMemo(() => {
    return [
      {
        dataField: "MonthReport",
        visible: true,
        caption: t("MonthReport"),
        label: {
          text: t("Time create"),
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
                defaultValue={searchCondition.ReportDTimeFrom}
                onValueChanged={(e: any) => {
                  formRef.instance().updateData("ReportDTimeFrom", e.value);
                }}
              ></DateBox>
              -
              <DateBox
                {...editorOptions}
                type="date"
                displayFormat="yyyy-MM-dd"
                defaultValue={searchCondition.ReportDTimeTo}
                onValueChanged={(e: any) => {
                  formRef.instance().updateData("ReportDTimeTo", e.value);
                }}
              ></DateBox>
            </div>
          );
        },
        editorOptions: {
          placeholder: t("Input"),
          type: "date",
          format: "yyyy-MM-dd",
          dataSource: monthYearDs,
          displayExpr: (item: Date | null) => {
            if (!!item) {
              return format(item, "yyyy-MM");
            }
            return "";
          },
        },
      },
      {
        caption: t("CampaignTypeCode"),
        dataField: "CampaignTypeCode",
        label: {
          text: t("CampaignType"),
        },
        editorType: "dxSelectBox",
        editorOptions: {
          dataSource: listMst_CampaignType?.DataList ?? [],
          displayExpr: "CampaignTypeName",
          valueExpr: "CampaignTypeCode",
          placeholder: t("Input"),
          searchEnabled: true,
        },
      },
      {
        caption: t("CampaignCodeConditionList"),
        dataField: "CampaignCodeConditionList",
        label: {
          text: t("Campaign"),
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
    ];
  }, [listMst_CampaignType]);

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
    title: t("RptCpnCampaignResultCtmFeedback Information"),
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

  const onDelete = async (id: any) => {};
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
    // instance.getSelectedRowsData()
    const dataSelects = gridRef.current.instance.getSelectedRowsData();
    const CampaignCodeConditionList = dataSelects.map(
      (item: any) => item.CAMPAIGNCODE
    );
    const resp = await api.Rpt_CpnCampaignResultCtmFeedback_ExportExcel({
      CampaignTypeCode:
        searchCondition.CampaignTypeCode ?? searchCondition.CampaignTypeCode,
      CampaignCodeConditionList,
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
    <AdminContentLayout className={"RptCpnCampaignResultCtmFeedback"}>
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
                storeKey="RptCpnCampaignResultCtmFeedback_Search"
                conditionFields={formItems}
                data={searchCondition}
                onSearch={handleSearch}
              />
            </div>
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewCustomize
              isLoading={isLoading}
              dataSource={
                data?.isSuccess
                  ? data?.Data?.Rpt_Cpn_CampaignResultCtmFeedback ?? []
                  : []
              }
              columns={columns}
              keyExpr={"CAMPAIGNCODE"}
              popupSettings={popupSettings}
              onReady={(ref) => (gridRef = ref)}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              // allowInlineEdit={false}
              onEditRowChanges={handleEditRowChanges}
              onDeleteRows={handleDeleteRows}
              // inlineEditMode="row"

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
              storeKey={"RptCpnCampaignResultCtmFeedback-columns"}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
