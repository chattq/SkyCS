import { ScrollView, SelectBox } from "devextreme-react";
import { IStateStoringProps } from "devextreme-react/data-grid";
import { IFormOptions } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import CustomStore from "devextreme/data/custom_store";
import {
  EditingStartEvent,
  EditorPreparingEvent,
} from "devextreme/ui/data_grid";
import { ForwardedRef, ReactNode, useState } from "react";
import {
  ColumnOptions,
  GridViewPopup,
  ToolbarItemProps,
} from "../base-gridview";

interface GridViewProps {
  defaultPageSize?: number;
  dataSource: CustomStore | Array<any> | any;
  columns: ColumnOptions[];
  allowSelection: boolean;
  ref: ForwardedRef<any>;
  onReady?: (ref: any) => void;
  allowInlineEdit?: boolean;
  onEditorPreparing?: (e: EditorPreparingEvent<any, any>) => void;
  onSaveRow?: (option: any) => void;
  isLoading?: boolean;
  keyExpr?: string | string[];
  onDeleteRows?: (rows: string[]) => void;
  onSelectionChanged: (rowKeys: string[]) => void;
  popupSettings?: IPopupOptions;
  formSettings?: IFormOptions;
  toolbarItems?: ToolbarItemProps[];
  customToolbarItems?: any[];
  onEditRowChanges?: (changes: any) => void;
  onEditingStart?: (e: EditingStartEvent) => void;
  stateStoring?: IStateStoringProps;
  storeKey: string;
  onEditRow?: (e: any) => void;
  customCard: (item: any) => ReactNode;
  defaultOption: string;
}

export const BaseCardView = ({
  ref,
  onEditorPreparing,
  onSaveRow,
  isLoading = false,
  keyExpr,
  onDeleteRows,
  onSelectionChanged,
  dataSource,
  columns,
  onReady,
  allowInlineEdit = true,
  popupSettings,
  formSettings,
  toolbarItems,
  onEditRowChanges,
  onEditingStart,
  storeKey,
  onEditRow,
  customToolbarItems,
  customCard,
  defaultOption,
}: GridViewProps) => {
  const listOption = [
    {
      display: "Card View",
      value: "card",
    },
    {
      display: "Table View",
      value: "table",
    },
  ];

  const [currentOption, setCurrentOption] = useState<string>(defaultOption);

  return (
    <>
      <div className="flex justify-between p-2">
        <div></div>
        <SelectBox
          id="custom-templates"
          dataSource={listOption}
          displayExpr="display"
          valueExpr="value"
          defaultValue={defaultOption}
          onValueChanged={(e: any) => {
            setCurrentOption(e.value);
          }}
        />
      </div>
      {currentOption == "card" ? (
        <ScrollView
          showScrollbar="always"
          className={dataSource?.length > 0 ? "bg-slate-300" : ""}
          height="100%"
        >
          {dataSource && dataSource.length > 0 ? (
            dataSource.map((item: any) => {
              return customCard(item);
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              Không có dữ liệu!
            </div>
          )}
        </ScrollView>
      ) : (
        <GridViewPopup
          isLoading={isLoading}
          dataSource={dataSource}
          columns={columns}
          keyExpr={keyExpr}
          formSettings={formSettings}
          onReady={onReady}
          allowSelection={true}
          onSelectionChanged={onSelectionChanged}
          onSaveRow={onSaveRow}
          onEditorPreparing={onEditorPreparing}
          onEditRowChanges={onEditRowChanges}
          onDeleteRows={onDeleteRows}
          onEditRow={onEditRow}
          storeKey={storeKey}
        />
      )}
    </>
  );
};
