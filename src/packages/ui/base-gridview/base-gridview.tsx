import { Button, DataGrid, LoadPanel } from "devextreme-react";
import {
  Column,
  ColumnChooser,
  ColumnFixing,
  Button as DxButton,
  Editing,
  HeaderFilter,
  IStateStoringProps,
  Pager,
  Paging,
  Scrolling,
  Selection,
  Toolbar,
  Item as ToolbarItem,
} from "devextreme-react/data-grid";

import { PageSize } from "@packages/ui/page-size";
import CustomStore from "devextreme/data/custom_store";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import ScrollView from "devextreme-react/scroll-view";
import "./base-gridview.scss";

import { useI18n } from "@/i18n/useI18n";
import { useVisibilityControl } from "@packages/hooks";
import { useWindowSize } from "@packages/hooks/useWindowSize";
import {
  gridStateAtom,
  normalGridDeleteMultipleConfirmationBoxAtom,
  normalGridDeleteSingleConfirmationBoxAtom,
  normalGridSelectionKeysAtom,
  normalGridSingleDeleteItemAtom,
} from "@packages/ui/base-gridview/store/normal-grid-store";
import CustomColumnChooser from "@packages/ui/column-toggler/custom-column-chooser";
import { IFormOptions } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useSetAtom } from "jotai";
import {
  DeleteButton,
  DeleteMultipleConfirmationBox,
  DeleteSingleConfirmationBox,
  NormalGridPageNavigator,
  NormalGridPageSummary,
  useSavedState,
} from "./components";
import { ColumnOptions, ToolbarItemProps } from "./types";

interface GridViewProps {
  defaultPageSize?: number;
  dataSource: CustomStore | Array<any>;
  columns: ColumnOptions[];
  allowSelection: boolean;
  ref: ForwardedRef<any>;
  onReady?: (ref: any) => void;
  allowInlineEdit?: boolean;
  inlineEditMode?: "row" | "popup" | "form";
  onEditorPreparing?: (e: EditorPreparingEvent<any, any>) => void;
  onSaveRow?: (option: any) => void;
  isLoading?: boolean;
  keyExpr?: string | string[];
  onDeleteRows?: (rows: string[]) => void;
  onSelectionChanged: (rowKeys: string[]) => void;
  popupSettings?: IPopupOptions;
  formSettings?: IFormOptions;
  toolbarItems?: ToolbarItemProps[];
  onEditRowChanges?: (changes: any) => void;
  storeKey?: string;
  stateStoring?: IStateStoringProps;
  onCustomerEditing?: Function;
  editable?: boolean;
  showCheck?: any;
  hidePagination?: boolean;
}

