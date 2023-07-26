import { ColumnOptions } from "@packages/ui/base-gridview";
import { StatusButton } from "@packages/ui/status-button";
import { useI18n } from "@/i18n/useI18n";
import { Mst_CustomerGroupData } from "@packages/types";
import { nanoid } from "nanoid";
import NavNetworkLink from "@/components/Navigate";
import { checkUIZNSAtom } from "./store";
import { useSetAtom } from "jotai";
import { filterByFlagActive } from "@/packages/common";

interface UseBankDealerGridColumnsProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useBankDealerGridColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const { t } = useI18n("Mst_PaymentTermController");
  const setcheckUIZNS = useSetAtom(checkUIZNSAtom);
  const handleClick = () => {
    setcheckUIZNS(false);
  };
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "SubFormCode", // Mã ngân hàng
      caption: t("SubFormCode"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <NavNetworkLink to={`/admin/Content_Managent/${data.SubFormCode}`}>
            <div className="text-green-600" onClick={handleClick}>
              {value}
            </div>
          </NavNetworkLink>
        );
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "SubFormName", // Mã ngân hàng
      caption: t("SubFormName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },

      columnIndex: 1,
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "ChannelType", // Tên ngân hàng
      caption: t("ChannelType"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "IDZNS", // Mã đại lý
      caption: t("IDZNS"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "BulletinType", // Mã đại lý
      caption: t("BulletinType"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
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
      headerFilter: {
        dataSource: filterByFlagActive(data, {
          true: t("Active"),
          false: t("Inactive"),
        }),
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "LogLUDTimeUTC",
      caption: t("LogLUDTimeUTC"),
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
