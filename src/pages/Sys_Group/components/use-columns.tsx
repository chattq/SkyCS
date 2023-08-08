import { ColumnOptions } from "@packages/ui/base-gridview";
import { useI18n } from "@/i18n/useI18n";
import { Mst_DepartmentControl, Sys_GroupController } from "@packages/types";
import { useSetAtom } from "jotai";

import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import { StatusButton } from "@/packages/ui/status-button";
import { flagEdit, showDetail, showPopup, viewingDataAtom } from "./store";
import { filterByFlagActive } from "@/packages/common";

interface Mst_DepartmentControlColumnsProps {
  data?: any;
}

export const useDepartMentGridColumns = ({
  data,
}: Mst_DepartmentControlColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const setCheckEdit = useSetAtom(flagEdit);
  const viewRow = (rowIndex: number, data: any) => {
    setPopupVisible(true);
    setShowDetail(true);
    setCheckEdit(false);
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const { t } = useI18n("Department_Control");
  const columns: ColumnOptions[] = [
    {
      dataField: "GroupName",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("GroupName"),
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
      dataField: "QtyUser",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("QtyUser"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "GroupDesc",
      editorOptions: {
        readOnly: true,
      },
      caption: t("GroupDesc"),
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
