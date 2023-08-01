import { useI18n } from "@/i18n/useI18n";
import {
  RequiredField,
  requiredEmailType,
  requiredType,
} from "@/packages/common/Validation_Rules";

export const useFormSettings = ({
  dataMST,
  dataListDepartment,
  dataListGroup,
}: any) => {
  const { t } = useI18n("User_Mananger");

  const formSettings: any = [
    {
      colCount: 4,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 2,
          cssClass: "",
          items: [
            {
              dataField: "EMail",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("EMail"),
              visible: true,
              validationRules: [
                requiredEmailType,
                RequiredField(t("EmailIsRequired")),
              ],
            },
            {
              dataField: "UserName",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("UserName"),
              visible: true,
              validationRules: [RequiredField(t("UserNameIsRequired"))],
            },
            {
              dataField: "PhoneNo",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("PhoneNo"),
              visible: true,
            },
            {
              dataField: "ACId",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("ACId"),
              visible: true,
            },
            {
              dataField: "UserPassword",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("UserPassword"),
              visible: true,
              validationRules: [RequiredField(t("UserPasswordIsRequired"))],
            },
            {
              dataField: "ReUserPassword",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              label: {
                text: t("Re-Enter the password"),
              },
              caption: t("ReUserPassword"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "ACLanguage",
              editorOptions: {
                dataSource: [{ text: t("Tiếng Việt"), value: "vi" }],
                displayExpr: "text",
                valueExpr: "value",
                placeholder: t("Input"),
              },
              editorType: "dxSelectBox",
              caption: t("ACLanguage"),
              visible: true,
            },
            {
              dataField: "ACTimeZone",
              editorOptions: {
                placeholder: t("Input"),
                dataSource: [{ text: t("UTC+7"), value: "7" }],
                displayExpr: "text",
                valueExpr: "value",
              },
              editorType: "dxSelectBox",
              caption: t("ACTimeZone"),
              visible: true,
            },
          ],
        },
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 2,
          cssClass: "",
          items: [
            {
              dataField: "MST",
              editorOptions: {
                placeholder: t("Input"),
                dataSource: dataMST ?? [],
                displayExpr: "NNTFullName",
                valueExpr: "MST",
              },
              label: {
                text: t("Chi nhánh"),
              },
              editorType: "dxSelectBox",
              caption: t("MST"),
              visible: true,
              validationRules: [RequiredField(t("MSTisRequired"))],
            },
            {
              dataField: "DepartmentName",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: dataListDepartment ?? [],
                displayExpr: "DepartmentName",
                valueExpr: "DepartmentCode",
                searchEnabled: true,
              },
              editorType: "dxTagBox",
              caption: t("DepartmentName"),
              visible: true,
            },
            {
              dataField: "GroupName",
              editorOptions: {
                dataSource: dataListGroup ?? [],
                displayExpr: "GroupName",
                valueExpr: "GroupCode",
                placeholder: t("Select"),
                searchEnabled: true,
              },
              editorType: "dxTagBox",
              caption: t("GroupName"),
              visible: true,
            },
            {
              dataField: "FlagSysAdmin",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxSwitch",
              caption: t("FlagSysAdmin"),
              visible: true,
            },
            {
              dataField: "FlagNNTAdmin",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxSwitch",
              caption: t("FlagNNTAdmin"),
              visible: true,
            },
          ],
        },
      ],
    },
    {
      typeForm: "TableForm",
      items: [],
      hidden: true,
    },
  ];

  const formSettingWhenSuccess: any = [
    {
      colCount: 4,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 2,
          cssClass: "",
          items: [
            {
              dataField: "EMail",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("EMail"),
              visible: true,
              validationRules: [
                requiredEmailType,
                RequiredField(t("EmailIsRequired")),
              ],
            },
            {
              dataField: "UserName",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("UserName"),
              visible: true,
              validationRules: [RequiredField(t("UserNameIsRequired"))],
            },
            {
              dataField: "PhoneNo",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("PhoneNo"),
              visible: true,
            },
            {
              dataField: "ACId",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("ACId"),
              visible: true,
            },
            {
              dataField: "ACLanguage",
              editorOptions: {
                dataSource: [{ text: t("Tiếng Việt"), value: "vi" }],
                displayExpr: "text",
                valueExpr: "value",
                placeholder: t("Input"),
              },
              editorType: "dxSelectBox",
              caption: t("ACLanguage"),
              visible: true,
            },
            {
              dataField: "ACTimeZone",
              editorOptions: {
                placeholder: t("Input"),
                dataSource: [{ text: t("UTC+7"), value: "7" }],
                displayExpr: "text",
                valueExpr: "value",
              },
              editorType: "dxSelectBox",
              caption: t("ACTimeZone"),
              visible: true,
            },
          ],
        },
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 2,
          cssClass: "",
          items: [
            {
              dataField: "MST",
              editorOptions: {
                placeholder: t("Input"),
                dataSource: dataMST ?? [],
                displayExpr: "NNTFullName",
                valueExpr: "MST",
              },
              label: {
                text: t("Chi nhánh"),
              },
              editorType: "dxSelectBox",
              caption: t("MST"),
              visible: true,
              validationRules: [RequiredField(t("MSTisRequired"))],
            },
            {
              dataField: "DepartmentName",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: dataListDepartment ?? [],
                displayExpr: "DepartmentName",
                valueExpr: "DepartmentCode",
                searchEnabled: true,
              },
              editorType: "dxTagBox",
              caption: t("DepartmentName"),
              visible: true,
            },
            {
              dataField: "GroupName",
              editorOptions: {
                dataSource: dataListGroup ?? [],
                displayExpr: "GroupName",
                valueExpr: "GroupCode",
                placeholder: t("Select"),
                searchEnabled: true,
              },
              editorType: "dxTagBox",
              caption: t("GroupName"),
              visible: true,
            },
            {
              dataField: "FlagSysAdmin",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxSwitch",
              caption: t("FlagSysAdmin"),
              visible: true,
            },
            {
              dataField: "FlagNNTAdmin",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxSwitch",
              caption: t("FlagNNTAdmin"),
              visible: true,
            },
          ],
        },
      ],
    },
    {
      typeForm: "TableForm",
      items: [],
      hidden: true,
    },
  ];

  return {
    formSettings: formSettings,
    formSettingWhenSuccess: formSettingWhenSuccess,
  };
};
