import { AdminContentLayout } from "@layouts/admin-content-layout";
import { ColumnOptions, GridViewPopup } from "@packages/ui/base-gridview";
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
import { dataGridAtom, selectedItemsAtom } from "../components/store";
import { StatusButton } from "@/packages/ui/status-button";
import "./Cpn_CampaignAgent.scss";
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
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { LoadPanel, TagBox } from "devextreme-react";
import { removeDuplicateCampaigns } from "../components/RemoveDataDuplicate";
import { callApi } from "@/packages/api/call-api";

export const Cpn_CampaignAgentPage = () => {
  const { t } = useI18n("Cpn_CampaignAgent");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const setSelectedItems = useSetAtom(selectedItemsAtom);
  const api = useClientgateApi();
  const [dataGrid, setDataGrid] = useAtom(dataGridAtom);

  const [searchCondition, setSearchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    KeyWord: "",
    CampaignCode: "",
    AgentCode: "",
  });
  const auth = useAtomValue(authAtom);
  const { data: listUser } = useQuery(
    ["listUser"],
    () => api.Sys_User_GetAllActive() as any
  );

  const { data: getCampaing, isLoading: isLoadingGetCampaign } = useQuery({
    queryKey: ["Cpn_CampaignAgent_GetActive"],
    queryFn: async () => {
      return api.Cpn_CampaignAgent_Search({});
    },
  });

  const { data, isLoading, refetch } = useQuery(
    ["Cpn_CampaignAgent", JSON.stringify(searchCondition)],
    async () => {
      const response = await api.Sys_User_GetAllActive();

      if (response.isSuccess) {
        const resp = api.Cpn_CampaignAgent_Search({
          ...searchCondition,
          CampaignCode: searchCondition.CampaignCode
            ? searchCondition.CampaignCode.join(",")
            : null,
          AgentCode: searchCondition.AgentCode
            ? searchCondition.AgentCode.join(",")
            : response?.DataList?.filter(
                (item: any) =>
                  item.EMail.toLowerCase() ===
                  auth.currentUser.Email.toLowerCase()
              )
            ? response?.DataList?.filter(
                (item: any) =>
                  item.EMail.toLowerCase() ===
                  auth.currentUser.Email.toLowerCase()
              )[0]?.UserCode
            : "",
        });
        return resp;
      }
    }
  );

  useEffect(() => {
    if (data) {
      callApi.getOrgAgentList(auth.networkId).then((resp) => {
        if (resp.Success) {
          const dataGridFormat = data?.Data?.map((item: any, index: any) => {
            const matchedUser = resp?.Data?.find(
              (user: any) =>
                user.Name?.toLowerCase() === item?.UserName?.toLowerCase()
            );
            const Ext = matchedUser ? matchedUser.Alias : "";
            console.log(124, matchedUser);
            console.log(125, Ext);
            return {
              ...item,
              Extension: Ext,
            };
          });
          setDataGrid(dataGridFormat ?? []);
        }
      });
    }
  }, [data]);

  const columns = useBankDealerGridColumns({ data: data?.Data || [] });

  const formItems: IItemProps[] = [
    {
      caption: t("CampaignCode"),
      dataField: "CampaignCode",
      label: {
        text: t("CampaignName"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        placeholder: t("Input"),
        displayExpr: "CampaignName",
        valueExpr: "CampaignCode",
        searchEnabled: true,
        dataSource: removeDuplicateCampaigns(getCampaing?.Data ?? []),
      },
      visible: true,
    },
    {
      dataField: "AgentCode",
      caption: t("AgentCode"),
      label: {
        text: t("Agent"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        // placeholder: t("Input"),
        displayExpr: "UserName",
        valueExpr: "UserCode",
        searchEnabled: true,
        dataSource: listUser?.DataList ?? [],
      },
      render: (param: any) => {
        const { dataField, component: formComponent } = param;
        return (
          <TagBox
            className="mb-2"
            defaultValue={
              searchCondition.AgentCode
                ? searchCondition.AgentCode
                : [
                    listUser?.DataList?.filter(
                      (item: any) =>
                        item.EMail.toLowerCase() ===
                        auth.currentUser.Email.toLowerCase()
                    )
                      ? listUser?.DataList?.filter(
                          (item: any) =>
                            item.EMail.toLowerCase() ===
                            auth.currentUser.Email.toLowerCase()
                        )[0]?.UserCode
                      : "",
                  ]
            }
            height={30}
            onValueChange={(data) => {
              formComponent.updateData(dataField, data);
            }}
            dataSource={listUser?.DataList ?? []}
            searchEnabled={true}
            displayExpr="UserName"
            valueExpr="UserCode"
          />
        );
      },
      visible: true,
    },
  ];

  const handleDeleteRows = async (rows: any) => {
    const resp = await api.Mst_Area_Delete(rows);
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
  const handleAddNew = () => {
    gridRef.current._instance.addRow();
  };

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
    title: t("Cpn_CampaignAgent Information"),
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

  const handleSearch = async () => {
    await refetch();
  };
  const handleOnEditRow = (e: any) => {
    const { row, column } = e;
    handleEdit(row.rowIndex);
  };
  const handleEditRowChanges = () => {};

  return (
    <AdminContentLayout className={"Cpn_CampaignAgent"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="font-bold dx-font-m py-[16px] ml-[40px]">
          {t("Cpn_CampaignAgent")}
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              storeKey="Cpn_CampaignAgent_Search"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <LoadPanel
              container={".dx-viewport"}
              shadingColor="rgba(0,0,0,0.4)"
              position={"center"}
              visible={isLoading || isLoadingGetCampaign}
              showIndicator={true}
              showPane={true}
            />
            <GridViewCustomize
              cssClass="Cpn_CampaignAgent_Grid"
              // isHidenHeaderFilter={false}
              isLoading={isLoading || isLoadingGetCampaign}
              dataSource={dataGrid ?? []}
              columns={columns}
              keyExpr={"CampaignCode"}
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
              storeKey={"Cpn_CampaignAgent-columns"}
              customToolbarItems={[]}
              isHiddenCheckBox={true}
              isSingleSelection={false}
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
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
