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
import { useNetworkNavigate } from "@/packages/hooks";

export const HeaderPart = () => {
  const { t } = useI18n("Mst_CampaignTypePage");
  const navigate = useNetworkNavigate();
  const handleAdd = () => {
    navigate("/admin/Mst_CampaignTypePage/Customize");
  };

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="font-bold dx-font-m">{t("Mst_CampaignTypePage")}</div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot
        name={"Center"}
      ></PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <Button
          icon="/images/icons/plus-circle.svg"
          stylingMode={"contained"}
          type="default"
          text={t("Add New")}
          onClick={handleAdd}
        />
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};
