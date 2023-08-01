import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/useI18n";

import "./Rpt_Call.scss";
import { Item as TabItem } from "devextreme-react/tabs";

import { nanoid } from "nanoid";
import { Tabs } from "devextreme-react";
import { format, set } from "date-fns";
import { EticketLayout } from "@/packages/layouts/eticket-layout";

import { Tab_CallHistory } from "../components/Tabs_RptCall/Tab_CallHistory/Tab_CallHistory";
import Tab_Call from "../components/Tabs_RptCall/Tab_Call/Tab_Call";
import { Tab_CallHistoryToAgent } from "../components/Tabs_RptCall/Tab_CallHistoryToAgent/Tab_CallHistoryToAgent";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";

export const Rpt_CallPage = () => {
  const { t } = useI18n("Rpt_Call");
  const [currentTab, setCurrentTab] = useState(0);
  const [dataCallSummary, setDataCallSummary] = useState({});
  const [dataCallHistory, setDataCallHistory] = useState<any>({});

  const ListTab = [
    {
      id: 0,
      component: <Tab_Call />,
    },
    {
      id: 1,
      component: <Tab_CallHistory />,
    },
    {
      id: 2,
      component: <Tab_CallHistoryToAgent />,
    },
  ];
  const outlet = ListTab?.filter((item: any) => {
    if (item?.id === currentTab) {
      return item?.component;
    }
  })[0]?.component;
  const onItemClick = (e: any) => {
    setCurrentTab(e.itemIndex);
  };
  console.log(
    "dataCallSummary ",
    dataCallSummary,
    "dataCallHistory ",
    dataCallHistory
  );

  const { auth } = useAuth();
  useEffect(() => {
    callApi
      .rpt_GetCallHistoryFull(auth.networkId, {
        fromDate: "2023-07-01",
        toDate: "2023-07-31",
        agentId: 0,
        ccNumber: "", //số tổng đài
        callType: "All", // All/Incoming/Outgoing
        callStatus: "Succeed", // 'Succeed/Missed/""'
        callId: 0,
        tag: "", //nghiệp vụ
      })
      .then((resp) => {
        setDataCallHistory(resp.Data);
      });

    callApi
      .rpt_GetCallSummary(auth.networkId, {
        period: "day", //day/hour
        fromDate: "2023-07-01",
        toDate: "2023-07-31",
        agentId: 0,
        ccNumber: "", //số tổng đài
        callType: "All", // All/Incoming/Outgoing
      })
      .then((resp) => {
        setDataCallSummary(resp.Data);
      });
  }, []);

  return (
    <EticketLayout className={"eticket monitor"}>
      <EticketLayout.Slot name={"Header"}>
        <div className={"w-full flex flex-col"}>
          <div className={"page-header w-full flex items-center p-2"}>
            <div className={"before px-4 mr-auto"}>
              <strong>{t("Report Call")}</strong>
            </div>
          </div>
        </div>
      </EticketLayout.Slot>

      <EticketLayout.Slot name={"Content"}>
        <div className={"w-full detail"}>
          <div
            className={"w-full flex flex-col pl-3 pt-0 sep-bottom-1 tab-ctn-1"}
          >
            <Tabs
              width={490}
              onItemClick={onItemClick}
              selectedIndex={currentTab}
            >
              <TabItem text={t("Call")}></TabItem>
              <TabItem text={t("Call history")}></TabItem>
              <TabItem text={t("Call history to Agent")}></TabItem>
            </Tabs>
          </div>
          <div className={"w-full flex flex-col"}>{outlet}</div>
        </div>
      </EticketLayout.Slot>
    </EticketLayout>
  );
};
