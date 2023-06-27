import 'src/pages/admin-page/admin-page.scss';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from "@packages/contexts/auth";
import { useI18n } from '@/i18n/useI18n';
import { EticketLayout } from '@/packages/layouts/eticket-layout';
import { Height } from 'devextreme-react/chart';
import { Button, TabPanel, Tabs } from 'devextreme-react';
import { Item as TabItem } from 'devextreme-react/tabs';
import { Tab_Detail } from './tab-detail';
import { Tab_Attachments } from './tab-attachments';
import { PartHeaderInfo } from './part-header-info';
import {
  Eticket,
} from "@packages/types";
import "../eticket.scss"
import { useEticket_api } from '@/packages/api/clientgate/Api_Eticket_Demo';
//import { useHub } from '@/packages/hooks/useHub';

export const EticketDetailPage = () => {
  const { t } = useI18n("Common");
  //const { auth: { currentUser } } = useAuth();

  const [currentTab, setCurrentTab] = useState(0);

  const ticketApi = useEticket_api();

  //const [data, setData] = useState<Eticket | null>(ticketApi.getDemoEticket());

  const data = useMemo(() => {
    return ticketApi.getDemoEticket();
  }, []);
  const onItemClick = (e: any) => {

    setCurrentTab(e.itemIndex);
  }

  //const hub = useHub("global");

  // useEffect(() => {
  //   hub.onReceiveMessage("Test", (retData) => {
  //     console.log('111')
  //   });
    
  // }, []);

  return (

    <EticketLayout className={'eticket'}>
      <EticketLayout.Slot name={'Header'}>
        <div className={'w-full flex flex-col'}>
          <div className={'page-header w-full flex items-center p-2'}>
            <div className={'before px-4 mr-auto'}>
              <strong>Chi tiết eTicket</strong>
            </div>
            <div className={'center flex flex-grow justify-end ml-auto'}>
              <Button
                stylingMode={"contained"}
                type="default"
                text="Phản hồi"
                className='mr-1'

              />
              <Button
                stylingMode={"contained"}
                type="default"
                text="Chỉnh sửa"
                className='mr-1'
              />
              <Button
                stylingMode={"contained"}
                type="default"
                text="Đánh giá"
                className='mr-1'
              />
            </div>
          </div>
        </div>
      </EticketLayout.Slot>


      <EticketLayout.Slot name={'Content'}>
        {data != null ?
          <div className={'w-full detail'}>
            <PartHeaderInfo data={data} />
            <div className={'w-full flex flex-col pl-4 pt-0 sep-bottom-3 tab-ctn-1'}>
              <Tabs
                width={300}
                onItemClick={onItemClick}
                selectedIndex={currentTab}
              >
                <TabItem
                  text="eTicket Detail"


                >
                </TabItem>

                <TabItem
                  text="Attachments"

                >
                </TabItem>

              </Tabs>
            </div>
            <div className={'w-full flex flex-col'}>
              {currentTab == 0 ? <Tab_Detail data={data} /> : <Tab_Attachments />}
            </div>
          </div>
          : <></>
        }
      </EticketLayout.Slot>

    </EticketLayout >
  );
};
export default EticketDetailPage;
