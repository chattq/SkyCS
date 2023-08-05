import NavNetworkLink from "@/components/Navigate";
import { encodeFileType, revertEncodeFileType } from "@/components/ulti";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useNetworkNavigate } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { getFullTime } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { Button, LoadPanel, Popup } from "devextreme-react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AddCustomerPopup from "./components/add-customer-popup";
import "./components/custom.scss";
import { DynamicForm, dynamicFormValue } from "./components/dynamic-form";
import { DefaultForm, customerPopup } from "./components/form-settings";
import { SideForm } from "./components/side-form-settings";

interface FormValue {
  TicketStatus: string;
  OrgID: string | undefined;
  CustomerCodeSys: string;
  TicketName: string;
  TicketDetail: string;
  AgentCode: string | undefined;
  DepartmentCode: string;
  TicketType: string;
  TicketPriority: string;
  TicketJsonInfo: any;
  TicketCustomType: string;
  TicketSource: string;
  ReceptionChannel: string;
  ContactChannel: string;
  Tags: string[];
  RemindWork: string;
  RemindDTimeUTC: any;
  uploadFiles: any;
  TicketFollowers: any;
  TicketCustomers: any;
  SLALevel?: any;
}

interface ticketAddSLAID {
  SLALevel: string | undefined;
  SLAID: string | undefined;
}

export const ticketAddSLAID = atom<ticketAddSLAID>({
  SLALevel: undefined,
  SLAID: undefined,
});

export const ticketDeadline = atom<Date>(new Date());

