import { useI18n } from "@/i18n/useI18n";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { Button, Form, Popup, ScrollView } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import DataGrid, {
  Column,
  Editing,
  Item,
  Toolbar,
} from "devextreme-react/data-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToolbarItemProps } from "@/packages/ui/base-gridview";
import { logger } from "@/packages/logger";
import {
  dataBotton,
  dataFormAtom,
  dataTableAtom,
  flagEdit,
  readOnly,
  showDetail,
  showPopup,
  viewingDataAtom,
} from "./store";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";

export interface DealerPopupViewProps {
  onEdit: any;
  formSettings: any;
  title: string;
  onCreate: any;
}

export const PopupView = ({
  onEdit,
  formSettings,
  title,
  onCreate,
}: DealerPopupViewProps) => {
  const popupVisible = useAtomValue(showPopup);
  // const valueBotton = useAtomValue(dataBotton);
  // console.log(valueBotton);

  const formRef = useRef<any>();
  const ref = useRef<any>();
  const validateRef = useRef<any>();
  const { t } = useI18n("Common");
  const dataRef = useRef<any>(null);
  const [viewingItem, setViewingItem] = useAtom(viewingDataAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const [dataTable, setDataTable] = useAtom(dataTableAtom);
  const [dataForm, setDataForm] = useAtom(dataFormAtom);
  const flagCheckCRUD = useAtomValue(flagEdit);
  const detailForm = useAtomValue(showDetail);
  const readonly = useAtomValue(readOnly);

  const api = useClientgateApi();
  const { data: listNNT } = useQuery(
    ["listNNTControl", viewingItem.item?.MST],
    () => api.Mst_NNTController_GetNNTCode(viewingItem.item?.MST)
  );

  useEffect(() => {
    setDataTable(listNNT?.Data);
    setDataForm(listNNT?.Data);
  }, [listNNT?.Data]);

  const handleCancel = () => {
    setPopupVisible(false);
  };

  const toolbarItems: ToolbarItemProps[] = [
    {
      location: "before",
      render: (e) => {
        return <div>{t("Danh sách các thành viên")}</div>;
      },
    },
    {
      widget: "dxButton",
      location: "after",
      options: {
        text: t("Thêm thành viên"),
        stylingMode: "contained",
        onClick: (e: any) => {
          dataRef.current.instance.addRow();
        },
      },
    },
  ];

  // console.log(79, valueBotton);
  const handleSubmitPopup = (e: any) => {
    const dataForm = new FormData(formRef.current);
    const dataSaveForm: any = Object.fromEntries(dataForm.entries()); // chuyển thành form chính
    validateRef.current.instance.validate();
    const dataSave = {
      ...dataSaveForm,
      ProvinceCode: dataSaveForm.mp_ProvinceName ?? "",
      MSTParent: "",
    };
    if (flagCheckCRUD) {
      onCreate(dataSave);
    } else {
      onEdit(dataSave);
    }
  };

  const handleDatatable = (e: any) => {
    console.log(122, e.component.totalCount());
  };
  const innerSavingRowHandler = (e: any) => {
    if (e.changes && e.changes.length > 0) {
      // we don't enable batch mode, so only 1 change at a time.
      const { type } = e.changes[0];
      if (type === "insert" || type === "update") {
        // pass handle to parent page
        handleDatatable?.(e);
      } else {
        // set selected keys, then open the confirmation
        // setDeletingId(e.changes[0].key);
        // // show the confirmation box of Delete single case
        // controlDeleteSingleConfirmBox.open();
        // // this one to clear `changes` set from grid.
        // dataGridRef.current?.instance.cancelEditData();
      }
    }
    e.cancel = true;
  };

  const customizeItem = (item: any) => {
    if (["MST"].includes(item.dataField) && readonly === false) {
      item.editorOptions.readOnly = true;
    } else if (["MST"].includes(item.dataField) && readonly === true) {
      item.editorOptions.readOnly = false;
    }
  };

  const handleFieldDataChanged = useCallback((changedData: any) => {
    // Handle the changed field data
  }, []);

  return (
    <Popup
      visible={popupVisible}
      showTitle={true}
      title={title}
      width={870}
      wrapperAttr={{
        class: "popup-form-department",
      }}
      toolbarItems={[
        {
          visible: !detailForm,
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          options: {
            text: flagCheckCRUD ? t("Save") : t("Edit"),
            stylingMode: "contained",
            type: "count",
            onClick: handleSubmitPopup,
          },
        },
        {
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          options: {
            text: t("Cancel"),
            type: "default",
            onClick: handleCancel,
          },
        },
      ]}
    >
      <ScrollView height={"100%"}>
        <form action="" ref={formRef} onSubmit={handleSubmitPopup}>
          <Form
            ref={validateRef}
            validationGroup="customerData"
            onInitialized={(e) => {
              validateRef.current = e.component;
            }}
            readOnly={detailForm}
            formData={dataForm}
            labelLocation="top"
            customizeItem={customizeItem}
            onFieldDataChanged={handleFieldDataChanged}
          >
            {formSettings
              .filter((item: any) => item.typeForm === "textForm")
              .map((value: any) => {
                return (
                  <GroupItem colCount={value.colCount}>
                    {value.items.map((items: any) => {
                      return (
                        <GroupItem colSpan={items.colSpan}>
                          {items.items.map((valueFrom: any) => {
                            return (
                              <SimpleItem
                                key={valueFrom.caption}
                                {...valueFrom}
                              />
                            );
                          })}
                        </GroupItem>
                      );
                    })}
                  </GroupItem>
                );
              })}
          </Form>
        </form>
        <div
          className={`mt-2 hidden ${
            formSettings.filter((item: any) => item.typeForm === "TableForm")[0]
              .hidden
              ? "hidden"
              : ""
          }`}
        >
          <DataGrid
            ref={dataRef}
            id="gridContainer"
            dataSource={[]}
            keyExpr="ID"
            onSaved={innerSavingRowHandler}
            noDataText={t("There is no data")}
            remoteOperations={false}
            columnAutoWidth={true}
            repaintChangesOnly
            allowColumnReordering={true}
            showColumnLines
            showRowLines
            showBorders
            width={"100%"}
          >
            <Toolbar>
              {!!toolbarItems &&
                toolbarItems.map((item, index) => {
                  return (
                    <Item key={index} location={item.location}>
                      {item.widget === "dxButton" && (
                        <Button {...item.options} />
                      )}
                      {!!item.render && item.render()}
                    </Item>
                  );
                })}
            </Toolbar>
            <Editing
              mode="row"
              allowUpdating={true}
              allowDeleting={true}
              allowAdding={true}
            />
            {formSettings
              .filter((item: any) => item.typeForm === "TableForm")
              .map((value: any) =>
                value.items.map((item: any) => {
                  return <Column key={item.caption} {...item} />;
                })
              )}
          </DataGrid>
        </div>
      </ScrollView>
    </Popup>
  );
};
