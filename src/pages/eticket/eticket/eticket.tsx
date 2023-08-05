import { compareDates, getDateNow, getYearMonthDate } from "@/components/ulti";
import { useNetworkNavigate } from "@/components/useNavigate";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration, useVisibilityControl } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { FlagActiveEnum } from "@/packages/types";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel } from "devextreme-react";
import { confirm } from "devextreme/ui/dialog";
import { useSetAtom } from "jotai";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import HeaderPart from "./Components/header-part";
import Eticket_Merger from "./Components/popup/Eticket_Merge";
import Eticket_Split from "./Components/popup/Eticket_Split";
import In_Charge_Of_Tranfer from "./Components/popup/In_Charge_Of_Tranfer";
import TransformCustomer from "./Components/popup/TransformCustomer";
import { popupVisibleAtom } from "./Components/popup/store";
import { useToolbar } from "./Components/toolbarItem";
import { useColumnSearch } from "./Components/use-column-search";
import { useColumn } from "./Components/use-columns";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { dynamicFields } from "@/pages/admin/Cpn_Campaign/components/store";

interface SearchProps {
  FlagOutOfDate: boolean;
  TicketDeadline?: Date[];
  CreateDTimeUTC?: Date[];
  LogLUDTimeUTC?: Date[];
  FlagNotRespondingSLA: boolean;
  DepartmentCode: string[];
  AgentCode: string[];
  TicketStatus: string[];
  TicketPriority: string[];
  TicketType: string[];
  CustomerCodeSys: string[];
  TicketDetail: string;
  TicketName: string;
  TicketID: string;
  TicketSource: string[];
  Follower: string[];
  OrgID: string[];
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
  const setPopupVisible = useSetAtom(popupVisibleAtom);
  const navigate = useNetworkNavigate();
  const windowSize = useWindowSize();
  const widthSearch = windowSize.width / 5;

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
  const { data: ticketSourceList, isLoading: isLoadingTicketSource } = useQuery(
    ["ticketSourceList"],
    api.Mst_TicketSource_GetAllActive
  );

  const defaultCondition = {
    Ft_PageIndex: 0,
    TicketDeadline: [null, null],
    CreateDTimeUTC: [null, null],
    LogLUDTimeUTC: [null, null],
    Ft_PageSize: config.MAX_PAGE_ITEMS,
  };
  const [searchCondition, setSearchCondition] = useState<Partial<SearchProps>>({
    ...defaultCondition,
  });

  let gridRef: any = useRef();

