import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useQuery } from "@tanstack/react-query";
import { Form, TextBox } from "devextreme-react";
import { GroupItem, Item } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { forwardRef } from "react";
import { ticketAddSLAID, ticketDeadline } from "../EticketAdd";

const CustomSLAID = ({ param }: any) => {
  const { component } = param;

  const setTicketSLAID = useSetAtom(ticketAddSLAID);

  const ticketSLAIDValue = useAtomValue(ticketAddSLAID);

  // useEffect(() => {
  //   const SLAID = component?.option("formData")?.SLAID;
  //   const SLALevel = component?.option("formData")?.SLALevel;

  //   if (SLAID && SLALevel) {
  //     setTicketSLAID({
  //       SLAID: SLAID,
  //       SLALevel: SLALevel,
  //     });
  //   }
  // }, []);

  return <TextBox readOnly value={ticketSLAIDValue?.SLALevel} />;
};

export const useSideFormSettings = () => {
  const { t } = useI18n("Ticket_Add");

  const api = useClientgateApi();

  const { data: MstTicketEstablishInfo } = useQuery(
    ["MstTicketEstablishInfoType"],
    api.Mst_TicketEstablishInfoApi_GetAllInfo
  );

  // Tags
  const { data: tagList } = useQuery(["tagList"], api.Mst_Tag_GetAllActive);

  // Người theo dõi
  const { data: followList } = useQuery(["followList"], async () => {
    const resp: any = await api.Sys_User_GetAllActive();

    const data = resp?.DataList?.map((item: any) => {
      return {
        ...item,
        UserCode: item?.UserCode?.toUpperCase(),
      };
    });

    return data;
  });

  console.log(MstTicketEstablishInfo);

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
          caption: t("TicketCustomType"),
          dataField: "TicketCustomType",
          label: {
            text: t("TicketCustomType"),
          },
          editorOptions: {
            dataSource:
              MstTicketEstablishInfo?.Data?.Lst_Mst_TicketCustomType ?? [],
            valueExpr: "TicketCustomType",
            displayExpr: "AgentTicketCustomTypeName",
          },
          editorType: "dxSelectBox",
          visible: true,
        },
        {
          caption: t("TicketSource"),
          label: {
            text: t("TicketSource"),
          },
          dataField: "TicketSource",
          editorOptions: {
            dataSource:
              MstTicketEstablishInfo?.Data?.Lst_Mst_TicketSource ?? [],
            valueExpr: "TicketSource",
            displayExpr: "AgentTicketSourceName",
          },
          editorType: "dxSelectBox",
          visible: true,
        },
        {
          caption: t("ReceptionChannel"),
          dataField: "ReceptionChannel",
          label: {
            text: t("ReceptionChannel"),
          },
          editorOptions: {
            dataSource:
              MstTicketEstablishInfo?.Data?.Lst_Mst_ReceptionChannel ?? [],
            valueExpr: "ReceptionChannel",
            displayExpr: "AgentReceptionChannelName",
          },
          editorType: "dxSelectBox",
          visible: true,
        },
        {
          caption: t("ContactChannel"),
          dataField: "ContactChannel",
          label: {
            text: t("ContactChannel"),
          },
          editorOptions: {
            dataSource:
              MstTicketEstablishInfo?.Data?.Lst_Mst_ContactChannel ?? [],
            valueExpr: "ContactChannel",
            displayExpr: "AgentContactChannelName",
          },
          editorType: "dxSelectBox",
          visible: true,
        },
        {
          caption: t("Tags"),
          dataField: "Tags",
          label: {
            text: t("Tags"),
          },
          editorOptions: {
            dataSource: tagList?.Data?.Lst_Mst_Tag ?? [],
            valueExpr: "TagID",
            displayExpr: "TagName",
          },
          editorType: "dxTagBox",
          visible: true,
        },
        {
          caption: t("TicketFollowers"),
          dataField: "TicketFollowers",
          label: {
            text: t("TicketFollowers"),
          },
          editorOptions: {
            dataSource: followList ?? [],
            valueExpr: "UserCode",
            displayExpr: "UserName",
          },
          editorType: "dxTagBox",
          visible: true,
        },
        {
          caption: t("SLAID"),
          dataField: "SLAID",
          label: {
            text: t("SLAID"),
          },
          editorOptions: {
            // valueExpr: "SLAID",
            // displayExpr: "SLADesc",
            readOnly: true,
          },
          editorType: "dxTextBox",
          visible: true,
          render: (param: any) => <CustomSLAID param={param} />,
        },
        {
          caption: t("RemindWork"),
          dataField: "RemindWork",
          label: {
            text: t("RemindWork"),
          },
          editorOptions: {
            placeholder: t("input"),
          },
          editorType: "dxTextBox",
          visible: true,
        },
        {
          caption: t("RemindDTimeUTC"),
          dataField: "RemindDTimeUTC",
          label: {
            text: t("RemindDTimeUTC"),
          },
          editorOptions: {
            type: "datetime",
            displayFormat: "yyyy/MM/dd hh:mm",
          },
          editorType: "dxDateBox",
          visible: true,
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
  const SLAID = useAtomValue(ticketAddSLAID);

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

        if (resp?.Data?.Mst_SLA?.SLAID != SLAID) {
          setSLAID({
            SLAID: resp?.Data?.Mst_SLA?.SLAID,
            SLALevel: resp?.Data?.Mst_SLA?.SLALevel,
          });
          const min = resp?.Data?.Mst_SLA?.ResolutionTime;
          const time = ticketDeadlineValue.setMinutes(
            ticketDeadlineValue.getMinutes() + min
          );

          setTicketDeadline(new Date(time));
        }
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
