import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { useQuery } from "@tanstack/react-query";
import { Button, DateBox, Form, SelectBox } from "devextreme-react";
import { GroupItem, Item } from "devextreme-react/form";
import CustomStore from "devextreme/data/custom_store";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { forwardRef, useState } from "react";
import { ticketAddSLAID, ticketDeadline } from "../EticketAdd";

export const customerPopup = atom<boolean>(false);

const TicketDealine = () => {
  const ticketDeadlineValue = useAtomValue(ticketDeadline);
  const setTicketDeadline = useSetAtom(ticketDeadline);

  return (
    <DateBox
      value={ticketDeadlineValue}
      type="datetime"
      onValueChanged={(e: any) => setTicketDeadline(new Date(e.value))}
      displayFormat="yyyy/MM/dd hh:mm"
      openOnFieldClick
    />
  );
};

const CustomerUserPopup = () => {
  const customerPopupValue = useAtomValue(customerPopup);
  const setCustomerPopup = useSetAtom(customerPopup);

  return (
    <Button
      style={{ padding: 10, background: "green", color: "white" }}
      onClick={() => setCustomerPopup(!customerPopupValue)}
    >
      Thêm
    </Button>
  );
};

const CustomerSearchBox = ({ param }: any) => {
  const { component } = param;

  const defaultValue = component?.option("formData")["CustomerCodeSys"];

  const [value, setValue] = useState<string | undefined>(
    defaultValue ?? undefined
  );

  const api = useClientgateApi();

  const store = new CustomStore({
    key: "CustomerCodeSys",
    load: async (loadOptions) => {
      const resp: any = await api.Mst_Customer_Search({
        KeyWord: loadOptions?.searchValue,
      });
      return resp?.DataList ?? [];
    },
    byKey: async (key: any) => {
      const resp: any = await api.Mst_Customer_Search({
        KeyWord: key,
      });
      return resp?.DataList ?? [];
    },
  });

  return (
    <div className="flex gap-3">
      <SelectBox
        dataSource={store}
        showClearButton
        className="flex-grow"
        itemRender={(e: any) => {
          return e.CustomerName;
        }}
        valueExpr="CustomerCodeSys"
        displayExpr="CustomerName"
        value={value}
        onSelectionChanged={(e: any) => {
          if (e.selectedItem) {
            component.updateData(
              "CustomerCodeSys",
              e?.selectedItem?.CustomerCodeSys
            );
            setValue(e?.selectedItem?.CustomerCodeSys);
          } else {
            component.updateData("CustomerCodeSys", undefined);
            setValue(undefined);
          }
        }}
        searchEnabled
        searchTimeout={200}
        name="CustomerCodeSys"
        validationError={requiredType}
        validationMessagePosition={"bottom"}
        validationMessageMode={"always"}
      ></SelectBox>
      <CustomerUserPopup />
    </div>
  );
};

export const useFormSettings = (formValue: any) => {
  const { t } = useI18n("Ticket_Add");

  const api = useClientgateApi();

  const { data: MstTicketEstablishInfo } = useQuery(
    ["MstTicketEstablishInfoType"],
    api.Mst_TicketEstablishInfoApi_GetAllInfo
  );

  const { data: customerList } = useQuery(
    ["CustomerList"],
    api.Mst_Customer_GetAllActive
  );

  const { data: departmentList } = useQuery(
    ["departmentList"],
    api.Mst_DepartmentControl_GetAllActive
  );

  // Chi nhánh, đại lý
  const { data: nntList }: any = useQuery(
    ["nntList"],
    api.Mst_NNTController_GetAllActive
  );

  // Agent
  const { data: agentList } = useQuery(
    ["agentList"],
    api.Sys_User_GetAllActive
  );

  const formSettings: any = [
    {
      colCount: 1,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          caption: t("TicketStatus"),
          dataField: "TicketStatus",
          editorOptions: {
            dataSource:
              MstTicketEstablishInfo?.Data?.Lst_Mst_TicketStatus ?? [],
            valueExpr: "TicketStatus",
            displayExpr: "AgentTicketStatusName",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("CustomerCodeSys"),
          dataField: "CustomerCodeSys",
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
          validationGroup: "formData",
          render: (param: any) => <CustomerSearchBox param={param} />,
        },
        {
          caption: t("TicketName"),
          dataField: "TicketName",
          editorOptions: {
            placeholder: t("Input"),
          },
          editorType: "dxTextBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          dataField: "TicketDetail",
          editorOptions: {
            placeholder: t("Input"),
          },
          editorType: "dxHtmlEditor",
          caption: t("Mô tả"),
          visible: true,
        },
      ],
    },
    {
      colCount: 2,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          caption: t("OrgID"),
          dataField: "OrgID",
          editorOptions: {
            dataSource: nntList?.Data?.Lst_Mst_NNT ?? [],
            valueExpr: "OrgID",
            displayExpr: "NNTFullName",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("TicketType"),
          dataField: "TicketType",
          editorOptions: {
            dataSource: MstTicketEstablishInfo?.Data?.Lst_Mst_TicketType ?? [],
            displayExpr: "AgentTicketTypeName",
            valueExpr: "TicketType",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("DepartmentCode"),
          dataField: "DepartmentCode",
          editorOptions: {
            dataSource: departmentList?.DataList ?? [],
            valueExpr: "DepartmentCode",
            displayExpr: "DepartmentName",
          },
          editorType: "dxSelectBox",
          visible: true,
        },
        {
          caption: t("Deadline"),
          dataField: "TicketDeadline",
          editorOptions: {
            type: "datetime",
          },
          visible: true,
          editorType: "dxDateBox",
          validationRules: [requiredType],
          render: (param: any) => {
            return <TicketDealine />;
          },
        },
        {
          caption: t("Agent"),
          dataField: "AgentCode",
          editorOptions: {
            dataSource: agentList?.DataList ?? [],
            valueExpr: "UserCode",
            displayExpr: "UserName",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("TicketPriority"),
          dataField: "TicketPriority",
          editorOptions: {
            dataSource:
              MstTicketEstablishInfo?.Data?.Lst_Mst_TicketPriority ?? [],
            valueExpr: "TicketPriority",
            displayExpr: "AgentTicketPriorityName",
          },
          editorType: "dxSelectBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          dataField: "TicketAttachFiles", // file đính kèm
          caption: t("UploadFiles"),
          colSpan: 2,
          label: {
            location: "left",
            text: "Upload files",
          },
          editorOptions: {
            readOnly: true,
          },
          render: (param: any) => {
            const { component: formComponent, dataField } = param;
            return (
              <UploadFilesField
                formInstance={formComponent}
                onValueChanged={(files: any) => {
                  formComponent.updateData("uploadFiles", files);
                }}
              />
            );
          },
        },
      ],
    },
  ];

  return formSettings;
};

export const DefaultForm = forwardRef(({ formValue }: any, ref: any) => {
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
        labelLocation="left"
        readOnly={false}
        onFieldDataChanged={handleChangeField}
      >
        {useFormSettings(formValue)?.map((value: any) => {
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
