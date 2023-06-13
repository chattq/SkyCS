import { useI18n } from "@/i18n/useI18n";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  dataFormAtom,
  dataTableAtom,
  flagEdit,
  showDetail,
  viewingDataAtom,
} from "@/pages/Department_Control/components/store";
import { showPopup } from "@/pages/Department_Control/components/store";
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
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { toast } from "react-toastify";
import { number } from "ts-pattern/dist/patterns";

export interface DealerPopupViewProps {
  onEdit: any;
  formSettings: any;
  title: string;
  onCreate: any;
}

export const DepartMentControlPopupView = ({
  onEdit,
  onCreate,
  title,
  formSettings,
}: DealerPopupViewProps) => {
  const popupVisible = useAtomValue(showPopup);
  const flagCheckCRUD = useAtomValue(flagEdit);
  const detailForm = useAtomValue(showDetail);
  const formRef = useRef<any>();
  const validateRef = useRef<any>();
  const { t } = useI18n("Common");
  const dataRef = useRef<any>(null);
  const [viewingItem, setViewingItem] = useAtom(viewingDataAtom);
  const [dataTable, setDataTable] = useAtom(dataTableAtom);
  const [dataForm, setDataForm] = useAtom(dataFormAtom);
  const setPopupVisible = useSetAtom(showPopup);

  const api = useClientgateApi();
  const { data: listMst_DepartmentControl } = useQuery(
    ["listMst_DepartmentControl", viewingItem.item?.DepartmentCode],
    () =>
      api.Mst_DepartmentControl_GetByDepartmentCode(
        viewingItem.item?.DepartmentCode
      )
  );

  useEffect(() => {
    setDataTable(listMst_DepartmentControl?.Data?.Lst_Sys_UserMapDepartment);
    setDataForm({
      ...listMst_DepartmentControl?.Data?.Mst_Department,
      FlagActive:
        listMst_DepartmentControl?.Data?.Mst_Department?.FlagActive === "1"
          ? true
          : false,
    });
  }, [listMst_DepartmentControl?.Data]);

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
        visible: !detailForm,
      },
    },
  ];

  const handleSubmitPopup = useCallback(
    (e: any) => {
      validateRef.current.instance.validate();
      const dataForm = new FormData(formRef.current);
      const dataSaveForm: any = Object.fromEntries(dataForm.entries()); // chuyển thành form chính
      const dataSave = {
        Mst_Department: {
          ...dataSaveForm,
          DepartmentCode: dataSaveForm.DepartmentCode,
          FlagActive: dataSaveForm.FlagActive ? "1" : "0",
          OrgID: "7206207001",
          DepartmentCodeParent: `${dataSaveForm.DepartmentCode}%`,
        },
        Lst_Sys_UserMapDepartment:
          dataRef.current.props.dataSource.map((item: any) => {
            return {
              DepartmentCode: dataSaveForm.DepartmentCode,
              UserCode: item.UserCode,
              OrgID: "7206207001",
              FullName: item.FullName,
              Email: item.EMail,
              PhoneNo: item.PhoneNo,
            };
          }) ?? [],
      };

      if (flagCheckCRUD) {
        onCreate(dataSave);
      } else {
        onEdit(dataSave);
      }
    },
    [flagCheckCRUD]
  );

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

  // const customizeItem = (e: any) => {
  //   if (e.dataField === "DepartmentCode") {
  //     e.editorOptions.value === value;

  //     if (e.editorOptions.value === value) {
  //       e.editorType = "dxTextBox";
  //     }
  //   }
  // };
  function customizeItem(item: any) {
    if (item.dataField === "DepartmentCode" && flagCheckCRUD === false) {
      item.editorOptions.readOnly = true;
    }
    if (item.dataField === "DepartmentCode" && flagCheckCRUD === true) {
      item.editorOptions.readOnly = false;
    }

    return item;
  }
  function handleFieldDataChanged(changedData: any) {
    // Handle the changed field data
    // setValue(changedData.value);
  }
  const handleChange = (e: any) => {
    console.log(177, e);
  };

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
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          visible: !detailForm,
          options: {
            text: flagCheckCRUD ? t("Save") : t("Edit"),
            stylingMode: "contained",
            type: "default",
            useSubmitBehavior: true,
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
        <form ref={formRef} onSubmit={handleSubmitPopup}>
          <Form
            // onEditorEnterKey={}
            ref={validateRef}
            formData={dataForm}
            labelLocation="top"
            validationGroup="DepartmentControlData"
            onInitialized={(e) => {
              validateRef.current = e.component;
            }}
            readOnly={detailForm}
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
          <div className="mt-2">
            <DataGrid
              ref={dataRef}
              id="gridContainer"
              dataSource={dataTable}
              keyExpr="DepartmentCode"
              noDataText={t("There is no data")}
              columnAutoWidth={true}
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
                allowUpdating={!detailForm}
                allowDeleting={!detailForm}
                allowAdding={!detailForm}
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
        </form>
      </ScrollView>
    </Popup>
  );
};
