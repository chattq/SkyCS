import { ColumnOptions } from "@packages/ui/base-gridview";
import {
  ExcludeSpecialCharactersType,
  RequiredField,
  requiredType,
} from "@packages/common/Validation_Rules";
import { filterByFlagActive, uniqueFilterByDataField } from "@packages/common";
import { StatusButton } from "@packages/ui/status-button";
import { useI18n } from "@/i18n/useI18n";
import { Mst_CustomerGroupData } from "@packages/types";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import { viewingDataAtom } from "./store";

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
  data?: Mst_CustomerGroupData[] | any;
}

export const useBankDealerGridColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const viewRow = (rowIndex: number, data: Mst_CustomerGroupData) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };
  const PTTypeData = [
    {
      text: "Sale",
      value: "SALE",
    },
    {
      text: "Purchase",
      value: "PURCHASE",
    },
  ];

  const { t } = useI18n("Mst_PaymentTermController");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "OrgID", // Mã ngân hàng
      caption: t("OrgID"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "PaymentTermCode", // Mã ngân hàng
      caption: t("PaymentTermCode"),
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
      dataField: "PaymentTermName", // Tên ngân hàng
      caption: t("PaymentTermName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "PTType", // Mã đại lý
      caption: t("PTType"),
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: PTTypeData,
        valueExpr: "value",
        displayExpr: "text",
        readOnly: false,
        placeholder: t("Input"),
      },
      validationRules: [requiredType],
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "PTDesc", // Mã đại lý
      caption: t("PTDesc"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      validationRules: [requiredType],
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "OwedDay", // Mã đại lý
      caption: t("OwedDay"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input number"),
      },
      editorType: "dxNumberBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CreditLimit", // Mã đại lý
      caption: t("CreditLimit"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input number"),
      },
      editorType: "dxNumberBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "DepositPercent", // Mã đại lý
      caption: t("DepositPercent"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input number"),
      },
      editorType: "dxNumberBox",
      columnIndex: 1,
    },
    {
      dataField: "FlagActive",
      caption: t("FlagActive"),
      editorType: "dxSwitch",
      alignment: "center",
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      width: 100,
      cellRender: ({ data }: any) => {
        return <StatusButton key={nanoid()} isActive={data.FlagActive} />;
      },
    },
  ];
  // return array of the first item only

  return columns;
};
