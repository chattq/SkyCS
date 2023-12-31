import { compareDates, getDateNow } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { Button } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useMemo } from "react";
import { HeaderFilterPost } from "../HeaderFilterPost";

interface PropsToolBar {
  data: any[];
  onSetStatus: (title: string, ref: any) => void;
}

export const useToolbar = ({
  data,
  onSetStatus,
}: PropsToolBar): GridCustomerToolBarItem[] => {
  const { t } = useI18n("Post_Manager");
  const getValue = useMemo(() => {
    let obj = {
      PUBLISHED: 0,
      DRAFT: 0,
    };

    obj.DRAFT = data.filter((item) => item.PostStatus === "DRAFT").length;
    obj.PUBLISHED = data.filter(
      (item) => item.PostStatus === "PUBLISHED"
    ).length;
    return obj;
  }, [data]);
  return [
    {
      text: "",
      onClick: () => {},
      shouldShow: (ref: any) => {
        return true;
      },
      widget: "customize",
      customize: (ref: any) => (
        <div className="px-1">
          <FilterDropdown
            buttonTemplate={<img src="/images/icons/filterHeader.png" />}
            genFilterFunction={
              <HeaderFilterPost dataRef={ref} onSetStatus={onSetStatus} />
            }
          />
        </div>
      ),
    },
    {
      text: t(`All`) + `(${data.length || 0})`,
      // text: t(`Responsibility`),
      onClick: (e: any, ref: any) => onSetStatus("All", ref),
      shouldShow: (ref: any) => {
        return true;
      },
    },
    {
      text: t(`Published`) + `(${getValue.PUBLISHED})`,
      onClick: (e: any, ref: any) => onSetStatus("PUBLISHED", ref),
      shouldShow: (ref: any) => {
        return true;
      },
    },
    {
      text: t(`Darft`) + `(${getValue.DRAFT})`,
      onClick: (e: any, ref: any) => onSetStatus("DRAFT", ref),
      shouldShow: (ref: any) => {
        return true;
      },
    },
  ];
};
