import { useI18n } from "@/i18n/useI18n";
import { uniqueFilterByDataField } from "@/packages/common";
import {
  RequiredField,
  requiredType,
} from "@/packages/common/Validation_Rules";
import { SysUserData } from "@/packages/types";
import { useCallback, useRef, useState } from "react";

interface Mst_DepartmentControlColumnsProps {
  data: any;
}

export const useFormSettings = ({
  data,
}: Mst_DepartmentControlColumnsProps) => {
  const { t } = useI18n("Department_Control");

  const formSettings: any = [
    {
      colCount: 4,
      labelLocation: "left",
      typeForm: "textForm",
      items: [
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 4,
          cssClass: "",
          items: [
            {
              dataField: "DepartmentCode",
              editorType: "dxTextBox",
              editorOptions: {
                placeholder: t("Input"),
              },
              caption: t("DepartmentCode"),
              validationRules: [RequiredField(t("DepartmentCodeIsRequired"))],
              visible: true,
            },
            {
              dataField: "DepartmentName",
              editorOptions: {
                placeholder: t("Input"),
                invalidDateMessage: [requiredType],
              },
              editorType: "dxTextBox",
              caption: t("DepartmentName"),
              visible: true,
              validationRules: [requiredType],
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
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 4,
          cssClass: "",
          items: [
            {
              dataField: "DepartmentDesc",
              editorOptions: {
                readOnly: false,
                placeholder: t("Input"),
                height: 70,
                maxLength: 200,
              },
              editorType: "dxTextArea",
              caption: t("DepartmentDesc"),
              visible: true,
            },
          ],
        },
      ],
    },
    {
      typeForm: "TableForm",
      items: [
        {
          dataField: "Email",
          width: 180,
          editorOptions: {
            dataSource: data ?? [],
            displayExpr: "EMail",
            valueExpr: "EMail",
            readOnly: false,
            placeholder: t("Input"),
          },
          editorType: "dxSelectBox",
          caption: t("Email"),
          visible: true,
          validationRules: [RequiredField(t("EmailIsRequired"))],

          setCellValue: (rowData: any, value: any, currentRowData: any) => {
            rowData.Email = value;
            if (data) {
              rowData.FullName = data.filter(
                (item: any) => item.EMail === rowData.Email
              )[0].UserName;
              rowData.UserCode = data.filter(
                (item: any) => item.EMail === rowData.Email
              )[0].UserCode;
              rowData.PhoneNo = data.filter(
                (item: any) => item.EMail === rowData.Email
              )[0].PhoneNo;
            }
          },
        },
        {
          dataField: "UserCode",
          editorOptions: {
            readOnly: true,
            placeholder: t("Input"),
          },
          width: 180,
          editorType: "dxTextBox",
          caption: t("UserCode"),
          visible: true,
        },
        {
          dataField: "FullName",
          editorOptions: {
            dataSource: data,
            displayExpr: "UserName",
            valueExpr: "UserName",
            readOnly: true,
            placeholder: t("Input"),
          },
          width: 180,
          editorType: "dxSelectBox",
          caption: t("FullName"),
          visible: true,
          validationRules: [RequiredField(t("FullNameIsRequired"))],
        },

        {
          dataField: "PhoneNo",
          editorOptions: {
            readOnly: true,
            placeholder: t("Input"),
          },
          width: 180,
          editorType: "dxTextBox",
          caption: t("PhoneNo"),
          visible: true,
        },
      ],
    },
  ];

  return formSettings;
};
