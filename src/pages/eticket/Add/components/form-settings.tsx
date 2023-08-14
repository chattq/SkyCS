import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { authAtom } from "@/packages/store";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { useQuery } from "@tanstack/react-query";
import { Button, DateBox, Form, LoadPanel, SelectBox } from "devextreme-react";
import { GroupItem, Item } from "devextreme-react/form";
import CustomStore from "devextreme/data/custom_store";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { forwardRef, useCallback, useEffect, useState } from "react";
import {
  ticketAddSLAID,
  ticketDeadline,
  ticketDepartmentAtom,
} from "../EticketAdd";

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
      style={{ padding: 10, background: "#00703C", color: "white" }}
      onClick={() => setCustomerPopup(!customerPopupValue)}
    >
      Thêm
    </Button>
  );
};

const CustomerSearchBox = ({ param }: any) => {
  const { component } = param;

  const defaultValue = component?.option("formData")["CustomerCode"];

  const [value, setValue] = useState<string | undefined>(
    defaultValue ?? undefined
  );

  const api = useClientgateApi();

  const store = new CustomStore({
    key: "CustomerCode",
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
        placeholder="Nhập tên, SĐT, Email, Mã KH để tìm"
        dataSource={store}
        showClearButton
        className="flex-grow"
        itemRender={(e: any) => {
          return e.CustomerName;
        }}
        valueExpr="CustomerCode"
        displayExpr="CustomerName"
        value={value}
        onSelectionChanged={(e: any) => {
          if (e.selectedItem) {
            component.updateData(
              "CustomerCodeSys",
              e?.selectedItem?.CustomerCodeSys
            );
            component.updateData("CustomerCode", e?.selectedItem?.CustomerCode);
            setValue(e?.selectedItem?.CustomerCode);
          } else {
            component.updateData("CustomerCodeSys", undefined);
            component.updateData("CustomerCode", undefined);

            setValue(undefined);
          }
        }}
        searchEnabled
        searchTimeout={200}
        name="CustomerCode"
        validationError={requiredType}
        validationMessagePosition={"bottom"}
        validationMessageMode={"always"}
      ></SelectBox>
      <CustomerUserPopup />
    </div>
  );
};

export const useFormSettings = () => {
  const { t } = useI18n("Ticket_Add");
  const auth = useAtomValue(authAtom);

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
      colCount: 2,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          cssClass: "TicketStatus",
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
          label: {
            text: t("TicketStatus"),
          },
          colSpan: 1,
        },
      ],
    },
    {
      colCount: 1,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          caption: t("CustomerCode"),
          dataField: "CustomerCode",
          label: {
            text: t("CustomerCode"),
          },
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
          label: {
            text: t("TicketName"),
          },
        },
        {
          dataField: "TicketDetail",
          cssClass: "TicketDetailHtmlEditor",
          editorOptions: {
            height: 200,
            placeholder: t("Input"),
            toolbar: {
              container: null,
              items: [
                "bold",
                "italic",
                "color",
                "background",
                "link",
                {
                  name: "header",
                  acceptedValues: [1, 2, 3, false],
                },
              ],
              multiline: true,
            },
          },
          editorType: "dxHtmlEditor",
          caption: t("TicketDetail"),
          visible: true,
          label: {
            text: t("TicketDetail"),
          },
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
          label: {
            text: t("OrgID"),
          },
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
          label: {
            text: t("TicketType"),
          },
        },
        {
          caption: t("DepartmentCode"),
          dataField: "DepartmentCode",
          editorOptions: {
            dataSource: [],
            valueExpr: "DepartmentCode",
            displayExpr: "DepartmentName",
          },
          editorType: "dxSelectBox",
          visible: true,
          label: {
            text: t("DepartmentCode"),
          },
          validationRules: [requiredType],
        },
        {
          caption: t("Deadline"),
          dataField: "TicketDeadline",
          editorOptions: {
            type: "datetime",
          },
          label: {
            text: t("Deadline"),
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
          label: {
            text: t("Agent"),
          },
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
          label: {
            text: t("TicketPriority"),
          },
        },
        {
          cssClass: "upload-files",
          dataField: "TicketAttachFiles", // file đính kèm
          caption: t("UploadFiles"),
          colSpan: 2,
          label: {
            location: "left",
            text: t("Upload files"),
          },
          editorOptions: {
            readOnly: true,
          },
          render: (param: any) => {
            const { component: formComponent, dataField } = param;
            return (
              <UploadFilesField
                controlFileInput={["DOCX", "PDF", "JPG", "PNG", "XLSX"]}
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

  const [loading, setLoading] = useState<boolean>(false);

  // editorOptions: {
  //   dataSource: departmentList?.DataList ?? [],
  //   valueExpr: "DepartmentCode",
  //   displayExpr: "DepartmentName",
  // },

  const { auth } = useAuth();

  const setSLAID = useSetAtom(ticketAddSLAID);
  const SLAID = useAtomValue(ticketAddSLAID);

  const ticketDeadlineValue = useAtomValue(ticketDeadline);
  const setTicketDeadline = useSetAtom(ticketDeadline);

  // Department here
  const [ticketDepartment, setTicketDepartment] = useAtom(ticketDepartmentAtom);

  const [listDepartment, setListDepartment] = useState<any[]>([]);

  const {
    data: defaultListDepartment,
    isLoading: defaultListDepartmentLoading,
    refetch: refetchDefaultListDepartmentLoading,
  } = useQuery(["defaultListDepartment"], async () => {
    const resp: any = await api.Mst_DepartmentControl_GetByOrgID(
      auth?.orgData?.Id.toString()
    );

    setListDepartment(resp?.Data?.Lst_Mst_Department ?? []);

    return resp?.Data?.Lst_Mst_Department ?? [];
  });

  console.log(listDepartment);

  useEffect(() => {
    refetchDefaultListDepartmentLoading();
  }, []);

  const handleChangeField = async (form: any) => {
    if (form?.dataField == "OrgID") {
      setLoading(true);
      const resp: any = await api.Mst_DepartmentControl_GetByOrgID(form?.value);

      if (resp?.isSuccess && resp?.Data && resp?.Data?.Lst_Mst_Department) {
        if (
          !resp?.Data?.Lst_Mst_Department?.find(
            (item: any) => item?.DepartmentCode == ticketDepartment
          )
        ) {
          setTicketDepartment(undefined);
        }
        setListDepartment(resp?.Data?.Lst_Mst_Department);
        setLoading(false);
      } else {
        setListDepartment([]);
        setTicketDepartment(undefined);
        setLoading(false);
      }
    }

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

  const customizeItem = useCallback(
    (item: any) => {
      if (item?.dataField == "DepartmentCode") {
        item.editorOptions.dataSource = listDepartment;
        item.editorOptions.displayExpr = "DepartmentName";
        item.editorOptions.valueExpr = "DepartmentCode";
      }
    },
    [listDepartment]
  );

  return (
    <>
      <LoadPanel visible={loading ?? defaultListDepartmentLoading} />
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
          className="eticketAdd-form"
          customizeItem={customizeItem}
        >
          {useFormSettings()?.map((value: any) => {
            return (
              <GroupItem colCount={value.colCount} key={nanoid()}>
                {value?.items?.map((items: any) => {
                  return (
                    <Item {...items} colSpan={items?.colSpan} key={nanoid()} />
                  );
                })}
              </GroupItem>
            );
          })}
        </Form>
      </form>
    </>
  );
});
