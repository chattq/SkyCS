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
import { Link } from "react-router-dom";
import NavNetworkLink from "@/components/Navigate";
import StatusPost from "./components/StatusPost";

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

  const { t } = useI18n("Mst_PaymentTermController");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Title", // Mã ngân hàng
      caption: t("Title"),
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
      dataField: "kbc_CategoryName", // Mã ngân hàng
      caption: t("kbc_CategoryName"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <NavNetworkLink to={`/admin/Post_Manager/detail`}>
            <div>{value}</div>
          </NavNetworkLink>
        );
      },
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Detail", // Tên ngân hàng
      caption: t("Detail"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CreateDTimeUTC", // Mã đại lý
      caption: t("CreateDTimeUTC"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 2,
    },
    {
      dataField: "PostStatus",
      caption: t("PostStatus"),
      editorType: "dxTextBox",
      alignment: "center",
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      cellRender: ({ data }: any) => {
        return <StatusPost key={nanoid()} isActive={data.PostStatus} />;
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "ShareType", // Mã đại lý
      caption: t("ShareType"),
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
