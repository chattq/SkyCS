import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { useNetworkNavigate } from "@/packages/hooks";
import { LinkCell } from "@/packages/ui/link-cell";
import { StatusButton } from "@/packages/ui/status-button";
import { viewingDataAtom } from "@/pages/Mst_Customer/components/store";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import React, { memo, useMemo } from "react";
export const useColumn = ({ ticketDynamic }: { ticketDynamic: any[] }) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const { t } = useI18n("Mst_Customer");
  const viewRow = (rowIndex: number, data: any) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const navigate = useNetworkNavigate();

  // thiếu
  // tương tác mới mới nhất,
  // tên khách hàng ,
  // phụ trách
  const ticketStatic = [
    "TicketDetail",
    "AgentTicketPriorityName", // Mức ưu tiên
    "NNTFullName", // Chi nhánh/ đại lý phụ trách
    "DepartmentName", // Phòng ban
    "AgentTicketCustomTypeName", // Phân loại tùy chọn
    "AgentTicketSourceName", // Nguồn
    "SLADesc", // SLA
    "Tags", // Tags
    "ListFollowerAgentName", // Người theo dõi
    "CreateBy", // Người tạo
    "CreateDTimeUTC", //Thời gian tạo
    "LogLUBy", // Người cập nhật cuối cùng
    "LogLUDTimeUTC", // Thời gian cập nhật cuối cùng
    "RemindWork", // Nhắc việc
    "RemindDTimeUTC", // Vào lúc
  ];

  const staticColumn = ticketStatic.map((item) => {
    return {
      dataField: item,
      caption: t(`${item}`),
      editorType: "dxTextBox",
      width: 200,
      visible: false,
    };
  });

  const dynamicColumn = ticketDynamic
    .filter((item) => {
      return item.FlagIsDynamic !== "0";
    })
    .map((item) => {
      if (
        item.TicketColCfgDataType === "MASTERDATA" ||
        item.TicketColCfgDataType === "MASTERDATASELECTMULTIPLE"
      ) {
        return {
          dataField: item.TicketColCfgCodeSys.split(".").join(""),
          caption: item.TicketColCfgName,
          editorType: "dxTextBox",
          width: 200,
          visible: false,
        };
      } else {
        return {
          dataField: item.TicketColCfgCodeSys.split(".").join(""),
          caption: item.TicketColCfgName,
          editorType: "dxTextBox",
          width: 200,
          visible: false,
        };
      }
    });

  const columns: ColumnOptions[] = [
    {
      dataField: "TicketID", // mã ticket
      caption: t("TicketID"),
      editorType: "dxTextBox",
      visible: true,
      cellRender: (column: any) => {
        return (
          <LinkCell
            onClick={() =>
              navigate(`/eticket/detail/${column.data.TicketID ?? ""}`)
            }
            value={column.data.TicketID}
          />
        );
      },
    },
    {
      dataField: "TicketName", // tên ticket
      caption: t("TicketName"),
      editorType: "dxTextBox",
      width: 300,
      visible: true,
    },
    {
      dataField: "TicketType", // Phân loại
      caption: t("TicketType"),
      editorType: "dxTextBox",
      visible: true,
    },
    {
      dataField: "CustomerName", // tên KH
      caption: t("CustomerName"),
      editorType: "dxTextBox",
      visible: true,
    },
    {
      dataField: "AgentName", // phụ trách
      caption: t("AgentName"),
      editorType: "dxTextBox",
      visible: true,
    },
    {
      dataField: "AgentTicketStatusName", // trạng thái
      caption: t("AgentTicketStatusName"),
      editorType: "dxTextBox",
      visible: true,
    },
    {
      dataField: "ReceptionDTimeUTC", // Thời điểm tiếp nhận
      caption: t("ReceptionDTimeUTC"),
      editorType: "dxTextBox",
      visible: true,
    },
    {
      dataField: "TicketDeadline", // Deadline
      caption: t("TicketDeadline"),
      editorType: "dxTextBox",
      visible: true,
    },
    {
      dataField: "Description", // Tương tác mới nhất
      caption: t("Description"),
      editorType: "dxTextBox",
      width: 400,
      visible: true,
    },
    ...staticColumn,
    ...dynamicColumn,
  ];

  return columns;
};
