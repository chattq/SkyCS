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
import { Button, CheckBox, DateBox } from "devextreme-react";

import { IItemProps } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import {
  Chart,
  Series,
  ArgumentAxis,
  Legend,
  Label,
} from "devextreme-react/chart";
import React, { useState } from "react";

export default function Tab_Call() {
  const { t } = useI18n("Post_Manager");
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const [searchCondition, setSearchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    KeyWord: "",
    CreateDTimeUTCFrom: "",
    CreateDTimeUTCTo: "",
    CreateBy: "",
    LogLUDTimeUTCFrom: "",
    LogLUDTimeUTCTo: "",
    LogLUBy: "",
    PostStatus: "",
    CategoryCode: "",
    Tag: "",
    ShareType: "",
    Title: "",
    Detail: "",
    FlagEdit: "0",
  });
  const api = useClientgateApi();
  const { data: listPost } = useQuery(["listPost"], () =>
    api.KB_PostData_GetAllPostCode()
  );
  const { data: listTag } = useQuery(["listTag"], () =>
    api.Mst_Tag_GetAllActive()
  );
  const PostStatus = [
    { text: t("Published"), value: "PUBLISHED" },
    { text: t("Draft"), value: "DRAFT" },
  ];
  const shareType = [
    { text: t("Organization"), value: "ORGANIZATION" },
    { text: t("Network"), value: "NETWORK" },
    { text: t("Private"), value: "PRIVATE" },
  ];
  const formItems: IItemProps[] = [
    {
      caption: t("Title"),
      dataField: "Title",
      label: {
        text: t("Title"),
      },
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      caption: t("Detail"),
      label: {
        text: t("Detail"),
      },
      dataField: "Detail",
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      dataField: "Month",
      visible: true,
      caption: t("Month"),
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
              defaultValue={searchCondition.CreateDTimeUTCTo}
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
        format: "yyyy-MM-dd",
        // dataSource: monthYearDs,
        // displayExpr: (item: Date | null) => {
        //   if (!!item) {
        //     return format(item, "yyyy-MM");
        //   }
        //   return "";
        // },
        // validationMessageMode: "always",
      },
      // validationRules: [RequiredField(t("MonthReportIsRequired"))],
    },
    {
      caption: t("PostStatus"),
      dataField: "PostStatus",
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: PostStatus,
        valueExpr: "value",
        displayExpr: "text",
        placeholder: t("Select"),
      },
    },
    {
      caption: t("CreateBy"),
      dataField: "CreateBy",
      label: {
        text: t("Người tạo"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: listPost?.Data ?? [],
        valueExpr: "CreateBy",
        displayExpr: "CreateBy",
        placeholder: t("Select"),
      },
    },
    {
      caption: t("LogLUBy"),
      dataField: "LogLUBy",
      label: {
        text: t("LogLUBy"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: listPost?.Data ?? [],
        valueExpr: "LogLUBy",
        displayExpr: "LogLUBy",
        placeholder: t("Select"),
      },
    },
    {
      caption: t("Tag"),
      dataField: "Tag",
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: listTag?.Data?.Lst_Mst_Tag ?? [],
        valueExpr: "TagID",
        displayExpr: "TagName",
        placeholder: t("Select"),
      },
    },
    {
      caption: t("CategoryCode"),
      dataField: "CategoryCode",
      label: {
        text: t("Category"),
      },
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: listPost?.Data ?? [],
        valueExpr: "CategoryCode",
        displayExpr: "kbc_CategoryName",
        placeholder: t("Select"),
      },
    },
    {
      caption: t("ShareType"),
      dataField: "ShareType",
      label: {
        text: t("ShareType"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: shareType,
        valueExpr: "value",
        displayExpr: "text",
        placeholder: t("Select"),
      },
    },
  ];
  const handleSearch = async (data: any) => {
    setSearchCondition({
      ...data,
      FlagEdit: data?.FlagEdit ? "1" : "0",
      Tag: data.Tag ?? data.Tag.join(","),
      ShareType: data.ShareType ?? data.ShareType.join(","),
      LogLUBy: data.LogLUBy ?? data.LogLUBy.join(","),
      PostStatus: data.PostStatus ?? data.PostStatus.join(","),
      CreateBy: data.CreateBy ?? data.CreateBy.join(","),
    });

    // await refetch();
  };
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };
  const listCall = [
    {
      text: "Tổng cuộc gọi",
      number: 227,
    },
    {
      text: "Tổng CG vào",
      number: 227,
    },
    {
      text: "Tổng CG ra",
      number: 227,
    },
    {
      text: "Tổng CG vào thành công",
      number: 227,
    },
    {
      text: "Tổng CG ra thành công",
      number: 227,
    },
    {
      text: "Tổng CG vào nhỡ",
      number: 12278,
    },
    {
      text: "Tổng ra nhỡ",
      number: 2,
    },
  ];
  const population = [
    { country: "China", val: 1382500000 },
    { country: "India", val: 1314300000 },
    { country: "United States", val: 324789000 },
    { country: "Indonesia", val: 261600000 },
    { country: "Brazil", val: 207332000 },
    { country: "Pakistan", val: 196865000 },
    { country: "Nigeria", val: 188500000 },
    { country: "Bangladesh", val: 162240000 },
    { country: "Russia", val: 146400000 },
    { country: "Japan", val: 126760000 },
    { country: "Mexico", val: 122273000 },
    { country: "Ethiopia", val: 104345000 },
    { country: "Philippines", val: 103906000 },
    { country: "Egypt", val: 92847800 },
  ];
  return (
    <ReportLayout className={"ReportCall_Manager"}>
      <ReportLayout.Slot name={"Content"}>
        <div className="flex">
          <div className="border-r-2 px-3 w-[250px]">
            {listCall.map((item: any) => {
              return (
                <div className="flex items-center gap-1">
                  <div className="w-[80%] font-semibold">{item.text}</div>
                  <div className="font-semibold w-[20%] text-left">
                    {item.number}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-[calc(100%_-_250px)]">
            <ContentSearchPanelLayout>
              <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
                <div className={"w-[230px]"}>
                  <SearchPanelV2
                    storeKey="ReportCall_Search"
                    conditionFields={formItems}
                    data={searchCondition}
                    onSearch={handleSearch}
                  />
                </div>
              </ContentSearchPanelLayout.Slot>
              <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
                <div className="flex pr-2">
                  <div className="pl-2 py-1">
                    <Button
                      className="button_Search"
                      icon={"/images/icons/search.svg"}
                      onClick={handleToggleSearchPanel}
                    />
                  </div>
                  <div className="w-full pr-5 py-1">
                    <div className="font-bold text-[15px] pt-[4px]">
                      Tổng cuộc gọi
                    </div>
                    <Chart
                      id="chart"
                      dataSource={population}
                      width={"100%"}
                      className="pr-5 py-4"
                    >
                      <ArgumentAxis
                        allowDecimals={false}
                        axisDivisionFactor={60}
                        discreteAxisDivisionMode="crossLabels"
                      >
                        <Label wordWrap="none" overlappingBehavior="rotate" />
                      </ArgumentAxis>
                      <Series argumentField="country" />
                      <Legend visible={false} />
                    </Chart>
                  </div>
                </div>
              </ContentSearchPanelLayout.Slot>
            </ContentSearchPanelLayout>
          </div>
        </div>
      </ReportLayout.Slot>
    </ReportLayout>
  );
}