const GridViewRaw = ({
  ref,
  defaultPageSize = 100,
  onEditorPreparing,
  onSaveRow,
  isLoading = false,
  keyExpr,
  onDeleteRows,
  onSelectionChanged,
  dataSource,
  columns,
  onReady,
  inlineEditMode = "form",
  popupSettings,
  formSettings,
  toolbarItems,
  onEditRowChanges,
  storeKey,
  stateStoring,
  onCustomerEditing,
  editable = true,
  showCheck = "always",
  hidePagination = false,
}: GridViewProps) => {
  const datagridRef = useRef<DataGrid | null>(null);
  const windowSize = useWindowSize();
  const onChangePageSize = (pageSize: number) => {
    datagridRef?.current?.instance.pageSize(pageSize);
  };
  const onChangePageIndex = (pageIndex: number) => {
    datagridRef?.current?.instance.pageIndex(pageIndex);
  };

  const chooserVisible = useVisibilityControl({ defaultVisible: false });

  const { saveState, loadState } = useSavedState<ColumnOptions[]>({
    storeKey: storeKey ?? "empty",
  });

  const [realColumns, setColumnsState] = useReducer(
    (state: any, changes: any) => {
      // save changes into localStorage
      saveState(changes);
      return changes;
    },
    columns
  );

  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      const columnOrders = savedState.map(
        (column: ColumnOptions) => column.dataField
      );
      const outputColumns = columns.map((column: ColumnOptions) => {
        const filterResult = savedState.find(
          (c: ColumnOptions) => c.dataField === column.dataField
        );
        column.visible = filterResult ? filterResult.visible : false;
        return column;
      });
      outputColumns.sort(
        (a, b) =>
          columnOrders.indexOf(a.dataField) - columnOrders.indexOf(b.dataField)
      );
      setColumnsState(outputColumns);
    }
  }, []);

  const onHiding = useCallback(() => {
    chooserVisible.close();
  }, []);

  const onApply = useCallback(
    (changes: any) => {
      // we need check the order of column from changes set
      const latest = [...changes];
      realColumns.forEach((column: ColumnOptions) => {
        const found = changes.find(
          (c: ColumnOptions) => c.dataField === column.dataField
        );
        if (!found) {
          column.visible = false;
          latest.push(column);
        }
      });
      setColumnsState(latest);
      chooserVisible.close();
    },
    [setColumnsState]
  );
  const onToolbarPreparing = useCallback((e: any) => {
    e.toolbarOptions.items.push({
      widget: "dxButton",
      location: "after",
      options: {
        icon: "/images/icons/settings.svg",
        elementAttr: {
          id: "myColumnChooser",
        },
        onClick: () => chooserVisible.toggle(),
      },
    });
  }, []);
  const setSelectionKeysAtom = useSetAtom(normalGridSelectionKeysAtom);
  const handleSelectionChanged = (e: any) => {
    setSelectionKeysAtom(e.selectedRowKeys);
    onSelectionChanged?.(e.selectedRowKeys);
  };

  const switchEditMode = (e: any, isOn: boolean) => {
    if (isOn) {
      e.component.option("sorting.mode", "none");
      e.component.option("headerFilter.visible", false);
    } else {
      e.component.option("sorting.mode", "single");
      e.component.option("headerFilter.visible", true);
    }
  };

  const handleEditingStart = (e: any) => {
    if (onCustomerEditing) {
      onCustomerEditing(e);
    } else {
      switchEditMode(e, true);
    }
  };

  const handleEditCancelled = (e: any) => {
    switchEditMode(e, false);
  };

  const handleSaved = (e: any) => {
    // logger.debug("saved event:", e);
    switchEditMode(e, false);
  };

  const handleNewRow = (e: any) => {
    switchEditMode(e, true);
  };
  const { t } = useI18n("Common");
  let innerGridRef = useRef<DataGrid>(null);

  const setRef = (ref: any) => {
    datagridRef.current = ref;
    innerGridRef = ref;
    onReady?.(ref);
  };

  const onCancelDelete = () => {
    setConfirmBoxVisible(false);
    setDeleteSingleConfirmBoxVisible(false);
  };

  const onDeleteSingle = async (key: string) => {
    setDeleteSingleConfirmBoxVisible(false);
    const result = await onDeleteRows?.([key]);
    if (result) {
      setDeletingId("");
    }
  };

  const onDeleteMultiple = async (keys: string[]) => {
    setConfirmBoxVisible(false);
    console.log("keys ", keys);
    const result = await onDeleteRows?.(keys);
    if (result) {
      setSelectionKeysAtom([]);
    }
  };

  const setConfirmBoxVisible = useSetAtom(
    normalGridDeleteMultipleConfirmationBoxAtom
  );
  const handleConfirmDelete = () => {
    setConfirmBoxVisible(true);
  };

  const renderPageSize = useCallback(() => {
    return (
      <PageSize
        title={t("Showing")}
        onChangePageSize={onChangePageSize}
        allowdPageSizes={[100, 200, 500, 1000]}
        showAllOption={true}
        showAllOptionText={t("ShowAll")}
        defaultPageSize={datagridRef.current?.instance.pageSize()}
      />
    );
  }, []);

  const renderPageNavigator = useCallback(() => {
    return <NormalGridPageNavigator onPageChanged={onChangePageIndex} />;
  }, []);

  const renderColumnChooser = useCallback(() => {
    return (
      <CustomColumnChooser
        title={t("ToggleColum")}
        applyText={t("Apply")}
        cancelText={t("Cancel")}
        selectAllText={t("SelectAll")}
        container={"#gridContainer"}
        button={"#myColumnChooser"}
        visible={chooserVisible.visible}
        columns={columns}
        onHiding={onHiding}
        onApply={onApply}
        actualColumns={realColumns}
      />
    );
  }, [chooserVisible, realColumns, columns]);
  const allToolbarItems: ToolbarItemProps[] = useMemo(() => {
    const items = [
      ...(toolbarItems || []),
      {
        location: "before",
        render: () => {
          return editable && <DeleteButton onClick={handleConfirmDelete} />;
        },
      },
    ];
    if (!hidePagination) {
      items.push({
        location: "after",
        render: renderPageSize,
      });
      items.push({
        location: "after",
        render: renderPageNavigator,
      });
      items.push({
        location: "after",
        render: () => {
          return <NormalGridPageSummary />;
        },
      });
    }
    items.push({
      location: "after",
      render: renderColumnChooser,
    });
    return items;
  }, [chooserVisible, realColumns, columns]);

  const handleEditorPreparing = (e: any) => {
    onEditorPreparing?.(e);
  };
  const setGridAtom = useSetAtom(gridStateAtom);
  const setDeletingId = useSetAtom(normalGridSingleDeleteItemAtom);
  const setDeleteSingleConfirmBoxVisible = useSetAtom(
    normalGridDeleteSingleConfirmationBoxAtom
  );

  const innerSavingRowHandler = useCallback((e: any) => {
    if (e.changes && e.changes.length > 0) {
      // we don't enable batch mode, so only 1 change at a time.
      const { type } = e.changes[0];
      if (type === "insert" || type === "update") {
        // pass handle to parent page
        onSaveRow?.(e);
      } else {
        // set selected keys, then open the confirmation
        setDeletingId(e.changes[0].key);
        // show the confirmation box of Delete single case
        setDeleteSingleConfirmBoxVisible(true);

        // this one to clear `changes` set from grid.
        datagridRef.current?.instance.cancelEditData();
      }
    }
    e.cancel = true;
  }, []);

  return (
    <div className={"base-gridview bg-white"}>
      <ScrollView showScrollbar={"always"}>
        <LoadPanel visible={isLoading} position={{ of: "#gridContainer" }} />
        <DataGrid
          keyExpr={keyExpr}
          errorRowEnabled={false}
          cacheEnabled={false}
          id="gridContainer"
          height={`${windowSize.height - 115}px`}
          width={"100%"}
          ref={(r) => setRef(r)}
          dataSource={dataSource}
          noDataText={t("ThereIsNoData")}
          remoteOperations={false}
          columnAutoWidth={true}
          repaintChangesOnly
          showBorders
          onContentReady={(e) => {
            // console.log("e ", e);
            setGridAtom({
              pageIndex: e.component.pageIndex() ?? 0,
              pageSize: e.component.pageSize() ?? 0,
              pageCount: e.component.pageCount() ?? 0,
              totalCount: e.component.totalCount() ?? 0,
            });
          }}
          onInitialized={(e) => {
            e.component?.option("headerFilter.visible", true);
            onReady?.(datagridRef.current);
          }}
          allowColumnResizing
          showColumnLines
          showRowLines
          columnResizingMode={"widget"}
          allowColumnReordering={false}
          onToolbarPreparing={onToolbarPreparing}
          onSelectionChanged={handleSelectionChanged}
          onEditorPreparing={handleEditorPreparing}
          onEditCanceled={handleEditCancelled}
          onEditingStart={handleEditingStart}
          onSaved={handleSaved}
          onInitNewRow={handleNewRow}
          onSaving={innerSavingRowHandler}
          stateStoring={stateStoring}
          scrolling={{ mode: "standard" }}
        >
          <ColumnFixing enabled={true} />
          <Paging enabled={!hidePagination} defaultPageSize={defaultPageSize} />
          <Pager visible={false} />
          <ColumnChooser enabled={true} />
          <HeaderFilter allowSearch={true} />
          <Scrolling
            renderAsync={true}
            mode={"standard"}
            scrollByThumb={true}
            scrollByContent
            showScrollbar={"always"}
          />
          <Toolbar>
            {!!allToolbarItems &&
              allToolbarItems.map((item, index) => {
                return (
                  <ToolbarItem key={index} location={item.location}>
                    {item.widget === "dxButton" && <Button {...item.options} />}
                    {!!item.render && item.render()}
                  </ToolbarItem>
                );
              })}
          </Toolbar>

          <Editing
            mode={inlineEditMode}
            useIcons={true}
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={true}
            popup={inlineEditMode === "popup" ? popupSettings : {}}
            form={formSettings ?? {}}
            confirmDelete={false}
            onChangesChange={onEditRowChanges ? onEditRowChanges : () => {}}
          ></Editing>
          <Column
            visible={editable}
            type="buttons"
            width={100}
            fixed={false}
            allowResizing={false}
          >
            <DxButton
              cssClass={"mx-1 cursor-pointer"}
              name="edit"
              icon={"/images/icons/edit.svg"}
            />
            <DxButton
              cssClass={"mx-1 cursor-pointer"}
              name="delete"
              icon={"/images/icons/trash.svg"}
            />
            <DxButton
              cssClass={"mx-1 cursor-pointer"}
              name="save"
              icon={"/images/icons/save.svg"}
            />
            <DxButton
              cssClass={"mx-1 cursor-pointer"}
              name="cancel"
              icon={"/images/icons/refresh.svg"}
            />
          </Column>
          <Selection
            mode="multiple"
            selectAllMode="page"
            showCheckBoxesMode={showCheck}
          />
          {realColumns.map((col: any) => (
            <Column key={col.dataField} {...col} />
          ))}
        </DataGrid>
      </ScrollView>
      <DeleteMultipleConfirmationBox
        title={t("Delete")}
        message={t("DeleteMultipleConfirmationMessage")}
        onYesClick={onDeleteMultiple}
        onNoClick={onCancelDelete}
      />
      <DeleteSingleConfirmationBox
        title={t("Delete")}
        message={t("DeleteSingleItemConfirmationMessage")}
        onYesClick={onDeleteSingle}
        onNoClick={onCancelDelete}
      />
    </div>
  );
};

export const BaseGridView = forwardRef(
  (props: Omit<GridViewProps, "ref">, ref: any) => {
    return props.isLoading ? null : <GridViewRaw ref={ref} {...props} />;
  }
);
BaseGridView.displayName = "BaseGridView";
