import "src/pages/admin-page/admin-page.scss";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@packages/contexts/auth";
import { useI18n } from "@/i18n/useI18n";
import { EticketLayout } from "@/packages/layouts/eticket-layout";
import { Height } from "devextreme-react/chart";
import { Button, LoadPanel, TabPanel, Tabs } from "devextreme-react";
import { Item as TabItem } from "devextreme-react/tabs";
import { Tab_Detail } from "./tab-detail";
import { Tab_Attachments } from "./tab-attachments";
import { Eticket } from "@packages/types";
import "../../../../eticket.scss";
import { useEticket_api } from "@/packages/api/clientgate/Api_Eticket_Demo";
import PartHeaderInfo from "./part-header-info";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { useSetAtom } from "jotai";
import { useConfiguration, useNetworkNavigate } from "@/packages/hooks";
import { useHub } from "@/packages/hooks/useHub";
import { Icon, IconName } from "@/packages/ui/icons";
import { currentTabAtom, currentValueTabAtom, reloadingtabAtom } from "./store";
import { nanoid } from "nanoid";

export const EticketDetailPage = () => {
  const { t } = useI18n("Eticket_Detail");
  const { auth } = useAuth();
  const param = useParams();
  const api: any = useClientgateApi();
  const setCurrentTag = useSetAtom(currentTabAtom);
  const showError = useSetAtom(showErrorAtom);
  const setCurrentValueTab = useSetAtom(currentValueTabAtom);
  const setReloadingtab = useSetAtom(reloadingtabAtom);
  const navigate = useNetworkNavigate();
  //const { auth: { currentUser } } = useAuth();
  // const hub = useHub("global");
  // useEffect(() => {
  //   hub.onReceiveMessage("dungvatest", (c) => {
  //     console.log("dungvatest ", c);
  //   });
  // });

  const {
    data: dataTicket,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ET_Ticket_GetByTicketID", param?.TicketID],
    queryFn: async () => {
      if (param?.TicketID) {
        const payload = {
          TicketID: param?.TicketID ?? "",
          OrgID: auth.orgData?.Id ?? "",
        };

        const response = await api.ET_Ticket_GetByTicketID(payload);
        if (response.isSuccess) {
          if (response.Data !== undefined && response.Data !== null) {
            const objETicket =
              response.Data.Lst_ET_Ticket.lenght > 0
                ? response.Data.Lst_ET_Ticket[0]
                : null;
            if (objETicket !== undefined && objETicket !== null) {
              // titleETicket = `${objETicket.TicketName} - ${objETicket.TicketID}`;
            }
          }
          return response.Data;
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
          return {
            Lst_ET_Ticket: [{}],
            Lst_ET_TicketAttachFile: [{}],
            Lst_ET_TicketCustomer: [{}],
            Lst_ET_TicketFollower: [{}],
            Lst_ET_TicketMessage: [{}],
          };
        }
      } else {
        return {
          Lst_ET_Ticket: [{}],
          Lst_ET_TicketAttachFile: [{}],
          Lst_ET_TicketCustomer: [{}],
          Lst_ET_TicketFollower: [{}],
          Lst_ET_TicketMessage: [{}],
        };
      }
    },
  });

  const handleNavigate = () => {
    navigate(`/eticket/edit/${dataTicket.Lst_ET_Ticket[0].TicketID}`);
  };

  const { data: dataListMedia, isLoading: isLoadingListMedia } = useQuery({
    queryKey: ["MstSubmissionForm/Search"],
    queryFn: async () => {
      if (param?.TicketID) {
        const response = await api.Mst_SubmissionForm_Search({
          Ft_PageSize: 1000,
          Ft_PageIndex: 0,
          FlagActive: 1,
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
      } else {
      }
    },
  });

  const { data: dataDynamicField, isLoading: isLoadingDynamicField } = useQuery(
    {
      queryFn: async () => {
        const response = await api.Mst_TicketColumnConfig_GetAllActive();
        if (response.isSuccess) {
          const listData = response.Data.Lst_Mst_TicketColumnConfig;
          if (listData.length) {
            const filterMasterData = listData
              .filter((item: any) => {
                return (
                  item.TicketColCfgDataType === "MASTERDATASELECTMULTIPLE" ||
                  item.TicketColCfgDataType === "MASTERDATA"
                );
              })
              .map((item: any) => {
                return item.TicketColCfgCodeSys;
              });
            if (filterMasterData.length) {
              const responseListOption =
                await api.Mst_TicketColumnConfig_GetListOption(
                  filterMasterData,
                  auth.orgData?.Id ?? ""
                );
              if (responseListOption.isSuccess) {
                const responseData =
                  responseListOption?.Data.Lst_Mst_TicketColumnConfig;
                const customizeDataResponse = listData.map((item: any) => {
                  const itemCheck = responseData.find((itemOption: any) => {
                    return (
                      itemOption.TicketColCfgCodeSys ===
                      item.TicketColCfgCodeSys
                    );
                  });
                  if (itemCheck) {
                    return {
                      ...item,
                      dataSource: itemCheck.Lst_MD_OptionValue,
                    };
                  } else {
                    return item;
                  }
                });

                return customizeDataResponse;
              } else {
                showError({
                  message: t(responseListOption.errorCode),
                  debugInfo: responseListOption.debugInfo,
                  errorInfo: responseListOption.errorInfo,
                });
              }
            } else {
              return response.Data.Lst_Mst_TicketColumnConfig;
            }
          }

          return response.Data.Lst_Mst_TicketColumnConfig;
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
        }
      },
      queryKey: ["Mst_TicketColumnConfig_GetAllActive", [param?.TicketID]],
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  const [currentTab, setCurrentTab] = useState(0);

  const onItemClick = (e: any) => {
    setCurrentTab(e.itemIndex);
  };

  if (isLoading || isLoadingListMedia || isLoadingDynamicField) {
    return <LoadPanel position={{ of: "#root" }} />;
  }

  const handleBackToManager = () => {
    navigate("/eticket/eticket_manager");
  };

  const handleResponse = () => {
    const messList = dataTicket.Lst_ET_TicketMessage;
    if (Array.isArray(messList)) {
      if (messList.length) {
        const item = messList[0];
        const itemFind = messList.find((item) => item?.ConvMessageType !== "9");
        let flag: IconName | "eventlog" = "remark";
        let flagIncoming = "";
        if (item.IsIncoming === "0") {
          flagIncoming = "out";
        }
        if (item.IsIncoming === "1") {
          flagIncoming = "in";
        }
        let obj: any = {
          ActionType: "0",
          MessageSend: "",
          OrgID: item.OrgID,
          SubFormCode: "",
          SubTitleSend: "",
          TicketID: item.TicketID,
        };

        // const { flag } = firtChild;

        switch (itemFind?.ConvMessageType) {
          case "1": {
            if (itemFind.ChannelId === "0") {
              flag = "note";
            }
            break;
          }
          case "9": {
            if (itemFind.ChannelId === "0") {
              flag = "eventlog";
            }
            break;
          }
          case "3": {
            if (itemFind?.ChannelId === "1") {
              flag = "email" + flagIncoming;
            }
            break;
          }
          case "11": {
            if (itemFind?.ChannelId === "2") {
              if (itemFind.State === "6") {
                flag = "call";
              } else {
                flag = "callmissed" + flagIncoming;
              }
              // flag = "call";
            }
            break;
          }
          case "8":
          case "10": {
            if (itemFind?.ChannelId === "6") {
              flag = "zalo" + flagIncoming;
            }
            break;
          }

          default: {
            flag = "remark";
            break;
          }
        }

        switch (flag) {
          case "zaloout":
          case "zaloin": {
            obj = {
              ...obj,
              ObjType: "",
              ObjCode: "",
            };

            if (
              itemFind.ChannelId === "6" &&
              itemFind.ConvMessageType === "8"
            ) {
              obj = {
                // zalo
                ...obj,
                ObjType: "ZaloUserId",
                ObjCode: itemFind.ObjectReceiveId,
              };
            }
            if (
              itemFind.ChannelId === "6" &&
              itemFind.ConvMessageType === "10"
            ) {
              obj = {
                // phone
                ...obj,
                ObjType: "PhoneNo",
                ObjCode: itemFind.ObjectReceiveId,
                ZNS: [],
              };
            }
            setCurrentValueTab(obj);
            setReloadingtab(nanoid());
            setCurrentTag(0);
            break;
          }
          case "emailout":
          case "emailin": {
            obj = {
              CtmEmail: itemFind.ObjectReceiveId,
              SubTitleSend: "",
              SubFormCode: "",
            };
            setCurrentValueTab(obj);
            setReloadingtab(nanoid());
            setCurrentTag(1);
            break;
          }
          case "remark": {
            setCurrentTag(4);

            break;
          }
          case "callin":
          case "callmissedin":
          case "callmissedout":
          case "callOut": {
            setReloadingtab(nanoid());
            setCurrentTag(2);
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  };

  return (
    <EticketLayout className={"eticket eticket-detail"}>
      <EticketLayout.Slot name={"Header"}>
        {!dataTicket ? (
          <></>
        ) : (
          <div className={"w-full flex flex-col"}>
            <div className={"page-header w-full flex items-center p-2"}>
              <div className={"before mr-auto"}>
                <div className="breadcrumb breadcrumb-eticket-detail flex align-items-center">
                  <span
                    className="cursor-pointer"
                    onClick={handleBackToManager}
                  >
                    {t("Eticket Manager")}
                  </span>
                  <Icon name="right"></Icon>
                  <strong>{t("Eticket Detail")}</strong>
                </div>
              </div>
              <div className={"center flex flex-grow justify-end ml-auto"}>
                <Button
                  stylingMode={"contained"}
                  type="default"
                  text={t("Response")}
                  className="mr-1"
                  onClick={handleResponse}
                />
                <Button
                  stylingMode={"contained"}
                  type="default"
                  text={t("Update")}
                  className="mr-1"
                  onClick={handleNavigate}
                />
              </div>
            </div>
          </div>
        )}
      </EticketLayout.Slot>
      <EticketLayout.Slot name={"Content"}>
        {!dataTicket ? (
          <></>
        ) : (
          <div className={"w-full detail"}>
            <PartHeaderInfo data={dataTicket} onReload={refetch} />
            <div className="separator"></div>
            <div
              className={
                "w-full flex flex-col pl-4 pt-0 sep-bottom-1 tab-ctn-1"
              }
            >
              <Tabs onItemClick={onItemClick} selectedIndex={currentTab}>
                <TabItem text={t("eTicket Detail")}></TabItem>
                <TabItem text={t("Attachments")}></TabItem>
              </Tabs>
            </div>
            <div className={"w-full flex flex-col"}>
              {currentTab == 0 ? (
                <Tab_Detail
                  data={dataTicket}
                  listMedia={dataListMedia}
                  dataDynamicField={dataDynamicField}
                />
              ) : (
                <Tab_Attachments onReload={refetch} data={dataTicket} />
              )}
            </div>
          </div>
        )}
      </EticketLayout.Slot>
    </EticketLayout>
  );
};
export default EticketDetailPage;
