import { compareDates, getDateNow } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { Button, CheckBox } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useMemo } from "react";

interface PropsToolBar {
  data: any[];
  onSetStatus: (title: string, ref: any, check: any) => void;
}

interface DropDownInferface {
  title: string;
  onclick: any;
}

export const useToolbar = ({
  data,
  onSetStatus,
}: PropsToolBar): GridCustomerToolBarItem[] => {
  const { t } = useI18n("Rpt_ETTicketDetailController");

  return [
    {
      text: "",
      onClick: () => {},
      shouldShow: (ref: any) => {
        return true;
      },
      widget: "customize",
      customize: (ref: any) => (
        <div className="mt-[3px] gap-2 flex items-center">
          <CheckBox
            key="FlagTicketOutOfDate"
            className="FlagTicketOutOfDate"
            onValueChanged={(e) =>
              onSetStatus("FlagTicketOutOfDate", ref, e.value)
            }
          />
          <span className="font-semibold">{t("eTicket quá hạn")}</span>
        </div>
      ),
    },
    {
      text: "",
      onClick: () => {},
      shouldShow: (ref: any) => {
        return true;
      },
      widget: "customize",
      customize: (ref: any) => (
        <div className="mt-[3px] ml-6 gap-2 flex items-center">
          <CheckBox
            key="FlagSLANotResponding"
            className="FlagSLANotResponding"
            onValueChanged={(e) =>
              onSetStatus("FlagSLANotResponding", ref, e.value)
            }
          />
          <span className="font-semibold">
            {t("eTicket không đáp ứng SLA")}
          </span>
        </div>
      ),
    },
  ];
};
