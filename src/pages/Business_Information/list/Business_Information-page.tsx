import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import { GridViewPopup } from "@packages/ui/base-gridview";
import { useEffect, useRef, useState } from "react";

import { HeaderPart, PopupView } from "@/pages/Business_Information/components";

import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import { useConfiguration, useVisibilityControl } from "@packages/hooks";
import { logger } from "@packages/logger";
import { showErrorAtom } from "@packages/store";
import {
  FlagActiveEnum,
  Mst_Dealer,
  Mst_NNTController,
  SearchDealerParam,
  SearchParam,
} from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import "./Business_Information.scss";

import { useDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import { DataGrid, LoadPanel } from "devextreme-react";

import {
  dataFormAtom,
  dataTableAtom,
  flagEdit,
  keywordAtom,
  readOnly,
  selectedItemsAtom,
  showDetail,
  showPopup,
} from "@/pages/Business_Information/components/store";
import { PageHeaderLayout } from "@/packages/layouts/page-header-layout";
import { toast } from "react-toastify";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { dataGridAtom } from "@/packages/ui/base-gridview/store/normal-grid-store";

export const Business_InformationPage = () => {
  const { t } = useI18n("Business_Information");

  let gridRef: any = useRef<DataGrid | null>(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const keyword = useAtomValue(keywordAtom);
  const setShowDetail = useSetAtom(showDetail);
  const setDataTable = useSetAtom(dataTableAtom);
  const setDataForm = useSetAtom(dataFormAtom);
  const setFlag = useSetAtom(flagEdit);
  const setReadOnly = useSetAtom(readOnly);

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Business_Information", keyword],
    () =>
      api.Mst_NNTController_Search({
        KeyWord: keyword,
        FlagActive: FlagActiveEnum.All,
        Ft_PageIndex: 0,
        Ft_PageSize: config.MAX_PAGE_ITEMS,
      } as SearchParam),
    {}
  );
  useEffect(() => {
    if (!!data && !data.isSuccess) {
      showError({
        message: t(data.errorCode),
        debugInfo: data.debugInfo,
        errorInfo: data.errorInfo,
      });
    }
  }, [data]);
  const { data: listMST } = useQuery(["listMST"], () =>
    api.Mst_NNTController_GetAllActive()
  );
  const { data: listProvince } = useQuery(["listProvince"], () =>
    api.Mst_Province_GetAllActive()
  );

  const formSettings = useFormSettings({
    data: listMST?.DataList,
    dataProvince: listProvince?.DataList,
  });
  const columns = useDealerGridColumns({ data: data?.DataList });

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    setFlag(true);
    setDataTable([]);
    setDataForm([]);
    setPopupVisible(true);
    setShowDetail(false);
    setReadOnly(true);
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleCancel = () => {
    gridRef.current?.instance?.cancelEditData();
  };
  const handleEdit = (rowIndex: number) => {
    // clear viewing item info before start edit it
    gridRef.current?.instance?.editRow(rowIndex);
  };
  const handleSubmit = () => {
    gridRef.current?.instance?.saveEditData();
  };

  const handleEditorPreparing = (e: EditorPreparingEvent) => {
    // use this function to control how the editor looks like
    if (["DealerCode", "DealerType", "ProvinceCode"].includes(e.dataField!)) {
      e.editorOptions.readOnly = !e.row?.isNewRow;
    } else if (e.dataField === "FlagActive") {
      e.editorOptions.value = true;
    } else if (["FlagDirect", "FlagTCG"].includes(e.dataField!)) {
      e.editorOptions.value = "0";
    }
  };
  const handleOnEditRow = async (e: any) => {
    console.log(134, e);
    setFlag(false);
    setReadOnly(false);
    setShowDetail(false);
    const resp = await api.Mst_NNTController_GetNNTCode(e[0]);
    if (resp.isSuccess) {
      setDataForm(resp.Data);
    }
    setPopupVisible(true);
  };

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Department_Control Information"),
    className: "dealer-information-popup",
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

  const onModifyNew = async (data: any) => {
    if (data.NNTFullName !== "") {
      const resp = await api.Mst_NNTController_Update({
        ...data,
        FlagActive: data.FlagActive ? "1" : "0",
      });
      if (resp.isSuccess) {
        // dataGrid.current?.instance.deselectRows(data.MST);
        toast.success(t("Update Successfully"));
        setPopupVisible(false);
        await refetch();
        return true;
      }
      showError({
        message: t(resp.errorCode),
        debugInfo: resp.debugInfo,
        errorInfo: resp.errorInfo,
      });
      throw new Error(resp.errorCode);
    }
  };
  const onModify = (id: string, data: Mst_Dealer) => {};
  // Section: CRUD operations
  const onCreateNew = async (data: Mst_NNTController & { __KEY__: string }) => {
    const { __KEY__, ...rest } = data;
    if (
      data.NNTFullName !== "" &&
      data.MST.match(/[^a-zA-Z0-9_]/g)?.length === undefined
    ) {
      const resp = await api.Mst_NNTController_Create({
        ...rest,
        FlagActive: rest.FlagActive ? "1" : "0",
      });
      if (resp.isSuccess) {
        toast.success(t("Create Successfully"));
        setPopupVisible(false);
        await refetch();
        return true;
      }
      showError({
        message: t(resp.errorCode),
        debugInfo: resp.debugInfo,
        errorInfo: resp.errorInfo,
      });
      throw new Error(resp.errorCode);
    }
    if (data.MST.match(/[^a-zA-Z0-9_]/g)?.length !== undefined) {
      toast.warning(t("MST không được chứa các ký tự đặc biệt"));
    }
  };
  const onCreate = (data: any) => {};
  const onDelete = async (id: string) => {
    // const resp = await api.Mst_Dealer_Delete(id);
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
    } else {
      // no changes
      // just close it
      e.promise = Promise.resolve();
      gridRef?.instance.cancelEditData();
    }
    e.cancel = true;
  };
  // End Section: CRUD operations

  const handleEditRowChanges = () => {};
  const handleOnEditRowOld = () => {};

  const loadingControl = useVisibilityControl({ defaultVisible: false });
  const handleDeleteRows = async (ids: any) => {
    const resp = await api.Mst_NNTController_Delete(ids);
    if (resp.isSuccess) {
      toast.success(t("Delete Successfully"));
      await refetch();
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
    <AdminContentLayout className={"Business_Information"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderLayout>
          <PageHeaderLayout.Slot name={"Before"}>
            <div className="font-bold dx-font-m">
              {t("Business_Information")}
            </div>
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"Center"}>
            <HeaderPart
              refetch={refetch}
              onAddNew={handleAddNew}
              handleOnEditRow={handleOnEditRow}
            />
          </PageHeaderLayout.Slot>
        </PageHeaderLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <GridViewCustomize
          isLoading={isLoading}
          dataSource={data?.isSuccess ? data?.DataList ?? [] : []}
          columns={columns}
          keyExpr={"MST"}
          popupSettings={popupSettings}
          formSettings={formSettings}
          onReady={(ref) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          onEditorPreparing={handleEditorPreparing}
          onEditRowChanges={handleEditRowChanges}
          onDeleteRows={handleDeleteRows}
          onEditRow={handleOnEditRowOld}
          storeKey={"Business_Information-columns"}
          isSingleSelection
        />
        <PopupView
          onEdit={onModifyNew}
          formSettings={formSettings}
          title={"Thêm mới công ty/chi nhánh"}
          onCreate={onCreateNew}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
