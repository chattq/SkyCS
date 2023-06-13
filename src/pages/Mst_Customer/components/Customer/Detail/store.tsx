import { useI18n } from "@/i18n/useI18n";
import Detail_Customer from "./Detal_Customer/Detail_Customer";
import { Form } from "devextreme-react";
import {
  GroupItem,
  Tab,
  TabPanelOptions,
  TabbedItem,
} from "devextreme-react/form";

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
      component: <Detail_Customer />,
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