  const { data: dataDynamic, isLoading: isLoadingDynamic } = useQuery({
    queryKey: ["Mst_TicketColumnConfig_GetAll"],
    queryFn: async () => {
      const response = await api.Mst_TicketColumnConfig_GetAll();
      if (response.isSuccess) {
        return response.Data?.Lst_Mst_TicketColumnConfig;
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "ET_Ticket_Search_Eticket_Manager",
      JSON.stringify(searchCondition),
    ],
    queryFn: async () => {
      console.log("searchCondition ", searchCondition);

      let conditionParam = {
        ...searchCondition,
        FlagOutOfDate: searchCondition?.FlagOutOfDate
          ? ""
          : searchCondition?.FlagOutOfDate === true
          ? "1"
          : "0",
        FlagNotRespondingSLA: searchCondition?.FlagNotRespondingSLA
          ? ""
          : searchCondition?.FlagNotRespondingSLA === true
          ? "1"
          : "0",
        TicketSource: searchCondition?.TicketSource
          ? searchCondition.TicketSource.join(",")
          : "",
        TicketStatus: searchCondition?.TicketStatus
          ? searchCondition.TicketStatus.join(",")
          : "",
        Follower: searchCondition?.Follower
          ? searchCondition.Follower.join(",")
          : "",
        TicketDeadlineFrom: searchCondition?.TicketDeadline[0]
          ? getYearMonthDate(searchCondition?.TicketDeadline[0])
          : "",
        TicketDeadlineTo: searchCondition?.TicketDeadline[1]
          ? getYearMonthDate(searchCondition?.TicketDeadline[1])
          : "",
        CreateDTimeUTCFrom: searchCondition?.CreateDTimeUTC[0]
          ? getYearMonthDate(searchCondition?.CreateDTimeUTC[0])
          : "",
        CreateDTimeUTCTo: searchCondition?.CreateDTimeUTC[1]
          ? getYearMonthDate(searchCondition?.CreateDTimeUTC[1])
          : "",
        LogLUDTimeUTCFrom: searchCondition?.LogLUDTimeUTC[0]
          ? getYearMonthDate(searchCondition?.LogLUDTimeUTC[0])
          : "",
        LogLUDTimeUTCTo: searchCondition?.LogLUDTimeUTC[1]
          ? getYearMonthDate(searchCondition?.LogLUDTimeUTC[1])
          : "",
        CustomerCodeSys: searchCondition?.CustomerCodeSys
          ? searchCondition.CustomerCodeSys.join(",")
          : "",
        TicketType: searchCondition?.TicketType
          ? searchCondition.TicketType.join(",")
          : "",
        DepartmentCode: searchCondition?.DepartmentCode
          ? searchCondition.DepartmentCode.join(",")
          : "",
        AgentCode: searchCondition?.AgentCode
          ? searchCondition.AgentCode.join(",")
          : "",
        TicketPriority: searchCondition?.TicketPriority
          ? searchCondition.TicketPriority.join(",")
          : "",
        OrgID: searchCondition?.OrgID ? searchCondition.OrgID.join(",") : "",
      };

      delete conditionParam.TicketDeadline;
      delete conditionParam.LogLUDTimeUTC;
      delete conditionParam.CreateDTimeUTC;

      const response = await api.ET_Ticket_Search(conditionParam);
      if (response.isSuccess) {
        const newResponse = {
          ...response,
        };
        const dataList = response.DataList ?? [];
        const newDataList = dataList.map((item) => {
          if (item.TicketJsonInfo) {
            const ticketJSON = JSON.parse(item.TicketJsonInfo);
            const ticket = Object.keys(ticketJSON)
              .map((item: string, index: number) => {
                return {
                  [`${item.split(".").join("")}`]:
                    Object.values(ticketJSON)[index],
                };
              })
              .reduce((acc: any, item: any) => {
                return {
                  ...acc,
                  ...item,
                };
              }, {});

            return {
              ...item,
              ...ticket,
            };
          }
          return {
            ...item,
          };
        });

        newResponse.DataList = newDataList;
        return newResponse;
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
        return response.Data.Lst_Mst_NNT ?? [];
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
    queryKey: ["Mst_Customer_Search_Eticket_Manager"],
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

  console.log("getEnterprise", getEnterprise);

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
        })
        .otherwise(() => {});
    },
    [isLoading]
  );

  const handleDelete = async (data: ETICKET_REPONSE[]) => {
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

  const handleExportExcel = async (data: any) => {
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
      TicketID: data.map((item: any) => item.TicketID).join(","),
    };

    const response = await api.ET_Ticket_Export(conditionParam);
    if (response.isSuccess) {
      toast.success(t("Export Excel success"));
      if (response.Data) {
        window.location = response.Data;
      }
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const columns = useColumn({
    ticketDynamic: dataDynamic ?? [],
  });
  const toolbar = useToolbar({
    data: data?.DataList ?? [],
    onClose: showPopUpClose,
    onDelete: showPopUpDelete,
    onSetStatus: handleSetField,
    onShowPopUp: handleShowPopUp,
    onExportExcel: handleExportExcel,
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
    ticketSourceList: ticketSourceList?.Data?.Lst_Mst_TicketSource ?? [],
  });

  const handleSearch = async (data: any) => {
    setSearchCondition({
      ...searchCondition,
      ...data,
    });
  };
  const hanldeAdd = () => {
    navigate("eticket/Add");
  };

  console.log("data  ++++++++++++++++++", data);

  return (
    <AdminContentLayout className={"Category_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart onAddNew={hanldeAdd} />
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <div
              style={{ minWidth: "300px" }}
              className={`w-[${widthSearch + ""}px]`}
            >
              <SearchPanelV2
                colCount={1}
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
                isLoadingEnterprise ||
                isLoadingTicketSource ||
                isLoadingDynamic
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
