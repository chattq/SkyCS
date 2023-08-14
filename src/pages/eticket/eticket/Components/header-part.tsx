import { useI18n } from "@/i18n/useI18n";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { Button } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useAtomValue, useSetAtom } from "jotai";
import { useExportExcel } from "@/packages/ui/export-excel/use-export-excel";
import { customizeGridSelectionKeysAtom } from "@/packages/ui/base-gridview/store/normal-grid-store";
import { getYearMonthDate } from "@/components/ulti";
import { useClientgateApi } from "@/packages/api";
import { toast } from "react-toastify";
import { showErrorAtom } from "@/packages/store";
interface HeaderPartProps {
  onAddNew: () => void;
  searchCondition: any;
}

const HeaderPart = ({ onAddNew, searchCondition }: HeaderPartProps) => {
  const { t } = useI18n("Eticket");
  const selectedItems = useAtomValue(customizeGridSelectionKeysAtom);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);

  const handleExportExcel = async (selectedOnly: boolean) => {
    let conditionParam = {
      ...searchCondition,
      FlagOutOfDate: searchCondition?.FlagOutOfDate ? "1" : "",
      FlagNotRespondingSLA: searchCondition?.FlagNotRespondingSLA ? "1" : "",
      TicketSource: searchCondition?.TicketSource
        ? searchCondition.TicketSource.join(",")
        : "",
      CustomerCodeSysERP: searchCondition?.CustomerCodeSysERP
        ? searchCondition.CustomerCodeSysERP.join(",")
        : "",
      TicketStatus: searchCondition?.TicketStatus
        ? searchCondition.TicketStatus.join(",")
        : "",
      TicketID: selectedItems.join(","),
      Follower: searchCondition?.Follower
        ? searchCondition.Follower.join(",")
        : "",
      TicketDeadlineFrom: searchCondition?.TicketDeadline[0]
        ? getYearMonthDate(searchCondition?.TicketDeadline[0])
        : "",
      TicketDeadlineTo: searchCondition?.TicketDeadline[1]
        ? getYearMonthDate(searchCondition?.TicketDeadline[1])
        : "",
      CreateDTimeUTCFrom: searchCondition?.CreateDTimeUTC[0]
        ? getYearMonthDate(searchCondition?.CreateDTimeUTC[0])
        : "",
      CreateDTimeUTCTo: searchCondition?.CreateDTimeUTC[1]
        ? getYearMonthDate(searchCondition?.CreateDTimeUTC[1])
        : "",
      LogLUDTimeUTCFrom: searchCondition?.LogLUDTimeUTC[0]
        ? getYearMonthDate(searchCondition?.LogLUDTimeUTC[0])
        : "",
      LogLUDTimeUTCTo: searchCondition?.LogLUDTimeUTC[1]
        ? getYearMonthDate(searchCondition?.LogLUDTimeUTC[1])
        : "",
      CustomerCodeSys: searchCondition?.CustomerCodeSys
        ? searchCondition.CustomerCodeSys.join(",")
        : "",
      TicketType: searchCondition?.TicketType
        ? searchCondition.TicketType.join(",")
        : "",
      DepartmentCode: searchCondition?.DepartmentCode
        ? searchCondition.DepartmentCode.join(",")
        : "",
      AgentCode: searchCondition?.AgentCode
        ? searchCondition.AgentCode.join(",")
        : "",
      TicketPriority: searchCondition?.TicketPriority
        ? searchCondition.TicketPriority.join(",")
        : "",
      OrgID: searchCondition?.OrgID ? searchCondition.OrgID.join(",") : "",
    };
    // let resp = await match(selectedOnly)
    //   .with(true, async () => {
    //     return await api.Mst_Quota_ExportByListCode(selectedItems);
    //   })
    //   .otherwise(async () => {
    //     return await api.Mst_Quota_ExportExcel(searchCondition);
    //   });
    // if (resp.isSuccess) {
    //   toast.success(t("Download Successfully"));
    //   if (resp.Data) {
    //     window.location.href = resp.Data;
    //   }
    // } else {
    //   showError({
    //     message: t(resp.errorCode),
    //     debugInfo: resp.debugInfo,
    //     errorInfo: resp.errorInfo,
    //   });
    // }

    const response = await api.ET_Ticket_Export(conditionParam);
    if (response.isSuccess) {
      if (response.Data) {
        toast.success(t("Export Excel success"));
        window.location.href = response.Data;
      }
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const { exportButton, exportDialog } = useExportExcel({
    buttonClassName: "w-full",
    selectedItems,
    onExportExcel: handleExportExcel,
  });

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">
          {t("Eticket_Manager")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <Button
          icon="/images/icons/plus-circle.svg"
          stylingMode={"contained"}
          type="default"
          className="heder-part-button-add"
          text={t("Add New")}
          onClick={onAddNew}
        />
        <DropDownButton
          showArrowIcon={false}
          keyExpr={"id"}
          className="menu-items"
          displayExpr={"text"}
          wrapItemText={false}
          dropDownOptions={{
            width: 200,
            wrapperAttr: {
              class: "headerform__menuitems",
            },
          }}
          icon="/images/icons/more.svg"
        >
          <DropDownButtonItem
            render={(item: any) => {
              return <div>{exportButton}</div>;
            }}
          />
        </DropDownButton>
        {exportDialog}
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};

export default HeaderPart;
