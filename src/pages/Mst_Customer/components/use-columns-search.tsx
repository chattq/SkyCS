import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { MdMetaColGroupSpec } from "@/packages/types";
import {
  mapCustomOptions,
  mapEditorOption,
  mapEditorType,
} from "@/utils/customer-common";
import { useQuery } from "@tanstack/react-query";
import { match } from "ts-pattern";

interface Columns {
  listColumn: MdMetaColGroupSpec[];
  listMapField: any;
}

export const useColumnsSearch = ({ listColumn, listMapField }: Columns) => {
  let getListSearch: any[] = [];
  const { t } = useI18n("Mst_Customer");

  const sortedField = [
    {
      name: "CustomerCode",
      idx: 0,
    },
    {
      name: "CustomerName",
      idx: 1,
    },
    {
      name: "MST",
      idx: 2,
    },
    {
      name: "CtmEmail",
      idx: 3,
    },
    {
      name: "CtmPhoneNo",
      idx: 4,
    },
    {
      name: "CustomerGrpCode",
      idx: 5,
    },
    {
      name: "CustomerType",
      idx: 6,
    },
    {
      name: "PartnerType",
      idx: 7,
    },
    {
      name: "CUSTOMERSOURCE",
      idx: 8,
    },
    {
      name: "CustomerCodeSysERP",
      idx: 9,
    },
    {
      name: "CREATEDDATE",
      idx: 10,
    },
  ];

  const api = useClientgateApi();

  const { data: listCustomerType }: any = useQuery(
    ["listCustomerType"],
    api.Mst_CustomerType_GetAllCustomerType
  );

  const { data: listCustomerGrp }: any = useQuery(
    ["listCustomerGrp"],
    api.Mst_CustomerGroup_GetAllActive
  );

  const { data: listPartnerType }: any = useQuery(
    ["listPartnerType"],
    api.Mst_PartnerType_GetAllActive
  );

  const { data: listCustomer }: any = useQuery(
    ["listCustomer"],
    api.Mst_Customer_GetAllActive
  );

  const baseStaticField = listColumn
    ?.filter((item: any) => item?.FlagIsColDynamic !== "1")
    ?.filter((item: any) => item?.FlagActive)
    ?.filter((item: any) =>
      sortedField?.find((c: any) => c?.name == item?.ColCodeSys)
    );

  const baseDynamicField = listColumn
    ?.filter((item: any) => item?.FlagIsColDynamic === "1")
    ?.filter((item: any) => item?.FlagActive)
    ?.filter((item: any) =>
      sortedField?.find((c: any) => c?.name == item?.ColCode)
    );

  const getListColumnSearch = [...baseStaticField, ...baseDynamicField]
    .map((field: any) => {
      return {
        ...field,
        ColOperatorType: field.ColOperatorType,
        dataField: field.ColCodeSys,
        caption: t(`${field.ColCaption}`),
        editorType: mapEditorType(field.ColDataType!),
        label: {
          text: field.ColCaption,
        },
        validationMessagePosition: "bottom",
        editorOptions: mapEditorOption({
          field: field,
          listDynamic: listMapField ?? {},
        }),
        idx: sortedField?.find((c: any) => c?.name == field?.ColCodeSys)?.idx,
        visible: true,
        // validationRules: mapValidationRules(field),
        ...mapCustomOptions(field),
      };
    })
    ?.map((item: any) => {
      return match(item?.ColDataType)
        .with("CUSTOMERTYPE", () => {
          return {
            ...item,
            editorType: "dxSelectBox",
            editorOptions: {
              dataSource: listCustomerType?.Data?.Lst_Mst_CustomerType ?? [],
              valueExpr: "CustomerType",
              displayExpr: "CustomerTypeName",
            },
          };
        })
        .with("CUSTOMERGROUP", () => {
          return {
            ...item,
            editorType: "dxTagBox",
            editorOptions: {
              dataSource: listCustomerGrp?.DataList ?? [],
              valueExpr: "CustomerGrpCode",
              displayExpr: "CustomerGrpName",
            },
          };
        })
        .with("PARTNERTYPE", () => {
          return {
            ...item,
            editorType: "dxTagBox",
            editorOptions: {
              dataSource: listPartnerType?.DataList ?? [],
              valueExpr: "PartnerType",
              displayExpr: "PartnerTypeName",
            },
          };
        })
        .with("CUSTOMERCODESYSERP", () => {
          return {
            ...item,
            editorType: "dxSelectBox",
            editorOptions: {
              dataSource: listCustomer?.DataList ?? [],
              valueExpr: "CustomerCodeSys",
              displayExpr: "CustomerName",
            },
          };
        })
        .otherwise(() => {
          return item;
        });
    })
    ?.sort((a: any, b: any) => a?.idx - b?.idx);

  getListColumnSearch.forEach((item) => {
    if (item.ColOperatorType === "RANGE") {
      const obj = [
        item,
        {
          ...item,
          dataField: item.dataField + "_To",
          caption: item.caption + " " + t("To"),
          label: {
            text: item.label.text + " " + t("To"),
          },
        },
      ];
      getListSearch = [...getListSearch, ...obj];
    } else {
      getListSearch = [...getListSearch, item];
    }
  });

  // console.log("getListSearch ", getListSearch);
  return getListSearch;
};
