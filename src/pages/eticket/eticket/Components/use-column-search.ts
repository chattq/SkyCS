import { defaultValue } from "./../../../admin/Mst_CampaignType/components/store";
import { useI18n } from "@/i18n/useI18n";
import { IItemProps } from "devextreme-react/form";

interface Props {
  listAgent: any[];
  listCustomer: any[];
  listDepart: any[];
  listTypeEticket: any[];
  listOrg: any[];
  ListTicketPriority: any[];
  listEnterprise: any;
}

export const useColumnSearch = ({
  listAgent,
  listCustomer,
  listDepart,
  listTypeEticket,
  listOrg,
  ListTicketPriority,
  listEnterprise,
}: Props) => {
  const { t } = useI18n("Eticket_Search");
  const flagFilterOptions = {
    searchEnabled: true,
    valueExpr: "value",
    displayExpr: "text",
    items: [
      {
        value: "",
        text: t("All"),
      },
      {
        value: "1",
        text: t("Active"),
      },
      {
        value: "0",
        text: t("Inactive"),
      },
    ],
  };

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
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "TicketType", // phân loại
      caption: t("TicketType"),
      label: {
        text: t("TicketType"),
      },
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
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketName", // tên ticket
      caption: t("TicketName"),
      label: {
        text: t("TicketName"),
      },
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketID", // mã ticket
      caption: t("TicketID"),
      label: {
        text: t("TicketID"),
      },
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "CreateDTimeUTCFrom", //
      caption: t("CreateDTimeUTCFrom"),
      label: {
        text: t("CreateDTimeUTCFrom"),
      },
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "CreateDTimeUTCTo",
      caption: t("CreateDTimeUTCTo"),
      label: {
        text: t("CreateDTimeUTCTo"),
      },
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "LogLUDTimeUTCFrom",
      caption: t("LogLUDTimeUTCFrom"),
      label: {
        text: t("LogLUDTimeUTCFrom"),
      },
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "LogLUDTimeUTCTo",
      caption: t("LogLUDTimeUTCTo"),
      label: {
        text: t("LogLUDTimeUTCTo"),
      },
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "TicketSourceFrom",
      caption: t("TicketSourceFrom"),
      label: {
        text: t("TicketSourceFrom"),
      },
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "TicketSourceTo",
      caption: t("TicketSourceTo"),
      label: {
        text: t("TicketSourceTo"),
      },
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "CustomerCodeSys", // Doanh nghiệp
      caption: t("CustomerCodeSys"),
      label: {
        text: t("CustomerCodeSys"),
      },
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
      editorOptions: {
        dataSource: listOrg,
        displayExpr: "NNTFullName",
        valueExpr: "OrgID",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TickerFollower", // Người theo dõi
      caption: t("TickerFollower"),
      label: {
        text: t("TickerFollower"),
      },
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
