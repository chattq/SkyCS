import { useI18n } from "@/i18n/useI18n";
import { uniqueFilterByDataField } from "@/packages/common";
import {
  RequiredField,
  requiredType,
} from "@/packages/common/Validation_Rules";
import { SysUserData, Sys_GroupController } from "@/packages/types";
import { showPopupUser } from "@/pages/User_Mananger/components/store";
import { useAtomValue, useSetAtom } from "jotai";

interface Mst_DepartmentControlColumnsProps {
  data: any;
}

export const useFormSettings = ({
  data,
}: Mst_DepartmentControlColumnsProps) => {
  const { t } = useI18n("Sys_Group");
  const setPopup = useSetAtom(showPopupUser);

  const viewRow = (data: any) => {
    console.log("a");
    setPopup(true);
    // setShowDetail(true);
  };

  const formSettings: any = [
    {
      colCount: 4,
      labelLocation: "left",
      typeForm: "textForm",
      items: [
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 2,
          cssClass: "",
          items: [
            {
              dataField: "GroupCode",
              editorType: "dxTextBox",
              editorOptions: {
                placeholder: t("Input"),
              },
              caption: t("GroupCode"),
              validationRules: [RequiredField(t("GroupCodeIsRequired"))],
              visible: true,
            },
            {
              dataField: "GroupName",
              editorType: "dxTextBox",
              editorOptions: {
                placeholder: t("Input"),
              },
              caption: t("GroupName"),
              validationRules: [RequiredField(t("GroupNameIsRequired"))],
              visible: true,
            },
            {
              dataField: "QtyUser",
              editorOptions: {
                placeholder: t("Input"),
                readOnly: true,
              },
              editorType: "dxTextBox",
              caption: t("QtyUser"),
              visible: true,
              render: (data: any) => {
                return (
                  <div>
                    {data.editorOptions.value === undefined ? (
                      <div
                        className="text-white bg-green-500 rounded-lg p-1 text-center text-[13px] cursor-pointer w-[25%] border"
                        onClick={() => viewRow(data)}
                      >
                        {t("Add user")}
                      </div>
                    ) : (
                      <div
                        onClick={() => viewRow(data)}
                        className="text-[13px] cursor-pointer text-green-600 ml-3"
                      >
                        {t(`NumberUser: ${data.editorOptions.value}`)}
                      </div>
                    )}
                  </div>
                );
              },
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
              dataField: "GroupDesc",
              editorType: "dxTextBox",
              editorOptions: {
                placeholder: t("Input"),
              },
              caption: t("GroupDesc"),
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
              rowData.su_UserName = data.filter(
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
          dataField: "su_UserName",
          editorOptions: {
            dataSource: data,
            displayExpr: "UserName",
            valueExpr: "UserName",
            readOnly: true,
            placeholder: t("Input"),
          },
          width: 180,
          editorType: "dxSelectBox",
          caption: t("su_UserName"),
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
      hidden: false,
    },
  ];

  return formSettings;
};
