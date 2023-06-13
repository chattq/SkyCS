import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  mapCustomOptions,
  mapEditorOption,
  mapEditorType,
  mapValidationRules,
} from "../../AddNew/util";
import { LoadPanel } from "devextreme-react";
import { GroupItem, Form } from "devextreme-react/form";
import { nanoid } from "nanoid";
import { GroupField } from "@/packages/ui/group-field";

const Detail_Customer = () => {
  const [dynamicFields, setDynamicFields] = useState<any>([]);
  const { t } = useI18n("Mst_Customer");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const param = useParams();
  const [formValue, setFormValue] = useState({});
  const {
    data: listGroupField,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["listGroupField"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupApi_Search({});
      if (response.isSuccess) {
        return response?.DataList;
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
        return [];
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
    data: dataColField,
    isLoading: isLoadingColField,
    refetch: refetchColField,
  } = useQuery({
    queryKey: ["listColField"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search({});
      if (response.isSuccess) {
        const data = response?.DataList ?? [];
        return data.filter((item: any) => item.FlagIsColDynamic === "1");
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
        return [];
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
        const response = await api.Mst_Customer_Search({
          CustomerCodeSys: param.CustomerCodeSys,
        });
        if (response.isSuccess) {
          if (response.DataList?.length) {
            const firstChild = response.DataList[0];
            const valueForm = JSON.parse(firstChild.JsonCustomerInfo);
            const obj = valueForm.reduce((acc: any, item: any) => {
              return {
                ...acc,
                [`${item.ColCodeSys}`]: item.ColValue,
              };
            }, {});
            setFormValue(obj);
            return firstChild;
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

  const getFormItem = useCallback(() => {
    console.log(
      "listGroupField ",
      listGroupField,
      "dataColField",
      dataColField
    );
    if (!isLoading && !isLoadingColField && !isLoadingValueItem) {
      const listField = dataColField?.map((field: any) => {
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
      const buildDynamicForm = listGroupField?.map((groupItem: any) => {
        return {
          colCount: 1,
          labelLocation: "left",
          caption: groupItem?.ColGrpName ?? "",
          // labelLocation: "left",
          items: [
            {
              itemType: "group",
              colCount: 2,
              items: listField?.filter(
                (item: any) => item.groupKeys === groupItem.ColGrpCodeSys
              ),
              caption: groupItem.ColGrpName ?? "",
              cssClass: "collapsible form-group",
            },
          ],
        };
      });
      console.log("buildDynamicForm ", buildDynamicForm);
      return buildDynamicForm;
    } else {
      return [];
    }
  }, [isLoading, isLoadingColField, isLoadingValueItem]);

  console.log("formValue ", formValue);
  // console.log("data ", data, "dataColField ", dataColField);
  getFormItem();
  useEffect(() => {
    refetchColField();
    refetch();
    refetchValueItem();
  }, []);

  return (
    <div>
      <LoadPanel
        container={".dx-viewport"}
        shadingColor="rgba(0,0,0,0.4)"
        position={"center"}
        visible={isLoading || isLoadingValueItem || isLoadingDynamic}
        showIndicator={true}
        showPane={true}
      />
      {!(isLoading || isLoadingValueItem || isLoadingDynamic) && (
        <form>
          <Form
            className="form-test"
            formData={formValue}
            validationGroup="customerData"
          >
            {getFormItem()?.map((item: any) => {
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
    </div>
  );
};

export default Detail_Customer;
