import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";

export const useSideFormSettings = () => {
  const { t } = useI18n("SLA_Page");

  const formSettings: any = [
    {
      colCount: 1,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          caption: t("Phân loại tùy chọn"),
          dataField: "Options",
          editorOptions: {
            dataSource: ["Open", "Close"],
            value: "Open",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("Nguồn"),
          dataField: "Source",
          editorOptions: {
            searchEnabled: true,
            showClearButton: true,
            dataSource: [],
          },
          editorType: "dxSelectBox",
          visible: true,
        },
        {
          caption: t("Kênh tiếp nhận"),
          dataField: "Channel",
          editorOptions: {
            searchEnabled: true,
            showClearButton: true,
            dataSource: [],
          },
          editorType: "dxSelectBox",
          visible: true,
        },
        {
          caption: t("Kênh tiếp nhận mong muốn"),
          dataField: "Channel",
          editorOptions: {
            searchEnabled: true,
            showClearButton: true,
            dataSource: [],
          },
          editorType: "dxSelectBox",
          visible: true,
        },
        {
          caption: t("Tags mong muốn"),
          dataField: "Tags",
          editorOptions: {
            searchEnabled: true,
            showClearButton: true,
            dataSource: [],
            acceptCustomValue: true,
          },
          editorType: "dxTagBox",
          visible: true,
        },
        {
          caption: t("Tags mong muốn"),
          dataField: "Tags",
          editorOptions: {
            searchEnabled: true,
            showClearButton: true,
            dataSource: [],
          },
          editorType: "dxSelectBox",
          visible: true,
        },
        {
          caption: t("Tags mong muốn"),
          dataField: "Tags",
          editorOptions: {
            searchEnabled: true,
            showClearButton: true,
            dataSource: [],
          },
          editorType: "dxSelectBox",
          visible: true,
        },
      ],
    },
  ];

  return formSettings;
};
