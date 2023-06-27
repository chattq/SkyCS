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
import { flagSelectorAtom, viewingDataAtom } from "./store";
import NavNetworkLink from "@/components/Navigate";
import { match } from "ts-pattern";

interface UseBankDealerGridColumnsProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useBankDealerGridColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const { t } = useI18n("Mst_CampaignTypePage");
  const setFlagSelector = useSetAtom(flagSelectorAtom);

  const FlagStatus = (value: string) => {
    const html = match(value)
      .with("PENDING", () => <>{t("PENDING")}</>)
      .with("APPROVE", () => <>{t("APPROVE")}</>)
      .with("STARTED", () => <>{t("STARTED")}</>)
      .with("PAUSED", () => <>{t("PAUSED")}</>)
      .with("CONTINUED", () => <>{t("CONTINUED")}</>)
      .with("FINISH", () => <>{t("FINISH")}</>)
      .otherwise(() => <p>""</p>);
    return html;
  };

  const columns: ColumnOptions[] = [
    {
      dataField: "CampaignCode", // Mã chien dich
      caption: t("CampaignCode"),
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <p
            onClick={() => {
              setFlagSelector("detail");
            }}
          >
            <NavNetworkLink
              to={`/admin/Cpn_CampaignPage/Cpn_Campaign_Info/${data.CampaignCode}`}
            >
              {data.CampaignCode}
            </NavNetworkLink>
          </p>
        );
      },
    },
    {
      dataField: "CampaignName", // Tên chiến dịch
      caption: t("CampaignName"),
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      dataField: "CampaignTypeCode", // Loại chiến dịch
      caption: t("CampaignTypeCode"),
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      dataField: "DTimeStart", // Thời gian
      caption: t("DTimeStart"),
      editorType: "dxTextBox",
    },
    {
      dataField: "DTimeEnd", // Thời gian kết thúc
      caption: t("DTimeEnd"),
      editorType: "dxTextBox",
    },
    {
      dataField: "QtyCustomer", // SL khách hàng
      caption: t("QtyCustomer"),
      editorType: "dxTextBox",
    },
    {
      dataField: "CreateBy", // Agent phụ trách
      caption: t("CreateBy"),
      editorType: "dxTextBox",
    },
    {
      dataField: "CampaignStatus", // trạng thái
      caption: t("CampaignStatus"),
      editorType: "dxTextBox",
      cellRender: ({ data }: any) => {
        return FlagStatus(data.CampaignStatus);
      },
    },
    {
      dataField: "CampaignDesc", // Mô tả
      caption: t("CampaignDesc"),
      editorType: "dxTextBox",
    },
  ];
  return columns;
};
