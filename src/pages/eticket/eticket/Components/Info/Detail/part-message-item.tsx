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
  TextArea,
  DropDownBox,
  List,
  ButtonGroup,
} from "devextreme-react";
import { Item as TabItem } from "devextreme-react/tabs";
import { Avatar } from "../../../../components/avatar";
import { Height } from "devextreme-react/chart";
import { Email, ET_TicketMessage, Call } from "@/packages/types";
import { Attachment } from "../../../../components/attachment";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { parse } from "date-fns";
import ReactPlayer from "react-player";
import audioFile from "../../../../../../../public/audio/test.mp3";
import { Icon, IconName } from "@/packages/ui/icons";
import { useClientgateApi } from "@/packages/api";
import { useSetAtom } from "jotai";
import { showErrorAtom } from "@/packages/store";
import { useI18n } from "@/i18n/useI18n";
import { toast } from "react-toastify";
import "./style.scss";
import { currentTabAtom, currentValueTabAtom, reloadingtabAtom } from "./store";
import { nanoid } from "nanoid";
import PopupAnotherPin from "./Popup/PopUpAnotherPin";
export const PartMessageItem = ({
  data,
  onGim,
  isHidenButton = false,
  flag = "remark",
  isShowButton = ["pin", "reply"],
  handleCustomerDelete = () => {},
}: {
  onGim: any;
  data: ET_TicketMessage;
  isHidenButton?: boolean;
  flag: string;
  isShowButton?: string[];
  handleCustomerDelete?: () => void;
}) => {
  const { t } = useI18n("Eticket_Detail");
  const setCurrentTag = useSetAtom(currentTabAtom);
  const [playTime, setPlayTime] = useState(0);
  const setCurrentValueTab = useSetAtom(currentValueTabAtom);
  const setReloadingtab = useSetAtom(reloadingtabAtom);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const handleProgress = (state: any) => {
    setPlayTime(state.playedSeconds);
  };

  const [currentPopUp, setCurrentPopUp] = useState<ReactNode>(<></>);

  const handleUpdatePin = async () => {
    const obj = {
      TicketID: data.TicketID ?? "",
      OrgID: data.OrgID ?? "",
      IsPin: data.IsPin === "0" ? "1" : "0",
      AutoID: data.AutoId,
    };

    // console.log("obj ", obj, "data", data);

    const response = await api.ET_Ticket_UpdatePin(obj);
    if (response.isSuccess) {
      toast.success(t("Update Pin successfully"));
      onGim();
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const RemarkDetail = ({ remark }: { remark: ET_TicketMessage }) => {
    const custom = `<b>${remark.Description}</b>`;
    return (
      <div className="w-full pl-5 pr-5">
        <div
          className="format-text-html pl-2"
          dangerouslySetInnerHTML={{
            __html: remark.Description ?? "--------------------",
          }}
        />
      </div>
    );
  };

  const NoteDetail = ({ data }: { data: ET_TicketMessage }) => {
    const custom = `<b>${data.Description}</b>`;
    return (
      <div className="w-full pl-5 pr-5">
        <div
          className="format-text-html"
          dangerouslySetInnerHTML={{
            __html: data.Description ?? "--------------------",
          }}
        />
      </div>
    );
  };

  const EmailDetail = ({ email }: { email: ET_TicketMessage }) => {
    const objDescription =
      email.Description != null ? JSON.parse(email.Description) : null;
    return (
      <div className="w-full pl-5 pr-5">
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2">{t("Email send")}: </span>
          <span>{email.ObjectSenderId}</span>
        </div>
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2">{t("Title")}: </span>
          <span>{objDescription?.SubTitleSend}</span>
        </div>
        <div className="flex pl-2 pt-1">
          <span
            className="text-gray mr-2 title"
            style={{ width: "w-full", display: "flex" }}
          >
            {t("Description")}:{" "}
            <div
              className="format-text-html"
              dangerouslySetInnerHTML={{
                __html: objDescription?.MessageSend ?? "----------------------",
              }}
            />
          </span>
        </div>
      </div>
    );
  };

  const CallDetail = ({ call }: { call: any }) => {
    const { Detail } = call;
    const convertJSON = JSON.parse(Detail);
    return (
      <div className="w-full pl-5 pr-5">
        <div className="pl-2 pt-1">
          {convertJSON.RecFilePath && (
            <ReactPlayer
              url={audioFile}
              controls
              config={{
                file: {
                  forceVideo: false,
                  forceAudio: true,
                },
              }}
              width={300}
              height={35}
              volume={0.1}
            />
          )}
          <div className="flex pl-2 pt-1">
            <span className="text-gray mr-2">{t("CallID")}: </span>
            <span>{convertJSON.CallID}</span>
          </div>{" "}
          <div className="flex pl-2 pt-1">
            <span className="text-gray mr-2">{t("SĐT khách hàng:")}: </span>
            <span>{convertJSON.FromNumber}</span>
          </div>
          <div className="flex pl-2 pt-1">
            <span className="text-gray mr-2">{t("Số tổng đài:")}: </span>
            <span>{convertJSON.ToNumber}</span>
          </div>
        </div>
      </div>
    );
  };

  const ZaloDetail = ({ data }: { data: any }) => {
    // hiện tại zalo đi và đến sẽ phải check thêm
    if (data.IsIncoming === "0") {
      if (data.ConvMessageType === "10") {
        // case phone
        const dataJSON = JSON.parse(data?.Description);
        const convertDetail = JSON.parse(data?.Detail);
        return (
          <div className="w-full pl-5 pr-5">
            <div className=" pl-2 pt-1">
              {/* <span>Tên tài khoản zalo: {data.ObjectReceiveId}</span> <br /> */}
              {/* <span>Thời gian gửi: {data.MsgDTime}</span> <br /> */}
              <p>
                <span className="title">Zalo ZNS:</span> {data.ObjectReceiveId}
              </p>
              <p className="pt-1">
                <span className="title"> {`${t("Content")}`}</span>:
                {dataJSON[0].SubFormCode}
              </p>
              <p className="pt-1">
                <span className="title">Mã Mẫu ZNS:</span>{" "}
                {convertDetail.template_id}
              </p>
              <table className="eticket-it-table">
                {dataJSON.map((item: any, index: number) => {
                  return (
                    <tr
                      className="pr-2 border-table"
                      key={`eticket-it-tr-${index}`}
                    >
                      <td>{item.ParamSFCodeZNS}</td>
                      <td>{item.ParamValue}</td>
                    </tr>
                  );
                })}
              </table>
              {/* <span>{call.FromNumber}</span> */}
            </div>
            {/* <div className="flex pl-2 pt-1">
              <span className="text-gray mr-2">SĐT nhận: </span>
              <span>{call.ToNumber}</span>
            </div> */}
          </div>
        );
      }

      return (
        <div className="w-full pl-5 pr-5">
          <div className="pl-2 pt-1">
            <span className="text-gray mr-2">
              <span>{t("Mail's ZaloUserID")}: </span> {data.ObjectReceiveId}{" "}
              <br />
            </span>
            <span className="text-gray mr-2">{data.Description}</span>
            {/* <span>{call.FromNumber}</span> */}
          </div>
          {/* <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2">SĐT nhận: </span>
          <span>{call.ToNumber}</span>
        </div> */}
        </div>
      );
    } else {
      return (
        <div className="w-full pl-5 pr-5">
          <div className="pl-2 pt-1">
            <span className="text-gray mr-2">
              <span className="title">{t("Mail's ZaloUserID")}: </span>{" "}
              {data.ObjectReceiveId} <br />
            </span>
            <span className="text-gray mr-2">{data.Description}</span>
          </div>
        </div>
      );
    }
  };

  const EventDetail = ({ data }: { data: ET_TicketMessage }) => {
    return (
      <div className="w-full pl-5 pr-5 pt-3 flex align-items-center justify-center">
        <div
          className="format-text-html text-center "
          dangerouslySetInnerHTML={{
            __html: data.Description ?? "---",
          }}
        />{" "}
      </div>
    );
  };

  const InfoDetail = ({ data }: { data: ET_TicketMessage }) => {
    if (flag === "remark") return <RemarkDetail remark={data}></RemarkDetail>;
    if (flag === "emailin" || flag === "emailout")
      return <EmailDetail email={data}></EmailDetail>;
    if (flag === "call") return <CallDetail call={data}></CallDetail>;
    if (flag === "zaloin" || flag === "zaloout")
      return <ZaloDetail data={data}></ZaloDetail>;
    if (flag === "note") return <NoteDetail data={data}></NoteDetail>;
    if (flag === "eventlog") return <EventDetail data={data}></EventDetail>;
    return <></>;
  };

  const handleReply = () => {
    let obj: any = {
      ActionType: "0",
      MessageSend: "",
      OrgID: data.OrgID,
      SubFormCode: "",
      SubTitleSend: "",
      TicketID: data.TicketID,
    };

    switch (flag) {
      case "zalo": {
        obj = {
          ...obj,
          ObjType: "",
          ObjCode: "",
        };

        if (data.ChannelId === "6" && data.ConvMessageType === "8") {
          obj = {
            // zalo
            ...obj,
            ObjType: "ZaloUserId",
            ObjCode: data.ObjectReceiveId,
          };
        }
        if (data.ChannelId === "6" && data.ConvMessageType === "10") {
          obj = {
            // phone
            ...obj,
            ObjType: "PhoneNo",
            ObjCode: data.ObjectReceiveId,
            ZNS: [],
          };
        }
        setCurrentValueTab(obj);
        setReloadingtab(nanoid());
        setCurrentTag(0);
        break;
      }
      case "email": {
        obj = {
          CtmEmail: data.ObjectReceiveId,
          SubTitleSend: "",
          SubFormCode: "",
        };
        setCurrentValueTab(obj);
        setReloadingtab(nanoid());
        setCurrentTag(1);
        break;
      }
      case "remark": {
        setCurrentTag(4);
        // const obj = {
        //   ActionType: data?.ActionType || "0",
        //   TicketID: data?.TicketID || "",
        //   OrgID: data?.OrgID || "",
        //   Description: data?.Description || "",
        // };
        break;
      }
      default: {
        break;
      }
    }
    // window.scrollTo(0, 0);
  };
  const showPopUp = () => {
    setCurrentPopUp(
      <PopupAnotherPin
        data={data?.dataPin ?? []}
        onClose={() => {
          setCurrentPopUp(<></>);
        }}
      />
    );
  };

  return (
    <div
      className={`w-full position-relative bg-white mb-3 pb-3 message-item ${flag} ${
        data?.checkPin ? "pin" : ""
      }`}
    >
      {flag != "eventlog" ? (
        <>
          <div className="flex p-3 pop-up-use">
            <div className=" avatar-name mr-4">
              <Avatar
                //img={data.AuthorImage}
                name={data.UserId}
                img={null}
                size={"sx"}
                className="mr-1"
              />
              <strong className="name">{data.UserId}</strong>
            </div>
            <span className="text-gray" style={{ lineHeight: "32px" }}>
              <i className="dx-icon-clock mr-1"></i>
              {data.CreateDTimeUTC}
            </span>
          </div>

          <div className="position-absolute" style={{ top: 0, right: 0 }}>
            {data?.dataPin && data?.dataPin.length > 1 && (
              <Button
                onClick={showPopUp}
                stylingMode="outlined"
                type="default"
                className="pin-show"
              >
                {data?.dataPin.length - 1} <p>{t("Another pin")}</p>
              </Button>
            )}

            {isShowButton?.includes("reply") && (
              <Button
                stylingMode="outlined"
                type="default"
                className="btn-msg-action"
                // icon="custom-reply"
                onClick={handleReply}
              >
                <Icon name="reply"></Icon>
              </Button>
            )}

            {isShowButton?.includes("pin") && (
              <Button
                stylingMode="outlined"
                type="default"
                className="btn-msg-action"
                icon={data.IsPin === "1" ? "unpin" : "pin"}
                onClick={() => handleUpdatePin()}
              >
                <Icon name={data.IsPin === "1" ? "unpin" : "pin"} />
              </Button>
            )}

            {isShowButton?.includes("delete") && (
              <Button
                stylingMode="outlined"
                type="danger"
                className="btn-msg-action"
                icon="trash"
              />
            )}
            {isShowButton?.includes("customeDelete") && (
              <Button
                stylingMode="outlined"
                type="danger"
                className="btn-msg-action"
                icon="trash"
                onClick={handleCustomerDelete}
              />
            )}
          </div>
          {data?.ConvMessageType === "4" && data?.ChannelId === "2" ? (
            <div className="auto-file"></div>
          ) : (
            <></>
          )}

          {/* <span className={`message-type email in  ${messageTypeCss}`}>
            <i></i>
          </span> */}
          {flag === "eventlog" ? (
            ""
          ) : (
            <span className={`message-type ${flag}`}>
              <Icon name={`${flag ?? "remark"}`} />
              {/* <i></i> */}
            </span>
          )}
        </>
      ) : (
        <></>
      )}
      <InfoDetail data={data}></InfoDetail>
      {/* <AttachmentList></AttachmentList> */}
      {currentPopUp}
    </div>
  );
};
