import { useI18n } from "@/i18n/useI18n";
import { uniqueFilterByDataField } from "@/packages/common";
import {
  RequiredField,
  requiredType,
} from "@/packages/common/Validation_Rules";
import { SysUserData, Sys_GroupController } from "@/packages/types";
import { showPopupUser } from "@/pages/User_Mananger/components/store";
import { useAtomValue, useSetAtom } from "jotai";
import { showInfoObjAtom } from "./store";

interface Mst_DepartmentControlColumnsProps {
  data: any;
}

export const useFormSettings = ({
  data,
}: Mst_DepartmentControlColumnsProps) => {
  const { t } = useI18n("Sys_Group");
  const setPopup = useSetAtom(showPopupUser);
  const setShowInfoObj = useSetAtom(showInfoObjAtom);

  const viewRow = (data: any) => {
    setShowInfoObj(false);
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
            // {
            //   dataField: "QtyUser",
            //   editorOptions: {
            //     placeholder: t("Input"),
            //     readOnly: true,
            //   },
            //   editorType: "dxTextBox",
            //   caption: t("QtyUser"),
            //   visible: true,
            //   render: (data: any) => {
            //     return (
            //       <div>
            //         {data.editorOptions.value === undefined ? (
            //           <div
            //             className="text-white bg-green-500 rounded-lg p-1 text-center text-[13px] cursor-pointer w-[25%] border"
            //             onClick={() => viewRow(data)}
            //           >
            //             {t("Add user")}
            //           </div>
            //         ) : (
            //           <div
            //             onClick={() => viewRow(data)}
            //             className="text-[13px] cursor-pointer text-green-600 ml-3"
            //           >
            //             {t(`NumberUser: ${data.editorOptions.value}`)}
            //           </div>
            //         )}
            //       </div>
            //     );
            //   },
            // },
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
              editorType: "dxTextArea",
              editorOptions: {
                placeholder: t("Input"),
                height: 50,
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
          dataField: "Idx",
          caption: t("STT"),
          alignment: "center",
          columnIndex: 1,
          visible: true,
          cellRender: ({ data, rowIndex, value }: any) => {
            return <div>{rowIndex + 1}</div>;
          },
          width: 85,
        },
        {
          dataField: "EMail",
          editorOptions: {
            placeholder: t("Input"),
          },
          editorType: "dxTextBox",
          caption: t("EMail"),
          visible: true,
        },
        {
          dataField: "UserName",
          editorOptions: {
            readOnly: true,
            placeholder: t("Input"),
          },

          editorType: "dxTextBox",
          caption: t("UserName"),
          visible: true,
        },
        {
          dataField: "PhoneNo",
          editorOptions: {
            readOnly: true,
            placeholder: t("Input"),
          },

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
