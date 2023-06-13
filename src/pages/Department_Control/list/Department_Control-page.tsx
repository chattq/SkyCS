import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import { GridViewPopup } from "@packages/ui/base-gridview";
import { useCallback, useRef, useState } from "react";

import { DepartMentControlPopupView } from "@/pages/Department_Control/components";
import {
  dataFormAtom,
  dataTableAtom,
  flagEdit,
  selectedItemsAtom,
  showDetail,
  viewingDataAtom,
} from "@/pages/Department_Control/components/store";
import { HeaderPart } from "@/pages/Department_Control/components/header-part";
import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import { useConfiguration, useVisibilityControl } from "@packages/hooks";
import { logger } from "@packages/logger";
import { showErrorAtom } from "@packages/store";
import {
  FlagActiveEnum,
  Mst_Dealer,
  Mst_DepartmentControl,
  SearchParam,
} from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import "./Department_Control.scss";

import { useDepartMentGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import { DataGrid, LoadPanel } from "devextreme-react";
import { showPopup } from "../components/store";

export const Department_ControlPage = () => {
  const { t } = useI18n("Department_Control");
  let gridRef: any = useRef<DataGrid | null>(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const setDataTable = useSetAtom(dataTableAtom);
  const setDataForm = useSetAtom(dataFormAtom);
  const setFlag = useSetAtom(flagEdit);

  const [searchCondition, setSearchCondition] = useState<SearchParam>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    KeyWord: "",
  });

  // const { data: listMst_DepartmentControl } = useQuery(
  //   ["listMst_DepartmentControl", viewingItem.item?.DepartmentCode],
  //   () =>
  //     api.Mst_DepartmentControl_GetByDepartmentCode(
  //       viewingItem.item?.DepartmentCode
  //     )
  // );

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Department_Control", JSON.stringify(searchCondition)],
    () =>
      api.Mst_DepartmentControl_Search({
        ...searchCondition,
      })
  );
  const { data: listUser } = useQuery(["listUser"], () =>
    api.Sys_User_GetAllActive()
  );

  const columns = useDepartMentGridColumns({ data: data?.DataList });
  const formSettings = useFormSettings({ data: listUser?.DataList });

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    setFlag(true);
    setDataTable([]);
    setDataForm([]);
    setPopupVisible(true);
    setShowDetail(false);
    // gridRef.current?._instance?.addRow();
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
    setFlag(false);
    setShowDetail(false);
    const resp = await api.Mst_DepartmentControl_GetByDepartmentCode(
      e.row.data.DepartmentCode
    );
    if (resp.isSuccess) {
      setDataTable(resp.Data?.Lst_Sys_UserMapDepartment);
      setDataForm({
        ...resp.Data?.Mst_Department,
        FlagActive: resp.Data?.Mst_Department.FlagActive === "1" ? true : false,
      });
    }
    setPopupVisible(true);
  };

  const onModifyNew = async (data: any) => {
    if (
      data.Mst_Department.DepartmentCode !== "" &&
      data.Mst_Department.DepartmentName !== ""
    ) {
      const resp = await api.Mst_DepartmentControl_Update({
        ...data,
        FlagActive: data.FlagActive === "true" ? "1" : "0",
      });
      if (resp.isSuccess) {
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
  // Section: CRUD operations

  const onCreateNew = async (data: any & { __KEY__: string }) => {
    if (
      data.Mst_Department.DepartmentCode !== "" &&
      data.Mst_Department.DepartmentName !== ""
    ) {
      const resp = await api.Mst_DepartmentControl_Create({
        ...data,
        FlagActive: data.FlagActive === "true" ? "1" : "0",
      });

      if (resp.isSuccess) {
        setPopupVisible(false);
        toast.success(t("Create Successfully"));
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

  const onCreate = (data: any) => {};
  const onModify = (data: any, id: any) => {};
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

  const handleSearch = async (data: any) => {
    setSearchCondition({
      ...searchCondition,
      ...data,
    });
    // await refetch();
  };
  const handleEditRowChanges = () => {};

  const loadingControl = useVisibilityControl({ defaultVisible: false });
  const handleDeleteRows = async (ids: any) => {
    // loadingControl.open();
    const resp = await api.Mst_DepartmentControl_Delete(ids[0]);
    // loadingControl.close();
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
    <AdminContentLayout className={"Department_Control"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart onAddNew={handleAddNew}></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <GridViewPopup
          isLoading={isLoading}
          dataSource={data?.isSuccess ? data.DataList ?? [] : []}
          columns={columns}
          keyExpr={"DepartmentCode"}
          formSettings={formSettings}
          onReady={(ref) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          onEditorPreparing={handleEditorPreparing}
          onEditRowChanges={handleEditRowChanges}
          onDeleteRows={handleDeleteRows}
          onEditRow={handleOnEditRow}
          storeKey={"department-control-columns"}
        />
        <DepartMentControlPopupView
          onEdit={onModifyNew}
          formSettings={formSettings}
          onCreate={onCreateNew}
          title={t("DepartMent Control Information")}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
