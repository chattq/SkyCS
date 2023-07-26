import { useI18n } from "@/i18n/useI18n";

import { LinkCell } from "@packages/ui/link-cell";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { SLA_EditType } from "./store";

export const useMst_SLAColumns = () => {
  const navigate = useNavigate();

  const setType = useSetAtom(SLA_EditType);

  const viewRow = async (rowIndex: number, data: any) => {
    setType("detail");
    navigate(`${data?.SLAID}`);
  };

  const { t } = useI18n("Mst_SLA");
  const columns = [
    {
      dataField: "SLAID",
      editorOptions: {
        readOnly: true,
      },
      caption: t("SLAID"),
      columnIndex: 1,
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
      dataField: "SLALevel",
      editorOptions: {
        readOnly: true,
      },
      caption: t("SLALevel"),
      columnIndex: 1,
      visible: true,
    },
    {
      dataField: "SLADesc",
      editorOptions: {
        readOnly: true,
      },
      caption: t("SLADesc"),
      columnIndex: 1,
      visible: true,
      width: 300,
    },
    {
      dataField: "LogLUDTimeUTC",
      editorOptions: {
        readOnly: true,
      },
      caption: t("LogLUDTimeUTC"),
      columnIndex: 1,
      visible: true,
    },
  ];
  // return array of the first item only

  return columns;
};
