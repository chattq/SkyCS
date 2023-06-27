import {
  Button,
  CheckBox,
  DataGrid,
  LoadPanel,
  TreeList,
} from "devextreme-react";
import {
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
import { DeleteConfirmationBox } from "../modal";
import { ColumnOptions, ToolbarItemProps } from "./types";
import { useSavedState } from "@packages/ui/base-gridview/components/use-saved-state";
import { PopupGridPageNavigator } from "@packages/ui/base-gridview/components/popup-grid-page-navigator";
import { PopupGridPageSummary } from "@packages/ui/base-gridview/components/popup-grid-page-summary";
import { useSetAtom } from "jotai";
import { popupGridStateAtom } from "@packages/ui/base-gridview/store/popup-grid-store";
import { Column, ValidationRule } from "devextreme-react/tree-list";

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
  onEditRowChanges?: (changes: any) => void;
  onEditingStart?: (e: EditingStartEvent) => void;
  stateStoring?: IStateStoringProps;
  storeKey: string;
  onEditRow?: (e: any) => void;
}

const GridViewRaw = ({
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
}: GridViewProps) => {
  const dataGridRef = useRef<DataGrid | null>(null);

  const popupSettingsMemo = useMemo(() => popupSettings, [popupSettings]);
  const formSettingsPopup = useRef<any>();
  useEffect(() => {
    formSettingsPopup.current = { ...formSettings };
  });
  const windowSize = useWindowSize();
  const onChangePageSize = (pageSize: number) => {
    dataGridRef.current?.instance.pageSize(pageSize);
  };
  const [visible, setVisible] = useState(false);

  const { saveState, loadState } = useSavedState<ColumnOptions[]>({ storeKey });

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
      const columnOrders = savedState.map(
        (column: ColumnOptions) => column.dataField
      );
      const outputColumns = columns.map((column: ColumnOptions) => {
        const filterResult = savedState.find(
          (c: ColumnOptions) => c.dataField === column.dataField
        );
        return {
          ...column,
          visible: filterResult ? filterResult.visible : false,
        };
      });
      outputColumns.sort(
        (a, b) =>
          columnOrders.indexOf(a.dataField) - columnOrders.indexOf(b.dataField)
      );
      setColumnsState(outputColumns);
      setIsLoadingState(false);
    }
  }, []);

  const onHiding = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onApply = useCallback(
    (changes: any) => {
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

      // const latest = realColumns.map((column: ColumnOptions) => {
      //   const found = changes.find((c: ColumnOptions) => c.dataField === column.dataField);
      //   column.visible = found ? found.visible : false;
      //   return column
      // })
      setColumnsState(latest);
      setVisible(false);
    },
    [setColumnsState, setVisible]
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
  const [selectionKeys, setSelectionKeys] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleSelectionChanged = useCallback((e: any) => {
    setSelectionKeys(e.selectedRowKeys);
    onSelectionChanged?.(e.selectedRowKeys);
  }, []);

  const handleEditingStart = useCallback((e: EditingStartEvent) => {
    logger.debug("e:", e);
    onEditingStart?.(e);
  }, []);
  const handleEditCancelled = useCallback(() => {}, []);

  const handleSaved = useCallback((e: any) => {
    logger.debug("saved event:", e);
    console.log(1024, e);
  }, []);
  const handleAddingNewRow = () => {};

  const { t, tf } = useI18n("Common");
  let innerGridRef = useRef<DataGrid>(null);

  const setRef = (ref: any) => {
    dataGridRef.current = ref;
    innerGridRef = ref;
  };

  const onCancelDelete = useCallback(() => {}, []);
  const onDelete = useCallback(() => {
    console.log("coming");
    onDeleteRows?.(selectionKeys);
  }, [selectionKeys]);
  const onDeleteSingle = useCallback(() => {
    if (deletingId) {
      onDeleteRows?.([deletingId]);
    }
  }, [deletingId]);
  const controlConfirmBoxVisible = useVisibilityControl({
    defaultVisible: false,
  });
  const controlDeleteSingleConfirmBox = useVisibilityControl({
    defaultVisible: false,
  });
  const handleConfirmDelete = useCallback(() => {
    controlConfirmBoxVisible.open();
  }, []);
  const handlePageChanged = useCallback((pageIndex: number) => {
    dataGridRef.current?.instance.pageIndex(pageIndex);
  }, []);
  const allToolbarItems: ToolbarItemProps[] = [
    ...(toolbarItems || []),
    {
      location: "before",
      widget: "dxButton",
      options: {
        text: t("Delete"),
        onClick: handleConfirmDelete,
        visible: selectionKeys.length >= 1,
        // visible: false,
        stylingMode: "contained",
        type: "default",
      },
    },
    {
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
    },
    {
      location: "after",
      render: () => {
        return <PopupGridPageNavigator onPageChanged={handlePageChanged} />;
      },
    },
    {
      location: "after",
      render: () => {
        return <PopupGridPageSummary />;
      },
    },
    {
      location: "after",
      render: () => {
        return (
          <CustomColumnChooser
            title={t("ToggleColumn")}
            applyText={t("Apply")}
            cancelText={t("Cancel")}
            selectAllText={t("SelectAll")}
            container={"#gridContainer"}
            button={"#myColumnChooser"}
            visible={visible}
            columns={columns}
            actualColumns={realColumns}
            onHiding={onHiding}
            onApply={onApply}
          />
        );
      },
    },
  ];

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
        controlDeleteSingleConfirmBox.open();

        // this one to clear `changes` set from grid.
        dataGridRef.current?.instance.cancelEditData();
      }
    }
    e.cancel = true;
  }, []);
  const setGridAtom = useSetAtom(popupGridStateAtom);

  const onEditorPreparingA = (e: any) => {
    if (e.dataField === "Head_ID" && e.row.data.ID === 1) {
      e.editorOptions.disabled = true;
      e.editorOptions.value = null;
    }
  };

  const onInitNewRow = (e: any) => {
    e.data.Head_ID = 1;
  };
  const TreeRef = useRef<any>();
  const popupOptions = {
    title: "Employee Info",
    showTitle: true,
    width: 700,
  };
  const expandedRowKeys = [1];

  const renderCell = (data: any) => {
    return (
      <CheckBox
        onValueChanged={(e) => {
          TreeRef.current.instance.selectRows([data.key]);
        }}
      />
    );
  };
  const renderHeaderCell = (data: any) => {
    console.log(data);
    return (
      <CheckBox
        onValueChanged={() => {
          TreeRef.current.instance.selectAll();
        }}
      />
    );
  };
  return (
    <div className={"base-gridview bg-white"}>
      <ScrollView
        showScrollbar={"always"}
        height={windowSize.height - 50}
        className={"mb-5"}
      >
        <LoadPanel visible={isLoading} position={{ of: "#gridContainer" }} />
        <TreeList
          ref={TreeRef}
          dataSource={[
            {
              ID: 1,
              Head_ID: 0,
              Full_Name: "John Heart",
              Prefix: "Mr.",
              Title: "CEO",
              City: "Los Angeles",
              State: "California",
              Email: "jheart@dx-email.com",
              Skype: "jheart_DX_skype",
              Mobile_Phone: "(213) 555-9392",
              Birth_Date: "1964-03-16",
              Hire_Date: "1995-01-15",
            },
            {
              ID: 2,
              Head_ID: 1,
              Full_Name: "Samantha Bright",
              Prefix: "Dr.",
              Title: "COO",
              City: "Los Angeles",
              State: "California",
              Email: "samanthab@dx-email.com",
              Skype: "samanthab_DX_skype",
              Mobile_Phone: "(213) 555-2858",
              Birth_Date: "1966-05-02",
              Hire_Date: "2004-05-24",
            },
            {
              ID: 3,
              Head_ID: 1,
              Full_Name: "Arthur Miller",
              Prefix: "Mr.",
              Title: "CTO",
              City: "Denver",
              State: "Colorado",
              Email: "arthurm@dx-email.com",
              Skype: "arthurm_DX_skype",
              Mobile_Phone: "(310) 555-8583",
              Birth_Date: "1972-07-11",
              Hire_Date: "2007-12-18",
            },
            {
              ID: 4,
              Head_ID: 1,
              Full_Name: "Robert Reagan",
              Prefix: "Mr.",
              Title: "CMO",
              City: "Bentonville",
              State: "Arkansas",
              Email: "robertr@dx-email.com",
              Skype: "robertr_DX_skype",
              Mobile_Phone: "(818) 555-2387",
              Birth_Date: "1974-09-07",
              Hire_Date: "2002-11-08",
            },
            {
              ID: 5,
              Head_ID: 1,
              Full_Name: "Greta Sims",
              Prefix: "Ms.",
              Title: "HR Manager",
              City: "Atlanta",
              State: "Georgia",
              Email: "gretas@dx-email.com",
              Skype: "gretas_DX_skype",
              Mobile_Phone: "(818) 555-6546",
              Birth_Date: "1977-11-22",
              Hire_Date: "1998-04-23",
            },
            {
              ID: 6,
              Head_ID: 3,
              Full_Name: "Brett Wade",
              Prefix: "Mr.",
              Title: "IT Manager",
              City: "Reno",
              State: "Nevada",
              Email: "brettw@dx-email.com",
              Skype: "brettw_DX_skype",
              Mobile_Phone: "(626) 555-0358",
              Birth_Date: "1968-12-01",
              Hire_Date: "2009-03-06",
            },
            {
              ID: 7,
              Head_ID: 5,
              Full_Name: "Sandra Johnson",
              Prefix: "Mrs.",
              Title: "Controller",
              City: "Beaver",
              State: "Utah",
              Email: "sandraj@dx-email.com",
              Skype: "sandraj_DX_skype",
              Mobile_Phone: "(562) 555-2082",
              Birth_Date: "1974-11-15",
              Hire_Date: "2005-05-11",
            },
            {
              ID: 8,
              Head_ID: 4,
              Full_Name: "Ed Holmes",
              Prefix: "Dr.",
              Title: "Sales Manager",
              City: "Malibu",
              State: "California",
              Email: "edwardh@dx-email.com",
              Skype: "edwardh_DX_skype",
              Mobile_Phone: "(310) 555-1288",
              Birth_Date: "1973-07-14",
              Hire_Date: "2005-06-19",
            },
            {
              ID: 9,
              Head_ID: 3,
              Full_Name: "Barb Banks",
              Prefix: "Mrs.",
              Title: "Support Manager",
              City: "Phoenix",
              State: "Arizona",
              Email: "barbarab@dx-email.com",
              Skype: "barbarab_DX_skype",
              Mobile_Phone: "(310) 555-3355",
              Birth_Date: "1979-04-14",
              Hire_Date: "2002-08-07",
            },
            {
              ID: 10,
              Head_ID: 2,
              Full_Name: "Kevin Carter",
              Prefix: "Mr.",
              Title: "Shipping Manager",
              City: "San Diego",
              State: "California",
              Email: "kevinc@dx-email.com",
              Skype: "kevinc_DX_skype",
              Mobile_Phone: "(213) 555-2840",
              Birth_Date: "1978-01-09",
              Hire_Date: "2009-08-11",
            },
            {
              ID: 11,
              Head_ID: 5,
              Full_Name: "Cindy Stanwick",
              Prefix: "Ms.",
              Title: "HR Assistant",
              City: "Little Rock",
              State: "Arkansas",
              Email: "cindys@dx-email.com",
              Skype: "cindys_DX_skype",
              Mobile_Phone: "(818) 555-6655",
              Birth_Date: "1985-06-05",
              Hire_Date: "2008-03-24",
            },
            {
              ID: 12,
              Head_ID: 8,
              Full_Name: "Sammy Hill",
              Prefix: "Mr.",
              Title: "Sales Assistant",
              City: "Pasadena",
              State: "California",
              Email: "sammyh@dx-email.com",
              Skype: "sammyh_DX_skype",
              Mobile_Phone: "(626) 555-7292",
              Birth_Date: "1984-02-17",
              Hire_Date: "2012-02-01",
            },
            {
              ID: 13,
              Head_ID: 10,
              Full_Name: "Davey Jones",
              Prefix: "Mr.",
              Title: "Shipping Assistant",
              City: "Pasadena",
              State: "California",
              Email: "davidj@dx-email.com",
              Skype: "davidj_DX_skype",
              Mobile_Phone: "(626) 555-0281",
              Birth_Date: "1983-03-06",
              Hire_Date: "2011-04-24",
            },
            {
              ID: 14,
              Head_ID: 10,
              Full_Name: "Victor Norris",
              Prefix: "Mr.",
              Title: "Shipping Assistant",
              City: "Little Rock",
              State: "Arkansas",
              Email: "victorn@dx-email.com",
              Skype: "victorn_DX_skype",
              Mobile_Phone: "(213) 555-9278",
              Birth_Date: "1986-07-23",
              Hire_Date: "2012-07-23",
            },
            {
              ID: 15,
              Head_ID: 10,
              Full_Name: "Mary Stern",
              Prefix: "Ms.",
              Title: "Shipping Assistant",
              City: "Beaver",
              State: "Utah",
              Email: "marys@dx-email.com",
              Skype: "marys_DX_skype",
              Mobile_Phone: "(818) 555-7857",
              Birth_Date: "1982-04-08",
              Hire_Date: "2012-08-12",
            },
            {
              ID: 16,
              Head_ID: 10,
              Full_Name: "Robin Cosworth",
              Prefix: "Mrs.",
              Title: "Shipping Assistant",
              City: "Los Angeles",
              State: "California",
              Email: "robinc@dx-email.com",
              Skype: "robinc_DX_skype",
              Mobile_Phone: "(818) 555-0942",
              Birth_Date: "1981-06-12",
              Hire_Date: "2012-09-01",
            },
            {
              ID: 17,
              Head_ID: 9,
              Full_Name: "Kelly Rodriguez",
              Prefix: "Ms.",
              Title: "Support Assistant",
              City: "Boise",
              State: "Idaho",
              Email: "kellyr@dx-email.com",
              Skype: "kellyr_DX_skype",
              Mobile_Phone: "(818) 555-9248",
              Birth_Date: "1988-05-11",
              Hire_Date: "2012-10-13",
            },
            {
              ID: 18,
              Head_ID: 9,
              Full_Name: "James Anderson",
              Prefix: "Mr.",
              Title: "Support Assistant",
              City: "Atlanta",
              State: "Georgia",
              Email: "jamesa@dx-email.com",
              Skype: "jamesa_DX_skype",
              Mobile_Phone: "(323) 555-4702",
              Birth_Date: "1987-01-29",
              Hire_Date: "2012-10-18",
            },
            {
              ID: 19,
              Head_ID: 9,
              Full_Name: "Antony Remmen",
              Prefix: "Mr.",
              Title: "Support Assistant",
              City: "Boise",
              State: "Idaho",
              Email: "anthonyr@dx-email.com",
              Skype: "anthonyr_DX_skype",
              Mobile_Phone: "(310) 555-6625",
              Birth_Date: "1986-02-19",
              Hire_Date: "2013-01-19",
            },
            {
              ID: 20,
              Head_ID: 8,
              Full_Name: "Olivia Peyton",
              Prefix: "Mrs.",
              Title: "Sales Assistant",
              City: "Atlanta",
              State: "Georgia",
              Email: "oliviap@dx-email.com",
              Skype: "oliviap_DX_skype",
              Mobile_Phone: "(310) 555-2728",
              Birth_Date: "1981-06-03",
              Hire_Date: "2012-05-14",
            },
            {
              ID: 21,
              Head_ID: 6,
              Full_Name: "Taylor Riley",
              Prefix: "Mr.",
              Title: "Network Admin",
              City: "San Jose",
              State: "California",
              Email: "taylorr@dx-email.com",
              Skype: "taylorr_DX_skype",
              Mobile_Phone: "(310) 555-7276",
              Birth_Date: "1982-08-14",
              Hire_Date: "2012-04-14",
            },
            {
              ID: 22,
              Head_ID: 6,
              Full_Name: "Amelia Harper",
              Prefix: "Mrs.",
              Title: "Network Admin",
              City: "Los Angeles",
              State: "California",
              Email: "ameliah@dx-email.com",
              Skype: "ameliah_DX_skype",
              Mobile_Phone: "(213) 555-4276",
              Birth_Date: "1983-11-19",
              Hire_Date: "2011-02-10",
            },
            {
              ID: 23,
              Head_ID: 6,
              Full_Name: "Wally Hobbs",
              Prefix: "Mr.",
              Title: "Programmer",
              City: "Chatsworth",
              State: "California",
              Email: "wallyh@dx-email.com",
              Skype: "wallyh_DX_skype",
              Mobile_Phone: "(818) 555-8872",
              Birth_Date: "1984-12-24",
              Hire_Date: "2011-02-17",
            },
            {
              ID: 24,
              Head_ID: 6,
              Full_Name: "Brad Jameson",
              Prefix: "Mr.",
              Title: "Programmer",
              City: "San Fernando",
              State: "California",
              Email: "bradleyj@dx-email.com",
              Skype: "bradleyj_DX_skype",
              Mobile_Phone: "(818) 555-4646",
              Birth_Date: "1988-10-12",
              Hire_Date: "2011-03-02",
            },
            {
              ID: 25,
              Head_ID: 6,
              Full_Name: "Karen Goodson",
              Prefix: "Miss",
              Title: "Programmer",
              City: "South Pasadena",
              State: "California",
              Email: "kareng@dx-email.com",
              Skype: "kareng_DX_skype",
              Mobile_Phone: "(626) 555-0908",
              Birth_Date: "1987-04-26",
              Hire_Date: "2011-03-14",
            },
            {
              ID: 26,
              Head_ID: 5,
              Full_Name: "Marcus Orbison",
              Prefix: "Mr.",
              Title: "Travel Coordinator",
              City: "Los Angeles",
              State: "California",
              Email: "marcuso@dx-email.com",
              Skype: "marcuso_DX_skype",
              Mobile_Phone: "(213) 555-7098",
              Birth_Date: "1982-03-02",
              Hire_Date: "2005-05-19",
            },
            {
              ID: 27,
              Head_ID: 5,
              Full_Name: "Sandy Bright",
              Prefix: "Ms.",
              Title: "Benefits Coordinator",
              City: "Denver",
              State: "Colorado",
              Email: "sandrab@dx-email.com",
              Skype: "sandrab_DX_skype",
              Mobile_Phone: "(818) 555-0524",
              Birth_Date: "1983-09-11",
              Hire_Date: "2005-06-04",
            },
            {
              ID: 28,
              Head_ID: 6,
              Full_Name: "Morgan Kennedy",
              Prefix: "Mrs.",
              Title: "Graphic Designer",
              City: "San Fernando Valley",
              State: "California",
              Email: "morgank@dx-email.com",
              Skype: "morgank_DX_skype",
              Mobile_Phone: "(818) 555-8238",
              Birth_Date: "1984-07-17",
              Hire_Date: "2012-01-11",
            },
            {
              ID: 29,
              Head_ID: 28,
              Full_Name: "Violet Bailey",
              Prefix: "Ms.",
              Title: "Jr Graphic Designer",
              City: "La Canada",
              State: "California",
              Email: "violetb@dx-email.com",
              Skype: "violetb_DX_skype",
              Mobile_Phone: "(818) 555-2478",
              Birth_Date: "1985-06-10",
              Hire_Date: "2012-01-19",
            },
            {
              ID: 30,
              Head_ID: 5,
              Full_Name: "Ken Samuelson",
              Prefix: "Dr.",
              Title: "Ombudsman",
              City: "St. Louis",
              State: "Missouri",
              Email: "kents@dx-email.com",
              Skype: "kents_DX_skype",
              Mobile_Phone: "(562) 555-9282",
              Birth_Date: "1972-09-11",
              Hire_Date: "2009-04-22",
            },
          ]}
          columnAutoWidth={true}
          showRowLines={true}
          showBorders={true}
          defaultExpandedRowKeys={expandedRowKeys}
          keyExpr="ID"
          parentIdExpr="Head_ID"
          onEditorPreparing={onEditorPreparingA}
          onInitNewRow={onInitNewRow}
        >
          <Editing
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={true}
            popup={popupOptions}
            mode="popup"
          />
          {/* <Selection mode="multiple" /> */}
          <Column>
            <Column
              dataField="Title2"
              cellRender={renderCell}
              headerCellRender={renderHeaderCell}
            />
            <Column dataField="Full_Name" />
            <Column dataField="Title" caption="Position" />
            <Column dataField="City" />
            <Column dataField="State" />
            <Column width={120} dataField="Hire_Date" dataType="date" />
          </Column>
        </TreeList>
      </ScrollView>
      <DeleteConfirmationBox
        control={controlConfirmBoxVisible}
        title={t("Are you sure to delete selected records")}
        onYesClick={onDelete}
        onNoClick={onCancelDelete}
      />
      <DeleteConfirmationBox
        control={controlDeleteSingleConfirmBox}
        title={tf("Are you sure to delete this {0} record?", deletingId)}
        onYesClick={onDeleteSingle}
        onNoClick={onCancelDelete}
      />
    </div>
  );
};

export const TreeGridViewPopup = forwardRef(
  (props: Omit<GridViewProps, "ref">, ref: any) => {
    if (props.isLoading) {
      return null;
    } else {
      return <GridViewRaw ref={ref} {...props} />;
    }
  }
);
TreeGridViewPopup.displayName = "GridViewPopup";
