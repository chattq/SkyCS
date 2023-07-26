import { Tabs } from "devextreme-react";
import { useState } from "react";
import Tab_All from "./tabs/Tab_All/Tab_All";
import Tab_CustomerCampaign from "./tabs/Tab_CustomerCampaign/Tab_CustomerCampaign";
import Tab_CustomerContract from "./tabs/Tab_CustomerContact/Tab_CustomerContract";
import Tab_CustomerDetail from "./tabs/Tab_CustomerDetail/Tab_CustomerDetail";
import Tab_CustomerEticket from "./tabs/Tab_CustomerEticket/Tab_CustomerEticket";
import Tab_CustomerHist from "./tabs/Tab_CustomerHist/Tab_CustomerHist";
import Tab_CustomerHistCall from "./tabs/Tab_CustomerHistCall/Tab_CustomerHistCall";

const Customer_Tabs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const dataSource = [
    {
      id: 0,
      text: "Tất cả",
      component: <Tab_All />,
    },
    {
      id: 1,
      text: "Lịch sử cuộc gọi",
      component: <Tab_CustomerHistCall />,
    },
    {
      id: 2,
      text: "eTicket",
      component: <Tab_CustomerEticket />,
    },
    {
      id: 3,
      text: "Chiến dịch",
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
    <>
      <Tabs
        dataSource={dataSource}
        selectedIndex={currentIndex}
        onItemClick={(value: any) => {
          setCurrentIndex(value.itemIndex);
        }}
      />
      {currentComponent}
    </>
  );
};

export default Customer_Tabs;
