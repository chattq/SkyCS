import 'src/pages/admin-page/admin-page.scss';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from "@packages/contexts/auth";
import { useI18n } from '@/i18n/useI18n';
import { EticketLayout } from '@/packages/layouts/eticket-layout';
import { Height } from 'devextreme-react/chart';
import { Button, TabPanel, Tabs } from 'devextreme-react';
import { Item as TabItem } from 'devextreme-react/tabs';
import {
  Eticket,
} from "@packages/types";
import "./monitor.scss"
import { useEticket_api } from '@/packages/api/clientgate/Api_Eticket_Demo';
import { Tab_CallMonitor } from './tab-call-monitor';
import { Tab_AgentMonitor } from './tab-agent-monitor';

export const MonitorPage = () => {
  const { t } = useI18n("Common");
  //const { auth: { currentUser } } = useAuth();

  const [currentTab, setCurrentTab] = useState(0);

  const onItemClick = (e: any) => {

    setCurrentTab(e.itemIndex);
  }

  return (

    <EticketLayout className={'eticket monitor'}>
      <EticketLayout.Slot name={'Header'}>
        <div className={'w-full flex flex-col'}>
          <div className={'page-header w-full flex items-center p-2'}>
            <div className={'before px-4 mr-auto'}>
              <strong>Giám sát</strong>
            </div>

          </div>
        </div>
      </EticketLayout.Slot>


      <EticketLayout.Slot name={'Content'}>

        <div className={'w-full detail'}>

          <div className={'w-full flex flex-col pl-4 pt-0 sep-bottom-3 tab-ctn-1'}>
            <Tabs
              width={300}
              onItemClick={onItemClick}
              selectedIndex={currentTab}
            >
              <TabItem
                text="Giám sát cuộc gọi"


              >
              </TabItem>

              <TabItem
                text="Giám sát agent"

              >
              </TabItem>

            </Tabs>
          </div>
          <div className={'w-full flex flex-col'}>
            {currentTab == 0 ? <Tab_CallMonitor /> : <Tab_AgentMonitor />}
          </div>
        </div>


      </EticketLayout.Slot>

    </EticketLayout >
  );
};
export default MonitorPage;
