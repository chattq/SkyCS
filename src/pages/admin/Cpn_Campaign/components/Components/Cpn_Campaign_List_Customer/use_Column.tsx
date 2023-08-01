import { useI18n } from "@/i18n/useI18n";
import { Icon } from "@/packages/ui/icons";

import {
  flagSelectorAtom,
  listCampaignAgentAtom,
} from "@/pages/admin/Cpn_Campaign/components/store";
import { ColumnOptions } from "@/types";
import { mapEditorOption, mapEditorType } from "@/utils/customer-common";
import { Button } from "devextreme-react";
import { useAtomValue } from "jotai";
import { useParams } from "react-router-dom";
interface Props {
  dataSource: any;
  dynamicField: any[];
}

export interface UseCustomerGridColumnsProps {
  dataField: Props;
  customeField: any;
  onClick: (param: any) => void;
}
export const useColumn = ({
  dataField,
  customeField,
  onClick,
}: UseCustomerGridColumnsProps) => {
  const { t } = useI18n("column");
  const param = useParams();
  let columnsDetail: ColumnOptions[] = [
    {
      dataField: "CustomerName", // tên khách hàng
      caption: t("CustomerName"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "CustomerPhoneNo1", // Số điện thoại 1
      caption: t("CustomerPhoneNo1"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "CustomerPhoneNo2", // Số điện thoại 2
      caption: t("CustomerPhoneNo2"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "CallOutDTimeUTC", // Thời gian gọi ra
      caption: t("CallOutDTimeUTC"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "CallTime", // Thời lượng
      caption: t("CallTime"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "File Ghi ÂM ( chưa có trường )", // File ghi âm
      caption: t("File Ghi ÂM ( chưa có trường )"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "CampaignCustomerCallStatus", // Trạng thái thực hiện
      caption: t("CampaignCustomerCallStatus"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "CustomerFeedBack", // Khách hàng phản hổi
      caption: t("CustomerFeedBack"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "QtyCall", // Số lần gọi
      caption: t("QtyCall"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "AgentName", // Khách hàng phản hổi
      caption: t("AgentName"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "Remark", // Ghi chú
      caption: t("Remark"),
      editorOptions: {
        readOnly: true,
      },
    },
  ];

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
        visible: true,
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
        visible: true,
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
          // readOnly: true,
          placeholder: "",
          readOnly: param?.flag === "detail",
          disabled: param?.flag === "detail",
        },
        visible: true,
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
          readOnly: param?.flag === "detail",
          disabled: param?.flag === "detail",
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
          // readOnly: param?.flag === "detail",
          // disabled: param?.flag === "detail",
        },
        visible: true,
      };
    } else {
      return {
        dataField: item, // Tên chiến dịch
        caption: t(item),
        editorType: "dxTextBox",
        editorOptions: {
          readOnly: true,
        },
        visible: true,
      };
    }
  });

  const buttonShowWhenDetail: ColumnOptions[] = [
    {
      dataField: "Button", // tên khách hàng
      caption: t(""),
      fixed: true,
      width: 80,
      alignment: "center",
      fixedPosition: "right",
      cssClass: "mx-1 cursor-pointer",
      cellRender: (param) => {
        return (
          <Button onClick={() => onClick(param)}>
            <Icon name="clock"></Icon>
          </Button>
        );
      },
    },
  ];

  if (param?.flag === "detail") {
    const result = [...columnsDetail, ...newColumn, ...buttonShowWhenDetail];
    console.log("result ", result);
    return [...columnsDetail, ...newColumn, ...buttonShowWhenDetail];
  }
  const response = [...columns, ...fieldCustomer, ...newColumn];
  return response;
};
