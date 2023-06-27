import Button from "devextreme-react/button";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import TextBox from "devextreme-react/text-box";
import { atom, useAtom, useAtomValue } from "jotai";

import { useI18n } from "@/i18n/useI18n";
import { logger } from "@/packages/logger";
import { useVisibilityControl } from "@packages/hooks";
import { ExportConfirmBox } from "@packages/ui/modal";
import { useLayoutEffect, useState } from "react";
import { UploadDialog } from "../upload-dialog/upload-dialog";
import "./headerNew-form.scss";
import { SelectionKeyAtom } from "../base-gridview/store/normal-grid-store";

const keywordAtom = atom("");

export interface HeaderFormProps {
  onAddNew?: () => void;
  onDelete?: any;
  onSearch: (keyword: string) => void;
  onUploadFile?: (file: File, progressCallback?: Function) => void;
  onExportExcel?: (selectedOnly: boolean) => void;
  onDownloadTemplate?: () => void;
  selectedItems?: string[];
  hidenExportExcel: boolean;
  hidenImportExcel: boolean;
  handleOnEditRow?: any;
}

export const HeaderNewForm = ({
  handleOnEditRow,
  onAddNew,
  onSearch,
  onUploadFile,
  onExportExcel,
  onDownloadTemplate,
  onDelete,
  selectedItems,
  hidenExportExcel,
  hidenImportExcel,
}: HeaderFormProps) => {
  const { t } = useI18n("Common");
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const handleSearch = () => {
    onSearch(keyword);
  };
  const selectionKeys = useAtomValue(SelectionKeyAtom);
  useLayoutEffect(() => {}, [selectedItems]);
  const [uploadDialogVisible, showUploadDialog] = useState(false);
  const controlExportBoxVisible = useVisibilityControl({
    defaultVisible: false,
  });
  const onImportExcelFile = () => {
    showUploadDialog(true);
  };
  const handleUploadFiles = async (files: File[]) => {
    logger.debug("files", files);
    if (files && files.length > 0) {
      onUploadFile?.(files[0]);
    }
  };
  const handleExportExcel = () => {
    controlExportBoxVisible.open();
  };
  const handleEdit = () => {
    handleOnEditRow(selectedItems);
  };

  return (
    <div className="headerform w-full">
      <div className="headerform__search w-1/3">
        <TextBox
          showClearButton
          stylingMode={"outlined"}
          value={keyword}
          onFocusOut={handleSearch}
          onEnterKey={handleSearch}
          onPaste={handleSearch}
          onValueChanged={(e) => setKeyword(e.value)}
        >
          <Button
            icon="search"
            className={"border-none"}
            stylingMode={"outlined"}
          />
        </TextBox>
      </div>
      <div className="headerform__button">
        <Button
          icon="/images/icons/plus-circle.svg"
          stylingMode={"contained"}
          type="default"
          text={t("AddNew")}
          onClick={onAddNew}
        />
      </div>
      <div
        className={`headerform__menu ${
          selectionKeys?.length >= 1 ? "" : "hidden"
        }`}
      >
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
          icon={"/images/icons/more.svg"}
        >
          <DropDownButtonItem
            visible={hidenImportExcel}
            render={(item: any) => {
              return (
                <div>
                  <Button
                    stylingMode="text"
                    hoverStateEnabled={false}
                    onClick={onImportExcelFile}
                    text={t("ImportExcel")}
                  />
                </div>
              );
            }}
          />
          <DropDownButtonItem
            visible={hidenExportExcel}
            render={(item: any) => {
              return (
                <div>
                  <Button
                    stylingMode="text"
                    hoverStateEnabled={false}
                    onClick={handleExportExcel}
                    text={t("ExportExcel")}
                  />
                </div>
              );
            }}
          />
          <DropDownButtonItem
            visible={hidenExportExcel}
            render={(item: any) => {
              return (
                <div>
                  <Button
                    stylingMode="text"
                    hoverStateEnabled={false}
                    onClick={handleExportExcel}
                    text={t("Export Excel")}
                  />
                </div>
              );
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              return (
                <div>
                  <Button
                    stylingMode="text"
                    hoverStateEnabled={false}
                    onClick={handleEdit}
                    text={t("Edit")}
                  />
                </div>
              );
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              return (
                <div>
                  <Button
                    stylingMode="text"
                    hoverStateEnabled={false}
                    onClick={() => onDelete(selectedItems)}
                    text={t("Delete")}
                  />
                </div>
              );
            }}
          />
        </DropDownButton>
        <UploadDialog
          visible={uploadDialogVisible}
          onDownloadTemplate={onDownloadTemplate}
          onCancel={() => showUploadDialog(false)}
          onUpload={handleUploadFiles}
        />
        <ExportConfirmBox
          selectedItems={selectedItems ?? []}
          control={controlExportBoxVisible}
          title={t("ExportExcel")}
          onYesClick={(value: number) => {
            onExportExcel?.(value === 0);
          }}
        />
      </div>
    </div>
  );
};
