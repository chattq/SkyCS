import { useI18n } from "@/i18n/useI18n";
import { Form } from "devextreme-react";
import {
  GroupItem,
  Tab,
  TabPanelOptions,
  TabbedItem,
} from "devextreme-react/form";
import Customer_Detail from "./Detal_Customer/Customer_Detail";

interface tabInterface {
  title: string;
  component: React.ReactNode;
}

const Tabs = () => {
  const { t } = useI18n("Mst_Customer_Detail");

  const tab: tabInterface[] = [
    {
      title: t("all"),
      component: <></>,
    },
    {
      title: t("History Call"),
      component: <></>,
    },
    {
      title: t("eTicket"),
      component: <></>,
    },
    {
      title: t("Campaign"),
      component: <></>,
    },
    {
      title: t("Detail Customer"),
      component: <Customer_Detail />,
    },
    {
      title: t("List_Contract"),
      component: <></>,
    },
    {
      title: t("History change"),
      component: <></>,
    },
    {
      title: t("History changed"),
      component: <></>,
    },
  ];

  return (
    <Form>
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
  );
};

export default Tabs;
