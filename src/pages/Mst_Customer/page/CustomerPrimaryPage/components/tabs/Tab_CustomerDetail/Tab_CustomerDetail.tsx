import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { MdMetaColGroupSpec } from "@/packages/types";
import { useQuery } from "@tanstack/react-query";
import { Form, LoadPanel } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { GroupField } from "@/components/fields/GroupField";
import { getListField } from "@/utils/customer-common";
import { editTypeAtom } from "@/utils/store";
import { GroupItem } from "devextreme-react/form";

export const Tab_CustomerDetail = () => {
  const param = useParams();
  const { t } = useI18n("Mst_Customer");
  const api = useClientgateApi();
  const ref = useRef(null);
  const showError = useSetAtom(showErrorAtom);
  const formRef: any = useRef(null);
  const [dynamicFields, setDynamicFields] = useState<any>([]);
  const [formValue, setFormValue] = useState<any>({});

  const editType = useAtomValue(editTypeAtom);

  const { CustomerCodeSys }: any = useParams();

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
      if (param.CustomerCodeSys || true) {
        const response: any = await api.Mst_Customer_GetByCustomerCode([
          CustomerCodeSys,
        ]);

        // console.log(response);

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
          editType: editType,
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
  }, [isLoadingCodeField, isLoadingGroupCode, listDynamic, editType]);

  useEffect(() => {
    refetchCodeField();
    refetchGroupCode();
    refetchDynamic();
    refetchValueItem();
  }, []);

  const handleInitialization = (e: any) => {
    formRef.current = e.component;
  };

  const handleSubmit = () => {};

  return (
    <div className="mt-2">
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
            // className="form-test"
            formData={formValue}
            validationGroup="customerData"
            onInitialized={handleInitialization}
            showValidationSummary={true}
            labelMode="outside"
            labelLocation="left"
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
                        key={nanoid()}
                        readOnly={editType == "detail"}
                      />
                    );
                  }}
                />
              );
            })}
          </Form>
        </form>
      )}
    </div>
  );
};
