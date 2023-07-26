import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import { Button, LoadPanel, ScrollView, TabPanel, Tabs } from "devextreme-react";
import { Item as TabItem } from "devextreme-react/tabs";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { PartReply } from "./part-reply";
import { PartMessageList } from "./part-message-list";
import { PartDetailInfo } from "./part-detail-info";
import { EticketT } from "@/packages/types";
import { useI18n } from "@/i18n/useI18n";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useEticket_api } from "@/packages/api/clientgate/Api_Eticket_Demo";
import { useHub } from "@/packages/hooks/useHub";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { useSetAtom } from "jotai";
import { toast } from "react-toastify";
export const Tab_Detail = ({
  data,
  listMedia,
  dataDynamicField,
}: {
  data: EticketT;
  listMedia: any[];
  dataDynamicField: any[];
}) => {
  const [loading, setLoading] = useState(false);
  const [valueGim, setValueGim] = useState<any[]>([]);
  const ticketApi = useEticket_api();
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const dataValue = useMemo(() => {
    return ticketApi.getDemoEticket();
  }, []);

  let dataRender = [];
  useEffect(() => {
    if (data?.Lst_ET_TicketMessagePin?.length) {
      dataRender = [data.Lst_ET_TicketMessagePin[0]].map((item: any) => {
        return {
          ...item,
          checkPin: true,
          dataPin: data.Lst_ET_TicketMessagePin,
        };
      });
      setValueGim([...dataRender, ...data.Lst_ET_TicketMessage]);
    } else {
      setValueGim(data.Lst_ET_TicketMessage);
    }
  }, []);

  const hub = useHub("global");
  useEffect(() => {
    hub.onReceiveMessage("ET_TicketMessage", (c) => {
      handleGim();
    });
  }, []);

  const handleGim = useCallback(async () => {
    setLoading(true);
    const responseCallMessage = await api.GetMessageByTicketID(
      data.Lst_ET_Ticket[0].TicketID
    );
    if (responseCallMessage.isSuccess) {
      toast.success(t("GetMessageByTicketID Success"));
      const { Lst_ET_TicketMessagePin, Lst_ET_TicketMessage } =
        responseCallMessage.Data;

      if (Lst_ET_TicketMessagePin?.length) {
        dataRender = [Lst_ET_TicketMessagePin[0]].map((item: any) => {
          return {
            ...item,
            checkPin: true,
            dataPin: data.Lst_ET_TicketMessagePin,
          };
        });
        console.log("...dataRender, ...data.Lst_ET_TicketMessage ", [
          ...dataRender,
          ...data.Lst_ET_TicketMessage,
        ]);
        setValueGim([...dataRender, ...data.Lst_ET_TicketMessage]);
        setLoading(false);
      } else {
        setValueGim(Lst_ET_TicketMessage);
        setLoading(false);
      }
    } else {
      showError({
        message: t(responseCallMessage.errorCode),
        debugInfo: responseCallMessage.debugInfo,
        errorInfo: responseCallMessage.errorInfo,
      });
    }
  }, []);

  const windowSize = useWindowSize();
  const { t } = useI18n("Eticket_Detail");
  const scrollHeight = windowSize.height - 100;
  if (loading) {
    return <LoadPanel visible={loading} />;
  }
  return (
    <ResponsiveBox className={"w-full"}>
      <Row></Row>
      <Col ratio={3}></Col>
      <Col ratio={1}></Col>
      <Item>
        <Location row={0} col={0} />
        <ScrollView style={{ maxHeight: scrollHeight }}>
          <div className="w-full" style={{ background: "#F5F7F9" }}>
            <PartReply dataValue={data} listMedia={listMedia} onReload={handleGim} />
            <PartMessageList data={data} value={valueGim} onGim={handleGim} />
          </div>
        </ScrollView>
      </Item>
      <Item>
        <Location row={0} col={1} />
        <PartDetailInfo data={data} dataDynamicField={dataDynamicField} />
      </Item>
    </ResponsiveBox>
  );
};
