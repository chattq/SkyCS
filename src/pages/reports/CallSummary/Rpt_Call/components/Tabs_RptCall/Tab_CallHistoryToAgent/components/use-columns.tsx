import { ColumnOptions } from "@packages/ui/base-gridview";
import { useI18n } from "@/i18n/useI18n";
import { Mst_CustomerGroupData } from "@packages/types";

interface UseBankDealerGridColumnsProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const { t } = useI18n("Mst_PaymentTermController");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "idx", // Số thứ tự
      caption: t("idx"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Id", // Mã cuộc gọi
      caption: t("Id"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
    },
    {
      dataField: "CallType",
      caption: t("CallType"), // loại cuộc gọi
      editorType: "dxTextBox",
      alignment: "center",
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "RemoteNumber", // Số điện thoại tổng đài
      caption: t("RemoteNumber"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "FromNumber", // Số khách hàng
      caption: t("FromNumber"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "AgentUserId", // Agent
      caption: t("AgentUserId"),
      editorType: "dxTextBox",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Thời gian của từng agent", // Mã ngân hàng
      caption: t("Thời gian của từng agent"),
      editorType: "dxTextBox",

      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columns: [
        {
          dataField: "detail_RingDTime", // thời gian đổ chuông
          caption: t("RingDTime"),
        },
        {
          dataField: "detail_EndDTime", // thời gian cúp máy
          caption: t("EndDTime"),
        },
        {
          dataField: "detail_TalkDTime", // thời điểm nhấc máy
          caption: t("TalkDTime"),
        },
        {
          dataField: "detail_RingTime", // thời lượng đổ chuông
          caption: t("RingTime"),
        },
        {
          dataField: "detail_TalkTime", // thời lượng trả lời
          caption: t("TalkTime"),
        },
        {
          dataField: "detail_HoldTime", // thời gian giữ máy
          caption: t("HoldTime"),
        },
      ],
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Tổng hợp thời của 1 id cuộc gọi", // Mã ngân hàng
      caption: t("Tổng hợp thời của 1 id cuộc gọi"),
      editorType: "dxTextBox",

      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columns: [
        {
          dataField: "RingDTime",
          caption: t("RingDTime"),
        },
        {
          dataField: "TalkDTime",
          caption: t("TalkDTime"),
        },
        {
          dataField: "EndDTime",
          caption: t("EndDTime"),
        },
        {
          dataField: "Remark",
          caption: t("Remark"),
        },
      ],
    },
  ];
  // return array of the first item only

  return columns;
};
