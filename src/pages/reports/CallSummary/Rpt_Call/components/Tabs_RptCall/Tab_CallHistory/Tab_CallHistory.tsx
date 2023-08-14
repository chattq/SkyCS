import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useI18n } from "@/i18n/useI18n";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
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
import { authAtom, showErrorAtom } from "@packages/store";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";

import { useClientgateApi } from "@/packages/api";

import { SearchPanelV2 } from "@/packages/ui/search-panel";

import { nanoid } from "nanoid";
import { Button, CheckBox, DateBox, SelectBox } from "devextreme-react";
import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { format, set } from "date-fns";
import NavNetworkLink from "@/components/Navigate";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import { useColumns } from "./components/use-columns";
import { ReportLayout } from "@/packages/layouts/report-layout/report-content-layout";
import { requiredType } from "@/packages/common/Validation_Rules";
import { callApi } from "@/packages/api/call-api";
import {
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getYearMonthDate,
} from "@/components/ulti";
export const Tab_CallHistory = ({ getListOrg }: { getListOrg: any }) => {
  const { t } = useI18n("Post_Manager");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const [formartDate, setFormatDate] = useState("month");
  const [searchCondition, setSearchCondition] = useState<any>({
    period: "month",
    callType: "All",
    fromDate: new Date(Date.now()),
  });
  const auth = useAtomValue(authAtom);
  const api = useClientgateApi();
  const [key, reloading] = useReducer(() => {
    return nanoid();
  }, "0");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["rpt_GetCallHistoryFull", key],
    queryFn: async () => {
      if (key !== "0") {
        const condition = {
          ...searchCondition,
          fromDate:
            searchCondition.period === "day"
              ? getYearMonthDate(searchCondition.fromDate)
              : getFirstDateOfMonth(searchCondition.fromDate),
          toDate:
            searchCondition.period === "day"
              ? getYearMonthDate(searchCondition.fromDate)
              : getLastDateOfMonth(searchCondition.fromDate),
        };

        const response = await callApi.rpt_GetCallHistoryFull(auth.networkId, {
          ...condition,
        });
        if (response.Success) {
          return response.Data.map((item: any, index: number) => {
            return {
              ...item,
              idx: index + 1,
            };
          });
        } else {
          // showError({
          //   message: t(response.ErrorDetail),
          //   debugInfo: response.ErrorDetail,
          //   errorInfo: response.ErrorDetail,
          // });
          return null;
        }
      }
    },
  });

  const PostStatus = [
    { text: t("Succeed"), value: "Succeed" },
    { text: t("Missed"), value: "Missed" },
  ];

  const columns = useColumns({ data: data?.DataList || [] });

  const formItems: IItemProps[] = useMemo(() => {
    return [
      {
        dataField: "period",
        caption: "period",
        editorType: "dxSelectBox",
        label: {
          text: t("period"),
        },
        visible: true,
        validationRules: [requiredType],
        editorOptions: {
          dataSource: [
            {
              title: t("Day"),
              value: "day",
            },
            {
              title: t("Month"),
              value: "month",
            },
          ],
          valueExpr: "value",
          displayExpr: "title",
          onValueChanged: (param: any) => {
            setFormatDate(param.value);
          },
        },
      },
      {
        dataField: "fromDate", // dealine
        caption: t("fromDate"),
        visible: true,
        label: {
          text: t("Time"),
        },
        validationRules: [requiredType],
        editorOptions: {
          type: "date",
          calendarOptions: {
            maxZoomLevel: formartDate === "day" ? "month" : "year",
            // minZoomLevel: "decade",
          },
          displayFormat: formartDate === "day" ? "yyyy-MM-dd" : "yyyy-MM",
          // pickerType: "calendar",
          // useMaskBehavior: true,
        },
        editorType: "dxDateBox",
      },
      {
        dataField: "agentId",
        caption: t("agentId"),
        label: {
          text: t("agentId"),
        },
        visible: true,
        editorType: "dxSelectBox",
        editorOptions: {
          showClearButton: true,
          dataSource: getListOrg?.AgentList ?? [],
          valueExpr: "Name",
          displayExpr: "Name",
        },
      },
      {
        dataField: "ccNumber",
        caption: t("ccNumber"),
        label: {
          text: t("ccNumber"),
        },
        visible: true,
        editorType: "dxSelectBox",
        editorOptions: {
          showClearButton: true,

          dataSource: getListOrg?.Numbers ?? [],
        },
      },
      {
        caption: t("callType"),
        label: {
          text: t("callType"),
        },
        dataField: "callType",
        editorType: "dxSelectBox",
        editorOptions: {
          showClearButton: true,
          dataSource: [
            {
              title: t("All"),
              value: "All",
            },
            {
              title: t("Incoming"),
              value: "Incoming",
            },
            {
              title: t("Outcoming"),
              value: "Outcoming",
            },
            {
              title: t("Internal"),
              value: "Internal",
            },
          ],
          valueExpr: "value",
          displayExpr: "title",
          placeholder: t("Select"),
        },
      },
      {
        caption: t("callStatus"),
        label: {
          text: t("callStatus"),
        },
        dataField: "callStatus",
        editorType: "dxSelectBox",
        editorOptions: {
          showClearButton: true,
          dataSource: PostStatus,
          valueExpr: "value",
          displayExpr: "text",
          placeholder: t("Select"),
        },
      },
      {
        caption: t("tag"),
        label: {
          text: t("tag"),
        },
        dataField: "tag",
        editorType: "dxSelectBox",
        editorOptions: {
          dataSource: [
            {
              title: t("ALL"),
              value: "ALL",
            },
            {
              title: t("MST_CUSTOMER"),
              vallue: "MST_CUSTOMER",
            },
            {
              title: t("CPN_CAMPAIGN"),
              vallue: "CPN_CAMPAIGN",
            },
            {
              title: t("ET_TICKET"),
              vallue: "ET_TICKET",
            },
            {
              title: t("OTHER"),
              vallue: "OTHER",
            },
          ],
          showClearButton: true,
          valueExpr: "value",
          displayExpr: "title",
          placeholder: t("Select"),
        },
      },
      {
        dataField: "callId",
        caption: t("callId"),
        label: {
          text: t("callId"),
        },
        visible: true,
        editorType: "dxTextBox",
      },
    ];
  }, [formartDate]);

  const handleDeleteRows = async (rows: any) => {
    const dataDelete = {
      KB_Post: {
        ...rows[0],
      },
    };
    const resp = await api.KB_PostData_Delete(dataDelete);
    if (resp.isSuccess) {
      toast.success(t("Delete Successfully"));
      await refetch();
    } else {
      showError({
        message: t(resp.errorCode),
        debugInfo: resp.debugInfo,
        errorInfo: resp.errorInfo,
      });
    }
  };
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
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
    title: t("Post_Manager Information"),
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

  const handleSearch = async (data: any) => {
    setSearchCondition({
      ...data,
    });
    reloading();
    // await refetch();
  };
  const handleExport = () => {};
  const searchPanelVisibility = useAtomValue(searchPanelVisibleAtom);
  const handleEditRowChanges = () => {};
  const handleSelectionChanged = () => {};
  return (
    <ReportLayout className={"ReportCall_Manager"}>
      <ReportLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              storeKey="Post_Manager_Search"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <div className="flex align-items-flex-start">
              {!searchPanelVisibility && (
                <Button
                  className="button_Search "
                  icon={"/images/icons/search.svg"}
                  onClick={handleToggleSearchPanel}
                />
              )}
              {key !== "0" && !isLoading && (
                <GridViewCustomize
                  isLoading={isLoading}
                  dataSource={data}
                  columns={columns}
                  keyExpr={["Id"]}
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
                  ]}
                  storeKey={"Post_Manager-columns"}
                  customToolbarItems={[
                    {
                      text: "Export",
                      onClick: () => handleExport,
                      shouldShow: () => {
                        return true;
                      },
                    },
                  ]}
                />
              )}
            </div>
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </ReportLayout.Slot>
    </ReportLayout>
  );
};
