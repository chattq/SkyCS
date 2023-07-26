import { useI18n } from "@/i18n/useI18n";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  dataFormAtom,
  dataFuntionAtom,
  dataTableAtom,
  flagEdit,
  showDetail,
  showInfoObjAtom,
  viewingDataAtom,
} from "@/pages/Sys_Group/components/store";
import { showPopup } from "@/pages/Sys_Group/components/store";
import { Button, Form, List, Popup, ScrollView } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import DataGrid, {
  Column,
  Editing,
  FilterRow,
  Item,
  Paging,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToolbarItemProps } from "@/packages/ui/base-gridview";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { Icon } from "@/packages/ui/icons";
import { showPopupUser } from "@/pages/User_Mananger/components/store";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

export interface DealerPopupViewProps {
  onEdit: any;
  formSettings: any;
  title: string;
  onCreate: any;
  dataAssigned?: any;
  dataUnassigned?: any;
  actualColumns?: any;
}

export const PopupViewDetail = ({
  onEdit,
  onCreate,
  title,
  formSettings,
  dataAssigned,
  dataUnassigned,
  actualColumns,
}: DealerPopupViewProps) => {
  const flagCheckCRUD = useAtomValue(flagEdit);
  const popupVisible = useAtomValue(showPopup);
  const popupVisibleUser = useAtomValue(showPopupUser);
  const detailForm = useAtomValue(showDetail);
  const showInfoObj = useAtomValue(showInfoObjAtom);
  const dataFuntion = useAtomValue(dataFuntionAtom);
  const formRef = useRef<any>();
  const validateRef = useRef<any>();
  const { t } = useI18n("Common");
  const dataRef = useRef<any>(null);
  const [viewingItem, setViewingItem] = useAtom(viewingDataAtom);
  const [dataTable, setDataTable] = useAtom(dataTableAtom);
  const [dataForm, setDataForm] = useAtom(dataFormAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const [total, setTotal] = useState(0);

  const setPopupVisibleUser = useSetAtom(showPopupUser);
  const dataGrid = useRef<any>(null);

  const api = useClientgateApi();
  const { data: listGroup } = useQuery(
    ["listUserDeparment", viewingItem.item?.GroupCode],
    () => api.Sys_GroupController_GetByGroupCode(viewingItem.item?.GroupCode)
  );

  const [selectItem, setSelectItems] = useState<any>([]);

  const backUpColumns = useRef<any>();
  useEffect(() => {
    if (dataFuntion && showInfoObj === false) {
      setSelectItems(dataFuntion);
      backUpColumns.current = dataFuntion;
    }
    if (showInfoObj === true) {
      setSelectItems([]);
      backUpColumns.current = [];
      // setDataTable([]);
    }

    if (listGroup?.Data && detailForm === true) {
      setSelectItems(listGroup?.Data?.Lst_Sys_Access);
      setDataTable(listGroup?.Data?.Lst_Sys_UserInGroup);
      setDataForm({
        ...listGroup?.Data?.Sys_Group,
        FlagActive:
          listGroup?.Data?.Sys_Group.FlagActive === "1" ? true : false,
      });
    }
  }, [dataFuntion, detailForm, listGroup?.Data, showInfoObj]);

  const handleCancel = () => {
    if (!detailForm) {
      dataGrid.current.instance.deselectAll();
    }
    setPopupVisible(false);
  };
  const handleCancelUser = () => {
    setPopupVisibleUser(false);
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

  const handleSubmitUser = (e: any) => {
    const dataTableUser = dataRef.current.props.dataSource;
    toast.success(t("Save Successfully"));
    setTimeout(() => {
      setPopupVisibleUser(false);
    }, 1500);
  };

  const handleSubmitPopup = (e: any) => {
    validateRef.current.instance.validate();
    const dataFormS = new FormData(formRef.current);
    const dataSaveForm: any = Object.fromEntries(dataFormS.entries()); // chuyển thành form chính
    const dataTableUser = dataRef.current.props.dataSource;
    const dataSave = {
      ...dataSaveForm,
      Lst_Sys_UserInGroup: Array.from(
        new Set(dataRef.current.props.dataSource)
      ).map((item: any) => {
        return {
          GroupCode: dataSaveForm.GroupCode,
          UserCode: item.UserCode,
        };
      }),
      Lst_Sys_Access: selectItem.map((item: any) => {
        return {
          GroupCode: dataSaveForm.GroupCode,
          ObjectCode: item.ObjectCode,
        };
      }),
    };
    if (flagCheckCRUD) {
      onCreate(dataSave);
    } else {
      onEdit(dataSave);
    }
  };

  const handleDatatable = (e: any) => {
    setTotal(e.component.totalCount());
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
    if (item.dataField === "GroupCode" && flagCheckCRUD === false) {
      item.editorOptions.readOnly = true;
    }
    return item;
  }
  function handleFieldDataChanged(changedData: any) {
    // Handle the changed field data
    // setValue(changedData.value);
  }

  const removeAllSelectedItem = () => {
    dataGrid.current.instance.deselectAll();
    setSelectItems([]);
  };

  const removeSelectedItem = (item: any) => {
    const filteredAbc = backUpColumns.current.filter((value: any) => {
      return ![item].some((elementBcd) => {
        return JSON.stringify(value) === JSON.stringify(elementBcd);
      });
    });

    backUpColumns.current = filteredAbc;
    // // uuncheckRow
    dataGrid.current.instance.deselectRows(item?.ObjectCode);
    //  thực hiện xóa những thứ thêm
    // I need remove item from the selectedItems array
    const changesCheck = [...selectItem];
    changesCheck.splice(selectItem.indexOf(item), 1);
    setSelectItems(changesCheck);
  };

  const handleChangeOrder = ({ toIndex, fromIndex }: any) => {
    const changes = [...selectItem];
    changes.splice(toIndex, 0, changes.splice(fromIndex, 1)[0]);
    setSelectItems(changes);
  };

  const handleSelectionChanged = (e: any) => {
    // thêm
    setSelectItems(
      Array.from(new Set([...e.selectedRowsData, ...backUpColumns.current])) // lọc trùng dữ liệu
    );
  };

  // console.log(255, dataTable);
  const onEditorPreparing = (e: any) => {
    if (e.dataField === "Email") {
      // console.log(255, e);
      // e.editorOptions.dataSource = e.editorOptions.dataSource?.filter(
      //   (item: any) => {
      //     return !dataTable?.some(
      //       (newItem: any) => newItem?.UserCode === item?.UserCode
      //     );
      //   }
      // );
      // console.log(
      //   254,
      //   e.editorOptions.dataSource.filter((item: any) => {
      //     return !dataTable.some(
      //       (newItem: any) => newItem.UserCode === item.UserCode
      //     );
      //   })
      // );
    }
  };

  return (
    <Popup
      visible={popupVisible}
      showTitle={true}
      title={title}
      width={870}
      onHiding={handleCancel}
      showCloseButton={true}
      hideOnOutsideClick={true}
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
          <div className="absolute top-[173px] left-[125px]">
            {flagCheckCRUD ? t(`Đã thêm ${total} thành viên`) : ""}
          </div>
          <div className={"flex w-full mt-4 gap-2 max-h-[800px]"}>
            {detailForm ? (
              ""
            ) : (
              <div className="w-[50%]">
                <div className="px-4 pb-2 ">
                  {`${t("Chức năng chưa gán nhóm")} (${
                    !!dataUnassigned ? dataUnassigned.length : 0
                  })`}
                </div>
                <DataGrid
                  id="grid-container"
                  ref={dataGrid}
                  // loadPanel={isLoading}
                  dataSource={dataUnassigned}
                  noDataText={t("Loading")}
                  showBorders={false}
                  keyExpr={"ObjectCode"}
                  onSelectionChanged={handleSelectionChanged}
                >
                  <Paging enabled={true} />
                  <FilterRow visible={true} />
                  <Selection mode="multiple" selectAllMode={"page"} />
                  {actualColumns.map((col: any) => (
                    <Column key={col.dataField} {...col} />
                  ))}
                </DataGrid>
              </div>
            )}
            <div className={detailForm ? "w-[80%] m-auto" : "w-[50%]"}>
              <div className="px-4 pb-2 flex  items-center justify-between">
                <div className="px-4">
                  {`${t("Chức năng đã gán nhóm")} (${
                    !!selectItem ? selectItem?.length : 0
                  })`}
                </div>
                {detailForm ? (
                  ""
                ) : (
                  <div className="cursor-pointer text-[#FF0000] pr-1">
                    <span
                      className="text-red"
                      onClick={() => removeAllSelectedItem()}
                    >
                      {t("RemoveAll")}
                    </span>
                  </div>
                )}
              </div>
              <div className="border-b px-[38px] py-2">
                <div
                  className={`flex items-center ${
                    detailForm ? "justify-start" : "justify-between"
                  } `}
                >
                  {actualColumns.map((col: any) => (
                    <div className="text-[13px] font-bold" key={col.dataField}>
                      {t(`${col.dataField}`)}
                    </div>
                  ))}
                  <div></div>
                </div>
              </div>
              <List
                dataSource={selectItem}
                keyExpr="ObjectCode"
                itemDragging={{
                  allowReordering: true,
                  rtlEnabled: true,
                }}
                // onPageLoading={}
                pageLoadMode={"scrollBottom"}
                itemRender={(item: any) => {
                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: detailForm
                            ? "flex-end"
                            : " space-between",
                        }}
                        className="py-1"
                      >
                        {detailForm ? (
                          ""
                        ) : (
                          <div onClick={() => removeSelectedItem(item)}>
                            <Icon
                              style={{ paddingTop: "-10px" }}
                              name={"remove"}
                              color={"#FF0000"}
                              size={10}
                            />
                          </div>
                        )}
                        <div className="truncate">{item?.ObjectCode}</div>
                      </div>
                    </>
                  );
                }}
                onItemReordered={handleChangeOrder}
              />
            </div>
          </div>
        </form>
        <Popup
          visible={popupVisibleUser}
          onHiding={handleCancelUser}
          showCloseButton={true}
          hideOnOutsideClick={true}
          dragEnabled={true}
          showTitle={true}
          title="Information"
          container=".dx-viewport"
          width={850}
          height={400}
          toolbarItems={[
            {
              toolbar: "bottom",
              location: "after",
              widget: "dxButton",
              visible: !detailForm,
              options: {
                text: t("Save"),
                stylingMode: "contained",
                type: "default",
                useSubmitBehavior: true,
                onClick: handleSubmitUser,
              },
            },
            {
              toolbar: "bottom",
              location: "after",
              widget: "dxButton",
              visible: detailForm,
              options: {
                text: t("Cancel"),
                stylingMode: "contained",
                type: "default",
                useSubmitBehavior: true,
                onClick: handleCancelUser,
              },
            },
          ]}
        >
          <DataGrid
            ref={dataRef}
            id="gridContainer"
            dataSource={dataTable}
            keyExpr="UserCode"
            // key={viewingItem?.rowIndex}
            onEditorPreparing={onEditorPreparing}
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
        </Popup>
      </ScrollView>
    </Popup>
  );
};
