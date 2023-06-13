import { ColumnOptions } from "@packages/ui/base-gridview";
import {
  ExcludeSpecialCharactersType,
  RequiredField,
  requiredType,
} from "@packages/common/Validation_Rules";
import { filterByFlagActive, uniqueFilterByDataField } from "@packages/common";
import { StatusButton } from "@packages/ui/status-button";
import { useI18n } from "@/i18n/useI18n";
import { Cpn_CampaignAgentData } from "@packages/types";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import { viewingDataAtom } from "./store";
import { StatusUser } from "@/packages/ui/status-user";

const flagEditorOptions = {
  searchEnabled: true,
  valueExpr: "value",
  displayExpr: "text",
  items: [
    {
      value: "1",
      text: "1",
    },
    {
      value: "0",
      text: "0",
    },
  ],
};

interface UseBankDealerGridColumnsProps {
  data?: Cpn_CampaignAgentData[] | any;
}

export const useBankDealerGridColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const viewRow = (rowIndex: number, data: Cpn_CampaignAgentData) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const { t } = useI18n("Mst_PaymentTermController");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CampaignCode", // Mã ngân hàng
      caption: t("CampaignCode"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <LinkCell
            key={nanoid()}
            onClick={() => viewRow(rowIndex, data)}
            value={value}
          />
        );
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CampaignName", // Mã ngân hàng
      caption: t("CampaignName"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CampaignStatus", // Tên ngân hàng
      caption: t("CampaignStatus"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },

      columnIndex: 1,
      cellRender: ({ data }: any) => {
        return <StatusUser key={nanoid()} status={data.CampaignStatus} />;
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "UserName", // Mã đại lý
      caption: t("UserName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Extension", // Mã đại lý
      caption: t("Extension"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyCustomer", // Mã đại lý
      caption: t("QtyCustomer"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyCustomerSuccess", // Mã đại lý
      caption: t("QtyCustomerSuccess"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
  ];
  // return array of the first item only

  return columns;
};
