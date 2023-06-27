import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { Form } from "devextreme-react";
import {
  GroupItem,
  Tab,
  TabPanelOptions,
  TabbedItem,
} from "devextreme-react/form";
import React, { ReactNode, useRef } from "react";
import Zalo_channel from "../components/Zalo_channel";
import Email_Channel from "../components/Email_Channel";
import SMS_Channel from "../components/SMS_Channel";
import Call_Channel from "../components/Call_Channel";
interface tabInterface {
  title: string;
  component: ReactNode;
}
export default function OmiChanelPage() {
  const { t } = useI18n("SearchMST");
  const formRef = useRef<any>();

  const tab = [
    {
      title: t("Email"),
      component: <Email_Channel />,
    },
    {
      title: t("Zalo"),
      component: <Zalo_channel />,
    },
    {
      title: t("SMS"),
      component: <SMS_Channel />,
    },
    {
      title: t("Call"),
      component: <Call_Channel />,
    },
  ];
  return (
    <AdminContentLayout className={"SearchMST"}>
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <Form validationGroup="campaignForm" ref={formRef}>
          <GroupItem>
            <TabbedItem>
              <TabPanelOptions deferRendering={false} />
              {tab.map((item: tabInterface) => {
                return (
                  <Tab key={item.title} title={item.title}>
                    {item.component}
                  </Tab>
                );
              })}
            </TabbedItem>
          </GroupItem>
        </Form>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
}
