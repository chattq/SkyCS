import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { authAtom, showErrorAtom } from "@/packages/store";
import { MdMetaColGroupSpec } from "@/packages/types";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, LoadPanel } from "devextreme-react";
import { GroupItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { GroupField } from "@/components/fields/GroupField";
import { useNetworkNavigate } from "@/packages/hooks";
import { getListField } from "@/utils/customer-common";

const CustomerEditPage = () => {
  const param = useParams();

  const navigate = useNetworkNavigate();

  const { t } = useI18n("Mst_Customer");
  const api = useClientgateApi();
  const ref = useRef(null);
  const auth = useAtomValue(authAtom);
  const showError = useSetAtom(showErrorAtom);
  const formRef: any = useRef(null);
  const [dynamicFields, setDynamicFields] = useState<any>([]);
  const [formValue, setFormValue] = useState<any>({});

  const {
    data: listCodeField,
    isLoading: isLoadingCodeField,
    refetch: refetchCodeField,
  } = useQuery({
    queryKey: ["ListCodeField"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search(
        {},
        "SCRTPLCODESYS.2023"
      );
      if (response.isSuccess) {
        if (response?.DataList) {
          const listDynamicFields: any[] = response?.DataList.filter(
            (item: MdMetaColGroupSpec) =>
              (item?.ColDataType === "MASTERDATA" ||
                item?.ColDataType === "MASTERDATASELECTMULTIPLE") &&
              item?.FlagActive
          ).map((item: MdMetaColGroupSpec) => item?.ColCodeSys);
          if (listDynamicFields.length) {
            setDynamicFields(listDynamicFields);
          }
        }

        return response.DataList?.filter((item: any) => item.FlagActive);
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
    data: getValueItem,
    isLoading: isLoadingValueItem,
    refetch: refetchValueItem,
  } = useQuery({
    queryKey: ["getValueItem", param],
    queryFn: async () => {
      if (param.CustomerCodeSys) {
        const response: any = await api.Mst_Customer_GetByCustomerCode([
          param.CustomerCodeSys,
        ]);

        if (response.isSuccess) {
          if (response?.Data?.Lst_Mst_Customer) {
            const firstChild = response?.Data?.Lst_Mst_Customer[0];
            const valueForm = JSON.parse(firstChild.JsonCustomerInfo);

            const obj = valueForm.reduce((acc: any, item: any) => {
              return {
                ...acc,
                [`${item.ColCodeSys}`]: item.ColValue,
              };
            }, {});

            setFormValue({
              ...obj,
              CUSTOMERCODE: response?.Data?.Lst_Mst_Customer[0]?.CustomerCode,
              CUSTOMERNAME: response?.Data?.Lst_Mst_Customer[0]?.CustomerName,
              ZaloUserFollowerId:
                response?.Data?.Lst_Mst_CustomerZaloUserFollower?.map(
                  (item: any) => {
                    return {
                      ...item,
                      id: nanoid(),
                    };
                  }
                ) ?? [],
              CtmEmail:
                response?.Data?.Lst_Mst_CustomerEmail.map((item: any) => {
                  return {
                    ...item,
                    id: nanoid(),
                  };
                }) ?? [],
              CtmPhoneNo:
                response?.Data?.Lst_Mst_CustomerPhone.map((item: any) => {
                  return {
                    ...item,
                    id: nanoid(),
                  };
                }) ?? [],
            });

            return obj;
          } else {
            return [];
          }
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
          return [];
        }
      } else {
        return [];
      }
    },
  });

  const getFormField = useCallback(() => {
    if (!isLoadingCodeField && !isLoadingGroupCode && !isLoadingValueItem) {
      // console.log("=================================", listDynamic);
      const listField = getListField({
        listField: listCodeField,
        listDynamic: listDynamic,
        customOptions: {
          editType: "update",
        },
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
                ?.filter(
                  (item: any) => item.groupKeys === groupItem.ColGrpCodeSys
                )
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
    refetchValueItem();
  }, []);

  const handleUpdate = async () => {
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

      const getDynamicValue: any = dynamicField
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

      const value: any = getDynamicValue?.map((item: any) => {
        return item.ColCodeSys;
      });

      const repsUpload = await api.SysUserData_UploadFile(formValue?.AVATAR);

      const avatarField = {
        ColCodeSys: listCodeField?.find((item: any) => item.ColCode == "AVATAR")
          ?.ColCodeSys,
        ColValue: repsUpload?.Data?.FileUrlFS,
      };

      const currentDynamicValue = [...getDynamicValue, avatarField];

      const curParam = {
        ...getStaticValue,
        OrgID: auth.orgId,
        NetworkID: auth.networkId,
        JsonCustomerInfo: currentDynamicValue?.length
          ? JSON.stringify(currentDynamicValue)
          : null,
      };

      // console.log("getStaticField ", getStaticValue);

      // const valueStatic = getStaticValue
      const objParam = {
        OrgID: auth.orgId,
        NetworkID: auth.networkId,
        CustomerCodeSys: param.CustomerCodeSys,
        CustomerCode: formValue["CUSTOMERCODE"],
        CustomerName: formValue["CUSTOMERNAME"],
        CustomerAvatarName: formValue["CUSTOMERAVATARNAME"] ?? null,
        CustomerAvatarPath: formValue["CUSTOMERAVATARPATH"] ?? null,
        CustomerNameEN: formValue["CUSTOMERNAMEEN"] ?? null,
        ...curParam,
      };

      // delete objParam.CUSTOMERCODE;
      // delete objParam.CUSTOMERAVATARNAME;
      // delete objParam.CUSTOMERAVATARPATH;
      // delete objParam.CUSTOMERNAMEEN;
      // delete objParam.CUSTOMERNAME;

      const zaloList =
        formValue["ZaloUserFollowerId"].map((item: any) => {
          return {
            ...item,
            OrgID: auth.orgId,
            CustomerCodeSys: param.CustomerCodeSys,
          };
        }) ?? [];
      const emailList =
        formValue["CtmEmail"].map((item: any) => {
          return {
            ...item,
            OrgID: auth.orgId,
            CustomerCodeSys: param.CustomerCodeSys,
          };
        }) ?? [];
      const phoneList =
        formValue["CtmPhoneNo"].map((item: any) => {
          return {
            ...item,
            OrgID: auth.orgId,
            CustomerCodeSys: param.CustomerCodeSys,
          };
        }) ?? [];

      const response = await api.Mst_Customer_Update(
        objParam,
        [...value, "ZaloUserFollowerId", "CtmEmail", "CtmPhoneNo"] ?? [],
        zaloList,
        emailList,
        phoneList,
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
    } else {
      toast.error("Vui lòng nhập đủ trường");
    }
  };

  const handleAdd = async () => {
    if (formRef.current.validate().isValid) {
      const dynamicField = listCodeField
        ?.filter((item: any) => item.FlagIsColDynamic === "1")
        .map((item: any) => item.ColCodeSys);
      const staticField = listCodeField
        ?.filter((item: any) => item.FlagIsColDynamic !== "1")
        .map((item: any) => item.ColCodeSys);

      const getStaticValue = staticField?.reduce((acc: any, item: any) => {
        return {
          ...acc,
          [item]: formValue[item],
        };
      }, {});

      const getDynamicValue: any = dynamicField
        ?.map((item: any) => {
          if (
            formValue[item] &&
            (item != "ZaloUserFollowerId" ||
              item != "CtmEmail" ||
              item != "CtmPhoneNo")
          ) {
            return {
              ColCodeSys: item,
              ColValue: formValue[item] ?? null,
            };
          } else {
            return null;
          }
        })
        .filter((item: any) => item);

      const repsUpload = await api.SysUserData_UploadFile(formValue?.AVATAR);

      const avatarField = {
        ColCodeSys: listCodeField?.find((item: any) => item.ColCode == "AVATAR")
          ?.ColCodeSys,
        ColValue: repsUpload?.Data?.FileUrlFS,
      };

      const currentDynamicValue = [...getDynamicValue, avatarField];

      const param = {
        ...getStaticValue,
        OrgID: auth.orgId,
        NetworkID: auth.networkId,
        JsonCustomerInfo: currentDynamicValue?.length
          ? JSON.stringify(currentDynamicValue)
          : null,
      };

      // console.log("param ", param);
      const response = await api.Mst_Customer_Create(
        param,
        formValue["ZaloUserFollowerId"] ?? [],
        formValue["CtmEmail"] ?? [],
        formValue["CtmPhoneNo"] ?? [],
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
      toast.error("Vui lòng nhập đủ trường");
    }
  };

  const handleInitialization = (e: any) => {
    formRef.current = e.component;
  };

  const handleSubmit = () => {};

  const handleCancel = () => {
    navigate(`/customer/list`);
  };

  return (
    <AdminContentLayout className={"province-management"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2 py-3">
          <div className="breakcrumb flex gap-1">
            <p>{t("Mst_Customer")}</p>
            <p>{`>`}</p>
            <p>{param?.type} Customer</p>
          </div>
          <div className="flex gap-3">
            {param?.type == "edit" ? (
              <Button
                onClick={handleUpdate}
                style={{
                  background: "green",
                  color: "white",
                  padding: "10px 20px",
                }}
              >
                Cập nhật
              </Button>
            ) : (
              <Button
                onClick={handleAdd}
                style={{
                  background: "green",
                  color: "white",
                  padding: "10px 20px",
                }}
              >
                Lưu
              </Button>
            )}

            <Button
              onClick={handleCancel}
              style={{
                padding: "10px 20px",
              }}
            >
              Hủy Bỏ
            </Button>
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

export default CustomerEditPage;
