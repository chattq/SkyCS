import { AdminContentLayout } from "@layouts/admin-content-layout";
import { GridViewPopup } from "@packages/ui/base-gridview";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import { useAtomValue, useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import {
  FlagActiveEnum,
  Mst_CampaignTypeSearchParam,
  Mst_PaymentTermData,
} from "@packages/types";
import { useConfiguration, useNetworkNavigate } from "@packages/hooks";
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
import {
  ListInfoDetailCampaignValue,
  dataComponent,
  defaultValue,
  selectedItemsAtom,
} from "../components/store";
import { StatusButton } from "@/packages/ui/status-button";

import { useClientgateApi } from "@/packages/api";
import { useBankDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import { PopupViewComponent } from "../components/use-popup-view";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import {
  RequiredField,
  requiredType,
} from "@/packages/common/Validation_Rules";
import { nanoid } from "nanoid";
import { useAuth } from "@/packages/contexts/auth";

export const Mst_CampaignTypePage = () => {
  const { t } = useI18n("Mst_CampaignTypePage");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const navigate = useNetworkNavigate();
  const showError = useSetAtom(showErrorAtom);
  const [searchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    CampaignTypeName: "",
    CampaignTypeDesc: "",
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Mst_CampaignTypePage", JSON.stringify(searchCondition)],
    queryFn: async () => {
      const response = await api.Mst_CampaignType_Search({
        ...searchCondition,
      });

      if (response.isSuccess) {
        console.log("response.DataList ", response.DataList);

        const data: any[] = response.DataList ?? [];
        return data.map((item, index) => {
          return {
            Idx: index + 1,
            ...item,
          };
        });
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  const columns = useBankDealerGridColumns({ data: data || [] });

  const formItems: IItemProps[] = [
    {
      caption: t("CampaignTypeName"),
      label: {
        text: t("CampaignTypeName"),
      },
      dataField: "CampaignTypeName",
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      caption: t("CampaignTypeDesc"),
      label: {
        text: t("CampaignTypeDesc"),
      },
      dataField: "CampaignTypeDesc",
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      dataField: "FlagActive",
      caption: t("FlagActive"),
      label: {
        text: t("FlagActive"),
      },
      editorType: "dxSelectBox",
      editorOptions: flagEditorOptionsSearch,
    },
  ];

  const handleDeleteRows = async (rows: Mst_CampaignTypeSearchParam[]) => {
    console.log("rows ", rows);

    const response = await api.Mst_CampaignType_DeleteMultiple(rows);
    if (response.isSuccess) {
      toast.success(t("Delete Multiple Successfully"));
      refetch();
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleCancel = () => {
    gridRef.current?.instance?.cancelEditData();
  };
  const handleEdit = (rowData: any) => {
    // gridRef.current?.instance?.editRow(rowData);
    // console.log("rowData ", rowData.CampaignTypeCode);
    navigate(
      `/campaign/Mst_CampaignTypePage/Customize/detail/${rowData.CampaignTypeCode}`
    );
  };
  const handleSubmit = () => {
    gridRef.current?.instance?.saveEditData();
  };

  const handleEditorPreparing = (e: EditorPreparingEvent) => {
    // use this function to control how the editor looks like
    // if (e.dataField) {
    //   if (["OrgID", "PaymentTermCode"].includes(e.dataField!)) {
    //     e.editorOptions.readOnly = !e.row?.isNewRow;
    //   }
    // }
  };

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Mst_CampaignTypePage Information"),
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

  const onModify = async (id: any, data: Partial<any>) => {
    const resp = await api.Mst_PaymentTermController_Update({
      ...id,
      ...data,
    });
    if (resp.isSuccess) {
      toast.success(t("Update Successfully"));
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
  // Section: CRUD operations
  const onCreate = async (data: Mst_PaymentTermData & { __KEY__: string }) => {
    const { __KEY__, ...rest } = data;
    // console.log(230, data);
    const resp = await api.Mst_PaymentTermController_Create({
      ...rest,
      FlagActive: rest.FlagActive ? "1" : "0",
    });
    if (resp.isSuccess) {
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
  };

  const onDelete = async (id: any) => {
    console.log("id ", id);
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
    handleEdit(row.data);
  };
  const handleEditRowChanges = (e: any) => {
    console.log("e", e);
  };
  return (
    <AdminContentLayout className={"Mst_CampaignTypePage"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            {/* <div className={"w-[200px]"}> */}
              <SearchPanelV2
                storeKey="Mst_CampaignTypePage_Search"
                conditionFields={formItems}
                data={searchCondition}
                onSearch={handleSearch}
              />
            {/* </div> */}
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewPopup
              isLoading={isLoading}
              dataSource={data ?? []}
              columns={columns}
              keyExpr={["CampaignTypeCode", "OrgID"]}
              popupSettings={popupSettings}
              formSettings={formSettings}
              onReady={(ref) => (gridRef = ref)}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              onEditRow={handleOnEditRow}
              onEditRowChanges={handleEditRowChanges}
              onDeleteRows={handleDeleteRows}
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
              storeKey={"Mst_CampaignTypePage-columns"}
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
