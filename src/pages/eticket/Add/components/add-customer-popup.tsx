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
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import NavNetworkLink from "@/components/Navigate";
import { checkEmail } from "@/components/fields/EmailField";
import { GroupField } from "@/components/fields/GroupField";
import { checkPhone } from "@/components/fields/PhoneField";
import { useNetworkNavigate } from "@/packages/hooks";
import { getListField } from "@/utils/customer-common";
import { customerPopup } from "./form-settings";

const AddCustomerPopup = ({ setValue, value }: any) => {
  const navigate = useNetworkNavigate();

  const { t } = useI18n("Mst_Customer");
  const api = useClientgateApi();
  const ref = useRef(null);
  const auth = useAtomValue(authAtom);
  const showError = useSetAtom(showErrorAtom);
  const formRef: any = useRef(null);
  const [dynamicFields, setDynamicFields] = useState<any>([]);
  const [formValue, setFormValue] = useState<any>({});

  const setCustomerPopup = useSetAtom(customerPopup);

  const [loading, setLoading] = useState<boolean>(true);

  const {
    data: listCodeField,
    isLoading: isLoadingCodeField,
    refetch: refetchCodeField,
  } = useQuery({
    queryKey: ["CustomerEditPage_ListCodeField"],
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
    queryKey: ["CustomerEditPage_ListDynamic", dynamicFields],
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
    queryKey: ["CustomerEditPage_ListGroupCode"],
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

  // console.log(listCodeField, listDynamic, listGroupCode, getValueItem);

  const { data: getCustomerCodeSysSeq, refetch: refetchSeq } = useQuery(
    ["GetCustomerCodeSysSeq"],
    async () => {
      const resp: any = await api.Seq_GetCustomerCodeSys();

      setFormValue({ ...formValue, CustomerCode: resp?.Data ?? undefined });

      return resp?.Data;
    }
  );

  useEffect(() => {
    Promise.all([
      refetchCodeField(),
      refetchDynamic(),
      refetchGroupCode(),
      refetchSeq(),
    ]).then(() => {
      setLoading(false);
    });
  }, []);

  const getFormField = useMemo(() => {
    if (!isLoadingCodeField && !isLoadingGroupCode) {
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
  }, [
    isLoadingCodeField,
    isLoadingGroupCode,
    listDynamic,
    listGroupCode,
    listCodeField,
  ]);

  const handleAdd = async () => {
    if (!checkPhone(formValue["CtmPhoneNo"] ?? [])) {
      toast.error("Vui lòng kiểm tra lại Số điện thoại!");
      return;
    }

    if (!checkEmail(formValue["CtmEmail"] ?? [])) {
      toast.error("Vui lòng kiểm tra lại Email!");
      return;
    }

    if (formRef.current.validate().isValid) {
      const dynamicField = listCodeField
        ?.filter((item: any) => item.FlagIsColDynamic === "1")
        .map((item: any) => item.ColCodeSys);
      const staticField = listCodeField
        ?.filter((item: any) => item.FlagIsColDynamic !== "1")
        .map((item: any) => item.ColCodeSys);

      const getStaticValue = staticField
        ?.filter(
          (item: any) =>
            item != "CustomerGrpCode" && item != "mpt_PartnerTypeName"
        )
        ?.reduce((acc: any, item: any) => {
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

      const param = {
        ...getStaticValue,
        OrgID: auth.orgId,
        NetworkID: auth.networkId,
        JsonCustomerInfo: getDynamicValue?.length
          ? JSON.stringify(getDynamicValue)
          : null,
      };

      const customerGroup =
        formValue["CustomerGrpCode"]?.map((item: any) => {
          return {
            OrgID: auth.orgId,
            CustomerGrpCode: item,
          };
        }) ?? [];

      const partnerType =
        formValue["PartnerType"]?.map((item: any) => {
          return {
            OrgID: auth.orgId,
            PartnerType: item,
          };
        }) ?? [];

      const response = await api.Mst_Customer_Create({
        data: param,
        ZaloUserFollower: formValue["ZaloUserFollowerId"] ?? [],
        CustomerGroup: customerGroup ?? [],
        Email: formValue["CtmEmail"] ?? [],
        Phone: formValue["CtmPhoneNo"] ?? [],
        ScrTplCodeSys: "SCRTPLCODESYS.2023",
        PartnerType: partnerType,
      });
      if (response.isSuccess) {
        toast.success(t("Thêm thành công"));
        setValue({ ...value, CustomerCodeSys: response?.Data });
        setCustomerPopup(false);
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
      }
    } else {
      toast.error("Vui lòng nhập đủ trường!");
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
        <div className="header flex justify-between items-center w-full px-2 py-2">
          <div className="breakcrumb flex gap-1">
            <NavNetworkLink to="/customer" className="text-black">
              Khách hàng
            </NavNetworkLink>

            <p>{`>`}</p>
            <p>Thêm mới khách hàng</p>
          </div>
          <div className="flex gap-3">
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
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <LoadPanel
          container={".dx-viewport"}
          shadingColor="rgba(0,0,0,0.4)"
          position={"center"}
          visible={
            isLoadingCodeField ||
            isLoadingGroupCode ||
            isLoadingDynamic ||
            loading
          }
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
              {getFormField?.map((item: any) => {
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

export default AddCustomerPopup;
