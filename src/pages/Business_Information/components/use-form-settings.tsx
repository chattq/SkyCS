import { useI18n } from "@/i18n/useI18n";
import { RequiredField } from "@/packages/common/Validation_Rules";
import { SelectBox } from "devextreme-react";
import { useState } from "react";
import Custombotton from "./Custombotton";

export const useFormSettings = ({ data, dataProvince }: any) => {
  const { t } = useI18n("Business_Information");

  const dataSelect = [
    { text: "Thêm", value: "abc" },
    { text: "Lựa chọn", value: "bca" },
  ];

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
            // {
            //   dataField: "Select",
            //   caption: t("OrgID"),
            //   visible: true,
            //   render: ({ editorOptions, component: formRef }: any) => {
            //     return (
            //       <Custombotton
            //         dataSelect={dataSelect}
            //         data={data}
            //         formRef={formRef}
            //       />
            //     );
            //   },
            // },
            // {
            //   dataField: "OrgID",
            //   editorOptions: {
            //     readOnly: true,
            //     placeholder: t("Input Select"),
            //   },
            //   editorType: "dxTextBox",
            //   caption: t("OrgID"),
            //   visible: true,
            // },
            {
              dataField: "NNTFullName",
              editorOptions: {
                readOnly: false,
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("NNTFullName"),
              visible: true,
              validationRules: [RequiredField(t("NNTFullNameIsRequired"))],
            },
            {
              dataField: "MST",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("MST"),
              visible: true,
              validationRules: [RequiredField(t("MSTIsRequired"))],
            },
            {
              dataField: "NNTShortName",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("NNTShortName"),
              visible: true,
            },
            {
              dataField: "PresentBy",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("PresentBy"),
              visible: true,
            },
            {
              dataField: "NNTPosition",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("NNTPosition"),
              visible: true,
            },
            {
              dataField: "Website",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("Website"),
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
              dataField: "ProvinceCode",
              editorOptions: {
                placeholder: t("Input"),
                dataSource: dataProvince,
                displayExpr: "ProvinceName",
                valueExpr: "ProvinceCode",
              },
              editorType: "dxSelectBox",
              caption: t("ProvinceName"),
              visible: true,
              label: {
                text: t("ProvinceName"),
              },
            },
            {
              dataField: "NNTAddress",
              editorOptions: {
                readOnly: false,
                placeholder: t("Input"),
                height: 70,
                maxLength: 200,
              },
              editorType: "dxTextArea",
              caption: t("NNTAddress"),
              visible: true,
            },
            {
              dataField: "ContactName",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("ContactName"),
              visible: true,
            },
            {
              dataField: "ContactPhone",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("ContactPhone"),
              visible: true,
            },
            {
              dataField: "ContactEmail",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("ContactEmail"),
              visible: true,
            },
            {
              dataField: "FlagActive",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxSwitch",
              caption: t("FlagActive"),
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

  return formSettings;
};
