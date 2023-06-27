import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import { useQuery } from "@tanstack/react-query";
import { FlagActiveEnum, Mst_PaymentTermData } from "@packages/types";
import { useConfiguration, useNetworkNavigate } from "@packages/hooks";
import { IPopupOptions } from "devextreme-react/popup";
import { IItemProps } from "devextreme-react/form";
import { toast } from "react-toastify";
import { showErrorAtom } from "@packages/store";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";

import { HeaderPart } from "../components/header-part";
import { flagSelectorAtom, selectedItemsAtom } from "../components/store";

import { useClientgateApi } from "@/packages/api";
import { useBankDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import { PopupViewComponent } from "../components/use-popup-view";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useAuth } from "@/packages/contexts/auth";
import { match } from "ts-pattern";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { useSetAtom } from "jotai";

export const Cpn_CampaignPage = () => {
  const { t } = useI18n("Cpn_CampaignPage");
  const setFlagSelector = useSetAtom(flagSelectorAtom);
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const { auth } = useAuth();
  const navigate = useNetworkNavigate();
  const [searchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    CampaignTypeName: "",
    CampaignTypeDesc: "",
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Cpn_CampaignPage", JSON.stringify(searchCondition)],
    async () => {
      const response = await api.Cpn_Campaign_Search(searchCondition);
      if (response.isSuccess) {
        return response;
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  const { data: listCampaignType, isLoading: isLoadingCampaignType } = useQuery(
    {
      queryKey: ["listCampaignType"],
      queryFn: async () => {
        const response = await api.Mst_CampaignType_Search({
          FlagActive: FlagActiveEnum.Active,
          Ft_PageIndex: 0,
          Ft_PageSize: 10000,
        });

        if (response.isSuccess) {
          return response.DataList;
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
        }
      },
    }
  );

  const columns = useBankDealerGridColumns({ data: data?.DataList || [] });

  console.log("listCampaignType", listCampaignType);
  const formItems: IItemProps[] = useMemo(() => {
    return [
      {
        dataField: "CreateDTimeUTCFrom",
        caption: t("CreateDTimeUTCFrom"),
        editorType: "dxDateBox",
        editorOptions: {
          type: "date",
          format: "yyyy-MM-dd",
        },
      },
      {
        dataField: "CreateDTimeUTCTo",
        caption: t("CreateDTimeUTCTo"),
        editorType: "dxDateBox",
        editorOptions: {
          type: "date",
          format: "yyyy-MM-dd",
        },
      },
      {
        dataField: "StartDTimeUTCFrom",
        caption: t("StartDTimeUTCFrom"),
        editorType: "dxDateBox",
        editorOptions: {
          type: "date",
          format: "yyyy-MM-dd",
        },
      },
      {
        dataField: "StartDTimeUTCTo",
        caption: t("StartDTimeUTCTo"),
        editorType: "dxDateBox",
        editorOptions: {
          type: "date",
          format: "yyyy-MM-dd",
        },
      },
      {
        dataField: "FinishDTimeUTCFrom",
        caption: t("FinishDTimeUTCFrom"),
        editorType: "dxDateBox",
        editorOptions: {
          type: "date",
          format: "yyyy-MM-dd",
        },
      },
      {
        dataField: "FinishDTimeUTCTo",
        caption: t("FinishDTimeUTCTo"),
        editorType: "dxDateBox",
        editorOptions: {
          type: "date",
          format: "yyyy-MM-dd",
        },
      },
      {
        dataField: "CampaignStatus",
        caption: t("CampaignStatus"),
        editorType: "dxTagBox",
        editorOptions: {
          dataSource: [
            {
              value: "1",
              text: t("Active"),
            },
            {
              value: "0",
              text: t("Inactive"),
            },
          ],
          displayExpr: "text",
        },
      },
      {
        dataField: "CampaignTypeCode",
        caption: t("CampaignTypeCode"),
        editorType: "dxSelectBox",
        editorOptions: {
          dataSource: listCampaignType ?? [],
          displayExpr: "CampaignTypeName",
          valueExpr: "CampaignTypeCode",
        },
      },
    ];
  }, [listCampaignType]);

  const handleDeleteRows = async (rows: any) => {
    const build: any = {
      Cpn_Campaign: {
        CampaignCode: rows?.CampaignCode,
        NetworkID: auth.networkId,
        OrgID: auth.orgData?.Id,
      },
      Lst_Cpn_CampaignAttachFile: [],
      Lst_Cpn_CampaignCustomer: [],
      Lst_Cpn_CampaignAgent: [],
    };
    const resp = await api.Cpn_Campaign_Delete(build);
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

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    console.log("handleToggleSearchPanel", gridRef?.instance);
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleCancel = () => {
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
    // if (e.dataField) {
    //   if (["OrgID", "PaymentTermCode"].includes(e.dataField!)) {
    //     e.editorOptions.readOnly = !e.row?.isNewRow;
    //   }
    // }
  };

  const toolBar: any[] = [
    {
      title: "Start",
      text: t("Start"),
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (
            ref.instance.getSelectedRowsData()[0] &&
            ref.instance.getSelectedRowKeys().length === 1
          ) {
            const status = ref.instance.getSelectedRowsData()[0].CampaignStatus;
            status === "APPROVE" ? (check = true) : false;
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) =>
        excuteChanges("Start", ref.instance.getSelectedRowsData()),
    },
    {
      title: "Pause",
      text: t("Pause"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length === 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;
              status === "Pause" ? (check = true) : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) =>
        excuteChanges("Pause", ref.instance.getSelectedRowsData()),
    },
    {
      title: "Approve",
      text: t("Approve"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length === 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;
              status === "PENDING" ? (check = true) : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) =>
        excuteChanges("Approve", ref.instance.getSelectedRowsData()),
    },
    {
      title: "Continue",
      text: t("Continue"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length === 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;
              status === "PAUSED" ? (check = true) : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) =>
        excuteChanges("Continue", ref.instance.getSelectedRowsData()),
    },
    {
      title: "Finish",
      text: t("Finish"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length === 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;
              status === "APPROVE" ||
              status === "STARTED" ||
              status === "PAUSED"
                ? (check = true)
                : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) =>
        excuteChanges("Finish", ref.instance.getSelectedRowsData()),
    },
    {
      text: t("Update"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length === 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;
              status === "PENDING" ? (check = true) : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) => {
        const code = ref.instance.getSelectedRowsData()[0].CampaignCode;
        setFlagSelector("update");
        navigate(`/admin/Cpn_CampaignPage/Cpn_Campaign_Info/${code}`);
      },
    },
    {
      text: t("Delete"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length === 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;
              status === "PENDING" ? (check = true) : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) => {
        const code = ref.instance.getSelectedRowsData()[0];
        handleDeleteRows(code);
      },
    },
  ];

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Cpn_CampaignPage Information"),
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

  const excuteChanges = async (Url: string, data: any[]) => {
    const obj = {
      OrgID: auth.orgData?.Id ?? "",
      CampaignCode: data[0].CampaignCode,
    };
    const response = await api.Cpn_Campaign_ExecuteState(obj, Url);
    if (response.isSuccess) {
      toast.success(t(`${Url} successfully`));
      await refetch();
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const handleSearch = async () => {
    await refetch();
  };
  const handleOnEditRow = (e: any) => {
    const { row, column } = e;
    handleEdit(row.rowIndex);
  };
  const handleEditRowChanges = (e: any) => {};
  return (
    <AdminContentLayout className={"Cpn_CampaignPage"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart />
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <div className={"w-[200px]"}>
              <SearchPanelV2
                storeKey="Cpn_CampaignPage_Search"
                conditionFields={formItems}
                data={searchCondition}
                onSearch={handleSearch}
              />
            </div>
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewCustomize
              isLoading={isLoading}
              dataSource={data?.isSuccess ? data.DataList ?? [] : []}
              columns={columns}
              keyExpr={"CampaignCode"}
              popupSettings={popupSettings}
              formSettings={formSettings}
              onReady={(ref) => (gridRef = ref)}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              // allowInlineEdit={false}
              onEditRowChanges={handleEditRowChanges}
              onDeleteRows={handleDeleteRows}
              // inlineEditMode="row"
              customToolbarItems={[...toolBar]}
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
              storeKey={"Cpn_CampaignPage-columns"}
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
