import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  BaseGridView,
  ColumnOptions,
  GridViewPopup,
} from "@packages/ui/base-gridview";
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
import { HeaderPart } from "../components/header-part";
import { refechAtom, selectedItemsAtom } from "../components/store";
import "./Post_Manager.scss";
import { useClientgateApi } from "@/packages/api";
import { useBankDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import { PopupViewComponent } from "../components/use-popup-view";
import { SearchPanelV2 } from "@/packages/ui/search-panel";

import { nanoid } from "nanoid";
import {
  Button,
  CheckBox,
  DateBox,
  DateRangeBox,
  SelectBox,
} from "devextreme-react";

import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import { useToolbar } from "../components/components/toolbarItem";
import { RequiredField } from "@/packages/common/Validation_Rules";
import { DateRangeField } from "@/pages/admin/test-upload/date-range-field";
import { confirm } from "devextreme/ui/dialog";
import {
  flattenCategories,
  getCategories,
} from "@/pages/Category_Manager/components/FormatCategoryGrid";
import { format, isAfter, isBefore } from "date-fns";

export function removeDulicateData(input: any) {
  const uniqueCreateByValues = Array.from(
    new Set(input?.map((item: any) => item.CreateBy))
  );

  // Creating the output array of objects
  const output = uniqueCreateByValues?.map((createBy) => ({
    CreateBy: createBy,
  }));
  return output;
}
export const Post_ManagerPage = () => {
  const { t } = useI18n("Post_Manager");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);

  const refechValue = useAtomValue(refechAtom);

  const [searchCondition, setSearchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    MonthReport: [null, null],
    MonthUpdate: [null, null],
    KeyWord: "",
    CreateBy: "",
    LogLUBy: "",
    PostStatus: "",
    CategoryCode: "",
    Tag: "",
    ShareType: "",
    Title: "",
    Detail: "",
    FlagEdit: "0",
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);
  const nav = useNavigate();
  const auth = useAtomValue(authAtom);
  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Post_Manager", JSON.stringify(searchCondition)],
    () =>
      api.KB_Post_Search({
        ...searchCondition,
        PostStatus: searchCondition.PostStatus
          ? searchCondition.PostStatus.join(",")
          : "",
        CreateBy: searchCondition.CreateBy
          ? searchCondition.CreateBy.join(",")
          : "",
        LogLUBy: searchCondition.LogLUBy
          ? searchCondition.LogLUBy.join(",")
          : "",
        Tag: searchCondition.Tag ? searchCondition.Tag.join(",") : "",
        CategoryCode: searchCondition.CategoryCode
          ? searchCondition.CategoryCode.join(",")
          : "",
        ShareType: searchCondition.ShareType
          ? searchCondition.ShareType.join(",")
          : "",
        Detail: searchCondition.Detail ? searchCondition.Detail : "",
        Title: searchCondition.Title ? searchCondition.Title : "",
        CreateDTimeUTCFrom: searchCondition.MonthReport[0]
          ? format(searchCondition.MonthReport[0], "yyyy-MM-dd")
          : "",
        CreateDTimeUTCTo: searchCondition.MonthReport[1]
          ? format(searchCondition.MonthReport[1], "yyyy-MM-dd")
          : "",
        LogLUDTimeUTCFrom: searchCondition.MonthUpdate[0]
          ? format(searchCondition.MonthUpdate[0], "yyyy-MM-dd")
          : "",
        LogLUDTimeUTCTo: searchCondition.MonthUpdate[1]
          ? format(searchCondition.MonthUpdate[1], "yyyy-MM-dd")
          : "",
      })
  );

  const { data: listPost } = useQuery(["listPost"], () =>
    api.KB_PostData_GetAllPostCode()
  );
  const { data: Category_Manager_GetALL } = useQuery(
    ["Category_Manager_GetALL"],
    () => api.KB_Category_GetAllActive()
  );

  const { data: listTag } = useQuery(["listTag"], () =>
    api.Mst_Tag_GetAllActive()
  );

  useEffect(() => {
    if (refechValue) {
      refetch();
    }
  }, [refechValue]);
  const PostStatus = [
    { text: t("Published"), value: "PUBLISHED" },
    { text: t("Draft"), value: "DRAFT" },
  ];
  const shareType = [
    { text: t("Organization"), value: "ORGANIZATION" },
    { text: t("Network"), value: "NETWORK" },
    { text: t("Private"), value: "PRIVATE" },
  ];

  const columns = useBankDealerGridColumns({
    data: data?.Data?.pageInfo?.DataList || [],
  });

  const formItems: any[] = [
    {
      editorType: "dxTextBox",
      dataField: "FlagEdit",
      label: {
        text: t("a"),
      },
      cssClass: "FlagEdit",
      editorOptions: {
        placeholder: t("Input"),
      },
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <div className="flex items-center gap-1 mt-1 ml-1">
            <CheckBox
              defaultValue={searchCondition?.FlagEdit === "0" ? false : true}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("FlagEdit", e.value);
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
            defaultStartDate={searchCondition?.MonthReport[0]}
            defaultEndDate={searchCondition?.MonthReport[1]}
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
      dataField: "MonthUpdate",
      visible: true,
      caption: t("MonthUpdate"),
      label: {
        text: t("Thời gian cập nhật"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {},
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <DateRangeBox
            displayFormat=" yyyy-MM-dd"
            defaultStartDate={searchCondition?.MonthUpdate[0]}
            defaultEndDate={searchCondition.MonthUpdate[1]}
            showClearButton={true}
            useMaskBehavior={true}
            openOnFieldClick={true}
            labelMode="hidden"
            onValueChanged={(e: any) => {
              formRef.instance().updateData("MonthUpdate", e.value);
            }}
          />
        );
      },
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
        dataSource: removeDulicateData(listPost?.Data) ?? [],
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
      editorType: "dxTagBox",
      editorOptions: {
        dataSource:
          flattenCategories(
            getCategories(Category_Manager_GetALL?.Data?.Lst_KB_Category)
          ) ?? [],
        valueExpr: "CategoryCode",
        displayExpr: "CategoryName",
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

  const handleSetField = useCallback(
    (titleButton: string, ref: any) => {
      match(titleButton)
        .with("All", () => {
          ref.instance?.clearFilter();
        })
        .with("DRAFT", () => {
          ref.instance?.filter(["PostStatus", "=", "DRAFT"]);
        })
        .with("PUBLISHED", () => {
          ref.instance?.filter(["PostStatus", "=", "PUBLISHED"]);
        })
        .otherwise(() => {});
    },
    [isLoading]
  );
  const toolbar = useToolbar({
    data: data?.Data?.pageInfo?.DataList ?? [],
    onSetStatus: handleSetField,
  });

  const showPopUpDelete = (data: any) => {
    let result = confirm(
      `${t("Bạn có muốn xóa bản ghi này ?")}`,
      `${t("THÔNG BÁO")}`
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        handleDeleteRows(data);
      }
    });
  };
  const handleDeleteRows = async (rows: any) => {
    const dataDelete = {
      KB_Post: {
        PostCode: rows[0].PostCode,
        OrgID: rows[0].OrgID,
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
  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  // const handleAddNew = () => {
  //   console.log(271, "a");
  //   setCheckTab(true);
  //   // gridRef.current._instance.addRow();
  // };

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

  const formSettings = useFormSettings({
    columns,
  });

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
    const dataSearch = {
      ...data,
      FlagEdit: data?.FlagEdit === true ? "1" : "0",
      Tag: data.Tag ?? data.Tag.join(","),
      ShareType: data.ShareType ?? data.ShareType.join(","),
      LogLUBy: data.LogLUBy ?? data.LogLUBy.join(","),
      PostStatus: data.PostStatus ?? data.PostStatus.join(","),
      CreateBy: data.CreateBy ?? data.CreateBy.join(","),
      // CreateDTimeUTCTo: data?.TimeCreate.length
      //   ? data?.TimeCreate[1] !== ""
      //     ? format(data?.TimeCreate[1], "yyyy-MM-dd")
      //     : ""
      //   : "",
      // CreateDTimeUTCFrom: data?.TimeCreate.length
      //   ? data?.TimeCreate[0] !== ""
      //     ? format(data?.TimeCreate[0], "yyyy-MM-dd")
      //     : ""
      //   : "",
      // LogLUDTimeUTCTo: data?.TimeUpdate.length
      //   ? data?.TimeUpdate[1] !== ""
      //     ? format(data?.TimeUpdate[1], "yyyy-MM-dd")
      //     : ""
      //   : "",
      // LogLUDTimeUTCFrom: data?.TimeUpdate.length
      //   ? data?.TimeUpdate[0] !== ""
      //     ? format(data?.TimeUpdate[0], "yyyy-MM-dd")
      //     : ""
      //   : "",
    };

    setSearchCondition(dataSearch);
    console.log(dataSearch);
    await refetch();
  };

  const handleEditRowChanges = () => {
    console.log("a");
  };

  const handleSave = () => {
    nav(`/${auth.networkId}/admin/Post_Manager/addNew`);
  };

  return (
    <AdminContentLayout className={"Post_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="text-header font-bold dx-font-m">
              {t("Post manager")}
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot name={"After"}>
            <Button
              stylingMode={"contained"}
              type="default"
              text={t("Add new")}
              onClick={handleSave}
            />
          </PageHeaderNoSearchLayout.Slot>
        </PageHeaderNoSearchLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
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
            <GridViewCustomize
              isLoading={isLoading}
              dataSource={
                data?.Data?.pageInfo?.DataList?.sort(
                  (a: any, b: any) =>
                    new Date(a.CreateDTimeUTC) - new Date(b.CreateDTimeUTC)
                ) ?? []
              }
              columns={columns}
              keyExpr={["PostCode", "OrgID"]}
              popupSettings={popupSettings}
              formSettings={formSettings}
              onReady={(ref) => (gridRef = ref)}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              allowInlineEdit={true}
              onEditRowChanges={handleEditRowChanges}
              // onDeleteRows={handleDeleteRows}
              isSingleSelection={true}
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
              customToolbarItems={[
                ...toolbar,
                {
                  text: t("Delete"),
                  shouldShow: (ref: any) => {
                    return ref.instance.getSelectedRowKeys().length === 1;
                  },
                  onClick: (e: any, ref: any) => {
                    const selectedRow = ref.instance.getSelectedRowsData();
                    showPopUpDelete(selectedRow);
                  },
                },
              ]}
            />
            <PopupViewComponent
              onEdit={handleEdit}
              formSettings={formSettings}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
