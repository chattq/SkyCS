import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { BaseCardView } from "@/packages/ui/card-view/card-view";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import ReactPlayer from "react-player";

import { useI18n } from "@/i18n/useI18n";
import { useParams } from "react-router-dom";
import { match } from "ts-pattern";
import audioFile from "../../../../../../../../public/audio/test.mp3";

export const renderIcon = (type: any) => {
  return match(type)
    .with("Incomming", () => <></>)

    .otherwise(() => <></>);
};

const Tab_CustomerHistCall = () => {
  let gridRef: any = useRef();

  const api = useClientgateApi();

  const { t } = useI18n("Tab_CustomerHistCall");

  const { CustomerCodeSys }: any = useParams();

  const { data, isLoading } = useQuery(["listHistCall"], async () => {
    const resp: any = await api.CallCall_GetByCustomerCodeSys(CustomerCodeSys);

    return resp;
  });

  console.log(data);

  const columns: any = [];

  const formSettings = {};

  const handleSelectionChanged = () => {};

  const handleSavingRow = () => {};

  const handleEditorPreparing = () => {};

  const handleEditRowChanges = () => {};

  const handleDeleteRows = () => {};

  const handleOnEditRow = () => {};

  const customCard = (item: any) => {
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
              url={audioFile}
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

  return (
    <AdminContentLayout className={"Category_Manager"}>
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <BaseCardView
          isLoading={isLoading}
          dataSource={data?.isSuccess ? data.DataList ?? [] : []}
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
  );
};

export default Tab_CustomerHistCall;
