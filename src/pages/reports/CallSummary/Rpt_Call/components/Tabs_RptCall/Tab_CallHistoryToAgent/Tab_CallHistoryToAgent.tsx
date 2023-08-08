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
import { ScrollView } from "devextreme-react";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { useNavigate } from "react-router-dom";
import { useColumns } from "./components/use-columns";
import { ReportLayout } from "@/packages/layouts/report-layout/report-content-layout";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { requiredType } from "@/packages/common/Validation_Rules";
import { callApi } from "@/packages/api/call-api";
import {
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getYearMonthDate,
} from "@/components/ulti";
import { nanoid } from "nanoid";

export const Tab_CallHistoryToAgent = ({ getListOrg }: { getListOrg: any }) => {
  const { t } = useI18n("Post_Manager");
  const windowSize = useWindowSize();
  const [formartDate, setFormatDate] = useState("day");
  const [searchCondition, setSearchCondition] = useState<any>({
    period: "day",
    callType: "All",
  });
  const [key, reloading] = useReducer(() => {
    return nanoid();
  }, "0");
  const nav = useNavigate();
  let gridRef: any = useRef();
  const auth = useAtomValue(authAtom);
  const api = useClientgateApi();

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
          const result = response.Data.map((item: any, index: number) => {
            return {
              ...item,
              idx: index + 1,
            };
          });
          //   {
          //     "ExtId": 7298293000,
          //     "Number": null,
          //     "RingDTime": "2023-07-26 04:04:24",
          //     "TalkDTime": "2023-07-26 04:04:24",
          //     "EndDTime": null,
          //     "HoldTime": 0,
          //     "RingTime": 0,
          //     "TalkTime": 12,
          //     "EndReason": null,
          //     "IsConnected": true
          // }

          const newResult = result.map((item: any) => {
            return {
              ...item,
              detail_ExtId: item.Logs.map((itemMap: any) => itemMap.ExtId).join(
                ""
              ),
              detail_Number: item.Logs.map(
                (itemMap: any) => itemMap.Number
              ).join(","),
              detail_RingDTime: item.Logs.map(
                (itemMap: any) => itemMap.RingDTime
              ).join(","),
              detail_TalkDTime: item.Logs.map(
                (itemMap: any) => itemMap.TalkDTime
              ).join(","),
              detail_EndDTime: item.Logs.map(
                (itemMap: any) => itemMap.EndDTime
              ).join(","),
              detail_HoldTime: item.Logs.map(
                (itemMap: any) => itemMap.HoldTime
              ).join(","),
              detail_RingTime: item.Logs.map(
                (itemMap: any) => itemMap.RingTime
              ).join(","),
              detail_TalkTime: item.Logs.map(
                (itemMap: any) => itemMap.TalkTime
              ).join(","),
              detail_EndReason: item.Logs.map(
                (itemMap: any) => itemMap.EndReason
              ).join(","),
              detail_IsConnected: item.Logs.map(
                (itemMap: any) => itemMap.IsConnected
              ).join(","),
            };
          });

          console.log("newResult", newResult);

          return newResult;
        } else {
          // showError({
          //   message: t(response.ErrorDetail),
          //   debugInfo: response.ErrorDetail,
          //   errorInfo: response.ErrorDetail,
          // });
          return null;
        }
      } else {
        return [];
      }
    },
  });

  const PostStatus = [
    { text: t("Succeed"), value: "Succeed" },
    { text: t("Missed"), value: "Missed" },
  ];

  const columns = useColumns({ data: data || [] });

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
          dataSource: ["day", "month"],
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
            maxZoomLevel: formartDate === "day" ? "date" : "year",
          },
          displayFormat: formartDate === "day" ? "yyyy-MM-dd" : "yyyy-MM",
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

  const handleDeleteRows = async (rows: any) => {};

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  // End Section: CRUD operations

  const handleSearch = async (data: any) => {
    console.log("data ", data);

    setSearchCondition({
      ...data,
    });
    reloading();
    await refetch();
  };
  const handleEditRowChanges = () => {
    console.log("a");
  };

  const handleSelectionChanged = () => {};
  const handleSavingRow = () => {};
  const handleEditorPreparing = () => {};

  return (
    <ReportLayout className={"ReportCall_Manager"}>
      <ReportLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              storeKey="tab_callAgent_Search"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            {key !== "0" && (
              <ScrollView
                showScrollbar={"always"}
                height={windowSize.height - 150}
                className={"mb-5 ScrollView_Customize"}
              >
                <div className="flex mt-2 overflow-x-auto w-full">
                  <GridViewCustomize
                    cssClass={"Tab_CallHistoryAgent"}
                    isLoading={isLoading}
                    dataSource={data}
                    columns={columns}
                    keyExpr={["PostCode", "OrgID"]}
                    popupSettings={{}}
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
                    isHiddenCheckBox={true}
                    toolbarItems={[]}
                    storeKey={"tab_Call-columns"}
                    customToolbarItems={[]}
                  />
                </div>
              </ScrollView>
            )}
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </ReportLayout.Slot>
    </ReportLayout>
  );
};
