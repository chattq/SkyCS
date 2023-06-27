import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration, useVisibilityControl } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { PageHeaderLayout } from "@/packages/layouts/page-header-layout";
import { showErrorAtom } from "@/packages/store";
import { BaseCardView } from "@/packages/ui/card-view/card-view";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import React, { useRef, useState } from "react";
import HeaderPart from "./Components/header-part";
import { searchConditions } from "./Components/use-column-search";
import { GridViewRaw } from "@/packages/ui/base-gridview/GridViewRaw";
import { BaseGridView, GridViewPopup } from "@/packages/ui/base-gridview";
import { useColumn } from "./Components/use-columns";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { useToolbar } from "./Components/toolbarItem";

const Eticket = () => {
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const { t } = useI18n("Eticket");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const config = useConfiguration();
  const { auth } = useAuth();
  const loadingControl = useVisibilityControl({ defaultVisible: false });
  const [searchCondition, setSearchCondition] = useState({
    FlagOutOfDate: "",
    FlagNotRespondingSLA: "",
    DepartmentCode: "",
    AgentCode: "",
    TicketStatus: "",
    TicketPriority: "",
    TicketDeadline: "",
    TicketType: "",
    CustomerCodeSys: "",
    TicketDetail: "",
    TicketName: "",
    TicketID: "",
    CreateDTimeUTCFrom: "",
    CreateDTimeUTCTo: "",
    LogLUDTimeUTCFrom: "",
    LogLUDTimeUTCTo: "",
    TicketSourceFrom: "",
    TicketSourceTo: "",
    OrgID: auth.orgData?.Id ?? "",
    NetworkID: auth.networkId ?? "",
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
  });
  let gridRef: any = useRef<any>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["Eticket_Search"],
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

  const handleToggleSearchPanel = () => {
    console.log("handleToggleSearchPanel", gridRef?.instance);
    setSearchPanelVisibility((visible) => !visible);
  };

  const columnSearch = searchConditions();
  const columns = useColumn();
  const toolbar = useToolbar();

  const handleSearch = () => {};

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
            <GridViewCustomize
              isLoading={isLoading}
              dataSource={data?.isSuccess ? data.DataList ?? [] : []}
              columns={columns}
              keyExpr={"TicketID"}
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
