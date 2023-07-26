import { useCallback, useEffect, useReducer, useRef, useState } from "react";
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

export const Tab_CallHistory = () => {
  const { t } = useI18n("Post_Manager");
  let gridRef: any = useRef(null);
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

  const nav = useNavigate();
  const auth = useAtomValue(authAtom);
  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Post_Manager", JSON.stringify(searchCondition)],
    () =>
      api.KB_Post_Search({
        ...searchCondition,
      })
  );

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

  const columns = useColumns({ data: data?.DataList || [] });

  const formItems: IItemProps[] = [
    {
      editorType: "dxTextBox",
      dataField: "FlagEdit",
      label: {
        text: t("FlagEdit"),
      },
      editorOptions: {
        placeholder: t("Input"),
      },
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <div className="flex items-center gap-1 mt-1 ml-1">
            <CheckBox
              defaultValue={searchCondition.FlagEdit === "0" ? false : true}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("FlagShare", e.value);
              }}
            />
            <div className="font-bold">{t("Bài viết cần chỉnh sửa")}</div>
          </div>
        );
      },
    },
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
      dataField: "MonthReport",
      visible: true,
      caption: t("MonthReport"),
      label: {
        text: t("Thời gian cập nhật"),
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
              defaultValue={searchCondition.LogLUDTimeUTCFrom}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("LogLUDTimeUTCFrom", e.value);
              }}
            ></DateBox>
            -
            <DateBox
              {...editorOptions}
              type="date"
              displayFormat="yyyy-MM-dd"
              defaultValue={searchCondition.LogLUDTimeUTCTo}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("LogLUDTimeUTCTo", e.value);
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

  // const handleAddNew = () => {
  //   console.log(271, "a");
  //   setCheckTab(true);
  //   // gridRef.current._instance.addRow();
  // };

  // toggle search panel
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
      FlagEdit: data?.FlagEdit ? "1" : "0",
      Tag: data.Tag ?? data.Tag.join(","),
      ShareType: data.ShareType ?? data.ShareType.join(","),
      LogLUBy: data.LogLUBy ?? data.LogLUBy.join(","),
      PostStatus: data.PostStatus ?? data.PostStatus.join(","),
      CreateBy: data.CreateBy ?? data.CreateBy.join(","),
    });

    await refetch();
  };
  const handleOnEditRow = (e: any) => {
    const { row, column } = e;
    handleEdit(row.rowIndex);
  };
  const handleEditRowChanges = () => {
    console.log("a");
  };

  const handleSave = () => {
    nav(`/${auth.networkId}/admin/Post_Manager/addNew`);
  };
  const handleSelectionChanged = () => {};

  return (
    <ReportLayout className={"ReportCall_Manager"}>
      <ReportLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <div className={"w-[230px]"}>
              <SearchPanelV2
                storeKey="Post_Manager_Search"
                conditionFields={formItems}
                data={searchCondition}
                onSearch={handleSearch}
              />
            </div>
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewCustomize
              isLoading={isLoading}
              dataSource={data?.DataList}
              columns={columns}
              keyExpr={["PostCode", "OrgID"]}
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
              ]}
              storeKey={"Post_Manager-columns"}
              customToolbarItems={[]}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </ReportLayout.Slot>
    </ReportLayout>
  );
};
