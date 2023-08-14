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
import { Search } from "devextreme-react/data-grid";

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
    return (
      <div className="status-container flex justify-center">
        <span className={`status ${value ? value.toLowerCase() : ""}`}>
          {t(`${value}`)}
        </span>
      </div>
    );
  };

  const columns: ColumnOptions[] = [
    {
      dataField: "CampaignCode", // Mã chien dich
      caption: t("CampaignCode"),
      visible: true,
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
              to={`/campaign/Cpn_CampaignPage/Cpn_Campaign_Info/detail/${data.CampaignCode}`}
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
      visible: true,
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      dataField: "CampaignTypeName", // Loại chiến dịch
      caption: t("CampaignTypeName"),
      visible: true,
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      dataField: "DTimeStart", // Thời gian
      caption: t("DTimeStart"),
      visible: true,
      editorType: "dxTextBox",
    },
    {
      dataField: "DTimeEnd", // Thời gian kết thúc
      caption: t("DTimeEnd"),
      visible: true,
      editorType: "dxTextBox",
    },
    {
      dataField: "QtyCustomer", // SL khách hàng
      caption: t("QtyCustomer"),
      visible: true,
      editorType: "dxTextBox",
    },
    {
      dataField: "CreateBy", // Agent phụ trách
      caption: t("CreateBy"),
      visible: true,
      editorType: "dxTextBox",
    },
    {
      dataField: "CampaignStatus", // trạng thái
      caption: t("CampaignStatus"),
      visible: true,
      editorType: "dxTextBox",
      cellRender: ({ data }: any) => {
        return FlagStatus(data.CampaignStatus);
      },
    },
    {
      dataField: "CampaignDesc", // Mô tả
      caption: t("CampaignDesc"),
      visible: true,
      editorType: "dxTextBox",
    },
  ];
  return columns;
};
