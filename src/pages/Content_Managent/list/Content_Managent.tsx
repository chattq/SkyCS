import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useEffect, useReducer, useRef, useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import { useAtomValue, useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { FlagActiveEnum, Mst_Area } from "@packages/types";
import { useConfiguration } from "@packages/hooks";
import { IPopupOptions } from "devextreme-react/popup";
import { IFormOptions, IItemProps } from "devextreme-react/form";
import { flagEditorOptionsSearch, zip } from "@packages/common";
import { toast } from "react-toastify";
import { authAtom, showErrorAtom } from "@packages/store";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import {
  checkUIZNSAtom,
  refetchAtom,
  selectedItemsAtom,
  valueIDAtom,
} from "../components/store";
import { useClientgateApi } from "@/packages/api";
import { useBankDealerGridColumns } from "../components/use-columns";
import { nanoid } from "nanoid";
import NavNetworkLink from "@/components/Navigate";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react";

export const Content_ManagentPage = () => {
  const { t } = useI18n("Content_Managent");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const setValueID = useSetAtom(valueIDAtom);
  const refetchData = useAtomValue(refetchAtom);
  const setcheckUIZNS = useSetAtom(checkUIZNSAtom);
  const navigate = useNavigate();
  const auth = useAtomValue(authAtom);

  const [searchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    KeyWord: "",
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Content_Managent", JSON.stringify(searchCondition), refetchData],
    () =>
      api.Mst_SubmissionForm_Search({
        ...searchCondition,
      })
  );
  useEffect(() => {
    if (refetchData === true) {
      refetch();
    }
  }, [refetchData]);

  const columns = useBankDealerGridColumns({ data: data?.DataList || [] });

  const handleDeleteRows = async (rows: any) => {};
  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    gridRef.current._instance.addRow();
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
    title: t("Content_Managent Information"),
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

  const onDelete = async (id: any) => {
    // const resp = await api.Mst_BankDealer_Delete(id);
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
  const handleAddnew = () => {
    navigate(`/${auth.networkId}/admin/Content_Managent/Content_Edit`);
    setValueID(false);
    setcheckUIZNS(false);
  };

  return (
    <AdminContentLayout className={"Content_Managent"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="flex gap-3 items-center">
              <div className="font-bold dx-font-m text-size">
                {t("Content Manager")}
              </div>
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
              onClick={handleAddnew}
            />
            {/* <Button
              stylingMode={"contained"}
              type="default"
              className="Cancel_Post_Detail"
              text={t("Cancel")}
              onClick={() => navigate(-1)}
            /> */}
          </PageHeaderNoSearchLayout.Slot>
        </PageHeaderNoSearchLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <GridViewCustomize
          isLoading={isLoading}
          dataSource={
            data?.isSuccess
              ? data?.DataList.filter(
                  (item: any) => item.OrgID === auth.orgId.toString()
                ) ?? []
              : []
          }
          columns={columns}
          keyExpr={["SubFormCode"]}
          popupSettings={popupSettings}
          formSettings={{}}
          onReady={(ref) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          onEditorPreparing={handleEditorPreparing}
          onEditRow={handleOnEditRow}
          onEditRowChanges={handleEditRowChanges}
          onDeleteRows={handleDeleteRows}
          toolbarItems={[]}
          storeKey={"Content_Managent-columns"}
          isHiddenCheckBox={true}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
