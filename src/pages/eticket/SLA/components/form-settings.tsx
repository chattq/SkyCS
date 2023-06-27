import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";

export const useFormSettings = () => {
  const { t } = useI18n("SLA_Page");

  const formSettings: any = [
    {
      colCount: 2,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          caption: t("Mức SLA"),
          dataField: "SLALevel",
          editorOptions: {
            placeholder: t("Input"),
          },
          editorType: "dxTextBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("Thời gian phản hồi ban đầu"),
          dataField: "FirstResTime",
          editorOptions: {
            type: "time",
          },
          editorType: "dxDateBox",
          visible: true,
          format: "HH:mm",
        },
        {
          dataField: "SLADesc",
          editorOptions: {
            placeholder: t("Input"),
          },
          editorType: "dxTextArea",
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
