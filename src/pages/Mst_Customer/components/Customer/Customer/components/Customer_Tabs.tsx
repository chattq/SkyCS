import { Tabs } from "devextreme-react";
import { useState } from "react";
import { Tab_CustomerDetail } from "./tabs/Tab_CustomerDetail/Tab_CustomerDetail";
import Tab_CustomerHist from "./tabs/Tab_CustomerHist/Tab_CustomerHist";

const Customer_Tabs = () => {
  const [currentIndex, setCurrentIndex] = useState(6);

  const dataSource = [
    {
      id: 0,
      text: "Tất cả",
      component: <></>,
    },
    {
      id: 1,
      text: "Lịch sử cuộc gọi",
      component: <></>,
    },
    {
      id: 2,
      text: "eTicket",
      component: <></>,
    },
    {
      id: 3,
      text: "Chiến dịch",
      component: <></>,
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
      component: <></>,
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
