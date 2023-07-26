import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { BaseCardView } from "@/packages/ui/card-view/card-view";
import { useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";

import { useI18n } from "@/i18n/useI18n";
import { Popup } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { match } from "ts-pattern";
import Tab_Popup, {
  bizCodeSys,
  bizType,
  matchTitleWithCurrentType,
} from "./Tab_Popup";

const Tab_All = () => {
  let gridRef: any = useRef();

  const api = useClientgateApi();

  const { CustomerCodeSys }: any = useParams();

  const { t } = useI18n("Tab_All");

  const { data, isLoading } = useQuery(["customerAll"], async () => {
    const resp: any = await api.Mst_Customer_GetAllByCustomerCodeSys(
      CustomerCodeSys
    );

    const {
      Lst_Biz_BizAllOrder,
      Lst_Call_Call,
      Lst_Cpn_CampaignCustomer,
      Lst_ET_Ticket,
    } = resp?.Data;

    const sortedList = Lst_Biz_BizAllOrder?.map((item: any) => {
      return match(item?.BizType)
        .with("CAMPAIGN", () => {
          return {
            ...Lst_Cpn_CampaignCustomer?.find(
              (c: any) => c?.CampaignCode == item?.BizCodeSys
            ),
            Idx: item?.Idx,
            BizType: item?.BizType,
          };
        })
        .with("ETICKET", () => {
          return {
            ...Lst_ET_Ticket?.find((c: any) => c?.TicketID == item?.BizCodeSys),
            Idx: item?.Idx,
            BizType: item?.BizType,
          };
        })
        .with("CALL", () => {
          return {
            ...Lst_Call_Call?.find((c: any) => c?.CallId == item?.BizCodeSys),
            Idx: item?.Idx,
            BizType: item?.BizType,
          };
        })
        .otherwise(() => {
          return;
        });
    });

    return sortedList;
  });

  const [open, setOpen] = useState<boolean>(false);

  const currentBizType = useAtomValue(bizType);
  const setBizType = useSetAtom(bizType);

  const currentBizCodeSys = useAtomValue(bizCodeSys);
  const setBizCodeSys = useSetAtom(bizCodeSys);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const columns: any = [
    {
      dataField: "TicketID",
      caption: t("TicketID"),
      cellRender: ({ data }: any) => {
        return (
          <span
            className="text-green-600 cursor-pointer"
            onClick={() => {
              handleOpen();
            }}
          >
            {data?.TicketID}
          </span>
        );
      },
    },
    {
      dataField: "TicketName",
      caption: t("TicketName"),
    },
    {
      dataField: "AgentName",
      caption: t("AgentName"),
    },
    {
      dataField: "ProcessTime",
      caption: t("ProcessTime"),
    },
    {
      dataField: "CreateDTimeUTC",
      caption: t("CreateDTimeUTC"),
    },
    {
      dataField: "TicketStatus",
      caption: t("TicketStatus"),
    },
    {
      dataField: "TicketDeadline",
      caption: t("TicketDeadline"),
    },
  ];

  const formSettings = {};

  const handleSelectionChanged = () => {};

  const handleSavingRow = () => {};

  const handleEditorPreparing = () => {};

  const handleEditRowChanges = () => {};

  const handleDeleteRows = () => {};

  const handleOnEditRow = () => {};

  const handleOpenCampaign = (item: any) => {
    setBizType("CAMPAIGN");
    handleOpen();
    setBizCodeSys(item?.CampaignCode);
  };

  const handleOpenEticket = (item: any) => {
    setBizType("ETICKET");
    handleOpen();
    setBizCodeSys(item?.TicketID);
  };

  const renderEticket = (item: any) => {
    return (
      <div className="px-[10px] pt-[5px]" key={nanoid()}>
        <div className="mb-1 px-[35px] py-[20px] grid grid-cols-3 gap-3 relative bg-white justify-between">
          <div className="flex flex-col gap-2">
            <div
              className="font-bold text-[16px] cursor-pointer hover:underline"
              onClick={() => handleOpenEticket(item)}
            >
              {item?.TicketName} ({item?.TicketID})
            </div>
            <div>
              Phụ trách: <strong>{item?.AgentName}</strong>
            </div>
          </div>

          <div className="flex flex-col  gap-3">
            <div>
              Thời gian xử lý: <strong>{item?.ProcessTime}</strong>
            </div>
            <div>
              Thời gian tạo: <strong>{item?.CreateDTimeUTC}</strong>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div>
              Trạng thái:{" "}
              <span className="bg-teal-500 rounded-[5px] text-white p-[5px]">
                {item?.TicketStatus}
              </span>
            </div>
            <div>
              Deadline: <strong>{item?.TicketDeadline}</strong>
            </div>
          </div>

          <div className="absolute left-[-10px] top-[calc(50%-18px)] rounded-[5px] bg-[#FFE4E4] flex justify-center items-center w-[30px] h-[30px]">
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5495 7.71899C11.541 7.72073 10.5744 8.1221 9.86131 8.83519C9.14823 9.54827 8.74685 10.5149 8.74512 11.5234C8.74685 12.5318 9.14823 13.4985 9.86131 14.2116C10.5744 14.9246 11.541 15.326 12.5495 15.3278C13.558 15.326 14.5246 14.9246 15.2377 14.2116C15.9508 13.4985 16.3521 12.5318 16.3539 11.5234C16.3521 10.5149 15.9508 9.54827 15.2377 8.83519C14.5246 8.1221 13.558 7.72073 12.5495 7.71899ZM12.5495 14.3422C11.8024 14.3404 11.0865 14.0429 10.5582 13.5147C10.03 12.9864 9.73244 12.2704 9.73071 11.5234C9.73244 10.7763 10.03 10.0604 10.5582 9.53211C11.0865 9.00386 11.8024 8.70632 12.5495 8.70459C13.2966 8.70632 14.0125 9.00386 14.5408 9.53211C15.069 10.0604 15.3666 10.7763 15.3683 11.5234C15.3666 12.2704 15.069 12.9864 14.5408 13.5147C14.0125 14.0429 13.2966 14.3404 12.5495 14.3422Z"
                fill="#EB0C0C"
              />
              <path
                d="M14.4084 9.98646L14.3598 9.94901C14.2634 9.88375 14.1467 9.85573 14.0312 9.87016C13.968 9.87741 13.9068 9.8971 13.8512 9.92812C13.7956 9.95913 13.7467 10.0008 13.7073 10.0508L12.1547 12.022L11.1908 11.1679C11.1434 11.1252 11.0881 11.0925 11.0279 11.0717C10.9678 11.0508 10.9041 11.0422 10.8405 11.0463C10.7769 11.05 10.7147 11.0662 10.6574 11.094C10.6001 11.1219 10.5489 11.1608 10.5068 11.2086C10.4218 11.3048 10.3783 11.4307 10.3858 11.5589C10.3934 11.687 10.4512 11.807 10.5468 11.8926L11.9247 13.1016L12.1665 13.2054H12.2322C12.2481 13.2057 12.2639 13.2044 12.2795 13.2015L14.4623 10.6659C14.544 10.5681 14.5841 10.4422 14.574 10.3152C14.5639 10.1881 14.5045 10.0701 14.4084 9.98646Z"
                fill="#EB0C0C"
              />
              <path
                d="M6.28898 3.72925H4.97485V5.04337H6.28898V3.72925Z"
                fill="#EB0C0C"
              />
              <path
                d="M6.28898 6.35767H4.97485V7.67179H6.28898V6.35767Z"
                fill="#EB0C0C"
              />
              <path
                d="M6.28894 8.98582H4.97482V9.96681H1.34258C1.32661 9.93706 1.31784 9.90398 1.31696 9.87023V7.74923C1.76222 7.60554 2.15177 7.3269 2.43161 6.95193C2.71145 6.57697 2.86773 6.12424 2.87879 5.65649C2.86769 5.18883 2.71139 4.7362 2.43154 4.36135C2.1517 3.9865 1.76217 3.70798 1.31696 3.56441V1.52752C1.31553 1.46142 1.32103 1.39535 1.33338 1.3304C1.40763 1.3212 1.5351 1.32317 1.65666 1.3212H4.97482V2.30154H6.28894V1.3212H14.7407V3.55521C14.3925 3.66803 14.0778 3.86559 13.8248 4.13014C13.621 4.34052 13.461 4.58932 13.3542 4.86207C13.2473 5.13481 13.1958 5.42607 13.2025 5.71891L13.2058 5.78461C13.1966 6.06646 13.2475 6.34703 13.3553 6.60763C13.463 6.86822 13.6251 7.10285 13.8307 7.29586C14.4318 7.76182 15.187 7.98274 15.9445 7.91415L15.8295 6.60463C15.436 6.64121 15.0419 6.54222 14.7125 6.32407C14.6414 6.2546 14.5868 6.17008 14.5527 6.07672C14.5185 5.98337 14.5058 5.88355 14.5153 5.78461L14.5121 5.69263C14.5093 5.57281 14.5305 5.45366 14.5742 5.3421C14.618 5.23053 14.6835 5.12879 14.767 5.04279C14.8498 4.95654 14.9489 4.88752 15.0585 4.83971C15.1681 4.79189 15.2861 4.76623 15.4057 4.7642L16.0502 4.75172V1.37311C16.0545 1.31822 16.0545 1.26308 16.0502 1.20819C16.0407 1.04069 15.998 0.876767 15.9247 0.725867C15.8514 0.574966 15.7489 0.440088 15.6232 0.329039C15.3813 0.110233 15.0633 -0.00491082 14.7374 0.00838897H1.61592C1.3982 -0.013754 1.17824 0.0080479 0.9691 0.072495C0.759957 0.136942 0.565884 0.242732 0.398385 0.38358C0.258546 0.537433 0.151479 0.718125 0.0837033 0.914675C0.0159273 1.11123 -0.0111401 1.31952 0.00414871 1.52686L0.00874814 4.60454L0.546224 4.70441C0.65004 4.72412 1.56598 4.91533 1.56598 5.65912C1.56598 6.40291 0.648726 6.59281 0.548195 6.60858L0.0028346 6.70253V9.8676C-0.0111931 10.2141 0.107409 10.5529 0.334479 10.815C0.561549 11.0771 0.880004 11.2428 1.22497 11.2783H8.12871V9.96419H6.28894V8.98582Z"
                fill="#EB0C0C"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const renderCampaign = (item: any) => {
    return (
      <div className="px-[10px] pt-[5px]" key={nanoid()}>
        <div className="mb-1 px-[35px] py-[20px] grid grid-cols-3 gap-3 relative bg-white justify-between">
          <div className="flex flex-col gap-2">
            <div
              className="font-bold text-[16px] cursor-pointer hover:underline"
              onClick={() => handleOpenCampaign(item)}
            >
              {item?.CampaignName} ({item?.CampaignCode})
            </div>
            <div>
              Loại chiến dịch: <strong>{item?.CampaignTypeName}</strong>
            </div>
          </div>

          <div className="">
            Trạng thái chiến dịch:{" "}
            <span className="bg-sky-500 p-[5px] text-white rounded-[5px]">
              {item?.CampaignStatus}
            </span>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div>Thực hiện: {item?.CampaignCustomerCallStatus ?? "---"}</div>
            <div>{item?.CallOutDTimeUTC}</div>
          </div>

          <div className="absolute left-[-10px] top-[calc(50%-18px)] rounded-[5px] bg-[#D1E8FF] flex justify-center items-center w-[30px] h-[30px]">
            <svg
              width="18"
              height="14"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 9V7H20V9H16ZM17.2 16L14 13.6L15.2 12L18.4 14.4L17.2 16ZM15.2 4L14 2.4L17.2 0L18.4 1.6L15.2 4ZM3 15V11H2C1.45 11 0.979167 10.8042 0.5875 10.4125C0.195833 10.0208 0 9.55 0 9V7C0 6.45 0.195833 5.97917 0.5875 5.5875C0.979167 5.19583 1.45 5 2 5H6L11 2V14L6 11H5V15H3ZM12 11.35V4.65C12.45 5.05 12.8125 5.5375 13.0875 6.1125C13.3625 6.6875 13.5 7.31667 13.5 8C13.5 8.68333 13.3625 9.3125 13.0875 9.8875C12.8125 10.4625 12.45 10.95 12 11.35ZM2 7V9H6.55L9 10.45V5.55L6.55 7H2Z"
                fill="#298EF2"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const renderCall = (item: any) => {
    const { Json_Call_CallBizRef } = item;

    const listCallBizRef = JSON.parse(Json_Call_CallBizRef) ?? [];

    const eticketFound = listCallBizRef?.find(
      (item: any) => item?.BizType == "ET_TICKET"
    );

    const campaignFound = listCallBizRef?.find(
      (item: any) => item?.BizType == "CPN_CAMPAIGN"
    );

    return (
      <div className="px-[10px] pt-[5px]">
        <div className="mb-1 px-[35px] py-[10px] flex flex-col gap-3 relative bg-white">
          <div className="font-bold">Cuộc gọi đến từ số {item?.FromNumber}</div>
          <div>Độ dài cuộc gọi: {item?.TalkTime}s</div>

          <div>Thời gian gọi đến: {item?.TalkDTime}</div>

          <div>File ghi âm: {item?.RecFileSrc ?? "Không có file ghi âm!"}</div>

          {item?.RecFileSrc && (
            <ReactPlayer
              url={item?.RecFileSrc}
              controls
              config={{
                file: {
                  forceAudio: true,
                },
              }}
              width={300}
              height={35}
              volume={0.1}
            />
          )}

          <div>Agent tiếp nhận: {item?.sut_UserName}</div>

          {eticketFound && <div>Mã eTicket: {eticketFound?.BizRefCode}</div>}

          {campaignFound && (
            <div>Mã chiến dịch: {campaignFound?.BizRefCode}</div>
          )}

          <div className="absolute left-[-10px] bg-green-200 p-[10px] rounded-[5px] top-[calc(50%-18px)] ">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.61538 7.30435V2.08696H10.3736V4.34783L14.7692 0L16 1.21739L11.6044 5.56522H13.8901V7.30435H8.61538ZM14.9011 16C13.011 16 11.1685 15.5833 9.37363 14.75C7.57875 13.9167 5.98901 12.8152 4.6044 11.4457C3.21978 10.0761 2.10623 8.50362 1.26374 6.72826C0.421245 4.9529 0 3.13043 0 1.26087C0 1 0.0879121 0.782609 0.263736 0.608696C0.43956 0.434783 0.659341 0.347826 0.923077 0.347826H4.48352C4.68864 0.347826 4.87179 0.413043 5.03297 0.543478C5.19414 0.673913 5.28938 0.84058 5.31868 1.04348L5.89011 4.08696C5.91941 4.28986 5.91575 4.47464 5.87912 4.6413C5.84249 4.80797 5.75824 4.95652 5.62637 5.08696L3.49451 7.21739C4.10989 8.26087 4.88278 9.23913 5.81319 10.1522C6.74359 11.0652 7.76557 11.8551 8.87912 12.5217L10.9451 10.4783C11.0769 10.3478 11.2491 10.25 11.4615 10.1848C11.674 10.1196 11.8828 10.1014 12.0879 10.1304L15.1209 10.7391C15.326 10.7826 15.4945 10.8804 15.6264 11.0326C15.7582 11.1848 15.8242 11.3623 15.8242 11.5652V15.087C15.8242 15.3478 15.7363 15.5652 15.5604 15.7391C15.3846 15.913 15.1648 16 14.9011 16ZM2.65934 5.56522L4.10989 4.13043L3.73626 2.08696H1.78022C1.85348 2.68116 1.95604 3.26812 2.08791 3.84783C2.21978 4.42754 2.41026 5 2.65934 5.56522ZM10.5275 13.3478C11.0989 13.5942 11.6813 13.7899 12.2747 13.9348C12.8681 14.0797 13.4652 14.1739 14.0659 14.2174V12.3043L12 11.8913L10.5275 13.3478Z"
                fill="#009751"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const customCard = (item: any) => {
    return match(item?.BizType)
      .with("CAMPAIGN", () => renderCampaign(item))
      .with("ETICKET", () => renderEticket(item))
      .with("CALL", () => renderCall(item))
      .otherwise(() => <></>);
  };

  return (
    <>
      <AdminContentLayout className={"Category_Manager"}>
        <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
        <AdminContentLayout.Slot name={"Content"}>
          <BaseCardView
            isLoading={isLoading}
            dataSource={data ?? []}
            columns={columns}
            keyExpr={"CustomerCodeSys"}
            formSettings={formSettings}
            onReady={(ref) => (gridRef = ref)}
            allowSelection={true}
            onSelectionChanged={handleSelectionChanged}
            onSaveRow={handleSavingRow}
            onEditorPreparing={handleEditorPreparing}
            onEditRowChanges={handleEditRowChanges}
            onDeleteRows={handleDeleteRows}
            onEditRow={handleOnEditRow}
            storeKey={"card-view"}
            ref={null}
            customCard={customCard}
            defaultOption="card"
          />
        </AdminContentLayout.Slot>
      </AdminContentLayout>
      <Popup
        title={matchTitleWithCurrentType(currentBizType)}
        showCloseButton
        visible={open}
        onHiding={handleClose}
      >
        <Tab_Popup />
      </Popup>
    </>
  );
};

export default Tab_All;
