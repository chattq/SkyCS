import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete, Button, DateBox, Form } from "devextreme-react";
import { GroupItem, Item } from "devextreme-react/form";
import CustomStore from "devextreme/data/custom_store";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { forwardRef, useMemo } from "react";
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

export const useFormSettings = (formValue: any) => {
  const { t } = useI18n("Ticket_Add");

  const api = useClientgateApi();

  const { data: ticketStatusList } = useQuery(
    ["TicketStatusList"],
    api.Mst_TicketStatus_GetAllActive
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

  // Phân loại
  const { data: ticketTypeList } = useQuery(
    ["ticketTypeList"],
    api.Mst_TicketType_GetAllActive
  );

  // Agent
  const { data: agentList } = useQuery(
    ["agentList"],
    api.Sys_User_GetAllActive
  );

  // Mức ưu tiên
  const { data: ticketPriority } = useQuery(
    ["ticketPriority"],
    api.Mst_TicketPriority_GetAllActive
  );

  console.log(formValue);

  const formSettings: any = useMemo(() => {
    return [
      {
        colCount: 1,
        labelLocation: "left",
        typeForm: "textForm",
        hidden: false,
        items: [
          {
            caption: t("Trạng thái"),
            dataField: "TicketStatus",
            editorOptions: {
              dataSource: ticketStatusList?.Data?.Lst_Mst_TicketStatus ?? [],
              valueExpr: "TicketStatus",
              displayExpr: "CustomerTicketStatusName",
            },
            editorType: "dxSelectBox",
            visible: true,
            validationRules: [requiredType],
          },
          {
            caption: t("Khách hàng"),
            dataField: "CustomerCodeSys",
            editorOptions: {
              searchEnabled: true,
              showClearButton: true,
              dataSource: customerList?.DataList ?? [],
              displayExpr: "CustomerName",
              valueExpr: "CustomerCodeSys",
            },
            editorType: "dxSelectBox",
            visible: true,
            validationRules: [requiredType],
            render: (param: any) => {
              const { component } = param;

              const store = new CustomStore({
                key: "CustomerCodeSys",
                load: async (loadOptions) => {
                  const resp: any = await api.Mst_Customer_Search({
                    KeyWord: loadOptions?.searchValue,
                  });
                  return resp?.DataList ?? [];
                },
              });

              return (
                <div className="flex gap-3">
                  <Autocomplete
                    dataSource={store ?? []}
                    showClearButton
                    className="flex-grow"
                    itemRender={(e: any) => {
                      return e.CustomerName;
                    }}
                    valueExpr="CustomerName"
                    defaultValue={
                      component?.option("formData")["CustomerCodeSys"]
                    }
                    onSelectionChanged={(e: any) => {
                      if (e.selectedItem) {
                        component.updateData(
                          "CustomerCodeSys",
                          e?.selectedItem?.CustomerCodeSys
                        );
                      } else {
                        component.updateData("CustomerCodeSys", "");
                      }
                    }}
                    searchEnabled
                  />
                  <CustomerUserPopup />
                </div>
              );
            },
          },
          {
            caption: t("Tên eTicket"),
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
            validationRules: [requiredType],
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
            caption: t("Chi nhánh/Đại lý"),
            dataField: "OrgID",
            editorOptions: {
              dataSource: nntList?.Data?.Lst_Mst_NNT ?? [],
              valueExpr: "OrgID",
              displayExpr: "NNTFullName",
              defaultValue: formValue?.OrgID,
            },
            editorType: "dxSelectBox",
            visible: true,
            validationRules: [requiredType],
          },
          {
            caption: t("Phần loại"),
            dataField: "TicketType",
            editorOptions: {
              dataSource: ticketTypeList?.Data?.Lst_Mst_TicketType ?? [],
              displayExpr: "CustomerTicketTypeName",
              valueExpr: "TicketType",
            },
            editorType: "dxSelectBox",
            visible: true,
            validationRules: [requiredType],
          },
          {
            caption: t("Phòng ban"),
            dataField: "DepartmentCode",
            editorOptions: {
              dataSource: departmentList?.DataList ?? [],
              valueExpr: "DepartmentCode",
              displayExpr: "DepartmentName",
            },
            editorType: "dxSelectBox",
            visible: true,
            validationRules: [requiredType],
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
              dataSource: ticketPriority?.Data?.Lst_Mst_TicketPriority ?? [],
              valueExpr: "TicketPriority",
              displayExpr: "CustomerTicketPriorityName",
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
  }, [
    ticketStatusList,
    customerList,
    departmentList,
    nntList,
    ticketTypeList,
    agentList,
    ticketPriority,
  ]);

  return formSettings;
};

export const DefaultForm = forwardRef(({ formValue }: any, ref: any) => {
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
