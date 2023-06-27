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
import { dataFormAtom, valueIDAtom, viewingDataAtom } from "./store";
import NavNetworkLink from "@/components/Navigate";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";

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
  const { t } = useI18n("Mst_PaymentTermController");
  const setIDForm = useSetAtom(dataFormAtom);
  const api = useClientgateApi();
  const setValueID = useSetAtom(valueIDAtom);
  const handleSendID = async (id: string) => {
    // localStorage.setItem("idForm", id);
    setValueID(false);
    const resp = await api.Mst_SubmissionForm_GetBySubFormCode(id);
    if (resp.isSuccess) {
      // if (resp.Data?.Lst_Mst_SubmissionForm[0].IDZNS === null) {
      //   setValueID(false);
      //   console.log(53, "a");
      // } else {
      //   setValueID(true);
      // }
      // console.log(resp.Data);
      setIDForm(resp.Data);
    }
    // const idFrom = localStorage.getItem("idForm") || {};
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
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <NavNetworkLink to={`/admin/Content_Managent/Content_Detail`}>
            <div onClick={() => handleSendID(data?.SubFormCode)}>{value}</div>
          </NavNetworkLink>
        );
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
    },
  ];
  // return array of the first item only

  return columns;
};
