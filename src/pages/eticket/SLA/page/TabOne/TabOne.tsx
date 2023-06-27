import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useQuery } from "@tanstack/react-query";
import Form, { GroupItem, Item } from "devextreme-react/form";
import { useAtomValue } from "jotai";
import { nanoid } from "nanoid";
import { forwardRef, useMemo } from "react";
import { SLA_EditType, ticketInfo } from "../../components/store";

const TabOne = forwardRef(({}, ref: any) => {
  const { t } = useI18n("SLA");

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

  const { data: listCustomer } = useQuery(["listCustomer"], async () => {
    const resp = await api.Mst_Customer_GetAllActive();

    return resp?.DataList ?? [];
  });

  const { data: listCustomerGroup } = useQuery(
    ["listCustomerGroup"],
    async () => {
      const resp = await api.Mst_CustomerGroup_GetAllActive();

      return resp?.DataList ?? [];
    }
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
            caption: t("Loại Eticket"),
            dataField: "TicketType",
            editorOptions: {
              dataSource: listTicket ?? [],
              displayExpr: "CustomerTicketTypeName",
              valueExpr: "TicketType",
            },
            editorType: "dxTagBox",
            visible: true,
            validationRules: [requiredType],
          },
          {
            caption: t("Phân loại tùy chọn"),
            dataField: "TicketCustomType",
            editorOptions: {
              dataSource: listTicketCustomType ?? [],
              displayExpr: "CustomerTicketCustomTypeName",
              valueExpr: "TicketCustomType",
            },
            editorType: "dxTagBox",
            visible: true,
            validationRules: [requiredType],
          },
        ],
      },
      {
        caption: "Cá nhân",
        colCount: 1,
        labelLocation: "left",
        typeForm: "textForm",
        hidden: false,
        items: [
          {
            caption: t("Khách hàng"),
            dataField: "Customer",
            editorOptions: {
              dataSource: listCustomer ?? [],
              valueExpr: "CustomerCodeSys",
              displayExpr: "CustomerName",
            },
            editorType: "dxTagBox",
            visible: true,
            validationRules: [requiredType],
          },
          {
            caption: t("Nhóm khách hàng"),
            dataField: "CustomerGroup",
            editorOptions: {
              dataSource: listCustomerGroup ?? [],
              valueExpr: "CustomerGrpCode",
              displayExpr: "CustomerGrpName",
            },
            editorType: "dxTagBox",
            visible: true,
            validationRules: [requiredType],
          },
        ],
      },
    ];
  }, [listTicket, listTicketCustomType, listCustomer, listCustomerGroup]);

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
