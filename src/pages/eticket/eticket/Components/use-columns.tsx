import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useApiHeaders } from "@/packages/api/headers";
import { useNetworkNavigate } from "@/packages/hooks";
import { LinkCell } from "@/packages/ui/link-cell";
import { viewingDataAtom } from "@/pages/Mst_Customer/components/store";
import { FileUploadCustom } from "@/utils/customer-common";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { FileUploader } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useState } from "react";

export const useColumn = ({ ticketDynamic }: { ticketDynamic: any[] }) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const { t } = useI18n("Eticket_Manager_Column");
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
      if (item.TicketColCfgDataType === "FILE") {
        return {
          dataField: item.TicketColCfgCodeSys.split(".").join(""),
          caption: t(item.TicketColCfgName),
          width: 200,
          visible: false,
          editCellComponent: FileUploadCustom,
        };
      }
      if (
        item.TicketColCfgDataType === "MASTERDATA" ||
        item.TicketColCfgDataType === "MASTERDATASELECTMULTIPLE"
      ) {
        return {
          dataField: item.TicketColCfgCodeSys.split(".").join(""),
          caption: t(item.TicketColCfgName),
          editorType: "dxTextBox",
          width: 200,
          visible: false,
        };
      } else {
        return {
          dataField: item.TicketColCfgCodeSys.split(".").join(""),
          caption: t(item.TicketColCfgName),
          editorType: "dxTextBox",
          width: 200,
          visible: false,
        };
      }
    });

  const customerRender = () => {};

  const columns: ColumnOptions[] = [
    {
      dataField: "TicketID", // mã ticket
      caption: t("TicketID"),
      editorType: "dxTextBox",
      visible: true,
      filterType: "exclude",
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
      dataField: "CustomerTicketTypeName", // Phân loại
      caption: t("CustomerTicketTypeName"),
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
      cellRender: (param: any) => {
        return (
          <div className={`status-container flex justify-content-center`}>
            <span
              className={`status ${
                param?.displayValue ? param?.displayValue.toLowerCase() : ""
              }`}
            >
              {param?.displayValue ?? ""}
            </span>
          </div>
        );
      },
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
