import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useQuery } from "@tanstack/react-query";

export const useFormSettings = () => {
  const { t } = useI18n("SLA_Page");

  const api = useClientgateApi();

  const { data: customerList } = useQuery(
    ["CustomerList"],
    api.Mst_Customer_GetAllActive
  );

  const { data: departmentList } = useQuery(
    ["departmentList"],
    api.Mst_DepartmentControl_GetAllActive
  );

  const { data: agentList } = useQuery(
    ["agentList"],
    api.Cpn_CampaignAgent_GetActive
  );

  console.log(agentList);

  const formSettings: any = [
    {
      colCount: 1,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          caption: t("Trạng thái"),
          dataField: "Status",
          editorOptions: {
            dataSource: ["Open", "Close"],
            value: "Open",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("Khách hàng"),
          dataField: "Customer",
          editorOptions: {
            searchEnabled: true,
            showClearButton: true,
            dataSource: customerList?.DataList ?? [],
            displayExpr: "CustomerName",
            valueExpr: "CustomerCodeSys",
          },
          editorType: "dxSelectBox",
          visible: true,
        },
        {
          caption: t("Tên eTicket"),
          dataField: "eTicketName",
          editorOptions: {
            placeholder: t("Input"),
          },
          editorType: "dxTextBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          dataField: "SLADesc",
          editorOptions: {
            placeholder: t("Input"),
          },
          editorType: "dxHtmlEditor",
          caption: t("Mô tả"),
          visible: true,
          validationRules: [requiredType],
        },
      ],
    },
    {
      colCount: 2,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          caption: t("Chi nhánh/Đại lý"),
          dataField: "DLCode",
          editorOptions: {
            dataSource: departmentList?.DataList ?? [],
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("Phần loại"),
          dataField: "Type",
          editorOptions: {
            searchEnabled: true,
            showClearButton: true,
            dataSource: [],
          },
          editorType: "dxSelectBox",
          visible: true,
        },
        {
          caption: t("Phòng ban"),
          dataField: "Department",
          editorOptions: {
            dataSource: departmentList?.DataList ?? [],
            valueExpr: "DepartmentCode",
            displayExpr: "DepartmentName",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          dataField: "SLADesc",
          editorOptions: {
            placeholder: t("Input"),
          },
          editorType: "dxHtmlEditor",
          caption: t("Mô tả"),
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("Thời gian xử lý"),
          dataField: "ResolutionTime",
          editorOptions: {
            type: "time",
          },
          editorType: "dxDateBox",
          visible: true,
          format: "HH:mm",
        },
        {
          caption: t("Trạng thái"),
          dataField: "SLAStatus",
          editorOptions: {},
          editorType: "dxSwitch",
          visible: true,
        },
      ],
    },
  ];

  return formSettings;
};
