import { PageHeaderNoSearchLayout } from "@layouts/page-header-layout-2/page-header-nosearch-layout";
import Button from "devextreme-react/button";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useI18n } from "@/i18n/useI18n";
import { toast } from "react-toastify";
import { useUploadFile } from "@packages/ui/upload-file/use-upload-file";
import { useExportExcel } from "@packages/ui/export-excel/use-export-excel";
import notify from "devextreme/ui/notify";
import { useClientgateApi } from "@packages/api";
import { useAtomValue, useSetAtom } from "jotai";
import { showErrorAtom } from "@packages/store";
import { logger } from "@packages/logger";
import { match } from "ts-pattern";
import { selectedItemsAtom } from "./store";
import { SearchParam } from "@/packages/types";
import NavNetworkLink from "@/components/Navigate";

interface HeaderPartProps {
  onAddNew: () => void;
  searchCondition?: Partial<SearchParam>;
}
export const HeaderPart = ({ onAddNew, searchCondition }: HeaderPartProps) => {
  const { t } = useI18n("Mst_PaymentTermController");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const selectedItems = useAtomValue(selectedItemsAtom);

  const onDownloadTemplate = async () => {
    // const resp = await api.Mst_BankDealer_ExportTemplate();
    // if (resp.isSuccess) {
    //   toast.success(t("Download Successfully"));
    //   window.location.href = resp.Data;
    //   return true;
    // }
    // showError({
    //   message: t(resp.errorCode),
    //   debugInfo: resp.debugInfo,
    //   errorInfo: resp.errorInfo,
    // });
    // throw new Error(resp.errorCode);
  };
  const handleUploadFiles = async (files: File[]) => {
    // const resp = await api.Mst_BankDealer_Import(files[0]);
    // console.log("result:", resp);
    // if (resp.isSuccess) {
    //   notify(t("Upload Successfully"), "success");
    // } else {
    //   notify(t(resp.Data._strErrCode), {
    //     position: {
    //       top: 0,
    //     },
    //     direction: "down-push",
    //   });
    // }
  };

  const handleExportExcel = async (selectedOnly: boolean) => {
    // let resp = await match(selectedOnly)
    //   .with(true, async () => {
    //     return await api.Mst_BankDealer_ExportByListBankCodeAndDealerCode(
    //       selectedItems
    //     );
    //   })
    //   .otherwise(async () => {
    //     return await api.Mst_BankDealer_Export(searchCondition);
    //   });
    // if (resp.isSuccess) {
    //   toast.success(t("Download Successfully"));
    //   window.location.href = resp.Data;
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
  const handleBack = () => {};

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="font-bold dx-font-m">{t("Post manager")}</div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        {/* <Button
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
        </DropDownButton> */}
        <Button
          stylingMode={"contained"}
          type="default"
          text={t("Update")}
          onClick={onAddNew}
        />
        <NavNetworkLink to={`/admin/Post_Manager`}>
          <Button
            className="ml-2 bg-[#ffff] Post_cancel"
            type="default"
            text={t("Cancel")}
            onClick={handleBack}
          />
        </NavNetworkLink>

        {uploadDialog}
        {exportDialog}
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};