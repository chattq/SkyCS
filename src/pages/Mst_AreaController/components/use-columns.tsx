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

interface UseBankDealerGridColumnsProps {
  data?: Mst_CustomerGroupData[] | any;
  listArea?: any;
  datalistOrgID?: any;
}

export const useBankDealerGridColumns = ({
  data,
  listArea,
  datalistOrgID,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const viewRow = (rowIndex: number, data: Mst_CustomerGroupData) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const { t } = useI18n("Mst_PaymentTermController");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "OrgID", // Mã ngân hàng
      caption: t("OrgID"),
      editorType: "dxSelectBox",

      editorOptions: {
        dataSource: datalistOrgID,
        valueExpr: "OrgID",
        displayExpr: "NNTFullName",
        readOnly: false,
        placeholder: t("Input"),
      },

      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "AreaCode", // Mã ngân hàng
      caption: t("AreaCode"),
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
      dataField: "AreaName", // Tên ngân hàng
      caption: t("AreaName"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
        maxLength: 100,
      },
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "AreaCodeParent", // Mã đại lý
      caption: t("AreaCodeParent"),
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: listArea ?? [],
        valueExpr: "AreaCode",
        displayExpr: "AreaName",
        readOnly: false,
        placeholder: t("Select"),
      },
      columnIndex: 2,
      validationRules: [requiredType],
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "AreaDesc", // Mã đại lý
      caption: t("AreaDesc"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
        maxLength: 500,
      },
      editorType: "dxTextArea",
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "FlagActive",
      caption: t("FlagActive"),
      editorType: "dxSwitch",
      alignment: "center",
      columnIndex: 2,

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
