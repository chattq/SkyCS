import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel, Tabs } from "devextreme-react";
import { Item } from "devextreme-react/tab-panel";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Tab_All from "./tabs/Tab_All/Tab_All";
import Tab_CustomerCampaign from "./tabs/Tab_CustomerCampaign/Tab_CustomerCampaign";
import Tab_CustomerContract from "./tabs/Tab_CustomerContact/Tab_CustomerContract";
import Tab_CustomerDetail from "./tabs/Tab_CustomerDetail/Tab_CustomerDetail";
import Tab_CustomerEticket from "./tabs/Tab_CustomerEticket/Tab_CustomerEticket";
import Tab_CustomerHist from "./tabs/Tab_CustomerHist/Tab_CustomerHist";
import Tab_CustomerHistCall from "./tabs/Tab_CustomerHistCall/Tab_CustomerHistCall";

export const bagde = (number: number) => {
  return (
    <div className="bg-red-600 w-[20px] h-[20px] text-white flex items-center justify-center rounded-[50%]">
      {number}
    </div>
  );
};

export const Text_All = () => {
  const countTab = useAtomValue(countTabAtom);

  return (
    <div className="flex gap-1 items-center">
      <div>Tất cả</div>
      {countTab.All > 0 && <div>{bagde(countTab.All)}</div>}
    </div>
  );
};

export const Text_HistCall = () => {
  const countTab = useAtomValue(countTabAtom);

  return (
    <div className="flex gap-1 items-center">
      <div>Lịch sử cuộc gọi</div>
      {countTab.HistCall > 0 && <div>{bagde(countTab.HistCall)}</div>}
    </div>
  );
};

export const Text_eTicket = () => {
  const countTab = useAtomValue(countTabAtom);

  return (
    <div className="flex gap-1 items-center">
      <div>eTicket</div>
      {countTab.eTicket > 0 && <div>{bagde(countTab.eTicket)}</div>}
    </div>
  );
};

export const Text_Campagin = () => {
  const countTab = useAtomValue(countTabAtom);

  return (
    <div className="flex gap-1 items-center">
      <div>Chiến dịch</div>
      {countTab.Campaign > 0 && <div>{bagde(countTab.Campaign)}</div>}
    </div>
  );
};

export const countTabAtom = atom<any>({
  All: 0,
  HistCall: 0,
  eTicket: 0,
  Campaign: 0,
});

const Customer_Tabs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { CustomerCodeSys }: any = useParams();

  const api = useClientgateApi();

  const setCountTab = useSetAtom(countTabAtom);

  const { data, isLoading, refetch } = useQuery(["countAll"], async () => {
    const resp: any = await api.Mst_Customer_GetAllByCustomerCodeSys(
      CustomerCodeSys
    );

    const {
      Lst_Biz_BizAllOrder,
      Lst_Call_Call,
      Lst_Cpn_CampaignCustomer,
      Lst_ET_Ticket,
    } = resp?.Data;

    setCountTab({
      All: Lst_Biz_BizAllOrder?.length ?? 0,
      HistCall: Lst_Call_Call?.length ?? 0,
      eTicket: Lst_ET_Ticket?.length ?? 0,
      Campaign: Lst_Cpn_CampaignCustomer?.length ?? 0,
    });

    return resp;
  });

  const dataSource = [
    {
      id: 0,
      text: <Text_All />,
      component: <Tab_All />,
    },
    {
      id: 1,
      text: <Text_HistCall />,
      component: <Tab_CustomerHistCall />,
    },
    {
      id: 2,
      text: <Text_eTicket />,
      component: <Tab_CustomerEticket />,
    },
    {
      id: 3,
      text: <Text_Campagin />,
      component: <Tab_CustomerCampaign />,
    },
    {
      id: 4,
      text: "Chi tiết khách hàng",
      component: (
        <>
          <Tab_CustomerDetail />
        </>
      ),
    },
    {
      id: 5,
      text: "Danh sách liên hệ",
      component: (
        <>
          <Tab_CustomerContract />
        </>
      ),
    },
    {
      id: 6,
      text: "Lịch sử thay đổi",
      component: (
        <>
          <Tab_CustomerHist />
        </>
      ),
    },
  ];

  const currentComponent = dataSource.find(
    (item: any) => item.id === currentIndex
  )?.component;

  return (
    <div>
      <Tabs
        // dataSource={dataSource}
        selectedIndex={currentIndex}
        onItemClick={(value: any) => {
          setCurrentIndex(value.itemIndex);
          refetch();
        }}
      >
        {dataSource?.map((item: any) => {
          return (
            <Item key={nanoid()}>
              <div className="normal-case">{item?.text}</div>
            </Item>
          );
        })}
      </Tabs>
      <div className="pr-2 pl-2">
        {currentComponent}
      </div>

      <LoadPanel
        container={".dx-viewport"}
        shadingColor="rgba(0,0,0,0.4)"
        position={"center"}
        visible={isLoading}
        showIndicator={true}
        showPane={true}
      />
    </div>
  );
};

export default Customer_Tabs;
