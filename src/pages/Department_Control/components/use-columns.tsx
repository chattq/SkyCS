import { ColumnOptions } from "@packages/ui/base-gridview";
import { useI18n } from "@/i18n/useI18n";
import { Mst_DepartmentControl } from "@packages/types";
import { useSetAtom } from "jotai";
import {
  showDetail,
  showPopup,
  viewingDataAtom,
} from "@/pages/Department_Control/components/store";
import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import { StatusButton } from "@/packages/ui/status-button";
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
  const viewRow = (rowIndex: number, data: Mst_DepartmentControl) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
    setPopupVisible(true);
    setShowDetail(true);
  };

  const { t } = useI18n("Department_Control");
  const columns: ColumnOptions[] = [
    {
      dataField: "DepartmentCode",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("DepartmentCode"),
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
      dataField: "DepartmentName",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("DepartmentName"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "su_QtyUser",
      editorOptions: {
        readOnly: true,
      },
      caption: t("su_QtyUser"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "DepartmentDesc",
      editorOptions: {
        readOnly: true,
      },
      caption: t("DepartmentDesc"),
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
