import { useI18n } from "@/i18n/useI18n";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  dataFormAtom,
  dataTableAtom,
  dataTableUserAtom,
  dataUserAtom,
  flagEdit,
  showDetail,
  showPopup,
  viewingDataAtom,
} from "@/pages/Department_Control/components/store";

import {
  Button,
  CheckBox,
  Form,
  LoadPanel,
  Popup,
  RadioGroup,
  ScrollView,
  SelectBox,
  TextBox,
} from "devextreme-react";
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
import { authAtom, showErrorAtom } from "@/packages/store";
import { toast } from "react-toastify";
import { number } from "ts-pattern/dist/patterns";
import { nanoid } from "nanoid";
import { hidenMoreAtom } from "@/packages/ui/base-gridview/store/normal-grid-store";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";

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
  let gridRef: any = useRef<any>(null);
  const [popupVisible, setPopupVisible] = useAtom(showPopup);
  const flagCheckCRUD = useAtomValue(flagEdit);
  const detailForm = useAtomValue(showDetail);
  const formRef = useRef<any>();
  const validateRef = useRef<any>();
  const { t } = useI18n("Common");
  const [userSelect, setUserSelect] = useAtom(dataTableAtom);
  const dataForm = useAtomValue(dataFormAtom);
  const auth = useAtomValue(authAtom);
  const [hidenPopupAddUser, setHidenPopupAddUser] = useState(false);
  const [dataUser, setDataUser] = useAtom(dataUserAtom);
  const [dataTable, setDataTable] = useAtom(dataTableUserAtom);

  const api = useClientgateApi();

  const { data: listUser, isLoading } = useQuery(["listDataUser"], () =>
    api.Sys_User_GetAllActive()
  );

  const [removeData, setRemoveData] = useState(false);

  useEffect(() => {
    if (listUser && flagCheckCRUD === true) {
      setDataUser(listUser?.DataList);
    }
    if (listUser && flagCheckCRUD === false) {
      setDataUser(
        listUser?.DataList?.filter(
          (item) =>
            !dataTable.some(
              (arrItem: any) => arrItem.UserCode === item.UserCode
            )
        )
      );
    }
  }, [listUser, flagCheckCRUD]);

  const handleCancel = () => {
    setPopupVisible(false);
  };

  const handleSubmitPopup = useCallback(
    (e: any) => {
      validateRef.current.instance.validate();
      const dataForm = new FormData(formRef.current);
      const dataSaveForm: any = Object.fromEntries(dataForm.entries()); // chuyển thành form chính
      const dataSave = {
        Mst_Department: {
          ...dataSaveForm,
          DepartmentCode: dataSaveForm.DepartmentCode,
          FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
          OrgID: auth.orgData.Id.toString(),
        },
        Lst_Sys_UserMapDepartment: dataTable
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          )
          .map((item: any) => {
            return {
              DepartmentCode: dataSaveForm.DepartmentCode,
              UserCode: item.UserCode,
              OrgID: item.OrgID,
              FullName: item.UserName,
              Email: item.EMail,
              PhoneNo: item.PhoneNo,
            };
          }),
      };
      if (flagCheckCRUD) {
        onCreate(dataSave);
      } else {
        onEdit(dataSave);
      }
    },
    [flagCheckCRUD, dataTable]
  );

  const customizeItem = useCallback(
    (item: any) => {
      if (item.dataField === "DepartmentCode" && flagCheckCRUD === false) {
        item.editorOptions.readOnly = true;
      }
      if (item.dataField === "DepartmentCode" && flagCheckCRUD === true) {
        item.editorOptions.readOnly = false;
      }
      if (item.dataField === "DepartmentDesc" && detailForm === true) {
        item.editorOptions.readOnly = true;
      }
      if (item.dataField === "DepartmentDesc" && detailForm === false) {
        item.editorOptions.readOnly = false;
      }

      if (item.dataField === "FlagActive") {
        item.editorOptions.value = true;
      }
      return item;
    },
    [flagCheckCRUD, detailForm]
  );
  function handleFieldDataChanged(changedData: any) {
    // Handle the changed field data
    // setValue(changedData.value);
  }
  const handleChooseUser = (user: any, userCode: any, check: any) => {
    if (check) {
      setUserSelect([...userSelect, user]);
    } else {
      setUserSelect(userSelect?.filter((e: any) => e.UserCode !== userCode));
    }
  };

  const handleCancelUser = () => {
    setHidenPopupAddUser(false);
  };
  const handleSearchUser = (e: any) => {
    setDataUser(
      listUser?.DataList?.filter((item: any) => {
        return item.UserName.toLowerCase().includes(
          e.target.value.toLowerCase()
        );
      })
    );
  };

  const handleSubmitUser = (e: any) => {
    toast.success(t("Save User Successfully"));
    setDataTable(userSelect.concat(dataTable));
    setRemoveData(true);
    setTimeout(() => {
      setHidenPopupAddUser(false);
    }, 1000);
  };

  const handleAddUser = () => {
    setDataUser(
      listUser?.DataList?.filter(
        (item) =>
          !dataTable.some((arrItem: any) => arrItem.UserCode === item.UserCode)
      )
    );
    setHidenPopupAddUser(true);
  };

  const handleCheckNumberUser = () => {
    if (flagCheckCRUD === true) {
      setDataUser(userSelect);
    }
    setHidenPopupAddUser(true);
  };

  const handleDeleteRow = (e: any) => {
    setDataTable(
      dataTable?.filter((item: any) => item?.UserCode !== e.row.key.UserCode)
    );
    const dataRow = e.row.data;
    setDataUser([{ dataUser, dataRow }]);
  };

  const dataSource = [
    {
      text: t("Phân chia tự động đều cho các thành viên"),
      check: false,
    },
    {
      text: t("Giao cho User"),
      check: true,
      component: (
        <SelectBox
          dataSource={dataTable.filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          )}
          valueExpr={"UserCode"}
          displayExpr={"UserName"}
          searchEnabled={true}
        />
      ),
    },
  ];

  const renderRadioGroupItem = (itemData: any) => {
    return (
      <div>
        <div className="flex items-center gap-4">
          <span>{itemData.text}</span>
          <div>{itemData?.component}</div>
        </div>
      </div>
    );
  };
  return (
    <Popup
      visible={popupVisible}
      showTitle={true}
      title={title}
      width={870}
      height={650}
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
            text: t("Save"),
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

          <div className="flex items-center px-2 mb-2 justify-between">
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
              // onClick={handleCheckNumberUser}
              className="text-[#008016]"
            >
              {t("Số lượng nhân viên:") +
                "  " +
                `${
                  dataTable?.filter(
                    (value: any, index: any, self: any) =>
                      self.indexOf(value) === index
                  ).length
                }`}
            </div>
          </div>
        </form>
        <form ref={gridRef} className="listUser_Department">
          <GridViewCustomize
            isShowIconEdit={false}
            cssClass={"listUser_Department"}
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
            storeKey={"List-user-columns"}
            isShowEditting={detailForm === true ? false : true}
            isSingleSelection={false}
            isHidenHeaderFilter={false}
            isHiddenCheckBox={true}
            customToolbarItems={[]}
          />
        </form>
        <div>
          {dataTable?.length !== 0 ? (
            <div>
              <span className="font-bold">
                {t("Tự động giao việc eTicket trong Team")}
              </span>
              <div className="ml-3 mt-3">
                <div>
                  <RadioGroup
                    dataSource={dataSource}
                    itemRender={renderRadioGroupItem}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
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
      </ScrollView>
    </Popup>
  );
};
