import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  BaseGridView,
  ColumnOptions,
  GridViewPopup,
} from "@packages/ui/base-gridview";
import { useEffect, useReducer, useRef, useState } from "react";
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
import "./Post_Manager.scss";
import { useClientgateApi } from "@/packages/api";
import { useBankDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import { PopupViewComponent } from "../components/use-popup-view";
import { SearchPanelV2 } from "@/packages/ui/search-panel";

import { nanoid } from "nanoid";
import { CheckBox, DateBox, SelectBox } from "devextreme-react";
import Post_detail from "../components/components/Post_add";
import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { set } from "date-fns";
import NavNetworkLink from "@/components/Navigate";
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

export const Post_ManagerPage = () => {
  const { t } = useI18n("Post_Manager");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);

  const [searchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    KeyWord: "",
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Post_Manager", JSON.stringify(searchCondition)],
    () =>
      api.KB_Post_Search({
        ...searchCondition,
      })
  );

  const columns = useBankDealerGridColumns({ data: data?.DataList || [] });

  const formItems: IItemProps[] = [
    {
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <div className="flex items-center gap-1 mt-1 ml-1">
            <CheckBox
              onValueChanged={(e: any) => {
                formRef.instance().updateData("MonthFrom", e.value);
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
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      caption: t("Content"),
      dataField: "Content",
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
      editorType: "dxDateBox",
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <div className={"flex items-center"}>
            <DateBox
              className="pr-[3px]"
              {...editorOptions}
              type="date"
              displayFormat="yyyy-MM-dd"
              // defaultValue={data.MonthFrom}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("MonthFrom", e.value);
              }}
            ></DateBox>
            -
            <DateBox
              {...editorOptions}
              type="date"
              displayFormat="yyyy-MM-dd"
              // defaultValue={data.MonthTo}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("MonthTo", e.value);
              }}
            ></DateBox>
          </div>
        );
      },
      editorOptions: {
        placeholder: t("Input"),
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
              // defaultValue={data.MonthFrom}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("MonthFrom", e.value);
              }}
            ></DateBox>
            -
            <DateBox
              {...editorOptions}
              type="date"
              displayFormat="yyyy-MM-dd"
              // defaultValue={data.MonthTo}
              onValueChanged={(e: any) => {
                formRef.instance().updateData("MonthTo", e.value);
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
      caption: t("Status"),
      dataField: "Content",
      editorType: "dxSelectBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      caption: t("Creator"),
      dataField: "Creator",
      editorType: "dxSelectBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      caption: t("Updater"),
      dataField: "Updater",
      editorType: "dxSelectBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      caption: t("Tag"),
      dataField: "Tag",
      editorType: "dxSelectBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      caption: t("Category"),
      dataField: "Category",
      editorType: "dxSelectBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      caption: t("Share"),
      dataField: "Share",
      editorType: "dxSelectBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
  ];

  const handleDeleteRows = async (rows: any) => {
    const dataDelete = {
      KB_Post: {
        ...rows[0],
      },
      Lst_KB_PostAttachFile: [],
    };
    console.log(279, dataDelete);
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
  const [checkTab, setCheckTab] = useState(false);

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    console.log(271, "a");
    setCheckTab(true);
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

  const onModify = async (id: any, data: Partial<Mst_Area>) => {
    // const resp = await api.Mst_Area_Update({
    //   ...id,
    //   ...data,
    // });
    // if (resp.isSuccess) {
    //   toast.success(t("Update Successfully"));
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
  // Section: CRUD operations
  const onCreate = async (data: Mst_Area & { __KEY__: string }) => {
    // const { __KEY__, ...rest } = data;
    // // console.log(230, data);
    // const resp = await api.Mst_Area_Create({
    //   ...rest,
    //   FlagActive: rest.FlagActive ? "1" : "0",
    // });
    // if (resp.isSuccess) {
    //   toast.success(t("Create Successfully"));
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
  const activeRef = useRef<any>(false);
  const handleFilterHeader = (tab: any) => {
    activeRef.current = true;
    console.log(440, "a");
  };
  const filterHeader = [
    {
      id: "timecreate",
      text: t("Time Create"),
    },
    {
      id: "timeupdate",
      text: t("Time Update"),
    },
    {
      id: "ascending",
      text: t("Sắp xếp tăng dần"),
    },
    {
      id: "descending",
      text: t("Sắp xếp giảm dần"),
    },
  ];
  const genFilterBlock = (onClose: any) => {
    return (
      <div className="w-[200px] bg-white shadow-md p-1 rounded-md absolute">
        {filterHeader.map((item: any) => {
          return (
            <div
              key={item.id}
              className={
                activeRef.current === false
                  ? "bg-red-200"
                  : "bg-slate-500 px-2 py-1 rounded-md cursor-pointer"
              }
              onClick={() => handleFilterHeader(item.id)}
            >
              {item.text}
            </div>
          );
        })}
        {/* <div className="bg-red-200 px-2 py-1 rounded-md">
          Thời gian cập nhật
        </div>
        <div className="bg-red-200 px-2 py-1 rounded-md">Sắp xếp tăng dần</div>
        <div className="bg-red-200 px-2 py-1 rounded-md">Sắp xếp giảm dần</div> */}
      </div>
    );
  };

  return (
    <AdminContentLayout className={"Post_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        {/* <NavNetworkLink to={"/admin/Post_Manager/addNew"}> */}
        <HeaderPart />
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
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
            <BaseGridView
              isLoading={isLoading}
              dataSource={data?.isSuccess ? data.DataList ?? [] : []}
              columns={columns}
              keyExpr={["PostCode", "OrgID"]}
              popupSettings={popupSettings}
              formSettings={formSettings}
              onReady={(ref) => (gridRef = ref)}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              allowInlineEdit={false}
              onEditRowChanges={handleEditRowChanges}
              onDeleteRows={handleDeleteRows}
              inlineEditMode="row"
              showCheck="always"
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
                  // widget: "dxButton",
                  options: {
                    icon: "filter",
                  },
                  render: () => {
                    return (
                      <FilterDropdown
                        buttonTemplate={<img src="/images/icons/save.svg" />}
                        genFilterFunction={genFilterBlock}
                      />
                    );
                  },
                },
                {
                  location: "before",
                  widget: "dxButton",
                  cssClass: "",
                  options: {
                    text: t("All"),
                    // onClick: handleFilterHeader,
                  },
                },
                {
                  location: "before",
                  widget: "dxButton",
                  cssClass: "",
                  options: {
                    text: t("Published"),
                    // onClick: handleFilterHeader,
                  },
                },
                {
                  location: "before",
                  widget: "dxButton",
                  cssClass: "",
                  options: {
                    text: t("Darft"),
                    // onClick: handleFilterHeader,
                  },
                },
              ]}
              storeKey={"Post_Manager-columns"}
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
