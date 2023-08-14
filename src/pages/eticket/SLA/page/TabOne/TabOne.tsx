import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import Form, { GroupItem, Item } from "devextreme-react/form";
import { useAtomValue } from "jotai";
import { nanoid } from "nanoid";
import { forwardRef, useMemo } from "react";
import { SLA_EditType, ticketInfo } from "../../components/store";

const TabOne = forwardRef(({}, ref: any) => {
  const { t } = useI18n("SLA_Form");

  const ticketInfoValue = useAtomValue(ticketInfo);

  const api = useClientgateApi();

  const { data: listTicket } = useQuery(["listTicket"], async () => {
    const resp = await api.Mst_TicketEstablishInfoApi_GetTicketType();

    return resp?.Data?.Lst_Mst_TicketType ?? [];
  });

  const { data: listTicketCustomType } = useQuery(
    ["listTicketCustomType"],
    async () => {
      const resp = await api.Mst_TicketEstablishInfoApi_GetTicketCustomType();

      return resp?.Data?.Lst_Mst_TicketCustomType ?? [];
    }
  );

  const { data: listCustomerCN } = useQuery(["listCustomerCN"], async () => {
    const resp: any = await api.Mst_Customer_Search({
      FlagActive: 1,
      Ft_PageIndex: 0,
      Ft_PageSize: 1000,
      CustomerType: "CANHAN",
    });

    return resp?.DataList ?? [];
  });

  const { data: listCustomerDN } = useQuery(["listCustomerDN"], async () => {
    const resp: any = await api.Mst_Customer_Search({
      FlagActive: 1,
      Ft_PageIndex: 0,
      Ft_PageSize: 1000,
      CustomerType: "TOCHUC",
    });

    return resp?.DataList ?? [];
  });

  const { data: listCustomerGroup } = useQuery(
    ["listCustomerGroup"],
    api?.Mst_CustomerGroup_GetAllActive
  );

  const formSettings = useMemo(() => {
    return [
      {
        colCount: 1,
        labelLocation: "left",
        typeForm: "textForm",
        hidden: false,
        items: [
          {
            caption: t("TicketType"),
            dataField: "TicketType",
            label: {
              text: t("TicketType"),
            },
            editorOptions: {
              dataSource: listTicket ?? [],
              displayExpr: "CustomerTicketTypeName",
              valueExpr: "TicketType",
            },
            editorType: "dxTagBox",
            visible: true,
          },
          {
            caption: t("TicketCustomType"),
            dataField: "TicketCustomType",
            label: {
              text: t("TicketCustomType"),
            },
            editorOptions: {
              dataSource: listTicketCustomType ?? [],
              displayExpr: "CustomerTicketCustomTypeName",
              valueExpr: "TicketCustomType",
            },
            editorType: "dxTagBox",
            visible: true,
          },
        ],
      },
      {
        caption: t("Personal"),
        colCount: 1,
        labelLocation: "left",
        typeForm: "textForm",
        hidden: false,
        items: [
          {
            caption: t("Customer"),
            dataField: "Customer",
            label: {
              text: t("Customer"),
            },
            editorOptions: {
              dataSource: listCustomerCN ?? [],
              valueExpr: "CustomerCodeSys",
              displayExpr: "CustomerName",
            },
            editorType: "dxTagBox",
            visible: true,
          },
          {
            caption: t("CustomerGroup"),
            dataField: "CustomerGroup",
            label: {
              text: t("CustomerGroup"),
            },
            editorOptions: {
              dataSource: listCustomerGroup?.DataList ?? [],
              valueExpr: "CustomerGrpCode",
              displayExpr: "CustomerGrpName",
            },
            editorType: "dxTagBox",
            visible: true,
          },
        ],
      },
      {
        caption: t("Organization"),
        colCount: 1,
        labelLocation: "left",
        typeForm: "textForm",
        hidden: false,
        items: [
          {
            caption: t("CustomerEnterprise"),
            dataField: "CustomerEnterprise",
            label: {
              text: t("CustomerEnterprise"),
            },
            editorOptions: {
              dataSource: listCustomerDN ?? [],
              valueExpr: "CustomerCodeSys",
              displayExpr: "CustomerName",
            },
            editorType: "dxTagBox",
            visible: true,
          },
          {
            caption: t("CustomerEnterpriseGroup"),
            dataField: "CustomerEnterpriseGroup",
            label: {
              text: t("CustomerEnterpriseGroup"),
            },
            editorOptions: {
              dataSource: listCustomerGroup?.DataList ?? [],
              valueExpr: "CustomerGrpCode",
              displayExpr: "CustomerGrpName",
            },
            editorType: "dxTagBox",
            visible: true,
          },
        ],
      },
    ];
  }, [
    listTicket,
    listTicketCustomType,
    listCustomerCN,
    listCustomerDN,
    listCustomerGroup,
  ]);

  const type = useAtomValue(SLA_EditType);

  return (
    <>
      <form className="p-2">
        <Form
          ref={ref}
          onInitialized={(e) => {
            ref.current = e.component;
          }}
          formData={ticketInfoValue}
          labelLocation="left"
          readOnly={type == "detail"}
        >
          {formSettings?.map((value: any) => {
            return (
              <GroupItem
                colCount={value.colCount}
                key={nanoid()}
                cssClass="mb-[20px]"
                caption={value.caption}
              >
                {value?.items?.map((items: any) => {
                  return <Item {...items} key={nanoid()} />;
                })}
              </GroupItem>
            );
          })}
        </Form>
      </form>
    </>
  );
});

export default TabOne;
