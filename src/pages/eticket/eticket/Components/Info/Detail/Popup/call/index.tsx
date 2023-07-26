import { ET_TicketMessage } from "@/packages/types";
import { Button, Popup, ScrollView } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { PartMessageItem } from "../../part-message-item";
import { IconName } from "@/packages/ui/icons";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcCall, CcCallingInfo } from "@/packages/types";
import "@packages/ui/phone/phone.scss";
import "./style.scss";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useSetAtom } from "jotai";
import { showErrorAtom } from "@/packages/store";
import { toast } from "react-toastify";
interface Props {
  onClose: () => void;
  data: ET_TicketMessage[];
  onSelect: (e: any) => void;
}

const PopupCall = ({ onClose, onSelect }: Props) => {
  const handleCancel = () => {
    onClose();
  };

  const { t } = useI18n("Eticket_Detail");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);

  const { auth } = useAuth();

  const [list, setList] = useState<CcCall[]>([]);
  useEffect(() => {
    callApi.getMyCallHistory(auth.networkId).then((resp) => {
      console.log("resp ", resp);
      if (resp.Success && resp.Data) {
        setList(resp.Data);
      }
    });
  }, []);

  const handleCall = async (item: CcCall) => {
    console.log("item ", item);
    const response = await api.ET_Ticket_GetCallMessageByCallID(item.Id);
    if (response.isSuccess) {
      toast.success(t("ET_Ticket_GetCallMessageByCallID success!"));
      console.log("response ", response.Data);
      const param = {
        ConvMessageType: "4",
        ChannelId: "2",
        ...response.Data,
      };

      onSelect(param);
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }

    // onSelect({
    //   ...fakeData,
    //   ...item,
    //   AutoId: item.Id,
    // });
  };

  const CallItem = ({ item }: { item: CcCall }) => {
    const icon = useMemo(() => {
      if (item.Type == "incoming") {
        return item.Status != "Complete" ? "icon-call-missed" : "icon-call-in";
      } else {
        return item.Status != "Complete"
          ? "icon-call-noanswer"
          : "icon-call-out";
      }
    }, [item]);

    return (
      <div
        className="his-item w-full p-2 mb-1 position-relative cursor-pointer"
        onClick={() => handleCall(item)}
      >
        <div className="flex w-full">
          <i className={`${icon} type missed mr-1 mt-1`} />
          <span>
            {item.RemoteNumber}
            <br />
            <span className="text-small">{item.Status}</span>
          </span>
        </div>
        <span className="time position-absolute text-small">
          {item.Date}
          <br />
          {item.Time}
        </span>

        <button
          className="btn-call"
          onClick={() => {
            window.Phone.dial(item.RemoteNumber);
          }}
        >
          <i className="dx-icon-tel"></i>
        </button>
      </div>
    );
  };

  return (
    <Popup
      position={"center"}
      showCloseButton={true}
      onHiding={handleCancel}
      height={500}
      className="popup-call"
      title={`Popup Call`}
      visible={true}
    >
      <ScrollView width={"100%"} height={"100%"}>
        <div className="soft-phone h-full">
          <div className="w-full pb-2">
            <div className={"w-full mb-2 block-head"}>
              <span>Cuộc gọi gần đây</span>
            </div>
            <div className="history p-2 mb-2">
              {list.map((item, idx) => {
                return <CallItem item={item} key={item.Id} />;
              })}
            </div>
          </div>
          {/* <div className="w-full pl-5 pr-5 pb-5">
            <div className="flex ml-4 mt-2 pl-5">
              <button style={{ width: 40, height: 40 }} onClick={() => {}}>
                <i className="dx-icon-bulletlist"></i>
              </button>
              <button className="rounded-btn btn-green ml-5" onClick={() => {}}>
                <i className="icon-keyboard"></i>
              </button>
            </div>
          </div> */}
        </div>
        {/* <Button onClick={() => onSelect(fakeData)}>Add File</Button> */}
      </ScrollView>
      <ToolbarItem toolbar={"bottom"} location={"center"}>
        <Button
          text={"Cancel"}
          stylingMode={"outlined"}
          type={"normal"}
          onClick={handleCancel}
          className={"mx-2 w-[100px]"}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default PopupCall;
