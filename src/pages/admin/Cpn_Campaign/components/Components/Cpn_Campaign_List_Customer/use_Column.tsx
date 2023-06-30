import { useI18n } from "@/i18n/useI18n";

import { listCampaignAgentAtom } from "@/pages/admin/Cpn_Campaign/components/store";
import { mapEditorOption, mapEditorType } from "@/utils/customer-common";
import { useAtomValue } from "jotai";
interface Props {
  dataSource: any;
  dynamicField: any[];
}

export interface UseCustomerGridColumnsProps {
  dataField: Props;
  customeField: any;
}
export const useColumn = ({
  dataField,
  customeField,
}: UseCustomerGridColumnsProps) => {
  const { t } = useI18n("column");
  const dataMap = dataField.dynamicField ?? [];
  const fieldCustomer = Object.keys(customeField)
    .map((item: string, index: number) => {
      return {
        [`${item}`]: Object.values(customeField)[index],
      };
    })
    .map((item, index) => {
      return {
        ColDataType: "dxTextBox",
        ColCodeSys: Object.values(item)[0],
        dataField: Object.values(item)[0],
        caption: Object.keys(item)[0],
      };
    });

  const newColumn = dataMap
    .map((item) => {
      return {
        ...item,
        ColDataType: item.CampaignColCfgDataType,
        ColCodeSys: item.CampaignColCfgCodeSys,
        caption: item.CampaignColCfgName,
        dataField: item.CampaignColCfgCodeSys,
      };
    })
    .map((item) => {
      return {
        ...item,
        editorType: mapEditorType(item.ColDataType),
        editorOptions: {
          ...mapEditorOption({
            field: item,
            listDynamic: dataField.dataSource,
          }),
          readOnly: true,
          placeholder: "",
        },
      };
    });

  const obj = {
    AgentCode: "",
    AgentName: "",
    CustomerName: "",
    CustomerPhoneNo1: "",
    CustomerPhoneNo2: "",
    CustomerEmail: "",
  };
  const listCampaignAgentValue = useAtomValue(listCampaignAgentAtom);
  const columns = Object.keys(obj).map((item) => {
    if (item === "AgentCode") {
      return {
        dataField: "AgentCode",
        caption: t(item),
        editorType: "dxSelectBox",
        setCellValue: (newData: any, value: any) => {
          const item = listCampaignAgentValue.find(
            (item) => !!item && item.UserCode === value
          );
          if (item) {
            newData.AgentName = item.UserName;
            newData.AgentCode = value;
          }
        },
        visible: false,
        editorOptions: {
          dataSource: listCampaignAgentValue,
          placeholder: t("Input"),
          displayExpr: "UserName",
          valueExpr: "UserCode",
        },
      };
    }
    if (item === "AgentName") {
      return {
        dataField: "AgentName",
        caption: t(item),
        editorType: "dxSelectBox",
        setCellValue: (newData: any, value: any) => {
          const item = listCampaignAgentValue.find(
            (item) => !!item && item.UserCode === value
          );
          if (item) {
            newData.AgentName = item.UserName;
            newData.AgentCode = value;
          }
        },
        editorOptions: {
          dataSource: listCampaignAgentValue,
          placeholder: t("Input"),
          displayExpr: "UserName",
          valueExpr: "UserCode",
        },
      };
    } else {
      return {
        dataField: item, // Tên chiến dịch
        caption: t(item),
        editorType: "dxTextBox",
        editorOptions: {
          readOnly: true,
        },
      };
    }
  });
  const response = [...columns, ...fieldCustomer, ...newColumn];
  return response;
};
