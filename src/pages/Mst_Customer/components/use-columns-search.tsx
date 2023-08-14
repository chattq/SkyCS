import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { MdMetaColGroupSpec } from "@/packages/types";
import { getDMY } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { DateBox } from "devextreme-react";

interface Columns {
  listColumn: MdMetaColGroupSpec[];
  listMapField: any;
}

export const useColumnsSearch = () => {
  const { t } = useI18n("Mst_CustomerSearch");

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
      name: "CreateDTimeUTC",
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

  const { data: listNNT }: any = useQuery(
    ["listNNT"],
    api.Mst_NNTController_GetAllActive
  );

  const { data: listCustomerCodeSysERP }: any = useQuery(
    ["listCustomerCodeSysERP"],
    async () => {
      const resp: any = await api.Mst_Customer_Search({
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
        CustomerType: "TOCHUC",
      });

      return resp?.DataList ?? [];
    }
  );

  console.log(listCustomerCodeSysERP);

  const { data: listCustomerSource }: any = useQuery(
    ["listCustomerSource"],
    async () => {
      const resp: any = await api.MdMetaColGroupSpec_Search(
        {},
        "SCRTPLCODESYS.2023"
      );

      if (resp?.DataList && resp?.DataList?.length > 0) {
        const find = resp?.DataList?.find(
          (item: any) => item?.ColCodeSys == "C0K5"
        );

        if (find) {
          const data = JSON.parse(find?.JsonListOption ?? "[]");

          return data;
        }

        return [];
      }

      return [];
    }
  );

  const listColumn: any = [
    {
      dataField: "CustomerCode", // trạng thái
      caption: t("CustomerCode"),
      visible: true,
      label: {
        text: "Mã khách hàng",
      },
      editorOptions: {},
    },
    {
      dataField: "CustomerName", // trạng thái
      caption: t("CustomerName"),
      visible: true,
      label: {
        text: "Tên khách hàng",
      },
      editorOptions: {},
    },
    {
      dataField: "MST", // trạng thái
      caption: t("MST"),
      visible: true,
      label: {
        text: "MST",
      },
      editorOptions: {},
    },
    {
      dataField: "CtmEmail", // trạng thái
      caption: t("CtmEmail"),
      visible: true,
      label: {
        text: "Email",
      },
      editorOptions: {},
    },
    {
      dataField: "CtmPhoneNo", // trạng thái
      caption: t("CtmPhoneNo"),
      visible: true,
      label: {
        text: "Số điện thoại",
      },
      editorOptions: {},
    },
    {
      dataField: "CustomerGrpCode", // trạng thái
      caption: t("CustomerGrpCode"),
      visible: true,
      label: {
        text: "Nhóm khách hàng",
      },
      editorOptions: {
        dataSource: listCustomerGrp?.DataList ?? [],
        valueExpr: "CustomerGrpCode",
        displayExpr: "CustomerGrpName",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "PartnerType", // trạng thái
      caption: t("PartnerType"),
      visible: true,
      label: {
        text: "Đối tượng",
      },
      editorOptions: {
        dataSource: listPartnerType?.DataList ?? [],
        valueExpr: "PartnerType",
        displayExpr: "PartnerTypeName",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "CustomerSource", // trạng thái
      caption: t("CustomerSource"),
      visible: true,
      label: {
        text: "Nguồn khách",
      },
      editorOptions: {
        dataSource: listCustomerSource ?? [],
        valueExpr: "Value",
        displayExpr: "Value",
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "CustomerType", // trạng thái
      caption: t("CustomerType"),
      visible: true,
      label: {
        text: "Loại khách hàng",
      },
      editorOptions: {
        dataSource: listCustomerType?.Data?.Lst_Mst_CustomerType ?? [],
        valueExpr: "CustomerType",
        displayExpr: "CustomerTypeName",
      },
      editorType: "dxSelectBox",
    },
    {
      dataField: "CustomerCodeSysERP", // trạng thái
      caption: t("CustomerCodeSysERP"),
      visible: true,
      label: {
        text: "Doanh nghiệp",
      },
      editorOptions: {
        dataSource: listCustomerCodeSysERP ?? [],
        valueExpr: "CustomerCodeSys",
        displayExpr: "CustomerName",
      },
      editorType: "dxSelectBox",
    },
    {
      dataField: "CreateDTimeUTC", // dealine
      caption: t("CreateDTimeUTC"),
      visible: true,
      label: {
        text: "Ngày tạo mới",
      },
      colSpan: 1,
      editorType: "dxDateRangeBox",
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
      },
    },
  ];

  return listColumn;
};

const CreateDTimeUTCSearch = ({ param }: any) => {
  const { component } = param;

  return (
    <div className="flex items-center gap-2">
      <DateBox
        type="date"
        pickerType="calendar"
        defaultValue={undefined}
        onValueChanged={(e: any) => {
          component?.updateData("CreateDTimeUTCFrom", getDMY(e?.value));
        }}
      ></DateBox>
      <DateBox
        type="date"
        pickerType="calendar"
        defaultValue={undefined}
        onValueChanged={(e: any) => {
          component?.updateData("CreateDTimeUTCTo", getDMY(e?.value));
        }}
      ></DateBox>
    </div>
  );
};