const EticketAdd = () => {
  const form_1: any = useRef();
  const form_2: any = useRef();
  const dynamic_ref: any = useRef();

  const api = useClientgateApi();

  const { auth } = useAuth();

  const { TicketID, type } = useParams();

  const navigate = useNetworkNavigate();

  const showError = useSetAtom(showErrorAtom);

  const ticketDeadlineValue = useAtomValue(ticketDeadline);

  const setTicketDealine = useSetAtom(ticketDeadline);

  const ticketAddSLAIDValue = useAtomValue(ticketAddSLAID);

  const [formValue, setFormValue] = useState<FormValue>({
    TicketStatus: "OPEN",
    OrgID: auth?.orgData?.Id.toString(),
    CustomerCodeSys: "",
    TicketName: "",
    TicketDetail: "",
    AgentCode: auth?.currentUser?.Email?.toUpperCase(),
    DepartmentCode: "",
    TicketType: "",
    TicketPriority: "NORMAL",
    TicketJsonInfo: "",
    TicketCustomType: "",
    TicketSource: "",
    ReceptionChannel: "",
    ContactChannel: "",
    Tags: [],
    RemindWork: "",
    RemindDTimeUTC: new Date(),
    uploadFiles: [],
    TicketFollowers: [],
    TicketCustomers: [],
  });

  const setDynamicForm = useSetAtom(dynamicFormValue);

  function convertDotToUnderscore(str: string) {
    return str.replace(/\./g, "_");
  }

  function convertDotsToUnderscores(obj: any) {
    const convertedObj: any = {};
    for (let key in obj) {
      const convertedKey = key.replace(/\./g, "_");
      convertedObj[convertedKey] = obj[key];
    }

    return convertedObj;
  }

  function convertUnderscoresToDots(obj: any) {
    const convertedObj: any = {};

    for (let key in obj) {
      const convertedKey = key.replace(/\_/g, ".");
      convertedObj[convertedKey] = obj[key];
    }

    return convertedObj;
  }

  const setTicketSLAID = useSetAtom(ticketAddSLAID);

  const {
    data: getFormValue,
    isLoading,
    refetch,
  } = useQuery(["ticketUpdate", TicketID], async () => {
    if (TicketID && auth?.orgData?.Id) {
      const resp: any = await api.ET_Ticket_GetByTicketID({
        TicketID: TicketID,
        OrgID: auth?.orgData?.Id,
      });

      if (resp?.Data?.Lst_ET_Ticket && resp?.Data?.Lst_ET_Ticket[0]) {
        setFormValue({
          ...formValue,
          ...resp?.Data?.Lst_ET_Ticket[0],
          CustomerCodeSys: resp?.Data?.Lst_ET_Ticket[0]?.CustomerCodeSys,
          Tags: resp?.Data?.Lst_ET_Ticket[0]?.Tags?.split(",") ?? [],
          TicketFollowers:
            resp?.Data?.Lst_ET_TicketFollower?.map((item: any) => {
              return item?.AgentCode?.toUpperCase();
            }) ?? [],
          uploadFiles:
            resp?.Data?.Lst_ET_TicketAttachFile?.map(
              (item: any, index: number) => {
                return {
                  ...item,
                  Idx: index + 1,
                  FileFullName: item?.FileName,
                  FileType: encodeFileType(item?.FileType),
                };
              }
            ) ?? [],
          TicketCustomers: resp?.Data?.Lst_ET_TicketCustomer,
        });
        setTicketDealine(resp?.Data?.Lst_ET_Ticket[0]?.TicketDeadline);
        setTicketSLAID({
          SLALevel: resp?.Data?.Lst_ET_Ticket[0]?.SLALevel,
          SLAID: resp?.Data?.Lst_ET_Ticket[0]?.SLAID,
        });
        const listDynamic =
          JSON.parse(resp?.Data?.Lst_ET_Ticket[0]?.TicketJsonInfo) ?? [];

        setDynamicForm(convertDotsToUnderscores(listDynamic));
      }

      return resp;
    }
  });

  useEffect(() => {
    refetch();
  }, []);

  const dynamicForm = useAtomValue(dynamicFormValue);

  const handleSave = async () => {
    const validate_form_1 = !form_1.current?.instance?.validate().isValid;
    const validate_form_2 = !form_2.current?.instance?.validate().isValid;

    if (validate_form_1 || validate_form_2) {
      return;
    }

    const deadLine = getFullTime(ticketDeadlineValue ?? new Date());
    const remindTime = getFullTime(formValue.RemindDTimeUTC);

    const ET_Ticket = {
      TicketStatus: formValue.TicketStatus,
      OrgID: formValue.OrgID,
      CustomerCodeSys: formValue.CustomerCodeSys,
      TicketName: formValue.TicketName,
      TicketDetail: formValue.TicketDetail,
      AgentCode: formValue.AgentCode,
      DepartmentCode: formValue.DepartmentCode,
      TicketType: formValue.TicketType,
      TicketDeadline: deadLine,
      TicketPriority: formValue.TicketPriority,
      TicketJsonInfo: JSON.stringify(convertUnderscoresToDots(dynamicForm)),
      TicketCustomType: formValue.TicketCustomType,
      TicketSource: formValue.TicketSource,
      ReceptionChannel: formValue.ReceptionChannel,
      ContactChannel: formValue.ContactChannel,
      Tags: formValue.Tags?.join(",") ?? "",
      SLAID: ticketAddSLAIDValue?.SLAID,
      RemindWork: formValue.RemindWork,
      RemindDTimeUTC: remindTime,
    };

    const Lst_ET_TicketAttachFile =
      formValue.uploadFiles?.map((item: any, index: number) => {
        return {
          Idx: index + 1,
          FileName: item?.FileFullName,
          FileType: revertEncodeFileType(item?.FileType),
          FilePath: item?.FilePath ?? item?.FileUrlFS,
        };
      }) ?? [];

    const Lst_ET_TicketFollower =
      formValue.TicketFollowers?.map((item: any) => {
        return {
          AgentCode: item,
          FollowType: "",
        };
      }) ?? [];

    const data = {
      ET_Ticket,
      Lst_ET_TicketAttachFile,
      Lst_ET_TicketFollower,
    };

    const resp: any = await api.ETTicket_Create(data);

    if (resp?.isSuccess) {
      toast.success("Tạo mới eTicket thành công!", {
        onClose: handleCancel,
        delay: 500,
      });
    } else {
      showError({
        message: resp?.errorCode,
        debugInfo: resp?.debugInfo,
        errorInfo: resp?.errorInfo,
      });
    }
  };

  const handleUpdate = async () => {
    const validate_form_1 = !form_1.current?.instance?.validate().isValid;
    const validate_form_2 = !form_2.current?.instance?.validate().isValid;

    if (validate_form_1 || validate_form_2) {
      return;
    }

    const deadLine = getFullTime(ticketDeadlineValue ?? new Date());
    const remindTime = getFullTime(formValue.RemindDTimeUTC);

    const ET_Ticket = {
      TicketID: TicketID,
      TicketStatus: formValue.TicketStatus,
      OrgID: formValue.OrgID,
      CustomerCodeSys: formValue.CustomerCodeSys,
      TicketName: formValue.TicketName,
      TicketDetail: formValue.TicketDetail,
      AgentCode: formValue.AgentCode,
      DepartmentCode: formValue.DepartmentCode,
      TicketType: formValue.TicketType,
      TicketDeadline: deadLine,
      TicketPriority: formValue.TicketPriority,
      TicketJsonInfo: JSON.stringify(convertUnderscoresToDots(dynamicForm)),
      TicketCustomType: formValue.TicketCustomType,
      TicketSource: formValue.TicketSource,
      ReceptionChannel: formValue.ReceptionChannel,
      ContactChannel: formValue.ContactChannel,
      Tags: formValue.Tags?.join(",") ?? "",
      SLAID: ticketAddSLAIDValue?.SLAID,
      RemindWork: formValue.RemindWork,
      RemindDTimeUTC: remindTime,
    };

    const Lst_ET_TicketAttachFile =
      formValue.uploadFiles?.map((item: any, index: number) => {
        return {
          Idx: index + 1,
          FileName: item?.FileFullName,
          FileType: revertEncodeFileType(item?.FileType),
          FilePath: item?.FilePath ?? item?.FileUrlFS,
        };
      }) ?? [];

    const Lst_ET_TicketFollower =
      formValue.TicketFollowers?.map((item: any) => {
        return {
          AgentCode: item,
          FollowType: "",
        };
      }) ?? [];

    const Lst_ET_TicketCustomer = formValue?.TicketCustomers ?? [];

    const data = {
      ET_Ticket,
      Lst_ET_TicketAttachFile,
      Lst_ET_TicketFollower,
      Lst_ET_TicketCustomer,
    };

    const resp: any = await api.ETTicket_Update(data);

    if (resp?.isSuccess) {
      toast.success("Update eTicket thành công!", {
        onClose: handleCancel,
        delay: 500,
      });
    } else {
      showError({
        message: resp?.errorCode,
        debugInfo: resp?.debugInfo,
        errorInfo: resp?.errorInfo,
      });
    }
  };

  const customerPopupValue = useAtomValue(customerPopup);
  const setCustomerPopup = useSetAtom(customerPopup);

  const handleClose = () => {
    setCustomerPopup(false);
  };

  const handleCancel = () => {
    navigate("/eticket/eticket_manager");
  };

  return (
    <AdminContentLayout className={"province-management"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2">
          <div className="breakcrumb flex gap-1">
            <NavNetworkLink
              to="/eticket/eticket_manager"
              className="text-black"
            >
              eTicket
            </NavNetworkLink>
            <p>{`>`}</p>
            {TicketID ? <p>Cập nhật eTicket</p> : <p>Tạo mới eTicket</p>}
          </div>
          <div className="flex justify-end">
            {TicketID ? (
              <Button
                style={{
                  padding: 10,
                  margin: 10,
                  background: "green",
                  color: "white",
                }}
                onClick={handleUpdate}
              >
                Cập nhật
              </Button>
            ) : (
              <Button
                style={{
                  padding: 10,
                  margin: 10,
                  background: "green",
                  color: "white",
                }}
                onClick={handleSave}
              >
                Lưu
              </Button>
            )}

            <Button
              style={{
                padding: 10,
                margin: 10,
              }}
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <LoadPanel visible={isLoading} />
        <div className="flex">
          <div className="p-2 w-[80%]">
            <DefaultForm
              ref={form_1}
              formValue={formValue}
              setFormValue={setFormValue}
            />
            <DynamicForm ref={dynamic_ref} formValue={dynamicForm} />
          </div>
          <div className="w-[20%] pr-2 pb-2">
            <SideForm ref={form_2} formValue={formValue} />
          </div>
        </div>
        <Popup
          onHiding={handleClose}
          visible={customerPopupValue}
          showCloseButton
          title="Thêm khách hàng"
        >
          <AddCustomerPopup setValue={setFormValue} value={formValue} />
        </Popup>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default EticketAdd;
