import { defaultValue } from "./../../../admin/Mst_CampaignType/components/store";
import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";
import { IItemProps } from "devextreme-react/form";

interface Props {
  listAgent: any[];
  listCustomer: any[];
  listDepart: any[];
  listTypeEticket: any[];
  listOrg: any[];
  ListTicketPriority: any[];
  listEnterprise: any;
  ticketSourceList: any;
}

export const useColumnSearch = ({
  listAgent,
  listCustomer,
  listDepart,
  listTypeEticket,
  listOrg,
  ListTicketPriority,
  listEnterprise,
  ticketSourceList,
}: Props) => {
  const { t } = useI18n("Eticket_Search");
  const listStatus = [
    {
      label: t("NEW"),
      value: "NEW",
    },
    {
      label: t("OPEN"),
      value: "OPEN",
    },
    {
      label: t("PROCESSING"),
      value: "PROCESSING",
    },
    {
      label: t("ON HOLD"),
      value: "ON HOLD",
    },
    {
      label: t("WATING ON CUSTOMER"),
      value: "WATING ON CUSTOMER",
    },
    {
      label: t("WAITING ON THIRD PARTY"),
      value: "WAITING ON THIRD PARTY",
    },
    {
      label: t("SOLVED"),
      value: "SOLVED",
    },
    {
      label: t("CLOSED"),
      value: "CLOSED",
    },
  ];

  const listColumn: IItemProps[] = [
    {
      dataField: "FlagOutOfDate", // ticket quá hạn
      caption: t("FlagOutOfDate"),
      label: {
        text: t("FlagOutOfDate"),
      },
      colSpan: 2,
      cssClass:
        "flex align-items-center label-pr-1 flex-direction-row-reverse justify-space-flex-end",
      editorType: "dxCheckBox",
      editorOptions: {
        defaultValue: false,
      },
    },
    {
      dataField: "FlagNotRespondingSLA", // ticket không đáp ứng sla
      caption: t("FlagNotRespondingSLA"),
      label: {
        text: t("FlagNotRespondingSLA"),
      },
      colSpan: 2,
      cssClass:
        "flex align-items-center label-pr-1 flex-direction-row-reverse justify-space-flex-end",
      editorType: "dxCheckBox",
      editorOptions: {
        defaultValue: false,
      },
    },
    {
      dataField: "DepartmentCode", // phòng ban
      caption: t("DepartmentCode"),
      label: {
        text: t("DepartmentCode"),
      },
      colSpan: 2,
      editorOptions: {
        dataSource: listDepart,
        valueExpr: "DepartmentCode",
        displayExpr: "DepartmentName",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "AgentCode", // agent
      caption: t("AgentCode"),
      label: {
        text: t("AgentCode"),
      },
      colSpan: 2,
      editorOptions: {
        dataSource: listAgent,
        valueExpr: "UserCode",
        displayExpr: "UserName",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TicketStatus", // trạng thái
      caption: t("TicketStatus"),
      label: {
        text: t("TicketStatus"),
      },
      colSpan: 2,
      editorOptions: {
        dataSource: listStatus,
        valueExpr: "value",
        displayExpr: "label",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TicketPriority", // mức ưu tiên
      caption: t("TicketPriority"),
      label: {
        text: t("TicketPriority"),
      },
      colSpan: 2,
      editorOptions: {
        dataSource: ListTicketPriority ?? [],
        valueExpr: "TicketPriority",
        displayExpr: "CustomerTicketPriorityName",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TicketDeadline", // dealine
      caption: t("TicketDeadline"),
      label: {
        text: t("TicketDeadline"),
      },
      colSpan: 1,
      editorType: "dxDateRangeBox",
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
    },
    // {
    //   dataField: "TicketDeadlineTo", // dealine
    //   caption: t("TicketDeadlineTo"),
    //   label: {
    //     text: t("TicketDeadlineTo"),
    //     visible: false,
    //   },
    //   colSpan: 1,
    //   editorOptions: {
    //     type: "date",
    //     format: "yyyy-MM-dd",
    //   },
    //   editorType: "dxDateBox",
    // },
    {
      dataField: "TicketType", // phân loại
      caption: t("TicketType"),
      label: {
        text: t("TicketType"),
      },
      colSpan: 2,
      editorOptions: {
        dataSource: listTypeEticket,
        displayExpr: "CustomerTicketTypeName",
        valueExpr: "TicketType",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "CustomerCodeSys", // khách hàng
      caption: t("CustomerCodeSys"),
      label: {
        text: t("CustomerCodeSys"),
      },
      colSpan: 2,
      editorOptions: {
        dataSource: listCustomer,
        displayExpr: "CustomerName",
        valueExpr: "CustomerCodeSys",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TicketDetail", // nội dung trao đổi
      caption: t("TicketDetail"),
      label: {
        text: t("TicketDetail"),
      },
      colSpan: 2,
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketName", // tên ticket
      caption: t("TicketName"),
      label: {
        text: t("TicketName"),
      },
      colSpan: 2,
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketID", // mã ticket
      caption: t("TicketID"),
      label: {
        text: t("TicketID"),
      },
      colSpan: 2,
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "CreateDTimeUTC", //
      caption: t("CreateDTimeUTC"),
      label: {
        text: t("CreateDTimeUTC"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
    },
    // {
    //   dataField: "CreateDTimeUTCTo",
    //   caption: t("CreateDTimeUTCTo"),
    //   label: {
    //     text: t("CreateDTimeUTCTo"),
    //     visible: false,
    //   },
    //   editorOptions: {
    //     type: "date",
    //     format: "yyyy-MM-dd",
    //   },
    //   editorType: "dxDateBox",
    // },
    {
      dataField: "LogLUDTimeUTC",
      caption: t("LogLUDTimeUTC"),
      label: {
        text: t("LogLUDTimeUTC"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
    },
    // {
    //   dataField: "LogLUDTimeUTCTo",
    //   caption: t("LogLUDTimeUTCTo"),
    //   label: {
    //     text: t("LogLUDTimeUTCTo"),
    //     visible: false,
    //   },
    //   editorOptions: {
    //     type: "date",
    //     format: "yyyy-MM-dd",
    //   },
    //   editorType: "dxDateBox",
    // },
    {
      dataField: "TicketSource",
      caption: t("TicketSource"),
      label: {
        text: t("TicketSource"),
      },
      colSpan: 2,
      editorOptions: {
        dataSource: ticketSourceList,
        displayExpr: "CustomerTicketSourceName",
        valueExpr: "TicketSource",
      },
      editorType: "dxTagBox",
    },
    // {
    //   dataField: "TicketSourceTo",
    //   caption: t("TicketSourceTo"),
    //   label: {
    //     visible: false,
    //     text: t("TicketSourceTo"),
    //   },
    //   colSpan: 1,
    //   editorOptions: {
    //     dataSource: ticketSourceList,
    //     displayExpr: "CustomerTicketSourceName",
    //     valueExpr: "TicketSource",
    //   },
    //   editorType: "dxTagBox",
    // },
    {
      dataField: "CustomerCodeSys", // Doanh nghiệp
      caption: t("CustomerCodeSys"),
      label: {
        text: t("CustomerCodeSys"),
      },
      colSpan: 2,
      editorOptions: {
        dataSource: listEnterprise,
        displayExpr: "CustomerName",
        valueExpr: "CustomerCodeSys",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "OrgID", // Chi nhánh
      caption: t("OrgID"),
      label: {
        text: t("OrgID"),
      },
      colSpan: 2,
      editorOptions: {
        dataSource: listOrg,
        displayExpr: "NNTFullName",
        valueExpr: "OrgID",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "Follower", // Người theo dõi
      caption: t("Follower"),
      label: {
        text: t("Follower"),
      },
      colSpan: 2,
      editorOptions: {
        dataSource: listAgent,
        valueExpr: "UserCode",
        displayExpr: "UserName",
      },
      editorType: "dxTagBox",
    },
  ];

  return listColumn;
};
