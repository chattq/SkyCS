import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import { GridViewPopup } from "@packages/ui/base-gridview";
import { useEffect, useRef, useState } from "react";

import { PopupView } from "@/pages/User_Mananger/components";
import {
  AvatarData,
  avatar,
  dataFormAtom,
  dataTableAtom,
  flagEdit,
  keywordAtom,
  selectedItemsAtom,
  showDetail,
} from "@/pages/User_Mananger/components/store";

import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import { useConfiguration, useVisibilityControl } from "@packages/hooks";
import { logger } from "@packages/logger";
import { showErrorAtom } from "@packages/store";
import {
  FlagActiveEnum,
  Mst_Dealer,
  SearchDealerParam,
  SearchUserControlParam,
  SysUserData,
} from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import "./User_Mananger.scss";

import { useDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import { DataGrid, LoadPanel } from "devextreme-react";

import { showPopup } from "@/pages/User_Mananger/components/store";
import { PageHeaderLayout } from "@/packages/layouts/page-header-layout";
import { HeaderPart } from "../components/header-part";
import { toast } from "react-toastify";
import { ColumnOptions } from "@/types";

export const UserManangerPage = () => {
  const { t } = useI18n("User_Mananger");
  let gridRef: any = useRef<DataGrid | null>(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const setDataTable = useSetAtom(dataTableAtom);
  const setDataForm = useSetAtom(dataFormAtom);
  const setFlag = useSetAtom(flagEdit);
  const setAvt = useSetAtom(avatar);
  const keyword = useAtomValue(keywordAtom);

  const [searchCondition, setSearchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    UserName: "",
    EMail: "",
    UserCode: "",
    PhoneNo: "",
    KeyWord: "",
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["User_Mananger", JSON.stringify(searchCondition)],
    () =>
      api.Sys_User_Search({
        ...searchCondition,
      })
  );
  const { data: listMST } = useQuery(["listMST"], () =>
    api.Mst_NNTController_GetAllActive()
  );
  const { data: listDepartMent } = useQuery(["listDepartMent"], () =>
    api.Mst_DepartmentControl_GetAllActive()
  );
  const { data: listGroup } = useQuery(["listGroup"], () =>
    api.Sys_GroupController_GetAllActive()
  );

  const columns = useDealerGridColumns({ data: data?.Data?.DataList });
  const formSettings = useFormSettings({
    data: listMST?.DataList,
    dataListDepartment: listDepartMent?.DataList,
    dataListGroup: listGroup?.DataList,
  });

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    // console.log("a");
    setFlag(true);
    setAvt(undefined);
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
    // if (["DealerCode", "DealerType", "ProvinceCode"].includes(e.dataField!)) {
    //   e.editorOptions.readOnly = !e.row?.isNewRow;
    // } else if (e.dataField === "FlagActive") {
    //   e.editorOptions.value = true;
    // } else if (["FlagDirect", "FlagTCG"].includes(e.dataField!)) {
    //   e.editorOptions.value = "0";
    // }
  };
  const handleOnEditRow = async (e: any) => {
    setShowDetail(false);
    const resp = await api.Sys_User_Data_GetByUserCode(e.row.data.UserCode);
    if (resp.isSuccess) {
      setAvt(resp?.Data?.Avatar);
      setDataForm({
        ...resp.Data,
        FlagNNTAdmin: resp.Data?.FlagNNTAdmin === "1" ? true : false,
        FlagSysAdmin: resp.Data?.FlagSysAdmin === "1" ? true : false,
      });
    }
    setFlag(false);
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

  const onModifyNew = async (data: SysUserData) => {
    if (data.EMail !== "" && data.UserCode !== "") {
      const resp = await api.Sys_User_Update({
        ...data,
        FlagNNTAdmin: data.FlagNNTAdmin === "true" ? "1" : "0",
        FlagSysAdmin: data.FlagSysAdmin === "true" ? "1" : "0",
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
  const onCreateNew = async (data: SysUserData & { __KEY__: string }) => {
    const { __KEY__, ...rest } = data;
    if (data.EMail !== "" && data.UserCode !== "") {
      const resp = await api.Sys_User_Create({
        ...rest,
        FlagNNTAdmin: rest.FlagNNTAdmin === "true" ? "1" : "0",
        FlagSysAdmin: rest.FlagSysAdmin === "true" ? "1" : "0",
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
  const onModify = (id: string, data: Mst_Dealer) => {};
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
      KeyWord: data,
    });
    await refetch();
  };

  const handleEditRowChanges = () => {};

  const loadingControl = useVisibilityControl({ defaultVisible: false });
  const handleDeleteRows = async (ids: any) => {
    const resp = await api.Sys_User_Data_Delete(ids);
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
  const handleUploadFile = () => {};
  const handleDownloadTemplate = () => {};

  return (
    <AdminContentLayout className={"User_Mananger"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderLayout>
          <PageHeaderLayout.Slot name={"Before"}>
            <div className="font-bold dx-font-m">{t("User Manager")}</div>
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"Center"}>
            <HeaderPart
              refetch={refetch}
              onAddNew={handleAddNew}
              onSearch={handleSearch}
            />
          </PageHeaderLayout.Slot>
        </PageHeaderLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <GridViewPopup
          isLoading={isLoading}
          dataSource={data?.isSuccess ? data.DataList ?? [] : []}
          columns={columns}
          keyExpr={"UserCode"}
          popupSettings={popupSettings}
          formSettings={formSettings}
          onReady={(ref) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          onEditorPreparing={handleEditorPreparing}
          onEditRowChanges={handleEditRowChanges}
          onDeleteRows={handleDeleteRows}
          onEditRow={handleOnEditRow}
          storeKey={"User-Manager-columns"}
        />
        <PopupView
          onCreate={onCreateNew}
          onEdit={onModifyNew}
          formSettings={formSettings}
          title={t("User Manager")}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
