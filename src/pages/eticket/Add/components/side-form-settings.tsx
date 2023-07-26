import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { useQuery } from "@tanstack/react-query";
import { Form, TextBox } from "devextreme-react";
import { GroupItem, Item } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { forwardRef } from "react";
import { ticketAddSLAID, ticketDeadline } from "../EticketAdd";

const CustomSLAID = () => {
  const ticketSLAIDValue = useAtomValue(ticketAddSLAID);

  return <TextBox readOnly value={ticketSLAIDValue} />;
};

export const useSideFormSettings = () => {
  const { t } = useI18n("Ticket_Add");

  const api = useClientgateApi();

  // Phân loại tùy chọn
  const { data: ticketCustomType } = useQuery(
    ["ticketCustomTypeList"],
    api.Mst_TicketCustomType_GetAllActive
  );

  // Nguồn
  const { data: ticketSourceList } = useQuery(
    ["ticketSourceList"],
    api.Mst_TicketSource_GetAllActive
  );

  // Kênh tiếp nhận
  const { data: receptionChannelList } = useQuery(
    ["receptionChannelList"],
    api.Mst_ReceptionChannel_GetAllActive
  );

  // Tags
  const { data: tagList } = useQuery(["tagList"], api.Mst_Tag_GetAllActive);

  // Người theo dõi
  const { data: followList } = useQuery(
    ["followList"],
    api.Sys_User_GetAllActive
  );

  // SLA
  const { data: SLAList } = useQuery(["SLADefaultList"], () =>
    api.Mst_SLA_GetSLADefault({
      TicketType: "",
      TicketCustomType: "",
      CustomerCodeSys: "",
      OrgID: "",
    })
  );

  const formSettings: any = [
    {
      colCount: 1,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          caption: t("Phân loại tùy chọn"),
          dataField: "TicketCustomType",
          editorOptions: {
            dataSource: ticketCustomType?.Data?.Lst_Mst_TicketCustomType ?? [],
            valueExpr: "TicketCustomType",
            displayExpr: "CustomerTicketCustomTypeName",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("Nguồn"),
          dataField: "TicketSource",
          editorOptions: {
            dataSource: ticketSourceList?.Data?.Lst_Mst_TicketSource ?? [],
            valueExpr: "TicketSource",
            displayExpr: "CustomerTicketSourceName",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("Kênh tiếp nhận"),
          dataField: "ReceptionChannel",
          editorOptions: {
            dataSource:
              receptionChannelList?.Data?.Lst_Mst_ReceptionChannel ?? [],
            valueExpr: "ReceptionChannel",
            displayExpr: "CustomerReceptionChannelName",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("Kênh tiếp nhận mong muốn"),
          dataField: "ContactChannel",
          editorOptions: {
            dataSource:
              receptionChannelList?.Data?.Lst_Mst_ReceptionChannel ?? [],
            valueExpr: "ReceptionChannel",
            displayExpr: "CustomerReceptionChannelName",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("Tags mong muốn"),
          dataField: "Tags",
          editorOptions: {
            dataSource: tagList?.Data?.Lst_Mst_Tag ?? [],
            valueExpr: "TagID",
            displayExpr: "TagName",
          },
          editorType: "dxTagBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("Người theo dõi"),
          dataField: "TicketFollowers",
          editorOptions: {
            dataSource: followList?.DataList ?? [],
            valueExpr: "UserCode",
            displayExpr: "UserName",
          },
          editorType: "dxTagBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("SLA"),
          dataField: "SLAID",
          editorOptions: {
            // valueExpr: "SLAID",
            // displayExpr: "SLADesc",
            readOnly: true,
          },
          editorType: "dxTextBox",
          visible: true,
          render: (param: any) => <CustomSLAID />,
        },
        {
          caption: t("Nhắc việc"),
          dataField: "RemindWork",
          editorOptions: {
            placeholder: t("input"),
          },
          editorType: "dxTextBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("Vào lúc"),
          dataField: "RemindDTimeUTC",
          editorOptions: {
            type: "datetime",
            displayFormat: "yyyy/MM/dd HH:MM",
          },
          editorType: "dxDateBox",
          visible: true,
          validationRules: [requiredType],
        },
      ],
    },
  ];

  return formSettings;
};

export const SideForm = forwardRef(({ formValue }: any, ref: any) => {
  const api = useClientgateApi();

  const { auth } = useAuth();

  const setSLAID = useSetAtom(ticketAddSLAID);

  const ticketDeadlineValue = useAtomValue(ticketDeadline);
  const setTicketDeadline = useSetAtom(ticketDeadline);

  const handleChangeField = async (form: any) => {
    const { component } = form;

    const formData = component.option("formData");

    const CustomerCodeSys = formData?.CustomerCodeSys ?? "";
    const TicketCustomType = formData?.TicketCustomType ?? "";
    const TicketType = formData?.TicketType ?? "";

    if (CustomerCodeSys && TicketCustomType && TicketType) {
      const resp: any = await api.Mst_SLA_GetSLADefault({
        OrgID: auth.orgData?.Id,
        CustomerCodeSys: formValue.CustomerCodeSys,
        TicketCustomType: formValue.TicketCustomType,
        TicketType: formValue.TicketType,
      });

      if (resp?.isSuccess) {
        // component.updateData("SLAID", resp?.Data?.Mst_SLA?.SLAID ?? "");
        setSLAID(resp?.Data?.Mst_SLA?.SLAID ?? "");
        const min = resp?.Data?.Mst_SLA?.ResolutionTime;
        const time = ticketDeadlineValue.setMinutes(
          ticketDeadlineValue.getMinutes() + min
        );

        setTicketDeadline(new Date(time));
      }
    }
  };

  return (
    <form>
      <Form
        ref={ref}
        onInitialized={(e) => {
          ref.current = e.component;
        }}
        formData={formValue}
        labelLocation="top"
        readOnly={false}
        onFieldDataChanged={handleChangeField}
      >
        {useSideFormSettings().map((value: any) => {
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
