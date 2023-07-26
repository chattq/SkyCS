import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@packages/api";
import { showErrorAtom } from "@packages/store";

import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { keywordAtom, selectedItemsAtom } from "./store";
import { HeaderNewForm } from "@/packages/ui/headerNew-form/headerNew-form";

interface HeaderPartProps {
  onAddNew?: () => void;
  refetch: any;
  handleOnEditRow?: any;
}

export const HeaderPart = ({
  onAddNew,
  refetch,
  handleOnEditRow,
}: HeaderPartProps) => {
  const { t } = useI18n("Common");

  const selectedItems = useAtomValue(selectedItemsAtom);
  const keyword = useAtomValue(keywordAtom);
  const setKeyword = useSetAtom(keywordAtom);
  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const handleSearch = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleExportExcel = async (selectedOnly: boolean) => {
    const resp = await api.Sys_User_Export(selectedItems, keyword || "");
    if (resp.isSuccess) {
      toast.success(t("DownloadSuccessfully"));
      window.location.href = resp.Data as any;
    } else {
      showError({
        message: t(resp.errorCode),
        debugInfo: resp.debugInfo,
        errorInfo: resp.errorInfo,
      });
    }
  };
  const handleDeleteRow = async (id: any) => {
    const resp = await api.Sys_User_Data_Delete(id);
    if (resp.isSuccess) {
      toast.success(t("Delete Successfully"));
      await refetch();
      return true;
    }
    showError({
      message: t(resp.errorCode),
      debugInfo: resp.debugInfo,
      errorInfo: resp.errorInfo,
    });
    throw new Error(resp.errorCode);
  };

  return (
    <HeaderNewForm
      hidenMore={true}
      hidenExportExcel={true}
      hidenImportExcel={false}
      onSearch={handleSearch}
      onAddNew={onAddNew}
      onExportExcel={handleExportExcel}
      selectedItems={selectedItems}
      onDelete={handleDeleteRow}
      handleOnEditRow={handleOnEditRow}
    />
  );
};
