import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useConfiguration } from "@/packages/hooks";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { ReportLayout } from "@/packages/layouts/report-layout/report-content-layout";

import { showErrorAtom } from "@/packages/store";
import { FlagActiveEnum } from "@/packages/types";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { Button, CheckBox, DateBox, LoadPanel } from "devextreme-react";
import Form, { IItemProps, SimpleItem } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import {
  Chart,
  Series,
  ArgumentAxis,
  Legend,
  Label,
} from "devextreme-react/chart";
import React, {
  memo,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { ColumnOptions } from "@/types";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { nanoid } from "nanoid";
import { requiredType } from "@/packages/common/Validation_Rules";
import {
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getYearMonthDate,
} from "@/components/ulti";
import { Icon } from "@/packages/ui/icons";
import { Text } from "devextreme-react/linear-gauge";
import { useWindowSize } from "@/packages/hooks/useWindowSize";

const Tab_Call = ({ getListOrg }: { getListOrg: any }) => {
  const { t } = useI18n("Tab_Call");
  const showError = useSetAtom(showErrorAtom);
  const [formartDate, setFormatDate] = useState("day");
  const [active, setActive] = useState("Total");

  const [key, reloading] = useReducer(() => {
    return nanoid();
  }, "0");
  const [formSearchData, setFormSearchData] = useState<any>({
    period: "day",
    fromDate: "",
    toDate: "",
    agentId: 0,
    ccNumber: "",
    callType: "All",
    rptType: "Total",
  });
  const { auth } = useAuth();
  const api = useClientgateApi();
  const handleSearch = async (data: any) => {
    const obj = {
      ...data,
    };
    refetch();
    setFormSearchData(obj);
    reloading();
  };

  const windowSize = useWindowSize();
  console.log("windowSize ", windowSize);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["rpt_GetCallSummary", key],
    queryFn: async () => {
      if (key !== "0") {
        const condition = {
          ...formSearchData,
          fromDate:
            formSearchData.period === "day"
              ? getYearMonthDate(formSearchData.fromDate)
              : getFirstDateOfMonth(formSearchData.fromDate),
          toDate:
            formSearchData.period === "day"
              ? getYearMonthDate(formSearchData.fromDate)
              : getLastDateOfMonth(formSearchData.fromDate),
        };

        console.log("condition", condition);

        const response: any = await callApi.rpt_GetCallSummary(auth.networkId, {
          ...condition,
        });

        if (response.Success) {
          const customize = Object.keys(response.Data)
            .filter((item) => {
              return item !== "DataList";
            })
            .map((item) => {
              return {
                text: item,
                number: response.Data[item],
              };
            });

          return {
            reportData: customize,
            DataList: response.Data.DataList.map((itemValue: any) => {
              return {
                ...itemValue,
                val: itemValue.Count,
              };
            }),
          };
        } else {
          showError({
            message: t(response.ErrorDetail),
            debugInfo: response.ErrorDetail,
            errorInfo: response.ErrorDetail,
          });
        }
      } else {
        return {};
      }
    },
  });

  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const formSearch = useMemo(() => {
    return [
      {
        dataField: "period",
        caption: "period",
        editorType: "dxSelectBox",
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
        visible: true,
        editorType: "dxSelectBox",
        editorOptions: {
          showClearButton: true,
          dataSource: getListOrg?.Numbers ?? [],
        },
      },
    ] as IItemProps[];
  }, [formartDate]);

  const handleSetActive = useCallback((text: string) => {
    setActive(text);
    setFormSearchData((prev: any) => {
      return {
        ...prev,
        rptType: text,
      };
    });
    reloading();
  }, []);

  return (
    <ReportLayout className={"ReportCall_Manager"}>
      <ReportLayout.Slot name={"Content"}>
        <div className="flex">
          <div className="w-full">
            <ContentSearchPanelLayout>
              <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
                <SearchPanelV2
                  storeKey="ReportCall_Search"
                  conditionFields={formSearch}
                  data={formSearchData}
                  onSearch={handleSearch}
                />
              </ContentSearchPanelLayout.Slot>
              <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
                <LoadPanel visible={isLoading} />
                {key !== "0" && !isLoading && (
                  <div className="flex pr-5">
                    <div className="border-r-2 " style={{ minWidth: "250px" }}>
                      {data?.reportData.map((item: any) => {
                        return (
                          <div
                            key={nanoid()}
                            className={`flex items-center gap-1 button-item ${
                              active === item.text ? "active" : ""
                            }`}
                            onClick={() => handleSetActive(item.text)}
                          >
                            <div className="w-[80%] font-semibold">
                              {item.text}
                            </div>
                            <div className="font-semibold w-[20%] text-left">
                              {item.number}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="pr-5 py-1" style={{ flex: "1" }}>
                      <Button
                        className="button_Search"
                        icon={"/images/icons/search.svg"}
                        onClick={handleToggleSearchPanel}
                      />
                      <Chart
                        id="chart"
                        dataSource={data?.DataList ?? []}
                        className="pl-5 pr-5 flex-1"
                        width={windowSize.width - 500}
                      >
                        <Series argumentField="Time" />
                        <ArgumentAxis>
                          <Label wordWrap="none" overlappingBehavior="rotate" />
                        </ArgumentAxis>
                        <Legend visible={false} />
                      </Chart>
                    </div>
                  </div>
                )}
              </ContentSearchPanelLayout.Slot>
            </ContentSearchPanelLayout>
          </div>
        </div>
      </ReportLayout.Slot>
    </ReportLayout>
  );
};

export default memo(Tab_Call);
