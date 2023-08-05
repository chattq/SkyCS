import { useI18n } from "@/i18n/useI18n";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { Button } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { selecteItemsAtom } from "./store";
import { useAtomValue } from "jotai";
import { useExportExcel } from "@/packages/ui/export-excel/use-export-excel";
interface HeaderPartProps {
  onAddNew: () => void;
}

const HeaderPart = ({ onAddNew }: HeaderPartProps) => {
  const { t } = useI18n("Eticket");
  const selectedItems = useAtomValue(selecteItemsAtom);

  const handleExportExcel = async (selectedOnly: boolean) => {
    console.log("selectedItems ", selectedItems);

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
  };

  const { exportButton, exportDialog } = useExportExcel({
    buttonClassName: "w-full",
    selectedItems,
    onExportExcel: handleExportExcel,
  });

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="font-bold dx-font-m">{t("Eticket_Manager")}</div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <Button
          icon="/images/icons/plus-circle.svg"
          stylingMode={"contained"}
          type="default"
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
