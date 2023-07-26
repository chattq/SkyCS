import { useI18n } from "@/i18n/useI18n";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import {
  Button,
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
import { logger } from "@/packages/logger";
import {
  AvatarData,
  avatar,
  checkDataPopPup,
  dataFormAtom,
  dataTableAtom,
  fileAtom,
  flagEdit,
  showDetail,
  showPopup,
} from "./store";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { viewingDataAtom } from "@/pages/User_Mananger/components/store";
import UploadAvatar from "./UploadAvatar";
import { Icon } from "@/packages/ui/icons";
import { authAtom } from "@/packages/store";

export interface DealerPopupViewProps {
  onEdit: any;
  formSettings: any;
  title: string;
  onCreate: any;
}

export const PopupView = ({
  onEdit,
  onCreate,
  formSettings,
  title,
}: DealerPopupViewProps) => {
  const popupVisible = useAtomValue(showPopup);
  const flagCheckCRUD = useAtomValue(flagEdit);
  const formRef = useRef<any>();
  const ref = useRef<any>();
  const validateRef = useRef<any>();
  const { t } = useI18n("Common");
  const dataRef = useRef<any>(null);
  const detailForm = useAtomValue(showDetail);
  const [viewingItem, setViewingItem] = useAtom(viewingDataAtom);
  const [dataTable, setDataTable] = useAtom(dataTableAtom);
  const [dataForm, setDataForm] = useAtom(dataFormAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setFile = useSetAtom(fileAtom);
  const [value, setValue] = useState<any>("");
  const [derpartmentTag, setDerpartmentTag] = useState([]);
  const [groupTag, setGroupTag] = useState([]);
  const [avt, setAvt] = useAtom(avatar);
  const auth = useAtomValue(authAtom);
  const api = useClientgateApi();

  const [changePassWord, setChangePassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const { data: listUserActive } = useQuery(
    ["listMst_DepartmentControl"],
    () => api.Sys_User_GetAllActive() as any
  );
  const { data: dataMST } = useQuery(
    ["MSTController"],
    () => api.Mst_NNTController_GetOrgCode(auth.orgId.toString()) as any
  );

  const handleCancel = () => {
    setFile(undefined);
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

  const handleSubmitPopup = useCallback(
    async (e: any) => {
      validateRef.current.instance.validate();
      const dataFormSub = new FormData(formRef.current);
      const dataSaveForm: any = Object.fromEntries(dataFormSub.entries()); // chuyển thành form chính
      const repsUpload = await api.SysUserData_UploadFile(avt);
      const dataSave = {
        ...dataSaveForm,
        Avatar: repsUpload?.Data?.FileUrlFS ?? "",
        UserPassword: flagCheckCRUD
          ? dataSaveForm.UserPassword ?? ""
          : dataForm.UserPassword,
        UserCode: dataSaveForm.EMail ?? "",
        // UserCode: dataSaveForm.EMail.split("@")[0] ?? "",
        Lst_Sys_UserMapDepartment:
          derpartmentTag.length !== 0
            ? derpartmentTag?.map((item: any) => {
                return {
                  UserCode: dataSaveForm.EMail,
                  // UserCode: dataSaveForm.EMail.split("@")[0] ?? "",
                  DepartmentCode: item,
                };
              })
            : dataForm?.DepartmentName?.map((item: any) => {
                return {
                  UserCode: dataSaveForm.EMail,
                  DepartmentCode: item,
                };
              }) || [],
        Lst_Sys_UserInGroup:
          groupTag.length !== 0
            ? groupTag?.map((item: any) => {
                return {
                  UserCode: dataSaveForm.EMail,
                  // UserCode: dataSaveForm.EMail.split("@")[0] ?? "",
                  GroupCode: item,
                };
              })
            : dataForm?.GroupName?.map((item: any) => {
                return {
                  UserCode: dataSaveForm.EMail,
                  GroupCode: item,
                };
              }) || [],
      };
      if (flagCheckCRUD) {
        onCreate(dataSave);
      } else {
        onEdit({
          ...dataSave,
          Avatar: repsUpload?.Data?.FileUrlFS
            ? repsUpload?.Data?.FileUrlFS
            : dataForm?.Avatar,
        });
      }
    },
    [avt, flagCheckCRUD, groupTag, derpartmentTag, dataForm]
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

  const customizeItem = useCallback(
    (item: any) => {
      // if (
      //   [
      //     "UserName",
      //     "PhoneNo",
      //     "ACLanguage",
      //     "ACTimeZone",
      //     "UserPassword",
      //     "ReUserPassword",
      //   ].includes(item.dataField)
      // ) {
      //   if (value === true) {
      //     item.editorOptions.readOnly = true;
      //   } else {
      //     item.editorOptions.readOnly = false;
      //   }
      // }

      if (
        [
          "UserName",
          "EMail",
          "PhoneNo",
          "ACLanguage",
          "ACTimeZone",
          "UserPassword",
          "ReUserPassword",
          "ACId",
        ].includes(item.dataField)
      ) {
        if (flagCheckCRUD === true) {
          item.editorOptions.readOnly = false;
        } else if (flagCheckCRUD === false) {
          item.editorOptions.readOnly = true;
        }
      }

      if (
        flagCheckCRUD === false &&
        ["UserPassword", "ReUserPassword"].includes(item.dataField)
      ) {
        item.visible = false;
      } else {
        item.visible = true;
      }
      if (flagCheckCRUD === true && ["ACId"].includes(item.dataField)) {
        item.visible = false;
      }

      // nếu tìm thấy thì ko cho sửa
      if (item.dataField === "UserName") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.dataField === "ACLanguage") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.dataField === "ReUserPassword") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.dataField === "PhoneNo") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.dataField === "UserPassword") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.dataField === "ACTimeZone") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }

      // init value mặc định
      if (item.dataField === "ACTimeZone") {
        item.editorOptions.value = "7";
      }
      if (item.dataField === "ACLanguage") {
        item.editorOptions.value = "vi";
      }
      if (item.dataField === "MST") {
        item.editorOptions.value = dataMST?.Data?.MST;
      }
    },
    [flagCheckCRUD, value, dataMST]
  );
  console.log(257, value);
  const handleFieldDataChanged = useCallback(
    async (changedData: any) => {
      // Handle the changed field data
      if (changedData.dataField === "EMail") {
        const checkUser = await api.Sys_User_CheckUser(changedData.value);
        setValue(checkUser?.Data?.FlagExist);
        if (checkUser.isSuccess && checkUser?.Data?.FlagExist) {
          setDataForm({
            EMail:
              checkUser?.Data?.FlagExist === true
                ? checkUser?.Data?.User.Email
                : changedData.value,
            UserName: checkUser?.Data?.User.Name ?? "",
            ACTimeZone: checkUser?.Data?.User.TimeZone === 7 ? "7" : "7",
            ACLanguage: checkUser?.Data?.User.Language === "vn" ? "vi" : "vi",
            PhoneNo: checkUser?.Data?.User.Phone ?? "",
            MST: dataMST?.Data?.MST,
          });
        }
      }
      if (changedData.dataField === "DepartmentName") {
        setDerpartmentTag(changedData.value);
      }
      if (changedData.dataField === "GroupName") {
        setGroupTag(changedData.value);
      }
    },
    [listUserActive?.DataList, derpartmentTag, groupTag, dataMST]
  );

  return (
    <Popup
      visible={popupVisible}
      showTitle={true}
      title={title}
      width={980}
      height={620}
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
        <LoadPanel
          visible={Boolean(dataForm)}
          position={{ of: "#gridContainer" }}
        />
        <div className="flex justify-between">
          <div>
            <UploadAvatar
              data={flagCheckCRUD ? undefined : avt}
              setAvt={setAvt}
            />
          </div>
          <div className="w-[77%]">
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
                <SimpleItem />
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
                formSettings.filter(
                  (item: any) => item.typeForm === "TableForm"
                )[0].hidden
                  ? "hidden"
                  : ""
              }`}
            >
              <DataGrid
                ref={dataRef}
                id="gridContainer"
                dataSource={dataTable}
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
          </div>
        </div>
      </ScrollView>
    </Popup>
  );
};
