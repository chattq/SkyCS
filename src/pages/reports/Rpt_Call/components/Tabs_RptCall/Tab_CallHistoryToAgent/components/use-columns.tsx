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
      dataField: "kbc_CategoryName", // Mã ngân hàng
      caption: t("kbc_CategoryName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data }: any) => {
        return (
          <div>
            <div>a</div>
            <div>a</div>
            <div>a</div>
          </div>
        );
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CreateDTimeUTC", // Mã đại lý
      caption: t("Thời gian của Agent"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 2,
      columns: [
        {
          dataField: "PERIODBEGIN_OSOD_APPROVEDDATE", // ngày xác nhận đơn hàng
          caption: t("PERIODBEGIN_OSOD_APPROVEDDATE"),
        },
        {
          dataField: "PERIODBEGIN_CDOD_DELIVERYOUTDATE", // ngày xuất kho
          caption: t("PERIODBEGIN_CDOD_DELIVERYOUTDATE"),
        },
      ],
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "LogLUDTimeUTC", // Mã đại lý
      caption: t("LogLUDTimeUTC"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 2,
      columns: [
        {
          dataField: "PERIODBEGIN_OSOD_APPROVEDDATE", // ngày xác nhận đơn hàng
          caption: t("PERIODBEGIN_OSOD_APPROVEDDATE"),
        },
        {
          dataField: "PERIODBEGIN_CDOD_DELIVERYOUTDATE", // ngày xuất kho
          caption: t("PERIODBEGIN_CDOD_DELIVERYOUTDATE"),
        },
      ],
    },
    {
      dataField: "PostStatus",
      caption: t("PostStatus"),
      editorType: "dxTextBox",
      alignment: "center",
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "ShareType", // Mã đại lý
      caption: t("ShareType"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
  ];
  // return array of the first item only

  return columns;
};
