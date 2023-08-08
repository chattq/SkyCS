import { useI18n } from "@/i18n/useI18n";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  dataFormAtom,
  dataFuntionAtom,
  dataTableAtom,
  dataTableUserAtom,
  dataUserAtom,
  flagEdit,
  showDetail,
  showInfoObjAtom,
  viewingDataAtom,
} from "@/pages/Sys_Group/components/store";
import { showPopup } from "@/pages/Sys_Group/components/store";
import {
  Button,
  CheckBox,
  Form,
  List,
  LoadPanel,
  Popup,
  ScrollView,
} from "devextreme-react";
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
import { authAtom, showErrorAtom } from "@/packages/store";
import { Icon } from "@/packages/ui/icons";
import { showPopupUser } from "@/pages/User_Mananger/components/store";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";

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
  let gridRef: any = useRef<any>(null);
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
  const [dataTable, setDataTable] = useAtom(dataTableUserAtom);
  const [dataForm, setDataForm] = useAtom(dataFormAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const [dataUser, setDataUser] = useAtom(dataUserAtom);
  const [userSelect, setUserSelect] = useAtom(dataTableAtom);

  const [hidenPopupAddUser, setHidenPopupAddUser] = useState(false);
  const [hidenTableInfor, setHidenTableInfor] = useState(false);
  const auth = useAtomValue(authAtom);

  const setPopupVisibleUser = useSetAtom(showPopupUser);
  const dataGrid = useRef<any>(null);

  const api = useClientgateApi();
  const { data: listGroup } = useQuery(
    ["listUserDeparment", viewingItem.item?.GroupCode],
    () => api.Sys_GroupController_GetByGroupCode(viewingItem.item?.GroupCode)
  );

  const [selectItem, setSelectItems] = useState<any>([]);

  const backUpColumns = useRef<any>();

  const {
    data: listUser,
    isLoading,
    refetch,
  } = useQuery(["listDataUser"], () => api.Sys_User_GetAllActive());

  useEffect(() => {
    if (listUser && flagCheckCRUD === true) {
      setDataUser(
        listUser?.DataList?.filter(
          (item) => item.OrgID === auth.orgId.toString()
        )
      );
    }
    if (listUser && flagCheckCRUD === false) {
      setDataUser(
        listUser?.DataList?.filter(
          (item) =>
            !dataTable.some(
              (arrItem: any) => arrItem.UserCode === item.UserCode
            )
        ).filter((item) => item.OrgID === auth.orgId.toString())
      );
    }
  }, [listUser, flagCheckCRUD]);

  useEffect(() => {
    if (dataFuntion && showInfoObj === false) {
      setSelectItems(dataFuntion);
      // backUpColumns.current = dataFuntion;
      dataGrid.current?.instance.selectRows(
        dataFuntion.map((item: any) => item.ObjectCode)
      );
    }
    if (showInfoObj === true) {
      setSelectItems([]);
      backUpColumns.current = [];
      // setDataTable([]);
    }

    if (listGroup?.Data && detailForm === true) {
      setSelectItems(listGroup?.Data?.Lst_Sys_Access);
      setDataTable(
        listGroup?.Data?.Lst_Sys_UserInGroup?.map((item: any) => {
          return {
            EMail: item.UserCode,
            UserName: item.su_UserName,
            PhoneNo: item.PhoneNo,
            UserCode: item.UserCode,
          };
        })
      );
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
    setHidenPopupAddUser(false);
  };

  const handleSubmitUser = (e: any) => {
    toast.success(t("Save User Successfully"));
    setDataTable(userSelect.concat(dataTable));
    setTimeout(() => {
      setHidenPopupAddUser(false);
    }, 1000);
  };

  const handleSubmitPopup = (e: any) => {
    validateRef.current.instance.validate();
    const dataFormS = new FormData(formRef.current);
    const dataSaveForm: any = Object.fromEntries(dataFormS.entries()); // chuyển thành form chính
    const dataSave = {
      ...dataSaveForm,
      Lst_Sys_UserInGroup: dataTable.map((item: any) => {
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

  const customizeItem = useCallback(
    (item: any) => {
      if (item.dataField === "GroupCode") {
        if (flagCheckCRUD === false) {
          item.editorOptions.readOnly = true;
        } else {
          item.editorOptions.readOnly = false;
        }
      }
      if (item.dataField === "FlagActive" && flagCheckCRUD === true) {
        item.editorOptions.value = true;
      }
    },
    [flagCheckCRUD]
  );

  function handleFieldDataChanged(changedData: any) {
    // Handle the changed field data
    // setValue(changedData.value);
  }

  const removeAllSelectedItem = () => {
    dataGrid.current.instance.deselectAll();
    setSelectItems([]);
  };

  const removeSelectedItem = (item: any) => {
    // const filteredAbc = backUpColumns.current.filter((value: any) => {
    //   return ![item].some((elementBcd) => {
    //     return JSON.stringify(value) === JSON.stringify(elementBcd);
    //   });
    // });

    // backUpColumns.current = filteredAbc;
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
      Array.from(new Set([...e.selectedRowsData])) // lọc trùng dữ liệu
    );
  };

  const handleSearchUser = (e: any) => {
    setDataUser(
      listUser?.DataList?.filter((item: any) => {
        return item.UserName.toLowerCase().includes(
          e.target.value.toLowerCase()
        );
      }).filter((item) => item.OrgID === auth.orgId.toString())
    );
  };
  const handleChooseUser = (user: any, userCode: any, check: any) => {
    if (check) {
      setUserSelect([...userSelect, user]);
    } else {
      setUserSelect(userSelect?.filter((e: any) => e.UserCode !== userCode));
    }
  };
  const handleAddUser = () => {
    setHidenPopupAddUser(true);
    setDataUser(
      listUser?.DataList?.filter(
        (item) =>
          !dataTable.some((arrItem: any) => arrItem.UserCode === item.UserCode)
      ).filter((item) => item.OrgID === auth.orgId.toString())
    );
  };

  const handleHiddenTableInfor = () => {
    setHidenTableInfor(false);
  };
  const handleCheckNumberUser = () => {
    setHidenTableInfor(true);
  };
  const handleDeleteRow = (e: any) => {
    const dataRow = e.row.data;
    setDataUser(dataUser.concat(dataRow));
    setDataTable(
      dataTable?.filter((item: any) => item?.UserCode !== e.row.key.UserCode)
    );
    setUserSelect(
      userSelect?.filter((item: any) => item?.UserCode !== e.row.key.UserCode)
    );
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
          <div className="flex items-center mt-4 px-2 mb-2 gap-4">
            {detailForm ? (
              ""
            ) : (
              <div
                onClick={handleAddUser}
                className="bg-[#008016] cursor-pointer px-2 text-[white] py-1 rounded-sm"
              >
                {t("Thêm thành viên")}
              </div>
            )}
            <div
              onClick={handleCheckNumberUser}
              className="text-[#008016] cursor-pointer"
            >
              {t("Số lượng nhân viên:") +
                "  " +
                `${
                  dataTable?.filter(
                    (value: any, index: any, self: any) =>
                      self.indexOf(value) === index
                  )?.length
                }`}
            </div>
          </div>
          <div className={"flex w-full mt-4 gap-2 max-h-[800px]"}>
            {detailForm ? (
              ""
            ) : (
              <div className="w-[50%]">
                <div className="px-4 pb-2 ">
                  {`${t("Chức năng chưa gán nhóm")} (${
                    !!dataUnassigned ? dataUnassigned?.length : 0
                  })`}
                </div>
                <DataGrid
                  id="grid-container"
                  ref={dataGrid}
                  // loadPanel={isLoading}
                  dataSource={dataUnassigned ?? []}
                  noDataText={t("Loading")}
                  showBorders={false}
                  keyExpr={"ObjectCode"}
                  onSelectionChanged={handleSelectionChanged}
                  // defaultSelectedRowKeys={[
                  //   "BTN_ADMIN_BUSINESS_INFORMATION_CREATE",
                  // ]}
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
                          <div
                            onClick={() => removeSelectedItem(item)}
                            className="pr-2"
                          >
                            <Icon
                              style={{ paddingTop: "-10px" }}
                              name={"remove"}
                              color={"#FF0000"}
                              size={10}
                            />
                          </div>
                        )}
                        <div className="truncate">
                          {item?.so_ObjectName || item?.ObjectName}
                        </div>
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
          visible={hidenPopupAddUser}
          onHiding={handleCancelUser}
          showCloseButton={true}
          hideOnOutsideClick={true}
          // dragEnabled={true}
          showTitle={true}
          title={t("Thông tin các nhân viên")}
          container=".dx-viewport"
          width={850}
          height={600}
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
              visible: !detailForm,
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
          <LoadPanel visible={dataUser} position={{ of: "#gridContainer" }} />
          <div>
            <div className="mb-3">
              <input
                className="h-[30px] w-full text-[14px]"
                type="text"
                placeholder={t("Nhập khóa để tìm kiếm ...")}
                onChange={(e) => handleSearchUser(e)}
              />
            </div>

            {dataUser?.map((item: any) => {
              return (
                <div>
                  <div
                    key={item.UserCode}
                    className="flex items-center border-b border-t py-2 px-2"
                  >
                    {detailForm ? (
                      ""
                    ) : (
                      <div className="mr-4">
                        <CheckBox
                          data-key={item.UserCode}
                          onValueChanged={(e) =>
                            handleChooseUser(item, item.UserCode, e.value)
                          }
                        />
                      </div>
                    )}
                    <div className="flex w-[95%] items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                          <img
                            src={
                              item?.Avatar !== null
                                ? item?.Avatar
                                : "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180"
                            }
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-2">
                          <div className="mb-1 h-[17px] truncate">
                            {item.UserName ?? "---"}
                          </div>
                          <div className="h-[20px] truncate">
                            {item.ACEmail ?? "---"}
                          </div>
                        </div>
                      </div>
                      <div>{item.PhoneNo}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Popup>
        <Popup
          visible={hidenTableInfor}
          onHiding={handleHiddenTableInfor}
          showCloseButton={true}
          hideOnOutsideClick={true}
          // dragEnabled={true}
          showTitle={true}
          title={t("Các nhân viên đã thêm")}
          container=".dx-viewport"
          width={750}
          height={400}
          toolbarItems={[]}
        >
          <form ref={gridRef} className="listUser_Department">
            <GridViewCustomize
              isShowIconEdit={false}
              cssClass={"listUser_Department h-full"}
              isLoading={isLoading}
              dataSource={dataTable.filter(
                (value: any, index: any, self: any) =>
                  self.indexOf(value) === index
              )}
              columns={
                formSettings.filter(
                  (item: any) => item.typeForm === "TableForm"
                )[0].items
              }
              keyExpr={["UserCode", "OrgID"]}
              formSettings={formSettings}
              onReady={(ref) => (gridRef = ref)}
              allowSelection={false}
              onSelectionChanged={() => {}}
              onSaveRow={() => {}}
              onEditorPreparing={() => {}}
              onEditRowChanges={() => {}}
              onDeleteRows={handleDeleteRow}
              onEditRow={() => {}}
              storeKey={"List-usertable-columns"}
              isShowEditting={detailForm === true ? false : true}
              isSingleSelection={false}
              isHidenHeaderFilter={false}
              isHiddenCheckBox={true}
              customToolbarItems={[]}
            />
          </form>
        </Popup>
      </ScrollView>
    </Popup>
  );
};
