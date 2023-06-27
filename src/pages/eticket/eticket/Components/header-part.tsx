import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { selecteItemsAtom } from "@/pages/Mst_Customer/components/store";
import { useAtomValue, useSetAtom } from "jotai";
import { useUploadFile } from "@packages/ui/upload-file/use-upload-file";
import { useExportExcel } from "@packages/ui/export-excel/use-export-excel";
import notify from "devextreme/ui/notify";
import { match } from "ts-pattern";
import { logger } from "@/packages/logger";
import { toast } from "react-toastify";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { Button } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
interface HeaderPartProps {
  onAddNew: () => void;
  searchCondition: Partial<any>;
}

const HeaderPart = ({ onAddNew, searchCondition }: HeaderPartProps) => {
  const { t } = useI18n("Eticket");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const selectedItems = useAtomValue(selecteItemsAtom);
  const onDownloadTemplate = async () => {
    // const resp = await api.Mst_Quota_ExportExcel_Template();
    // if (resp.isSuccess) {
    //   notify(t("Download Successfully"));
    //   console.log("resp.Data._objResult ", resp.Data);
    //   window.location.href = resp.Data;
    // } else {
    //   notify(t(resp.Data._strErrCode), {
    //     position: {
    //       top: 0,
    //     },
    //     direction: "down-push",
    //   });
    // }
  };

  const handleUploadFiles = async (files: File[]) => {
    // const resp = await api.Mst_Quota_Upload(files[0]);
    // if (resp.isSuccess) {
    //   notify(t("Upload Successfully"));
    // } else {
    //   showError({
    //     message: t(resp.errorCode),
    //     debugInfo: resp.debugInfo,
    //     errorInfo: resp.errorInfo,
    //   });
    // }
  };

  const handleExportExcel = async (selectedOnly: boolean) => {
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

  const { uploadButton, uploadDialog } = useUploadFile({
    handleUploadFiles,
    onDownloadTemplate,
    buttonClassName: "w-full",
  });
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
              return <div>{uploadButton}</div>;
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              return <div>{exportButton}</div>;
            }}
          />
        </DropDownButton>

        {uploadDialog}
        {exportDialog}
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};

export default HeaderPart;
