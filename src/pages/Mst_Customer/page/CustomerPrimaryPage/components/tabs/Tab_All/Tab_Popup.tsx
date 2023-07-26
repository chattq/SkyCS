import { atom, useAtomValue } from "jotai";
import { match } from "ts-pattern";
import CustomerCampaign_Popup from "../Tab_CustomerCampaign/CustomerCampagin_Popup";
import CustomerEticket_Popup from "../Tab_CustomerEticket/CustomerEticket_Popup";

export const matchTitleWithCurrentType = (type: string) => {
  return match(type)
    .with("ETICKET", () => "Chi tiết Eticket")
    .with("CAMPAIGN", () => "Chi tiết chiến dịch")
    .otherwise(() => "");
};

export const bizType = atom<any>(null);

export const bizCodeSys = atom<any>(null);

const Tab_Popup = () => {
  const currentBizType = useAtomValue(bizType);

  const currentBizCodeSys = useAtomValue(bizCodeSys);

  return match(currentBizType)
    .with("ETICKET", () => (
      <CustomerEticket_Popup TicketID={currentBizCodeSys} />
    ))
    .with("CAMPAIGN", () => (
      <CustomerCampaign_Popup CampaignCode={currentBizCodeSys} />
    ))
    .otherwise(() => <></>);
};

export default Tab_Popup;
