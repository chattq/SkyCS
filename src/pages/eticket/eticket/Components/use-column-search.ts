import { useI18n } from "@/i18n/useI18n";
import { IItemProps } from "devextreme-react/form";

export const searchConditions = () => {
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
  const listColumn: IItemProps[] = [
    {
      caption: t("Dealer Code"), // ticket quá hạn
      dataField: "DealerCode",
      editorType: "dxCheckBox",
      label: {
        text: t(""),
      },
    },
    {
      caption: t("Dealer Code"), // ticket quá hạn
      dataField: "DealerCode",
      editorType: "dxCheckBox",
      label: {
        text: t(""),
      },
    },
    {
      dataField: "AgentCode", // Team
      caption: t("Team"),
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: [],
        valueExpr: "AgentCode",
        displayExpr: "AgentName",
      },
    },
    {
      dataField: "AgentCode", // agent code
      caption: t("AgentCode"),
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: [],
        valueExpr: "AgentCode",
        displayExpr: "AgentName",
      },
    },
    {
      dataField: "FlagActive", // trạng thái
      caption: t("Flag Active"),
      editorType: "dxTagBox",
      editorOptions: flagFilterOptions,
    },
    {
      dataField: "AgentCode", // Mức ưu tiên
      caption: t("Team"),
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: [],
        valueExpr: "AgentCode",
        displayExpr: "AgentName",
      },
    },
    {
      dataField: "TicketDeadline", // dealline
      caption: t("TicketDeadline"),
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: [],
        valueExpr: "AgentCode",
        displayExpr: "AgentName",
      },
    },
    {
      dataField: "TicketDeadline", // phân loại
      caption: t("TicketDeadline"),
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: [],
        valueExpr: "AgentCode",
        displayExpr: "AgentName",
      },
    },
    {
      dataField: "CustomerCodeSys", // Khách hàng
      caption: t("CustomerCodeSys"),
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: [],
        valueExpr: "AgentCode",
        displayExpr: "AgentName",
      },
    },
    {
      dataField: "CustomerCodeSys", // Nội dung trao đổi
      caption: t("CustomerCodeSys"),
      editorType: "dxTextBox",
    },
    {
      dataField: "CustomerCodeSys", // Tên eticket
      caption: t("CustomerCodeSys"),
      editorType: "dxTextBox",
    },
    {
      dataField: "CustomerCodeSys", // mã eticket
      caption: t("CustomerCodeSys"),
      editorType: "dxTextBox",
    },
    {
      dataField: "CreateDTimeUTCTo", // ngày tạo
      caption: t("CreateDTimeUTCTo"),
      editorType: "dxDateBox",
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
    },
    {
      dataField: "CreateDTimeUTCTo", // ngày cập nhật
      caption: t("CreateDTimeUTCTo"),
      editorType: "dxDateBox",
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
    },
    {
      dataField: "CreateDTimeUTCTo", // nguồn
      caption: t("CreateDTimeUTCTo"),
      editorType: "dxDateBox",
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
    },
    {
      dataField: "CreateDTimeUTCTo", // Doanh nghiệp
      caption: t("CreateDTimeUTCTo"),
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: [],
        valueExpr: "AgentCode",
        displayExpr: "AgentName",
      },
    },
    {
      dataField: "CreateDTimeUTCTo", // Chi nhánh
      caption: t("CreateDTimeUTCTo"),
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: [],
        valueExpr: "AgentCode",
        displayExpr: "AgentName",
      },
    },
  ];

  return listColumn;
};
