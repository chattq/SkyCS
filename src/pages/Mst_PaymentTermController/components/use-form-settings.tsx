import { useI18n } from "@/i18n/useI18n";
import { ColumnOptions } from "@/packages/ui/base-gridview";
import { FormOptions } from "@/types";
import { zip } from "@packages/common";

interface UseFormSettingsProps {
  columns: ColumnOptions[];
}

export const useFormSettings = ({
  columns: inputColumns,
}: UseFormSettingsProps) => {
  const { t } = useI18n("Mst_PaymentTermController");

  const basicInformationFirstColumn = inputColumns.filter(
    (c) => c.groupKey === "BASIC_INFORMATION" && c.columnIndex === 1
  );
  const basicInformationSecondColumn = inputColumns.filter(
    (c) => c.groupKey === "BASIC_INFORMATION" && c.columnIndex === 2
  );

  const formSettings: FormOptions = {
    colCount: 1,
    labelLocation: "left",
    visible: false,
    items: [
      {
        itemType: "group",
        caption: t("BASIC_INFORMATION"),
        colSpan: 1,
        cssClass: "collapsible form-group",
        items: zip(basicInformationFirstColumn, basicInformationSecondColumn),
      },
    ],
  };
  return formSettings;
};
