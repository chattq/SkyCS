import { useI18n } from "@/i18n/useI18n";
import { IItemProps } from "devextreme-react/form";

interface Props {
  listAgent: any[];
  listCustomer: any[];
  listDepart: any[];
  listTypeEticket: any[];
  listOrg: any[]
}

export const useColumnSearch = ({
  listAgent,
  listCustomer,
  listDepart,
  listTypeEticket,
  listOrg
}: Props) => {
  const { t } = useI18n("Eticket_Search");
  console.log("listTypeEticket", listTypeEticket);

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
      dataField: "FlagOutOfDate",
      caption: t("FlagOutOfDate"),
      editorType: "dxCheckBox",
    },
    {
      dataField: "FlagNotRespondingSLA",
      caption: t("FlagNotRespondingSLA"),
      editorType: "dxCheckBox",
    },
    {
      dataField: "DepartmentCode",
      caption: t("DepartmentCode"),
      editorOptions: {
        dataSource: listDepart,
        valueExpr: "DepartmentCode",
        displayExpr: "DepartmentName",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "AgentCode",
      caption: t("AgentCode"),
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
      editorOptions: {
        dataSource: listStatus,
        valueExpr: "value",
        displayExpr: "label",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TicketPriority",
      caption: t("TicketPriority"),
      editorOptions: {

      },
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketDeadline",
      caption: t("TicketDeadline"),
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketType", // phân loại
      caption: t("TicketType"),
      editorOptions: {
        dataSource: listTypeEticket,
        displayExpr: "CustomerTicketTypeName",
        valueExpr: "TicketType",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "CustomerCodeSys",
      caption: t("CustomerCodeSys"),
      editorOptions: {
        dataSource: listCustomer,
        displayExpr: "CustomerName",
        valueExpr: "CustomerCodeSys",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TicketDetail",
      caption: t("TicketDetail"),
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketName",
      caption: t("TicketName"),
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketID",
      caption: t("TicketID"),
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "CreateDTimeUTCFrom",
      caption: t("CreateDTimeUTCFrom"),
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "CreateDTimeUTCTo",
      caption: t("CreateDTimeUTCTo"),
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "LogLUDTimeUTCFrom",
      caption: t("LogLUDTimeUTCFrom"),
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "LogLUDTimeUTCTo",
      caption: t("LogLUDTimeUTCTo"),
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "TicketSourceFrom",
      caption: t("TicketSourceFrom"),
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "TicketSourceTo",
      caption: t("TicketSourceTo"),
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
      editorType: "dxDateBox",
    },
    {
      dataField: "OrgID",
      caption: t("OrgID"),
      editorOptions: {
        dataSource: listOrg,
        displayExpr: "NNTFullName",
        valueExpr: "OrgID"
      },
      editorType: "dxTagBox",
    },
  ];

  return listColumn;
};
