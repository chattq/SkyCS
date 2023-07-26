import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useEticket_api } from "@/packages/api/clientgate/Api_Eticket_Demo";
import { EticketLayout } from "@/packages/layouts/eticket-layout";
import { showErrorAtom } from "@/packages/store";
import PartHeaderInfo from "@/pages/eticket/eticket/Components/Info/Detail/part-header-info";
import { Tab_Attachments } from "@/pages/eticket/eticket/Components/Info/Detail/tab-attachments";
import { Tab_Detail } from "@/pages/eticket/eticket/Components/Info/Detail/tab-detail";
import { useAuth } from "@packages/contexts/auth";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel, Tabs } from "devextreme-react";
import { Item as TabItem } from "devextreme-react/tabs";
import { useSetAtom } from "jotai";
import { useMemo, useState } from "react";
import "src/pages/admin-page/admin-page.scss";
//import { useHub } from '@/packages/hooks/useHub';

export const CustomerEticket_Popup = ({ TicketID }: any) => {
  const { t } = useI18n("Eticket_Detail");
  const { auth } = useAuth();
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);

  //const { auth: { currentUser } } = useAuth();
  const { data: dataTicket, isLoading } = useQuery({
    queryKey: ["ET_Ticket_GetByTicketID", TicketID],
    queryFn: async () => {
      if (TicketID) {
        const payload = {
          TicketID: TicketID ?? "",
          OrgID: auth.orgData?.Id ?? "",
        };

        const response = await api.ET_Ticket_GetByTicketID(payload);
        if (response.isSuccess) {
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

  const [currentTab, setCurrentTab] = useState(0);

  const ticketApi = useEticket_api();

  //const [data, setData] = useState<Eticket | null>(ticketApi.getDemoEticket());

  const data = useMemo(() => {
    return ticketApi.getDemoEticket();
  }, []);

  const onItemClick = (e: any) => {
    setCurrentTab(e.itemIndex);
  };

  return (
    <EticketLayout className={"eticket"}>
      <EticketLayout.Slot name={"Header"}></EticketLayout.Slot>
      <EticketLayout.Slot name={"Content"}>
        <LoadPanel visible={isLoading} />
        {!isLoading && (
          <div className={"w-full detail"}>
            <PartHeaderInfo data={dataTicket} />
            <div
              className={
                "w-full flex flex-col pl-4 pt-0 sep-bottom-1 tab-ctn-1"
              }
            >
              <Tabs
                // width={400}
                onItemClick={onItemClick}
                selectedIndex={currentTab}
              >
                <TabItem text={t("eTicket Detail")}></TabItem>
                <TabItem text={t("WorkFlow")}></TabItem>
                <TabItem text={t("Attachments")}></TabItem>
              </Tabs>
            </div>
            <div className={"w-full flex flex-col"}>
              {currentTab == 0 ? (
                <Tab_Detail data={dataTicket} listMedia={[]} />
              ) : (
                <Tab_Attachments />
              )}
            </div>
          </div>
        )}
      </EticketLayout.Slot>
    </EticketLayout>
  );
};
export default CustomerEticket_Popup;
