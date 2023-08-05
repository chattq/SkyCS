import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import {
  Button,
  ScrollView,
  TabPanel,
  Tabs,
  DropDownBox,
  SelectBox,
  List,
} from "devextreme-react";
import { Item as TabItem } from "devextreme-react/tabs";
import { useState } from "react";
import { StringLengthRule } from "devextreme-react/tree-list";
import { useClientgateApi } from "@/packages/api";
import { useAtomValue, useSetAtom } from "jotai";
import { showErrorAtom } from "@/packages/store";
import { useI18n } from "@/i18n/useI18n";
import { toast } from "react-toastify";
import { Lst_Eticket_ActionType_Atom } from "./store";
import { Eticket_AddRemark } from "@/packages/types";
import { Icon } from "@/packages/ui/icons";

export const PartReplyNote = ({
  data,
  onReload,
}: {
  data: Eticket_AddRemark;
  onReload: any;
}) => {
  const showError = useSetAtom(showErrorAtom);
  const Lst_Eticket_ActionType = useAtomValue(Lst_Eticket_ActionType_Atom);

  const { t } = useI18n("Eticket_Detail");
  const initValue = {
    ActionType: data?.ActionType || "0",
    TicketID: data?.TicketID || "",
    OrgID: data?.OrgID || "",
    Description: data?.Description || "",
  };
  const [addRemark, setAddRemark] = useState(initValue);
  const api = useClientgateApi();

  const hanldleChangeActionType = (event: any) => {
    const _index = event?.component?._dataSource?._items?.findIndex(
      (x: any) => x.phoneCode === event.value
    );
  };

  const hanldleAddRemark = async () => {
    const obj = {
      ...addRemark,
    };

    const response = await api.ET_Ticket_AddRemark(obj);
    if (response.isSuccess) {
      toast.success(t("Add remark successfully"));
      // window.location.reload();
      onReload();
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  return (
    <div className={"w-full message-reply mb-2"}>
      <div className="input-area">
        <textarea
          className="input-area-content"
          value={addRemark.Description}
          placeholder="Nhập ghi chú..."
          maxLength={2000}
          onChange={(event) => {
            const dataCur = {
              ...addRemark,
              Description: event.target.value,
            };
            setAddRemark(dataCur);
          }}
        ></textarea>
      </div>

      <div className={"w-full box-button-eticket"}>
        <div className="flex">
          <SelectBox
            value={addRemark.ActionType} // giá trị khởi tạo
            valueExpr={"ActionTypeCode"} // giá trị được chọn
            displayExpr={"ActionTypeName"} // giá trị hiển thị
            style={{ width: 160, marginRight: 8 }}
            height={30}
            searchEnabled={true} // hiển thị chức năng tìm kiếm trong selectbox
            minSearchLength={3} // số lượng ký tự bắt đầu tìm kiếm
            searchExpr={["ActionTypeCode", "ActionTypeName"]} // tìm kiếm theo trường dữ liệu nào
            searchTimeout={10} // độ trễ thời điểm người dùng nhập xong và thời điểm tìm kiếm được thực hiện
            showDataBeforeSearch={false} // true: luôn hiển thị tất cả danh sách dữ liệu kể cả chưa nhập tới minSearchLength; false: không hiển thị dữ liệu cho đến khi nhập số ký tự bằng minSearchLength
            //showClearButton={true} // hiển thị item xóa dữ liệu
            dataSource={Lst_Eticket_ActionType} // nguồn dữ liệu
            onValueChanged={(event: any) => {
              const dataCur = {
                ...addRemark,
                ActionType: event.value,
              };
              setAddRemark(dataCur);
            }}
          ></SelectBox>
          <Button
            stylingMode={"contained"}
            type="default"
            icon="email"
            text={t("Send")}
            className="eticket-button-send"
            onClick={hanldleAddRemark}
          >
            {t("Send")}
            <Icon style={{ marginLeft: "10px" }} name="send"></Icon>
          </Button>
        </div>
      </div>
    </div>
  );
};
