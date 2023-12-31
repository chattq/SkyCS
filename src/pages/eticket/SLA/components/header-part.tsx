import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@packages/api";
import { showErrorAtom } from "@packages/store";

import { HeaderNewForm } from "@/packages/ui/headerNew-form/headerNew-form";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { keywordAtom, selectedItemsAtom } from "./store";

interface HeaderPartProps {
  onAddNew?: () => void;
  refetch: any;
}

export const HeaderPart = ({ onAddNew, refetch }: HeaderPartProps) => {
  const { t } = useI18n("Common");

  const selectedItems = useAtomValue(selectedItemsAtom);
  const keyword = useAtomValue(keywordAtom);
  const setKeyword = useSetAtom(keywordAtom);
  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const handleSearch = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleExportExcel = async (selectedOnly: boolean) => {};
  const handleDeleteRow = async (id: any) => {
    const resp = await api.Mst_NNTController_Delete(id);
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
      hidenExportExcel={false}
      hidenImportExcel={false}
      onSearch={handleSearch}
      onAddNew={onAddNew}
      onExportExcel={handleExportExcel}
      selectedItems={selectedItems}
      onDelete={handleDeleteRow}
    />
  );
};
