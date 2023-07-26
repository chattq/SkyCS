import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { EticketT } from "@/packages/types";
import { IconName } from "@/packages/ui/icons";
import { useSetAtom } from "jotai";
import { memo, useCallback, useEffect, useState } from "react";
import { PartMessageItem } from "./part-message-item";
import { useHub } from "@/packages/hooks/useHub";
import { toast } from "react-toastify";
import { LoadPanel } from "devextreme-react";

export const PartMessageList = memo(
  ({ data, value, onGim }: { data: EticketT; value: any[]; onGim: any }) => {
    // const [valueGim, setValueGim] = useState<any[]>([]);
    // const api = useClientgateApi();
    // const showError = useSetAtom(showErrorAtom);
    // const { t } = useI18n("");
    // const [loading, setLoading] = useState(false);

    // Các định dạng file sẽ hỗ trợ:
    // - Nhóm Text:
    // TXT
    // DOC
    // DOCX
    // XLS
    // XLSX
    // PPT
    // PPTX
    // PDF
    // - Nhóm file ảnh:
    // PNG
    // JPG
    // GIF
    // SVG
    // - Nhóm file âm thanh, video
    // WMA
    // WAV
    // MP3
    // MP4
    // WMV
    // AVI
    // - File nén:
    // ZIP
    // RAR
    // 7Z

    // const handleGim = useCallback(async () => {
    //   setLoading(true);
    //   const responseCallMessage = await api.GetMessageByTicketID(
    //     data.Lst_ET_Ticket[0].TicketID
    //   );
    //   if (responseCallMessage.isSuccess) {
    //     toast.success(t("GetMessageByTicketID Success"));
    //     const { Lst_ET_TicketMessagePin, Lst_ET_TicketMessage } =
    //       responseCallMessage.Data;

    //     if (Lst_ET_TicketMessagePin?.length) {
    //       dataRender = [Lst_ET_TicketMessagePin[0]].map((item: any) => {
    //         return {
    //           ...item,
    //           checkPin: true,
    //           dataPin: data.Lst_ET_TicketMessagePin,
    //         };
    //       });
    //       console.log("...dataRender, ...data.Lst_ET_TicketMessage ", [
    //         ...dataRender,
    //         ...data.Lst_ET_TicketMessage,
    //       ]);
    //       setValueGim([...dataRender, ...data.Lst_ET_TicketMessage]);
    //       setLoading(false);
    //     } else {
    //       setValueGim(Lst_ET_TicketMessage);
    //       setLoading(false);
    //     }
    //   } else {
    //     showError({
    //       message: t(responseCallMessage.errorCode),
    //       debugInfo: responseCallMessage.debugInfo,
    //       errorInfo: responseCallMessage.errorInfo,
    //     });
    //   }
    // }, []);

    // let dataRender = [];
    // useEffect(() => {
    //   if (data?.Lst_ET_TicketMessagePin?.length) {
    //     dataRender = [data.Lst_ET_TicketMessagePin[0]].map((item: any) => {
    //       return {
    //         ...item,
    //         checkPin: true,
    //         dataPin: data.Lst_ET_TicketMessagePin,
    //       };
    //     });
    //     setValueGim([...dataRender, ...data.Lst_ET_TicketMessage]);
    //   } else {
    //     setValueGim(data.Lst_ET_TicketMessage);
    //   }
    // }, []);

    // const hub = useHub("global");
    // useEffect(() => {
    //   hub.onReceiveMessage("ET_TicketMessage", (c) => {
    //     handleGim();
    //   });
    // }, []);

    // if (loading) {
    //   return <LoadPanel visible={loading} />;
    // }
    return (
      <div className={"w-full pt-3 pb-3 pl-5 pr-5"}>
        {value?.map((item: any, idx: number) => {
          let flag: IconName | "eventlog" = "remark";
          let flagIncoming = "";
          if (item.IsIncoming === "0") {
            flagIncoming = "out";
          }
          if (item.IsIncoming === "1") {
            flagIncoming = "in";
          }

          switch (item?.ConvMessageType) {
            case "1": {
              if (item.ChannelId === "0") {
                flag = "note";
              }
              break;
            }
            case "9": {
              if (item.ChannelId === "0") {
                flag = "eventlog";
              }
              break;
            }
            case "3": {
              if (item?.ChannelId === "1") {
                flag = "email" + flagIncoming;
              }
              break;
            }
            case "11": {
              if (item?.ChannelId === "2") {
                console.log("item ", item);
                if (item.State === "6") {
                  flag = "call";
                } else {
                  flag = "callmissed" + flagIncoming;
                }
                // flag = "call";
              }
              break;
            }
            case "8":
            case "10": {
              if (item?.ChannelId === "6") {
                flag = "zalo" + flagIncoming;
              }
              break;
            }

            default: {
              flag = "remark";
              break;
            }
          }

          // console.log("item ", item, "flag ", flag);
          return (
            <PartMessageItem
              onGim={onGim}
              key={`part-message-item-${idx}`}
              data={item}
              flag={flag}
            />
          );
        })}
      </div>
    );
  }
);
