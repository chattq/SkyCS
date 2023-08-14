import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useConfiguration } from "@/packages/hooks";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { ReportLayout } from "@/packages/layouts/report-layout/report-content-layout";
import "./style.scss";
import { showErrorAtom } from "@/packages/store";
import { FlagActiveEnum } from "@/packages/types";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { Button, CheckBox, DateBox, LoadPanel } from "devextreme-react";
import Form, { IItemProps, SimpleItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import {
  Chart,
  Series,
  ArgumentAxis,
  Legend,
  Label,
} from "devextreme-react/chart";
import {
  memo,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { nanoid } from "nanoid";
import { requiredType } from "@/packages/common/Validation_Rules";
import {
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getYearMonthDate,
} from "@/components/ulti";
import { useWindowSize } from "@/packages/hooks/useWindowSize";

const Tab_Call = ({ getListOrg }: { getListOrg: any }) => {
  const { t } = useI18n("Tab_Call");
  const showError = useSetAtom(showErrorAtom);
  const [formartDate, setFormatDate] = useState("month");
  const [active, setActive] = useState("Total");

  const [key, reloading] = useReducer(() => {
    return nanoid();
  }, "0");
  const [formSearchData, setFormSearchData] = useState<any>({
    period: "month",
    fromDate: new Date(Date.now()),
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

        const response: any = await callApi.rpt_GetCallSummary(auth.networkId, {
          ...condition,
        });

        if (response.Success) {
          const customize: any[] = Object.keys(response.Data)
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
            reportData: customize ?? [],
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
        label: {
          text: t("period"),
        },
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
        label: {
          text: t("fromDate"),
        },
        visible: true,
        validationRules: [requiredType],
        editorOptions: {
          type: "date",
          calendarOptions: {
            maxZoomLevel: formartDate === "day" ? "month" : "year",
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
  const searchPanelVisibility = useAtomValue(searchPanelVisibleAtom);

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
                <div className="flex align-items-flex-start">
                  {!searchPanelVisibility && (
                    <Button
                      className="button_Search "
                      icon={"/images/icons/search.svg"}
                      onClick={handleToggleSearchPanel}
                    />
                  )}
                  <LoadPanel visible={isLoading} />
                  {key !== "0" && !isLoading && (
                    <div className="flex pr-5">
                      <div
                        className="border-r-2 "
                        style={{ minWidth: "300px" }}
                      >
                        {data?.reportData?.map((item: any) => {
                          return (
                            <div
                              key={nanoid()}
                              className={`flex items-center gap-1 button-item ${
                                active === item.text ? "active" : ""
                              }`}
                              onClick={() => handleSetActive(item.text)}
                            >
                              <div className="w-[85%] font-semibold">
                                {t(item.text)}
                              </div>
                              <div className="font-semibold w-[15%] text-right">
                                {t(item.number ?? "0")}
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
                            <Label
                              wordWrap="none"
                              overlappingBehavior="rotate"
                            />
                          </ArgumentAxis>
                          <Legend visible={false} />
                        </Chart>
                      </div>
                    </div>
                  )}
                </div>
              </ContentSearchPanelLayout.Slot>
            </ContentSearchPanelLayout>
          </div>
        </div>
      </ReportLayout.Slot>
    </ReportLayout>
  );
};

export default memo(Tab_Call);
