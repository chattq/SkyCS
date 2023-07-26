import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import {
  getListField,
  mapCustomOptions,
  mapEditorOption,
  mapEditorType,
  mapValidationRules,
} from "@/utils/customer-common";
import { useQuery } from "@tanstack/react-query";
import { Form } from "devextreme-react";
import { GroupItem, Item } from "devextreme-react/form";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { forwardRef, useState } from "react";

export const useDynamicForm = () => {
  const { t } = useI18n("Ticket_Add");

  const api = useClientgateApi();

  const { auth } = useAuth();

  const showError = useSetAtom(showErrorAtom);

  const setDynamicForm = useSetAtom(dynamicFormValue);

  const [dynamicFields, setDynamicFields] = useState<any[]>([]);

  function convertDotToUnderscore(str: string) {
    return str.replace(/\./g, "_");
  }

  const { data: listCodeField }: any = useQuery(
    ["ticketColumnConfigList"],
    async () => {
      const resp: any = await api.Mst_TicketColumnConfig_GetAllActive();

      if (resp?.Data?.Lst_Mst_TicketColumnConfig) {
        const list: any = resp?.Data?.Lst_Mst_TicketColumnConfig;
        const result = list?.reduce((prev: any, cur: any) => {
          return {
            ...prev,
            [convertDotToUnderscore(cur?.TicketColCfgCodeSys)]: undefined,
          };
        }, {});

        setDynamicForm(result);

        const filterDynamic =
          list
            ?.filter((item: any) => item?.TicketColCfgDataType == "MASTERDATA")
            ?.map((item: any) => item?.TicketColCfgCodeSys) ?? [];
        console.log("filterDynamic", filterDynamic);
        setDynamicFields(filterDynamic);
      }

      return resp?.Data?.Lst_Mst_TicketColumnConfig ?? [];
    }
  );

  const { data: listDynamic }: any = useQuery({
    queryKey: ["listDynamicEticketAdd", dynamicFields],
    queryFn: async () => {
      if (dynamicFields && dynamicFields.length > 0) {
        const response: any = await api.Mst_TicketColumnConfig_GetListOption(
          dynamicFields ?? [],
          auth?.orgData?.Id ?? ""
        );
        // console.log(response);
        if (response.isSuccess) {
          const result = response?.Data?.Lst_Mst_TicketColumnConfig?.reduce(
            (result: any, item: any) => {
              result[convertDotToUnderscore(item.TicketColCfgCodeSys)] =
                item.Lst_MD_OptionValue;

              return result;
            },
            {} as { [key: string]: any[] }
          );

          return result;
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
          return {};
        }
      } else {
        return {};
      }
    },
  });

  const filterdListCodeField = listCodeField?.map((field: any) => {
    return {
      ...field,
      ColCaption: field.TicketColCfgName,
      FlagIsColDynamic: field.FlagIsDynamic,
      groupKeys: null,
      dataField: field.TicketColCfgCodeSys,
      editorType: mapEditorType(field.TicketColCfgDataType!),
      ColCodeSys: convertDotToUnderscore(String(field?.TicketColCfgCodeSys)),
      ColDataType: field.TicketColCfgDataType,
      label: {
        text: field.TicketColCfgName,
      },
      validationMessagePosition: "bottom",
      editorOptions: mapEditorOption({
        field: {
          ...field,
          ColDataType: field.TicketColCfgDataType,
          ColCodeSys: convertDotToUnderscore(
            String(field?.TicketColCfgCodeSys)
          ),
        },
        listDynamic: listDynamic ?? {},
        customOption: {},
      }),
      validationRules: mapValidationRules(field),
      ...mapCustomOptions(field),
    };
  });

  const listField = getListField({
    listField: filterdListCodeField,
    listDynamic: listDynamic ?? {},
    customOptions: {
      editType: "",
    },
  });

  const formSettings: any = [
    {
      colCount: 2,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: listField ?? [],
    },
  ];

  // return listCodeField?.Data?.Lst_Mst_TicketColumnConfig ?? [];

  return formSettings;
};

export const dynamicFormValue = atom<any>({});

export const DynamicForm = forwardRef(({}: any, ref: any) => {
  const formValue = useAtomValue(dynamicFormValue);

  return (
    <form className="mt-[50px]">
      <Form
        ref={ref}
        onInitialized={(e) => {
          ref.current = e.component;
        }}
        formData={formValue}
        labelLocation="left"
        readOnly={false}
        onFieldDataChanged={(e: any) => {
          e.component.updateData([e.dataField], e.value);
        }}
      >
        {useDynamicForm()?.map((value: any) => {
          return (
            <GroupItem colCount={value.colCount} key={nanoid()}>
              {value?.items?.map((items: any) => {
                return <Item {...items} key={nanoid()} />;
              })}
            </GroupItem>
          );
        })}
      </Form>
    </form>
  );
});
