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
import React, {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import HeaderPart from "./Components/header-part";
import { useColumnSearch } from "./Components/use-column-search";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { useToolbar } from "./Components/toolbarItem";
import { LoadPanel } from "devextreme-react";
import { compareDates, getDateNow, getYearMonthDate } from "@/components/ulti";
import { confirm } from "devextreme/ui/dialog";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { match } from "ts-pattern";
import TransformCustomer from "./Components/popup/TransformCustomer";
import { popupVisibleAtom } from "./Components/popup/store";
import Eticket_Merger from "./Components/popup/Eticket_Merge";
import In_Charge_Of_Tranfer from "./Components/popup/In_Charge_Of_Tranfer";
import { dataFormAtom } from "../SLA/components/store";
import Eticket_Split from "./Components/popup/Eticket_Split";
import { toast } from "react-toastify";
import { useNetworkNavigate } from "@/components/useNavigate";
import { number } from "ts-pattern/dist/patterns";
import { useColumn } from "./Components/use-columns";
import { formatDate } from "@/packages/common";
import DataGrid from "devextreme-react/data-grid";
import { FlagActiveEnum } from "@/packages/types";

interface SearchProps {
  FlagOutOfDate: boolean;
  FlagNotRespondingSLA: boolean;
  DepartmentCode: string;
  AgentCode: string;
  TicketStatus: string;
  TicketPriority: string;
  TicketDeadline: string;
  TicketType: string;
  CustomerCodeSys: string;
  TicketDetail: string;
  TicketName: string;
  TicketID: string;
  CreateDTimeUTCFrom: string;
  CreateDTimeUTCTo: string;
  LogLUDTimeUTCFrom: string;
  LogLUDTimeUTCTo: string;
  TicketSourceFrom: string;
  TicketSourceTo: string;
  TickerFollower: string;
  OrgID: string;
  NetworkID: string;
  Ft_PageIndex: number;
  Ft_PageSize: number;
}

const Eticket = () => {
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const { t } = useI18n("Eticket");
  const [popUp, setPopUp] = useState<ReactNode>(<></>);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const config = useConfiguration();
  const { auth } = useAuth();
  const [filterApi, setFilterApi] = useState<any>({});
  const setPopupVisible = useSetAtom(popupVisibleAtom);
  const loadingControl = useVisibilityControl({ defaultVisible: false });
  const navigate = useNetworkNavigate();
  const { data: dataUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["GetForCurrentUser"],
    queryFn: async () => {
      const response = await api.GetForCurrentUser();
      if (response.isSuccess) {
        return response.Data?.Sys_User;
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    },
  });
  const defaultCondition = {
    CreateDTimeUTCFrom: "",
    CreateDTimeUTCTo: "",
    LogLUDTimeUTCFrom: "",
    LogLUDTimeUTCTo: "",
    TicketSourceFrom: "",
    TicketSourceTo: "",
    TickerFollower: "",
    // FlagOutOfDate: "",
    // FlagNotRespondingSLA: "",
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

    // OrgID: "" ?? "",
    // NetworkID: "" ?? "",
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
  };
  const [searchCondition, setSearchCondition] = useState<Partial<SearchProps>>({
    ...defaultCondition,
  });
  let gridRef: any = useRef<any>(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ET_Ticket_Search", JSON.stringify(searchCondition)],
    queryFn: async () => {
      let conditionParam = {
        ...searchCondition,
        FlagOutOfDate:
          searchCondition?.FlagOutOfDate === undefined
            ? ""
            : searchCondition?.FlagOutOfDate === true
            ? "1"
            : "0",
        FlagNotRespondingSLA:
          searchCondition?.FlagNotRespondingSLA === undefined
            ? ""
            : searchCondition?.FlagNotRespondingSLA === true
            ? "1"
            : "0",
      };
      const response = await api.ET_Ticket_Search(conditionParam);
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

  const {
    data: getListTicketPriority,
    isLoading: isLoadingListTicketPriority,
  } = useQuery({
    queryKey: ["Mst_TicketPriority_GetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_TicketPriority_GetAllActive();
      if (response.isSuccess) {
        return response?.Data?.Lst_Mst_TicketPriority ?? [];
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
        return response.DataList ?? [];
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
        return response.DataList ?? [];
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

  const { data: getEnterprise, isLoading: isLoadingEnterprise } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await api.Mst_Customer_Search({
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
        FlagActive: FlagActiveEnum.Active,
        CustomerType: "TOCHUC",
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
  });

  const setDefaultPopUp = () => {
    setPopupVisible(false);
    setPopUp(<></>);
  };

  useEffect(() => {
    return () => {
      setDefaultPopUp();
    };
  }, []);

  const handleSetPopUp = (title: string, data: ETICKET_REPONSE[]) => {
    match(title)
      .with("Merge", () => {
        setPopUp(
          <Eticket_Merger
            onCancel={() => setDefaultPopUp()}
            onSave={(): void => {}}
            dataRow={data}
          />
        );
      })
      .with("Split", () => {
        setPopUp(
          <Eticket_Split
            onCancel={() => setDefaultPopUp()}
            onSave={(): void => {}}
            dataRow={data}
          />
        );
      })
      .with("UpdateAgentCode", () => {
        setPopUp(
          <In_Charge_Of_Tranfer
            onCancel={() => setDefaultPopUp()}
            onSave={(): void => {}}
            dataRow={data}
          />
        );
      })
      .with("UpdateCustomer", () => {
        setPopUp(
          <TransformCustomer
            onCancel={() => setDefaultPopUp()}
            onSave={(): void => {}}
            dataRow={data}
          />
        );
      })
      .otherwise(() => {
        setPopUp(
          <TransformCustomer
            onCancel={() => setDefaultPopUp()}
            onSave={(): void => {}}
            dataRow={data}
          />
        );
      });
    setPopupVisible(true);
  };

  const handleShowPopUp = (title: string, dataRow: ETICKET_REPONSE[]) => {
    if (title === "response") {
      navigate(`eticket/detail/${dataRow[0].TicketID}`);
      return;
    } else {
      handleSetPopUp(title, dataRow);
    }
  };

  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleSetField = useCallback(
    (titleButton: string, ref: any) => {
      console.log("ref ", ref.instance);

      match(titleButton)
        .with("All", () => {
          ref.instance?.clearFilter();
        })
        .with("Open", () => {
          ref.instance?.filter(["TicketStatus", "=", "OPEN"]);
        })
        .with("Process", () => {
          ref.instance?.filter(["TicketStatus", "=", "PROCESS"]);
        })
        .with("ONHOLD", () => {
          ref.instance?.filter(function (itemData: any) {
            console.log("itemData", itemData);
            return !itemData.AgentCode;
          });
        })
        .with("Responsibility", () => {
          ref.instance?.filter(["AgentCode", "=", dataUser.UserCode]);
        })
        .with("Closed", () => {
          ref.instance?.filter(["TicketStatus", "=", "CLOSED"]);
        })
        .with("Follower", () => {
          ref.instance?.filter(["AgentCode", "=", dataUser.UserCode]);
        })
        .with("OutOfDate", () => {
          ref.instance?.filter(function (itemData: any) {
            console.log("itemData", itemData.TicketDeadline);
            return (
              compareDates(getDateNow(), itemData.TicketDeadline) &&
              itemData.TicketStatus !== "OPEN"
            );
          });
          // ref.instance?.filter([
          //   "TicketDeadline",
          //   "<",
          //   formatDate(new Date(getDateNow())),
          // ]);
          // console.log("getDateNow()", formatDate(new Date(getDateNow())));
        })
        // .with("Process", () =>
        //   setFilterApi(() => {
        //     const newList = data?.DataList ?? [];
        //     return newList.filter((item) => item.TicketStatus === "PROCESS");
        //   })
        // )
        // .with("Process", () =>
        //   setFilterApi(() => {
        //     const newList = data?.DataList ?? [];
        //     return newList.filter((item) => item.TicketStatus === "PROCESS");
        //   })
        // )
        .otherwise(() => {});
    },
    [isLoading]
  );

  useEffect(() => {
    if (!isLoading) {
      setFilterApi(data?.DataList);
    }
  }, [isLoading]);

  const handleDelete = async (data: ETICKET_REPONSE[]) => {
    // const value = data[0].TicketID;
    // const obj = {
    //   ET_Ticket: {
    //     TicketID: value,
    //   },
    // };
    console.log("data ", data);

    const param = data.map((item) => {
      return {
        OrgID: item.OrgID,
        TicketID: item.TicketID,
      };
    });

    const response = await api.ET_Ticket_DeleteMultiple(param);
    if (response.isSuccess) {
      toast.success(t("Delete Success"));
      await refetch();
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

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

  const handleClose = async (data: ETICKET_REPONSE[]) => {
    const param = data.map((item: ETICKET_REPONSE) => {
      return {
        OrgID: item.OrgID,
        TicketID: item.TicketID,
      };
    });

    const response = await api.ET_Ticket_CloseMultiple(param);
    if (response.isSuccess) {
      toast.success(t("Close Success"));
      await refetch();
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const columns = useColumn();
  const toolbar = useToolbar({
    data: data?.DataList ?? [],
    onClose: showPopUpClose,
    onDelete: showPopUpDelete,
    onSetStatus: handleSetField,
    onShowPopUp: handleShowPopUp,
    dataUser: dataUser,
  });

  const columnSearch = useColumnSearch({
    listAgent: getListAgent ?? [],
    listCustomer: getListCustomer ?? [],
    listDepart: getListDepart ?? [],
    listTypeEticket: getListEticketType ?? [],
    listOrg: getListOrg ?? [],
    ListTicketPriority: getListTicketPriority ?? [],
    listEnterprise: getEnterprise ?? [],
  });

  const handleSearch = async (data: any) => {
    console.log("data ", data);

    setSearchCondition({
      ...searchCondition,
      ...data,
      TicketStatus: data?.TicketStatus ? data.TicketStatus.join(",") : "",
      TickerFollower: data?.TickerFollower ? data.TickerFollower.join(",") : "",
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
  console.log("data ", data);
  const hanldeAdd = () => {};
  return (
    <AdminContentLayout className={"Category_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart onAddNew={hanldeAdd} />
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
                isLoadingListEticketType ||
                isLoadingListTicketPriority ||
                isLoadingListOrg ||
                isLoadingUser ||
                isLoadingEnterprise
              }
              showIndicator={true}
              showPane={true}
            />
            <GridViewCustomize
              isSingleSelection={false}
              isLoading={isLoading}
              dataSource={data?.isSuccess ? data?.DataList ?? [] : []}
              columns={columns}
              keyExpr={"TicketID"}
              onReady={(ref) => {
                gridRef = ref;
              }}
              allowSelection={true}
              onSelectionChanged={() => {}}
              hidenTick={true}
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
            {popUp}
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Eticket;
