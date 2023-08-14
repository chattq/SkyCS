import {
  Button,
  CheckBox,
  DataGrid,
  LoadPanel,
  SelectBox,
  Tooltip,
} from "devextreme-react";
import {
  Button as DxButton,
  Column,
  ColumnChooser,
  ColumnFixing,
  Editing,
  HeaderFilter,
  IStateStoringProps,
  Item as ToolbarItem,
  Pager,
  Paging,
  Scrolling,
  Selection,
  Texts,
  Toolbar,
  LoadPanel as GridLoadPanel,
  Search,
} from "devextreme-react/data-grid";

import { PageSize } from "@packages/ui/page-size";
import CustomStore from "devextreme/data/custom_store";
import {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import ScrollView from "devextreme-react/scroll-view";
import "./base-gridview.scss";

import { useI18n } from "@/i18n/useI18n";
import { logger } from "@/packages/logger";
import { useVisibilityControl } from "@packages/hooks";
import { useWindowSize } from "@packages/hooks/useWindowSize";
import CustomColumnChooser from "@packages/ui/column-toggler/custom-column-chooser";
import { IFormOptions } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import {
  EditingStartEvent,
  EditorPreparingEvent,
} from "devextreme/ui/data_grid";
import { differenceBy } from "lodash-es";

import { DeleteConfirmationBox } from "../modal";
import { ColumnOptions, ToolbarItemProps } from "./types";
import { useSavedState } from "@packages/ui/base-gridview/components/use-saved-state";
import { PopupGridPageNavigator } from "@packages/ui/base-gridview/components/popup-grid-page-navigator";
import { PopupGridPageSummary } from "@packages/ui/base-gridview/components/popup-grid-page-summary";
import { useSetAtom } from "jotai";
import { popupGridStateAtom } from "@packages/ui/base-gridview/store/popup-grid-store";
import {
  GridCustomerToolBarItem,
  GridCustomToolbar,
} from "@packages/ui/base-gridview/components/grid-custom-toolbar";
import {
  SelectionKeyAtom,
  customizeGridSelectionKeysAtom,
  dataGridAtom,
  hidenMoreAtom,
  normalGridSelectionKeysAtom,
} from "./store/normal-grid-store";
import { Icon } from "../icons";
const SelectionCheckBox = ({
  key,
  gridRef,
  rowIndex,
  isSelected,
}: {
  key: string;
  gridRef: RefObject<DataGrid>;
  rowIndex: number;
  isSelected: boolean;
}) => {
  return (
    <CheckBox
      defaultValue={isSelected}
      data-key={key}
      onValueChanged={(e: any) => {
        // console.log("select event:", e, gridRef);
        const { component, value, previousValue } = e;
        if (value) {
          gridRef.current?.instance?.selectRowsByIndexes([rowIndex]);
        } else {
          gridRef.current?.instance?.selectRowsByIndexes([]);
        }
        gridRef.current?.instance.refresh();
      }}
    />
  );
};

interface GridViewProps {
  isHiddenCheckBox?: boolean;
  isHidenHeaderFilter?: boolean;
  defaultPageSize?: number;
  dataSource: CustomStore | Array<any> | any;
  columns: ColumnOptions[];
  allowSelection: boolean;
  ref: ForwardedRef<any>;
  onReady?: (ref: any) => void;
  allowInlineEdit?: boolean;
  isShowIconEdit?: boolean;
  onEditorPreparing?: (e: EditorPreparingEvent<any, any>) => void;
  onSaveRow?: (option: any) => void;
  isLoading?: boolean;
  keyExpr?: string | string[];
  onDeleteRows?: (rows: string[]) => void;
  onSelectionChanged: (rowKeys: string[]) => void;
  popupSettings?: IPopupOptions;
  formSettings?: IFormOptions;
  toolbarItems?: ToolbarItemProps[];
  customToolbarItems?: GridCustomerToolBarItem[];
  onEditRowChanges?: (changes: any) => void;
  onEditingStart?: (e: EditingStartEvent) => void;
  stateStoring?: IStateStoringProps;
  storeKey: string;
  onEditRow?: (e: any) => void;
  isSingleSelection?: boolean;
  isShowEditting?: boolean;
  isShowEditCard?: boolean;
  hidenTick?: boolean;
  cssClass?: string;
  locationCustomToolbar?: "center" | "before" | "after";
  customerHeight?: number;
  id?: string;
}

const GridViewRaw = ({
  cssClass,
  ref,
  onEditorPreparing,
  onSaveRow,
  isLoading = false,
  keyExpr,
  onDeleteRows,
  onSelectionChanged,
  dataSource,
  columns,
  isHidenHeaderFilter = true,
  onReady,
  allowInlineEdit = true,
  isShowIconEdit = true,
  popupSettings,
  formSettings,
  toolbarItems,
  onEditRowChanges,
  onEditingStart,
  storeKey,
  onEditRow,
  isShowEditting = false,
  customToolbarItems,
  isSingleSelection = false,
  isShowEditCard = false,
  isHiddenCheckBox = false,
  locationCustomToolbar,
  customerHeight = 0,
  id = "gridContainer",
}: GridViewProps) => {
  const setHidenMore = useSetAtom(hidenMoreAtom);
  let dataGridRef = useRef<DataGrid | null>(null);
  const setDataGrid = useSetAtom(dataGridAtom);
  const setSelectionKey = useSetAtom(SelectionKeyAtom);
  const popupSettingsMemo = useMemo(() => popupSettings, [popupSettings]);
  const formSettingsPopup = useRef<any>();
  useEffect(() => {
    formSettingsPopup.current = { ...formSettings };
    setDataGrid(dataGridRef);
  });
  const windowSize = useWindowSize();
  const onChangePageSize = (pageSize: number) => {
    dataGridRef.current?.instance.pageSize(pageSize);
  };
  const [visible, setVisible] = useState(false);

  const { saveState, loadState } = useSavedState<ColumnOptions[]>({ storeKey });
  const chooserVisible = useVisibilityControl({ defaultVisible: false });
  const [realColumns, setColumnsState] = useReducer(
    (state: any, changes: any) => {
      // save changes into localStorage
      saveState(changes);
      return changes;
    },
    columns
  );
  const [isLoadingState, setIsLoadingState] = useState(true);
  // I want to restore columns from localStorage if it exists
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      // we need check the order of column from changes set
      const shouldHideColumns = differenceBy<ColumnOptions, ColumnOptions>(
        columns,
        savedState,
        "dataField"
      );
      for (let i = 0; i < shouldHideColumns.length; i++) {
        const column = shouldHideColumns[i];
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visible",
          false
        );
      }
      // update column with new index
      savedState.forEach((column: ColumnOptions, index: number) => {
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visibleIndex",
          index + 1
        );
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visible",
          true
        );
      });
      // setColumnsState(outputColumns);
    }
  }, [columns]);

  const onHiding = useCallback(() => {
    chooserVisible.close();
  }, []);

  const onApply = useCallback(
    (changes: any) => {
      console.log("change ", changes);
      chooserVisible.close();
      // we need check the order of column from changes set
      const shouldHideColumns = differenceBy<ColumnOptions, ColumnOptions>(
        columns,
        changes,
        "dataField"
      );
      for (let i = 0; i < shouldHideColumns.length; i++) {
        const column = shouldHideColumns[i];
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visible",
          false
        );
      }
      // update column with new index
      changes.forEach((column: ColumnOptions, index: number) => {
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visibleIndex",
          index + 1
        );
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visible",
          true
        );
      });
      saveState(changes);
    },
    [chooserVisible]
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
        onClick: () => setVisible(!visible),
      },
    });
  }, []);
  const setSelectionKeysAtom = useSetAtom(customizeGridSelectionKeysAtom);
  const [selectionKeys, setSelectionKeys] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleSelectionChanged = useCallback((e: any) => {
    setHidenMore(e.selectedRowKeys);
    setSelectionKeysAtom(e.selectedRowKeys);
    // console.log("e.isSingleSelection", e.selectedRowKeys);
    setSelectionKey(e.selectedRowKeys);
    setSelectionKeys(e.selectedRowKeys);
    onSelectionChanged?.(e.selectedRowKeys);
  }, []);
  const [currentOption, setCurrentOption] = useState<string>("table");
  const handleEditingStart = useCallback((e: EditingStartEvent) => {
    logger.debug("e:", e);
    onEditingStart?.(e);
  }, []);
  const handleEditCancelled = useCallback(() => {}, []);
  const switchEditMode = (e: any, isOn: boolean) => {
    if (isOn) {
      e.component.option("sorting.mode", "none");
      e.component.option("headerFilter.visible", false);
    } else {
      e.component.option("sorting.mode", "single");
      e.component.option("headerFilter.visible", true);
    }
  };
  const handleSaved = useCallback((e: any) => {
    logger.debug("saved event:", e);
    switchEditMode(e, false);
  }, []);
  const handleAddingNewRow = () => {};

  const { t, tf } = useI18n("Common");
  let innerGridRef = useRef<DataGrid>(null);

  const setRef = (ref: any) => {
    dataGridRef.current = ref;
    innerGridRef = ref;
  };

  // const onCancelDelete = useCallback(() => {}, []);
  // const onDelete = useCallback(() => {
  //   console.log("coming");
  //   onDeleteRows?.(selectionKeys);
  // }, [selectionKeys]);
  // const onDeleteSingle = useCallback(() => {
  //   if (deletingId) {
  //     onDeleteRows?.([deletingId]);
  //   }
  // }, [deletingId]);
  const controlConfirmBoxVisible = useVisibilityControl({
    defaultVisible: false,
  });
  // const controlDeleteSingleConfirmBox = useVisibilityControl({
  //   defaultVisible: false,
  // });
  const listOption = [
    {
      display: t("Card View"),
      value: "card",
    },
    {
      display: t("Table View"),
      value: "table",
    },
  ];

  const handlePageChanged = useCallback((pageIndex: number) => {
    dataGridRef.current?.instance.pageIndex(pageIndex);
  }, []);

  const allToolbarItems: ToolbarItemProps[] = [
    ...(toolbarItems || []),
    {
      location: locationCustomToolbar ? locationCustomToolbar : "before",
      render: () => <GridCustomToolbar items={customToolbarItems} />,
    },
    isShowEditCard === true
      ? {
          location: "after",
          render: () => {
            return (
              <div className="flex items-center">
                {t("Layout")}
                <SelectBox
                  id="custom-templates"
                  dataSource={listOption}
                  displayExpr="display"
                  className="ml-2 w-[120px]"
                  valueExpr="value"
                  defaultValue={listOption[1].value}
                  onValueChanged={(e: any) => {
                    setCurrentOption(e.value);
                  }}
                />
              </div>
            );
          },
        }
      : {},
    isHidenHeaderFilter === true
      ? {
          location: "after",
          render: () => {
            return (
              <PageSize
                title={t("Showing")}
                onChangePageSize={onChangePageSize}
                allowdPageSizes={[100, 200, 500, 1000]}
                showAllOption={true}
                showAllOptionText={t("ShowAll")}
                defaultPageSize={100}
              />
            );
          },
        }
      : {},
    isHidenHeaderFilter === true
      ? {
          location: "after",
          render: () => {
            return <PopupGridPageNavigator onPageChanged={handlePageChanged} />;
          },
        }
      : {},
    isHidenHeaderFilter === true
      ? {
          location: "after",
          render: () => {
            return <PopupGridPageSummary />;
          },
        }
      : {},
  ];

  // const innerSavingRowHandler = useCallback((e: any) => {
  //   if (e.changes && e.changes.length > 0) {
  //     // we don't enable batch mode, so only 1 change at a time.
  //     const { type } = e.changes[0];
  //     if (type === "insert" || type === "update") {
  //       // pass handle to parent page
  //       onSaveRow?.(e);
  //     } else {
  //       // set selected keys, then open the confirmation
  //       setDeletingId(e.changes[0].key);
  //       // show the confirmation box of Delete single case
  //       controlDeleteSingleConfirmBox.open();

  //       // this one to clear `changes` set from grid.
  //       dataGridRef.current?.instance.cancelEditData();
  //     }
  //   }
  //   e.cancel = true;
  // }, []);
  const setGridAtom = useSetAtom(popupGridStateAtom);
  return (
    <div className={"base-gridview bg-white"}>
      <ScrollView showScrollbar={"always"}>
        <LoadPanel visible={isLoading} position={{ of: `#${id}` }} />
        <DataGrid
          className={cssClass}
          keyExpr={keyExpr}
          errorRowEnabled={false}
          cacheEnabled={false}
          id={id}
          height={`${
            customerHeight ? customerHeight : windowSize.height - 150
          }px`}
          width={"100%"}
          ref={(r) => setRef(r)}
          dataSource={dataSource}
          noDataText={t("There is no data")}
          remoteOperations={false}
          columnAutoWidth={true}
          repaintChangesOnly
          showBorders
          onInitialized={() => {
            onReady?.(dataGridRef);
          }}
          onContentReady={() => {
            setGridAtom({
              pageIndex: dataGridRef.current?.instance.pageIndex() ?? 0,
              pageSize: dataGridRef.current?.instance.pageSize() ?? 0,
              pageCount: dataGridRef.current?.instance.pageCount() ?? 0,
              totalCount: dataGridRef.current?.instance.totalCount() ?? 0,
              ref: dataGridRef.current,
            });
          }}
          allowColumnResizing
          showColumnLines
          showRowLines
          columnResizingMode={"widget"}
          onSelectionChanged={handleSelectionChanged}
          onEditorPreparing={onEditorPreparing}
          onEditingStart={handleEditingStart}
          onEditCanceled={handleEditCancelled}
          onSaved={handleSaved}
          onInitNewRow={handleAddingNewRow}
          onSaving={() => {}}
          onRowRemoved={(e: any) => {
            // to support custom delete confirmation
            e.cancel = true;
          }}
          onRowRemoving={(e: any) => {
            // to support custom delete confirmation
            e.cancel = true;
          }}
          // stateStoring={stateStoring}
        >
          <ColumnChooser enabled={true} mode={"select"}>
            <Search enabled={true}></Search>
          </ColumnChooser>
          <ColumnFixing enabled={true} />
          <Pager visible={false} />
          <Paging enabled={true} defaultPageSize={100} />
          <HeaderFilter visible={true} dataSource={dataSource}>
            <Search enabled={true}></Search>
          </HeaderFilter>

          {isHidenHeaderFilter && (
            <HeaderFilter visible={true} dataSource={dataSource}>
              <Search enabled={true}></Search>
            </HeaderFilter>
          )}

          {isHidenHeaderFilter && (
            <Toolbar>
              {!!allToolbarItems &&
                allToolbarItems.map((item, index) => {
                  return (
                    <ToolbarItem key={index} location={item.location}>
                      {item.widget === "dxButton" && (
                        <Button {...item.options} />
                      )}
                      {!!item.render && item.render()}
                    </ToolbarItem>
                  );
                })}

              <ToolbarItem location="after">
                <div
                  id={"myColumnChooser"}
                  className={"search-form__settings cursor-pointer"}
                  onClick={() => chooserVisible.toggle()}
                >
                  <Icon name={"setting"} width={14} height={14} />
                  {/* <Tooltip
                    target="#myColumnChooser"
                    showEvent="dxhoverstart"
                    hideEvent="dxhoverend"
                    container={"#myColumnChooser"}
                  >
                    <div className={"z-[9999]"} style={{ zIndex: 9999 }}>
                      {t("ColumnToggleTooltip")}
                    </div>
                    &nbsp;
                  </Tooltip> */}
                </div>
              </ToolbarItem>
              <ToolbarItem location="after">
                <CustomColumnChooser
                  title={t("ToggleColum")}
                  applyText={t("Apply")}
                  cancelText={t("Cancel")}
                  selectAllText={t("SelectAll")}
                  container={`#${id}`}
                  button={"#myColumnChooser"}
                  visible={chooserVisible.visible}
                  columns={columns}
                  onHiding={onHiding}
                  onApply={onApply}
                  actualColumns={columns}
                  getColumnOptionCallback={
                    dataGridRef.current?.instance.columnOption || (() => {})
                  }
                />
              </ToolbarItem>
            </Toolbar>
          )}
          {isShowEditting && (
            <Editing
              mode={"popup"}
              useIcons={true}
              allowUpdating={true}
              allowDeleting={true}
              allowAdding={true}
              // allowUpdating={false}
              // allowDeleting={false}
              // allowAdding={false}
              popup={popupSettingsMemo}
              form={formSettingsPopup.current ?? {}}
              confirmDelete={false} // custom confirm delete dialog
              onChangesChange={onEditRowChanges}
            >
              <Texts
                confirmDeleteMessage={t(
                  "Are you sure to delete those records?"
                )}
                ok={t("OK")}
                cancel={t("Cancel")}
              />
            </Editing>
          )}

          {isShowEditting && (
            <Column
              visible={allowInlineEdit}
              type="buttons"
              width={110}
              fixed={false}
              allowResizing={false}
            >
              {isShowIconEdit && (
                <DxButton
                  cssClass={"mx-1 cursor-pointer"}
                  name="edit"
                  icon={"/images/icons/edit.svg"}
                  onClick={(e: any) => {
                    onEditRow?.(e);
                  }}
                />
              )}
              <DxButton
                cssClass={"mx-1 cursor-pointer"}
                name="delete"
                icon={"/images/icons/trash.svg"}
                onClick={(e: any) => {
                  onDeleteRows?.(e);
                }}
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
          )}
          {!isHiddenCheckBox && (
            <Selection mode="multiple" selectAllMode="page" />
          )}
          {isSingleSelection && <Selection mode={"none"} />}
          {isSingleSelection && (
            <Column
              dataField={"fake"}
              width={50}
              caption={t("")}
              showInColumnChooser={false}
              allowFiltering={false}
              allowSearch={false}
              allowResizing={false}
              cellRender={(e: any) => {
                const {
                  data,
                  row: { isSelected, rowIndex },
                  value,
                  key,
                } = e;
                return (
                  <SelectionCheckBox
                    isSelected={isSelected}
                    key={key}
                    gridRef={dataGridRef}
                    rowIndex={rowIndex}
                  />
                );
              }}
              dataType={"boolean"}
            ></Column>
          )}
          {isHidenHeaderFilter && (
            <Scrolling
              renderAsync={true}
              mode={"standard"}
              showScrollbar={"always"}
              rowRenderingMode={"standard"}
            />
          )}
          <GridLoadPanel enabled={true} />
          {columns.map((col: any) => (
            <Column key={col.dataField} {...col} allowSorting={true} />
          ))}
        </DataGrid>
      </ScrollView>
    </div>
  );
};

export const GridViewCustomize = forwardRef(
  (props: Omit<GridViewProps, "ref">, ref: any) => {
    if (props.isLoading) {
      return null;
    } else {
      return <GridViewRaw ref={ref} {...props} />;
    }
  }
);
GridViewCustomize.displayName = "GridViewCustomize";
