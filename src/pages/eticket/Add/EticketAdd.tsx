import { encodeFileType, revertEncodeFileType } from "@/components/ulti";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useNetworkNavigate } from "@/packages/hooks";
import { showErrorAtom } from "@/packages/store";
import CustomerEditPage from "@/pages/Mst_Customer/page/CustomerEditPage/CustomerEditPage";
import { getFullTime } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { Button, Popup, ScrollView } from "devextreme-react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DynamicForm, dynamicFormValue } from "./components/dynamic-form";
import { DefaultForm, customerPopup } from "./components/form-settings";
import { SideForm } from "./components/side-form-settings";

interface FormValue {
  TicketStatus: string;
  OrgID: string | undefined;
  CustomerCodeSys: string;
  TicketName: string;
  TicketDetail: string;
  AgentCode: string;
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
}

export const ticketAddSLAID = atom<string | undefined>("");

export const ticketDeadline = atom<Date>(new Date());

const EticketAdd = () => {
  const form_1: any = useRef();
  const form_2: any = useRef();
  const dynamic_ref: any = useRef();

  const api = useClientgateApi();

  const { auth } = useAuth();

  const { TicketID } = useParams();

  const navigate = useNetworkNavigate();

  const showError = useSetAtom(showErrorAtom);

  const ticketDeadlineValue = useAtomValue(ticketDeadline);

  const setTicketDealine = useSetAtom(ticketDeadline);

  const { data: serverTime, refetch }: any = useQuery(
    ["serverTime"],
    async () => {
      const resp: any = await api.Api_GetDTime();

      if (resp?.isSuccess) {
        setTicketDealine(new Date(resp?.Data?.DTimeServer));
      }

      return resp;
    }
  );

  const ticketAddSLAIDValue = useAtomValue(ticketAddSLAID);

  const [formValue, setFormValue] = useState<FormValue>({
    TicketStatus: "",
    OrgID: auth?.orgData?.Id,
    CustomerCodeSys: "",
    TicketName: "",
    TicketDetail: "",
    AgentCode: "",
    DepartmentCode: "",
    TicketType: "",
    TicketPriority: "",
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

  const result = useMemo(() => {
    return <></>;
  }, [
    formValue?.CustomerCodeSys &&
      formValue?.TicketCustomType &&
      formValue?.TicketType,
  ]);

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

  const { data: getFormValue } = useQuery(
    ["ticketUpdate", TicketID],
    async () => {
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
                return item?.AgentCode;
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
          const listDynamic =
            JSON.parse(resp?.Data?.Lst_ET_Ticket[0]?.TicketJsonInfo) ?? [];
          //  convertToOriginalFormat
          setDynamicForm(convertDotsToUnderscores(listDynamic));
        }

        return resp;
      }
    }
  );

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
      SLAID: ticketAddSLAIDValue,
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
      toast.success("Tạo mới eTicket thành công!");
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
      SLAID: ticketAddSLAIDValue,
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
      toast.success("Update eTicket thành công!");
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
    <div className="w-full">
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
      <div className="flex">
        <div className="p-2 w-[80%]">
          <DefaultForm ref={form_1} formValue={formValue} />
          <DynamicForm ref={dynamic_ref} formValue={dynamicForm} />
        </div>

        <SideForm ref={form_2} formValue={formValue} />
      </div>
      <Popup
        onHiding={handleClose}
        visible={customerPopupValue}
        showCloseButton
        title="Thêm khách hàng"
      >
        <ScrollView>
          <CustomerEditPage />
        </ScrollView>
      </Popup>
      {result}
    </div>
  );
};

export default EticketAdd;

// {
//   "TKCCFGCODESYS": {
//       "D6O": {
//           "00060": null,
//           "00098": "",
//           "00108": null,
//           "00111": [],
//           "00110": []
//       }
//   },
//   "ZaloUserFollowerId": []
// }

// TKCCFGCODESYS.D6O.00060 : null,
// TKCCFGCODESYS.D6O.00098 : "",
// TKCCFGCODESYS.D6O.00108 : null,
// TKCCFGCODESYS.D6O.00111 : [],
// TKCCFGCODESYS.D6O.00110 : []
