import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration, useVisibilityControl } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import React, { useCallback, useEffect, useRef, useState } from "react";
import HeaderPart from "./Components/header-part";
import { useColumnSearch } from "./Components/use-column-search";
import { useColumn } from "./Components/use-columns";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { useToolbar } from "./Components/toolbarItem";
import { LoadPanel } from "devextreme-react";
import { getYearMonthDate } from "@/components/ulti";
import { confirm } from "devextreme/ui/dialog";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { match } from "ts-pattern";

const Eticket = () => {
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const { t } = useI18n("Eticket");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const config = useConfiguration();
  const { auth } = useAuth();
  const [filterApi, setFilterApi] = useState<any>({});
  const loadingControl = useVisibilityControl({ defaultVisible: false });
  const [searchCondition, setSearchCondition] = useState({
    FlagOutOfDate: "",
    FlagNotRespondingSLA: "",
    // DepartmentCode: "",
    // AgentCode: "",
    // TicketStatus: "",
    // TicketPriority: "",
    // TicketDeadline: "",
    // TicketType: "",
    // CustomerCodeSys: "",
    // TicketDetail: "",
    // TicketName: "",
    // TicketID: "",
    CreateDTimeUTCFrom: "",
    CreateDTimeUTCTo: "",
    LogLUDTimeUTCFrom: "",
    LogLUDTimeUTCTo: "",
    TicketSourceFrom: "",
    TicketSourceTo: "",
    // OrgID: "" ?? "",
    // NetworkID: "" ?? "",
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
  });
  let gridRef: any = useRef<any>(null);
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => {
      const response = await api.ET_Ticket_Search(searchCondition);
      if (response.isSuccess) {
        return response;
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    },
  });

  const { data: getListAgent, isLoading: isLoadingListAgent } = useQuery({
    queryKey: ["Sys_User_GetAllActive"],
    queryFn: async () => {
      const response = await api.Sys_User_GetAllActive();
      if (response.isSuccess) {
        return response.DataList;
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
        return [];
      }
    },
  });

  const { data: getListCustomer, isLoading: isLoadingListCustomer } = useQuery({
    queryKey: ["Mst_Customer_GetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_Customer_GetAllActive();
      if (response.isSuccess) {
        return response.DataList;
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
        return [];
      }
    },
  });

  const { data: getListDepart, isLoading: isLoadingListDepart } = useQuery({
    queryKey: ["Mst_DepartmentControl_GetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_DepartmentControl_GetAllActive();
      if (response.isSuccess) {
        return response.DataList;
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
        return [];
      }
    },
  });

  const { data: getListOrg, isLoading: isLoadingListOrg } = useQuery({
    queryKey: ["Mst_NNTController_GetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_NNTController_GetAllActive();
      if (response.isSuccess) {
        return response.DataList;
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
        return [];
      }
    },
  });

  const { data: getListEticketType, isLoading: isLoadingListEticketType } =
    useQuery({
      queryKey: ["Mst_TicketEstablishInfoApi_GetTicketType"],
      queryFn: async () => {
        const response = await api.Mst_TicketEstablishInfoApi_GetTicketType();
        if (response.isSuccess) {
          return response.Data.Lst_Mst_TicketType;
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
          return [];
        }
      },
    });

  const handleToggleSearchPanel = () => {
    console.log("handleToggleSearchPanel", gridRef?.instance);
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleSetField = useCallback(
    (titleButton: string) => {
      match(titleButton)
        .with("All", () => setFilterApi(data?.DataList))
        .otherwise(() =>
          setFilterApi(
            data?.DataList.filter((item) => item.TicketStatus === "OPEN")
          )
        );
    },
    [isLoading]
  );

  useEffect(() => {
    if (!isLoading) {
      setFilterApi(data?.DataList);
    }
  }, [isLoading]);

  const handleDelete = async (data: any) => {};

  const showPopUpClose = (data: ETICKET_REPONSE[]) => {
    let result = confirm(
      `<i>${t("Are you sure to change eTicket's status to closed ?")}</i>`,
      `${t("Closed Ticket")}`
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        handleClose(data);
      }
    });
  };

  const showPopUpDelete = (data: ETICKET_REPONSE[]) => {
    let result = confirm(
      `<i>${t("Are you sure to delete eticket ?")}</i>`,
      `${t("Delete Ticket")}`
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        handleDelete(data);
      }
    });
  };

  console.log("getListDepart ", getListDepart);

  const handleClose = async (data: any) => {};

  const columns = useColumn();
  const toolbar = useToolbar({
    onClose: showPopUpClose,
    onDelete: showPopUpDelete,
    onSetStatus: handleSetField,
  });
  const columnSearch = useColumnSearch({
    listAgent: getListAgent ?? [],
    listCustomer: getListCustomer ?? [],
    listDepart: getListDepart ?? [],
    listTypeEticket: getListEticketType ?? [],
    listOrg: getListOrg ?? [],
  });

  const handleSearch = async (data: any) => {
    setSearchCondition({
      ...searchCondition,
      ...data,
      FlagOutOfDate: data?.FlagOutOfDate ? "1" : "0",
      FlagNotRespondingSLA: data?.FlagNotRespondingSLA ? "1" : "0",
      TicketStatus: data?.TicketStatus ? data.TicketStatus.join(",") : "",
      CreateDTimeUTCFrom:
        data?.CreateDTimeUTCFrom !== ""
          ? getYearMonthDate(data?.CreateDTimeUTCFrom)
          : "",
      CreateDTimeUTCTo:
        data?.CreateDTimeUTCTo !== ""
          ? getYearMonthDate(data?.CreateDTimeUTCTo)
          : "",
      LogLUDTimeUTCFrom:
        data?.LogLUDTimeUTCFrom !== ""
          ? getYearMonthDate(data?.LogLUDTimeUTCFrom)
          : "",
      LogLUDTimeUTCTo:
        data?.LogLUDTimeUTCTo !== ""
          ? getYearMonthDate(data?.LogLUDTimeUTCTo)
          : "",
      TicketSourceFrom:
        data?.TicketSourceFrom !== ""
          ? getYearMonthDate(data?.TicketSourceFrom)
          : "",
      TicketSourceTo:
        data?.TicketSourceTo !== ""
          ? getYearMonthDate(data?.TicketSourceTo)
          : "",
      CustomerCodeSys: data?.CustomerCodeSys
        ? data.CustomerCodeSys.join(",")
        : "",
    });
  };
  const hanldeAdd = () => {};
  return (
    <AdminContentLayout className={"Category_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart onAddNew={hanldeAdd} searchCondition={searchCondition} />
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <div className={"w-[200px]"}>
              <SearchPanelV2
                conditionFields={columnSearch}
                storeKey="Mst_BankAccount_Search"
                data={searchCondition}
                onSearch={handleSearch}
              />
            </div>
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <LoadPanel
              container={".dx-viewport"}
              shadingColor="rgba(0,0,0,0.4)"
              position={"center"}
              visible={
                isLoading ||
                isLoadingListAgent ||
                isLoadingListCustomer ||
                isLoadingListDepart ||
                isLoadingListEticketType
              }
              showIndicator={true}
              showPane={true}
            />
            <GridViewCustomize
              isLoading={isLoading}
              dataSource={data?.isSuccess ? filterApi ?? [] : []}
              columns={columns}
              keyExpr={"TicketID"}
              isSingleSelection={false}
              onReady={(ref) => {
                gridRef = ref;
              }}
              allowSelection={true}
              onSelectionChanged={() => {}}
              onSaveRow={() => {}}
              onEditorPreparing={() => {}}
              onEditRowChanges={() => {}}
              onDeleteRows={() => {}}
              storeKey={"Eticket-manage"}
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
              customToolbarItems={toolbar}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Eticket;
