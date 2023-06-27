import { SelectBox } from "devextreme-react";
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

  const [currentOption, setCurrentOption] = useState<string>("table");

  return (
    <>
      <div className="flex justify-between p-2">
        <div className="bg-yellow-500 p-2">Sort</div>
        <SelectBox
          id="custom-templates"
          dataSource={listOption}
          displayExpr="display"
          valueExpr="value"
          defaultValue={listOption[1].value}
          onValueChanged={(e: any) => {
            setCurrentOption(e.value);
          }}
        />
      </div>
      {currentOption == "card" ? (
        dataSource.map((item: any) => {
          return customCard(item);
        })
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
