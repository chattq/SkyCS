import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import {
  Button,
  ScrollView,
  TabPanel,
  Tabs,
  DropDownBox,
  List,
} from "devextreme-react";
import { Item as TabItem } from "devextreme-react/tabs";
import { useState } from "react";
import { PartReplyZalo } from "./part-reply-zalo";
import { PartReplyEmail } from "./part-reply-email";
import { PartReplyCall } from "./part-reply-call";
import { PartReplyNote } from "./part-reply-note";
import { PartReplySms } from "./part-reply-sms";
import { useAtomValue, useSetAtom } from "jotai";
import { currentTabAtom } from "./store";

export const PartReply = ({
  dataValue,
  onReload,
  listMedia,
}: {
  dataValue: any;
  onReload: any;
  listMedia: any[];
}) => {
  const currentTabAtomValue = useAtomValue(currentTabAtom);
  const setCurrentTabAtomValue = useSetAtom(currentTabAtom);
  // const [currentTab, setCurrentTab] = useState(0);

  const onItemClick = (e: any) => {
    setCurrentTabAtomValue(e.itemIndex);
  };

  const unique = [...new Set(listMedia.map((item) => item.ChannelType))];
  let list = unique.reduce((acc, item) => {
    return {
      ...acc,
      [`${item}`]: [],
    };
  }, {});

  const media = listMedia.reduce((acc, item) => {
    const check = unique.includes(item.ChannelType);
    if (check) {
      return {
        ...acc,
        [`${item.ChannelType}`]: [...acc[`${item.ChannelType}`], item],
      };
    }
  }, list);

  const objEticket_AddRemark = {
    ActionType: "0",
    TicketID: dataValue?.Lst_ET_Ticket[0].TicketID || "",
    OrgID: dataValue?.Lst_ET_Ticket[0].OrgID || "",
    Description: "",
  };

  const getReplyContent = () => {
    if (currentTabAtomValue == 0)
      return (
        <PartReplyZalo onReload={onReload}
          dataValue={dataValue}
          listMedia={media}
          data={objEticket_AddRemark}
        />
      );
    if (currentTabAtomValue == 1)
      return (
        <PartReplyEmail onReload={onReload}
          dataValue={dataValue}
          listMedia={media}
          data={objEticket_AddRemark}
        />
      );
    if (currentTabAtomValue == 2) return <PartReplyCall onReload={onReload} />;
    if (currentTabAtomValue == 3)
      return <PartReplyNote onReload={onReload} data={objEticket_AddRemark} />;
    if (currentTabAtomValue == 4)
      return <PartReplyNote onReload={onReload} data={objEticket_AddRemark} />;
    if (currentTabAtomValue == 5)
      return <PartReplySms onReload={onReload} dataValue={dataValue} listMedia={media} />;
  };

  return (
    <div className={"w-full sep-bottom-5 pb-1"}>
      <div className={"w-full pt-0 sep-bottom-1 tab-ctn-2"}>
        <Tabs
          style={{ maxWidth: 600 }}
          onItemClick={onItemClick}
          selectedIndex={currentTabAtomValue}
        >
          <TabItem text="Zalo" />
          <TabItem text="Email" />
          <TabItem text="Call" />
          <TabItem text="Ghi chú" />
          {/* <TabItem text="Livechat" /> */}
          {/* <TabItem text="SMS" /> */}
        </Tabs>
      </div>

      {getReplyContent()}
    </div>
  );
};
