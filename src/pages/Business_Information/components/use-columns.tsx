import { ColumnOptions } from "@packages/ui/base-gridview";
import {
  ExcludeSpecialCharactersType,
  RequiredField,
  requiredType,
} from "@packages/common/Validation_Rules";
import { filterByFlagActive, uniqueFilterByDataField } from "@packages/common";
import { StatusButton } from "@packages/ui/status-button";
import { useI18n } from "@/i18n/useI18n";
import { Mst_Dealer } from "@packages/types";
import { useSetAtom } from "jotai";

import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import { showDetail, showPopup, viewingDataAtom } from "./store";

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

interface UseDealerGridColumnsProps {
  data: any;
}

export const useDealerGridColumns = ({ data }: UseDealerGridColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const viewRow = (rowIndex: number, data: any) => {
    setShowDetail(true);
    setViewingItem({
      rowIndex,
      item: data,
    });
    setPopupVisible(true);
  };

  const { t } = useI18n("Dealer");
  const columns: ColumnOptions[] = [
    {
      dataField: "OrgID",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("OrgID"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "NNTFullName",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("NNTFullName"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      cellRender: ({ data, rowIndex, value }: any) => {
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
      dataField: "MST",
      editorOptions: {
        readOnly: true,
      },
      caption: t("MST"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "PresentBy",
      editorOptions: {
        readOnly: true,
      },
      caption: t("PresentBy"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "NNTPosition",
      editorOptions: {
        readOnly: true,
      },
      caption: t("NNTPosition"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "ContactName",
      editorOptions: {
        readOnly: true,
      },
      caption: t("ContactName"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "ContactPhone",
      editorOptions: {
        readOnly: true,
      },
      caption: t("ContactPhone"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "ContactEmail",
      editorOptions: {
        readOnly: true,
      },
      caption: t("ContactEmail"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "FlagActive",
      caption: t("Status"),
      editorType: "dxSwitch",
      columnIndex: 2,
      headerFilter: {
        dataSource: filterByFlagActive(data ?? [], {
          true: t("Active"),
          false: t("Inactive"),
        }),
      },
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
