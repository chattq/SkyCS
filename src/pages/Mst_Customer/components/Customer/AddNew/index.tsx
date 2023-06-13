import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { authAtom, showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, LoadPanel, Switch } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style.scss";
import { GroupField } from "./GroupField";
import { nanoid } from "nanoid";
import { fakeValue } from "./value";
import { GroupItem, IItemProps } from "devextreme-react/form";
import {
  mapCustomOptions,
  mapEditorOption,
  mapEditorType,
  mapValidationRules,
} from "@/pages/Mst_Customer/components/Customer/AddNew/util";
import { toast } from "react-toastify";
import { MdMetaColGroupSpec } from "@/packages/types";
import { flagCustomer } from "../store";
import { useI18n } from "@/i18n/useI18n";
import { useParams } from "react-router-dom";
const Customer_AddNew = () => {
  const param = useParams();
  const { t } = useI18n("Mst_Customer");
  const api = useClientgateApi();
  const ref = useRef(null);
  const auth = useAtomValue(authAtom);
  const showError = useSetAtom(showErrorAtom);
  const formRef: any = useRef(null);
  const [dynamicFields, setDynamicFields] = useState<any>([]);
  const [formValue, setFormValue] = useState<any>({});
  const flagCustomerValue = useAtomValue(flagCustomer);
  const {
    data: listCodeField,
    isLoading: isLoadingCodeField,
    refetch: refetchCodeField,
  } = useQuery({
    queryKey: ["ListCodeField"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search({});
      if (response.isSuccess) {
        if (response?.DataList) {
          const listDynamicFields: any[] = response?.DataList.filter(
            (item: MdMetaColGroupSpec) => item?.ColDataType === "MASTERDATA"
          ).map((item: MdMetaColGroupSpec) => item?.ColCodeSys);
          if (listDynamicFields.length) {
            // console.log("dynamicFields ", dynamicFields);
            setDynamicFields(listDynamicFields);
          }
        }

        return response.DataList;
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
      }
    },
  });

  const {
    data: listDynamic,
    isLoading: isLoadingDynamic,
    refetch: refetchDynamic,
  } = useQuery({
    queryKey: ["ListDynamic", dynamicFields],
    queryFn: async () => {
      if (dynamicFields.length) {
        const response = await api.MDMetaColGroupSpec_GetListOption(
          dynamicFields
        );
        if (response.isSuccess) {
          return response.DataList?.reduce((result, item) => {
            result[item.ColCodeSys] = item.Lst_MD_OptionValue;
            return result;
          }, {} as { [key: string]: any[] });
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
        }
      } else {
        return {};
      }
    },
  });
  // console.log("listDynamic", listDynamic);
  const {
    data: listGroupCode,
    isLoading: isLoadingGroupCode,
    refetch: refetchGroupCode,
  } = useQuery({
    queryKey: ["listGroupCode"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupApi_Search({});
      if (response.isSuccess) {
        return response.DataList;
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
      }
    },
  });

  const {
    data: getCustomerValueFollowParam,
    isLoading: isLoadingCustomerValue,
    refetch,
  } = useQuery({
    queryKey: ["CustomerValue", param],
    queryFn: async () => {
      if (param && param?.CustomerCodeSys) {
        const response = await api.Mst_Customer_Search({
          CustomerCodeSys: param.CustomerCodeSys,
        });
        if (response.isSuccess) {
          const getStaticField = listCodeField
            ?.filter((item: any) => item.FlagIsColDynamic !== "1")
            .map((item: any) => item.ColCodeSys);

          if (response.DataList?.length) {
            const customer = response.DataList[0];
            const valueJson = JSON.parse(customer.JsonCustomerInfo).reduce(
              (acc: any, item: any) => {
                return {
                  ...acc,
                  CustomerAvatarPath: customer["CustomerAvatarPath"] ?? null,
                  CUSTOMERAVATARPATH: customer["CustomerAvatarPath"] ?? null,
                  CustomerAvatarName: customer["CustomerAvatarName"] ?? null,
                  CUSTOMERAVATARNAME: customer["CustomerAvatarName"] ?? null,
                  CUSTOMERCODE: customer["CustomerCode"],
                  CustomerCode: customer["CustomerCode"],
                  CUSTOMERNAME: customer["CustomerName"],
                  CustomerName: customer["CustomerName"],
                  CUSTOMERNAMEEN: customer["CustomerNameEN"] ?? null,
                  CustomerNameEN: customer["CustomerNameEN"] ?? null,
                  [item.ColCodeSys]: item.ColValue ?? "",
                };
              },
              {}
            );
            const obj = {
              ...response.DataList[0],
              ...valueJson,
            };
            console.log("obj ", obj);
            setFormValue(obj);
          }
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
        }
      } else {
        return [];
      }
    },
  });

  const getFormField = useCallback(() => {
    if (!isLoadingCodeField && !isLoadingGroupCode) {
      // console.log("=================================", listDynamic);
      const listField = listCodeField?.map((field: any) => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          groupKeys: field.ColGrpCodeSys,
          dataField: field.ColCodeSys,
          editorType: mapEditorType(field.ColDataType!),
          label: {
            text: field.ColCaption,
          },
          validationMessagePosition: "bottom",
          editorOptions: mapEditorOption(field, listDynamic ?? {}),
          validationRules: mapValidationRules(field),
          ...mapCustomOptions(field),
        };
      });

      const buildDynamicForm = listGroupCode?.map((groupItem: any) => {
        return {
          colCount: 1,
          labelLocation: "left",
          caption: groupItem?.ColGrpName ?? "",
          // labelLocation: "left",
          items: [
            {
              itemType: "group",
              colCount: 2,
              items: listField
                ?.filter((item) => item.groupKeys === groupItem.ColGrpCodeSys)
                .sort(function (a: any, b: any) {
                  return a.OrderIdx - b.OrderIdx;
                }),
              caption: groupItem.ColGrpName ?? "",
              cssClass: "collapsible form-group",
            },
          ],
        };
      });
      return buildDynamicForm;
    } else {
      return [];
    }
  }, [isLoadingCodeField, isLoadingGroupCode, listDynamic]);

  useEffect(() => {
    refetchCodeField();
    refetchGroupCode();
    refetchDynamic();
  }, []);

  const handleSave = async () => {
    if (formRef.current.validate().isValid) {
      const dynamicField = listCodeField
        ?.filter((item: any) => item.FlagIsColDynamic === "1")
        .map((item: any) => item.ColCodeSys);
      const staticField = listCodeField
        ?.filter((item: any) => item.FlagIsColDynamic !== "1")
        .map((item: any) => item.ColCodeSys);

      const getStaticValue = staticField?.reduce((acc, item) => {
        return {
          ...acc,
          [item]: formValue[item],
        };
      }, {});
      const getDynamicValue = dynamicField
        ?.map((item) => {
          if (formValue[item]) {
            return {
              ColCodeSys: item,
              ColValue: formValue[item] ?? null,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item);

      const param = {
        ...getStaticValue,
        OrgID: auth.orgId,
        NetworkID: auth.networkId,
        JsonCustomerInfo: getDynamicValue?.length
          ? JSON.stringify(getDynamicValue)
          : null,
      };

      if (flagCustomerValue === "add") {
        console.log("param ", param);
        const response = await api.Mst_Customer_Create(
          param,
          "SCRTPLCODESYS.2023"
        );
        if (response.isSuccess) {
          toast.success(t("Thêm thành công"));
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
        }
      } else {
        console.log("getStaticField ", getStaticValue);

        const value = getDynamicValue?.map((item: any) => {
          return item.ColCodeSys;
        });

        // const valueStatic = getStaticValue
        const objParam = {
          OrgID: auth.orgId,
          NetworkID: auth.networkId,
          CustomerCodeSys: formValue.CustomerCodeSys,
          CustomerCode: formValue["CUSTOMERCODE"],
          CustomerName: formValue["CUSTOMERNAME"],
          CustomerAvatarName: formValue["CUSTOMERAVATARNAME"] ?? null,
          CustomerAvatarPath: formValue["CUSTOMERAVATARPATH"] ?? null,
          CustomerNameEN: formValue["CUSTOMERNAMEEN"] ?? null,
          ...param,
        };

        delete objParam.CUSTOMERCODE;
        delete objParam.CUSTOMERAVATARNAME;
        delete objParam.CUSTOMERAVATARPATH;
        delete objParam.CUSTOMERNAMEEN;
        delete objParam.CUSTOMERNAME;

        console.log("formValue", formValue);
        console.log("value param ", param);
        console.log("objParam ", objParam);

        const response = await api.Mst_Customer_Update(
          objParam,
          value ?? [],
          "SCRTPLCODESYS.2023"
        );
        if (response.isSuccess) {
          toast.success("Customer updated successfully");
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
        }
      }
    } else {
      toast.error("Vui lòng nhập đủ trường");
    }
  };

  const handleInitialization = (e: any) => {
    formRef.current = e.component;
  };

  const handleSubmit = () => {};

  return (
    <AdminContentLayout className={"province-management"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header d-flex justify-space-between">
          <div className="breakcrumb">
            <p>{t("Mst_Customer")}</p>
            <p>{`>`}</p>
            <p>
              {flagCustomerValue === "add"
                ? t("Add new Customer")
                : t("Update Customer")}
            </p>
          </div>
          <div className="list-button">
            <Button onClick={handleSave}>Lưu</Button>
            <Button>Lưu & Tạo Mới</Button>
            <Button>Hủy Bỏ</Button>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <LoadPanel
          container={".dx-viewport"}
          shadingColor="rgba(0,0,0,0.4)"
          position={"center"}
          visible={isLoadingCodeField || isLoadingGroupCode || isLoadingDynamic}
          showIndicator={true}
          showPane={true}
        />
        {!(isLoadingCodeField || isLoadingGroupCode || isLoadingDynamic) && (
          <form ref={ref} className="overflow-auto" onSubmit={handleSubmit}>
            <Form
              className="form-test"
              formData={formValue}
              validationGroup="customerData"
              onInitialized={handleInitialization}
              showValidationSummary={true}
            >
              {getFormField()?.map((item: any) => {
                return (
                  <GroupItem
                    key={nanoid()}
                    render={({}) => {
                      return (
                        <GroupField
                          item={item}
                          formData={formValue}
                          disableCollapsible={item.disableCollapsible}
                        />
                      );
                    }}
                  />
                );
              })}
            </Form>
          </form>
        )}
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Customer_AddNew;
