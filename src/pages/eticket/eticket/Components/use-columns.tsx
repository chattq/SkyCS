import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { StatusButton } from "@/packages/ui/status-button";
import { viewingDataAtom } from "@/pages/Mst_Customer/components/store";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
export const useColumn = () => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const viewRow = (rowIndex: number, data: any) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const listStatus = [
    "NEW",
    "OPEN",
    "PROCESSING",
    "ON HOLD",
    "WATING ON CUSTOMER",
    "WAITING ON THIRD PARTY",
    "SOLVED",
    "CLOSED",
  ];

  const { t } = useI18n("Mst_Customer");
  const columns: ColumnOptions[] = [
    {
      dataField: "TicketID", // mã ticket
      caption: t("TicketID"),
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketName", // tên ticket
      caption: t("TicketName"),
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketID", // Phân loại
      caption: t("TicketID"),
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketID", // tên KH
      caption: t("TicketID"),
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketID", // phụ trách
      caption: t("TicketID"),
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketStatus", // trạng thái
      caption: t("TicketStatus"),
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketID", // Thời điểm tiếp nhận
      caption: t("TicketID"),
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketDeadline", // DeadLine
      caption: t("TicketDeadline"),
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketID", // Tương tác mới nhất
      caption: t("TicketID"),
      editorType: "dxTextBox",
    },
  ];
  return columns;
};
