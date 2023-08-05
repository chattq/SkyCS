import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import { Icon, IconName } from "@/packages/ui/icons";
import { Avatar } from "@/pages/eticket/components/avatar";
import { Button, SelectBox } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useState } from "react";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import PopupCall from "./Popup/call";
import { Lst_Eticket_ActionType_Atom } from "./store";
interface CallItem {
  CallID: number;
  CallType: number;
  State: number;
  FromNumber: number;
  ToNumber: number;
  TalkTime: number;
  TalkDTime: string;
  TalkLocalDTimeFrom: string;
  TalkLocalDTimeTo: string;
  Type: string;
  RecFilePath?: string;
}

export const PartReplyCall = ({
  data,
  onReload,
}: {
  data: any;
  onReload: any;
}) => {
  const [popup, setPopup] = useState<ReactNode>(<></>);
  const [file, setFile] = useState<CallItem[]>([]);
  const { t } = useI18n("Eticket_Detail");
  const { auth } = useAuth();
  const api = useClientgateApi();
  const Lst_Eticket_ActionType = useAtomValue(Lst_Eticket_ActionType_Atom);
  const showError = useSetAtom(showErrorAtom);
  const initValue = {
    ActionType: data?.ActionType || "0",
    TicketID: data?.TicketID || "",
    OrgID: data?.OrgID || "",
    Description: data?.Description || "",
  };
  const [addRemark, setAddRemark] = useState(initValue);
  const callLastest = async () => {
    callApi.getMyLatestCall(auth.networkId ?? "").then(async (resp) => {
      if (resp.Success) {
        if (resp.Data) {
          const response = await api.ET_Ticket_GetCallMessageByCallID(
            resp.Data?.Id
          );
          if (response.isSuccess) {
            toast.success(t("ET_Ticket_GetCallMessageByCallID success!"));
            const param = {
              // ConvMessageType: "4",
              // ChannelId: "2",
              ...response.Data,
            };
            setFile([param]);
          } else {
            showError({
              message: t(response.errorCode),
              debugInfo: response.debugInfo,
              errorInfo: response.errorInfo,
            });
          }
        } else {
          toast.error("There is no call to show");
        }
      }
    });
  };

  const handleShowPopUp = () => {
    setPopup(
      <PopupCall
        data={[]}
        onClose={() => setPopup(<></>)}
        onSelect={selectFile}
      />
    );
  };

  const selectFile = (e: any) => {
    setFile([e]);
    setPopup(<></>);
  };

  const hanldleAddCall = async () => {
    const obj = {
      ActionType: addRemark.ActionType,
      TicketID: addRemark.TicketID,
      List_ET_TicketMessageCall: file.map((item) => {
        return {
          CallID: item.CallID,
        };
      }),
    };
    const response = await api.AddCall(obj);
    if (response.isSuccess) {
      toast.success(t("AddCall success!"));
      onReload();
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const handleRemoveFile = () => {
    setFile([]);
  };
  return (
    <div className={"w-full box-reply message-reply mb-2"}>
      <center
        className="h-[200px] content-call flex align-items-center justify-center"
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        {file.length ? (
          <div className="w-[100%] p-3">
            {file.map((item: CallItem, idx: number) => {
              console.log(item);
              let flag: IconName = "call";
              // let flagI
              // None=0,								Báo lỗi "Chưa kết thúc cuộc gọi"
              // Ringing=1,								Báo lỗi "Chưa kết thúc cuộc gọi"
              // InCall=2,								Báo lỗi "Chưa kết thúc cuộc gọi"
              // Unavail=3,						Ko gọi được, sai số...							Giống Error
              // NoAnswer=4,						KH ko nhấc máy							Giống Rejected
              // Cancel=5,						Agent hủy				Ko thay đổi trạng thái, chỉ lưu note. ko lưu lịch sử liên hệ
              // Complete=6,
              if (item.State === 6) {
                flag === "call";
              } else {
                if (item.Type === "Incoming") {
                  flag = "callmissedin";
                } else {
                  flag = "callmissedout";
                }
              }
              return (
                <div key={idx} className="message-item call-item">
                  <div className="flex p-2 pop-up-use">
                    <div className=" avatar-name mr-4">
                      <Avatar
                        //img={data.AuthorImage}
                        name={"Testing"}
                        img={null}
                        size={"sx"}
                        className="mr-1"
                      />
                      <strong className="name">{"Testing"}</strong>
                    </div>
                    <span className="text-gray" style={{ lineHeight: "32px" }}>
                      <i className="dx-icon-clock mr-1"></i>
                      {"Testing time"}
                    </span>
                  </div>
                  <div
                    className="position-absolute"
                    style={{ top: 0, right: 0 }}
                  >
                    <Button
                      stylingMode="outlined"
                      type="danger"
                      className="btn-msg-action"
                      icon="trash"
                      onClick={handleRemoveFile}
                    />
                  </div>
                  <span className={`message-type callin`}>
                    <Icon name={`${flag}`} />
                  </span>

                  <div className="w-full pl-5 pr-5">
                    {item?.RecFilePath && (
                      <ReactPlayer
                        url={item.RecFilePath}
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
                    <br />
                    <p>
                      <span>{t("CallID")}</span>: <strong>{item.CallID}</strong>
                    </p>
                    <p>
                      <span>{t("FromNumber")}</span>:{" "}
                      <strong>{item.FromNumber}</strong>
                    </p>
                    <p>
                      <span>{t("ToNumber")}</span>:{" "}
                      <strong>{item.ToNumber}</strong>
                    </p>
                    <p>
                      <span>{t("TalkTime")}</span>:{" "}
                      <strong>{item.TalkTime}</strong>
                    </p>
                    <p>
                      <span>{t("TalkDTime")}</span>:{" "}
                      <strong>{item.TalkDTime}</strong>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <Button
              stylingMode={"contained"}
              type="default"
              icon="file"
              text="Thêm file ghi âm"
              className="mr-1"
              onClick={handleShowPopUp}
            />
            <Button
              stylingMode={"contained"}
              type="default"
              icon="file"
              text="Thêm cuộc gọi đang thực hiện"
              className="mr-1"
              onClick={callLastest}
            />
          </>
        )}
      </center>

      <div
        className={"w-full box-button-eticket"}
        style={{ textAlign: "center" }}
      >
        <div className="flex">
          <SelectBox
            value={addRemark.ActionType} // giá trị khởi tạo
            valueExpr={"ActionTypeCode"} // giá trị được chọn
            displayExpr={"ActionTypeName"} // giá trị hiển thị
            style={{ width: 160, marginRight: 8 }}
            height={30}
            searchEnabled={true} // hiển thị chức năng tìm kiếm trong selectbox
            minSearchLength={3} // số lượng ký tự bắt đầu tìm kiếm
            searchExpr={["ActionTypeCode", "ActionTypeName"]} // tìm kiếm theo trường dữ liệu nào
            searchTimeout={10} // độ trễ thời điểm người dùng nhập xong và thời điểm tìm kiếm được thực hiện
            showDataBeforeSearch={false} // true: luôn hiển thị tất cả danh sách dữ liệu kể cả chưa nhập tới minSearchLength; false: không hiển thị dữ liệu cho đến khi nhập số ký tự bằng minSearchLength
            //showClearButton={true} // hiển thị item xóa dữ liệu
            dataSource={Lst_Eticket_ActionType} // nguồn dữ liệu
            onValueChanged={(event: any) => {
              const dataCur = {
                ...addRemark,
                ActionType: event.value,
              };
              setAddRemark(dataCur);
            }}
          ></SelectBox>
          <Button
            stylingMode={"contained"}
            type="default"
            icon="email"
            text={t("Send")}
            className="eticket-button-send"
            onClick={hanldleAddCall}
          >
            {t("Send")}
            <Icon style={{ marginLeft: "10px" }} name="send"></Icon>
          </Button>
        </div>
      </div>
      {popup}
    </div>
  );
};
