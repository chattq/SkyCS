import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import { Avatar } from "../../../../components/avatar";

import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { CcCall, EticketT } from "@/packages/types";
import { Button, SelectBox } from "devextreme-react";
import { memo, useEffect, useRef } from "react";
import { usePhone } from "@/packages/hooks/usePhone";
import { useClientgateApi } from "@/packages/api";
import { useSetAtom } from "jotai";
import { showErrorAtom } from "@/packages/store";
import { toast } from "react-toastify";
const PartHeaderInfo = ({
  data,
  onReload,
}: {
  data: EticketT;
  onReload: () => void;
}) => {
  const { t } = useI18n("Eticket_Detail");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const phone = usePhone();
  const useRefPhoneNo = useRef("");
  // const hanldleOnChangePhoneNo = (_value: any, index: string) => {
  //   const _index = _value?.component?._dataSource?._items?.findIndex(
  //     (x: any) => x.phoneCode === _value.value
  //   );

  //   //setPhoneCode(_value.value || "");
  // };

  const { Lst_ET_Ticket, Lst_ET_TicketCustomer } = data;
  const hanldleChangePhoneNo = (event: any) => {
    useRefPhoneNo.current = event.value;
    const _index = event?.component?._dataSource?._items?.findIndex(
      (x: any) => x.phoneCode === event.value
    );
  };

  useEffect(() => {
    if (
      Lst_ET_TicketCustomer !== undefined &&
      Lst_ET_TicketCustomer !== null &&
      Lst_ET_TicketCustomer.length
    ) {
      useRefPhoneNo.current = Lst_ET_TicketCustomer[0].CustomerPhoneNo;
    }
  }, []);

  const addCall = async (objRQ_ET_Ticket: any) => {
    const response = await api.AddCall(objRQ_ET_Ticket);
    if (response.isSuccess) {
      toast.success(t("Add Call Successfully"));
      onReload();
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const doCall = (phoneNo: any) => {
    phone.call(phoneNo, (call: CcCall) => {
      if (
        Lst_ET_Ticket !== undefined &&
        Lst_ET_Ticket !== null &&
        call !== undefined &&
        call !== null
      ) {
        const objET_Ticket = Lst_ET_Ticket[0];
        const objRQ_ET_Ticket = {
          TicketID: objET_Ticket.TicketID ?? "",
          OrgID: objET_Ticket.OrgID ?? "",
          ActionType: "0",
          List_ET_TicketMessageCall: [
            {
              CallID: call.Id,
            },
          ],
        };
        addCall(objRQ_ET_Ticket);
      }
    });
  };
  return (
    <div className={"w-full flex flex-col detail-header "}>
      {Lst_ET_Ticket.map((item: any, index: number) => {
        const objMst_Customer = Lst_ET_TicketCustomer.find(
          (it: any) => it.CustomerCodeSys === item.CustomerCodeSys
        );
        // item.CustomerName = objMst_Customer?.CustomerName;
        return (
          <div key={index}>
            <div className={"w-full header-title position-relative mb-2"}>
              <strong className="font-weight-bold">
                {objMst_Customer
                  ? Lst_ET_Ticket[0].TicketName +
                    " - " +
                    objMst_Customer.TicketID
                  : ""}
              </strong>
              {item?.TicketWarning && (
                <div
                  className={"position-absolute"}
                  style={{ top: "-10px", right: "-16px" }}
                >
                  <span className={"sp-warning"}>
                    <i className="dx-icon-warning"></i>{" "}
                    {item?.TicketWarning ?? ""}
                  </span>
                </div>
              )}
            </div>

            <div className={"w-full"}>
              <ResponsiveBox className={"w-full"}>
                <Row></Row>
                <Col ratio={1}></Col>
                <Col ratio={1}></Col>
                <Col ratio={1}></Col>
                <Item>
                  <Location row={0} col={0} />
                  {Lst_ET_TicketCustomer.length && (
                    <div className="flex">
                      <Avatar
                        name={Lst_ET_TicketCustomer[index].CustomerName}
                        img={Lst_ET_TicketCustomer[index].CustomerAvatarPath}
                        size={"sm"}
                        className="detail-avatar mr-1"
                      />
                      <div>
                        <NavNetworkLink
                          className="detail-customer-name"
                          to={`/customer/detail/${Lst_ET_TicketCustomer[index].CustomerCodeSys}`}
                        >
                          {Lst_ET_TicketCustomer[index].CustomerName}
                        </NavNetworkLink>

                        <br></br>
                        <div className="flex mt-1 select-phone">
                          <SelectBox
                            value={
                              Lst_ET_TicketCustomer[index].CustomerPhoneNo ?? ""
                            } // giá trị khởi tạo
                            // valueExpr={"phoneCode"} // giá trị được chọn
                            // displayExpr={"phoneNumber"} // giá trị hiển thị
                            style={{ width: 150, height: 30 }}
                            searchEnabled={true} // hiển thị chức năng tìm kiếm trong selectbox
                            minSearchLength={3} // số lượng ký tự bắt đầu tìm kiếm
                            searchExpr={["phoneCode", "phoneNumber"]} // tìm kiếm theo trường dữ liệu nào
                            searchTimeout={10} // độ trễ thời điểm người dùng nhập xong và thời điểm tìm kiếm được thực hiện
                            showDataBeforeSearch={false} // true: luôn hiển thị tất cả danh sách dữ liệu kể cả chưa nhập tới minSearchLength; false: không hiển thị dữ liệu cho đến khi nhập số ký tự bằng minSearchLength
                            //showClearButton={true} // hiển thị item xóa dữ liệu
                            dataSource={
                              Lst_ET_TicketCustomer[index].Lst_CustomerPhoneNo
                            } // nguồn dữ liệu
                            // onValueChanged={(_value: any) => {
                            //   hanldleOnChangePhoneNo(_value, "");
                            // }}
                            //// OK
                            // onValueChanged={(event: any) => {
                            //   hanldleChangePhoneNo(event);
                            // }}
                            //// OK
                            onValueChanged={hanldleChangePhoneNo}
                            onSelectionChanged={(_value: any) => {
                              // event onSelecti  onChanged xảy ra trước event onValueChanged
                              //hanldleOnChangePhoneNo(_value, "");
                            }}
                          ></SelectBox>

                          <Button
                            height={30}
                            stylingMode={"contained"}
                            type="default"
                            icon="tel"
                            className="phone-button"
                            onClick={() => {
                              const phoneNo = useRefPhoneNo.current;
                              doCall(phoneNo);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Item>
                <Item>
                  <Location row={0} col={1} />
                  <div className="flex">
                    <span className="text-gray mr-1">{t("ProcessTime")}:</span>
                    <strong className="detail-header-value">
                      {item.ProcessTime ?? "--"}
                    </strong>
                  </div>

                  <div className="flex mt-2">
                    <span className="text-gray mr-1">
                      {t("AgentContactChannelName")}:
                    </span>
                    <strong className="detail-header-value">
                      {item.AgentContactChannelName ?? "--"}
                    </strong>
                  </div>
                </Item>

                <Item>
                  <Location row={0} col={2} />
                  <div className="flex align-items-center">
                    <span className="text-gray mr-1">{t("TicketStatus")}:</span>
                    <strong
                      className={`detail-header-value status ${item?.TicketStatus?.toLowerCase()}`}
                    >
                      {item.TicketStatus ?? "--"}
                    </strong>
                  </div>

                  <div className="flex mt-2">
                    <span className="text-gray mr-1">
                      {t("AgentTicketTypeName")}:
                    </span>
                    <strong className="detail-header-value">
                      {item.AgentTicketTypeName ?? "--"}
                    </strong>
                  </div>
                </Item>
              </ResponsiveBox>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(PartHeaderInfo);
