import {
  Button,
  Form,
  List,
  LoadPanel,
  Popup,
  ScrollView,
} from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import React, { memo, useMemo, useRef } from "react";
import { listCampaignAgentAtom, visiblePopupAtom } from "../../../store";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useI18n } from "@/i18n/useI18n";
import { GroupItem, Item, Label, SimpleItem } from "devextreme-react/form";
import { readOnly } from "@/pages/Business_Information/components/store";
import { toast } from "react-toastify";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { showErrorAtom } from "@/packages/store";
import { ColumnOptions } from "@/types";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";

interface Props {
  param: any;
  onCancel: () => void;
}
//listCampaign
const History_Call = ({ onCancel, param }: Props) => {
  const popupVisible = useAtomValue(visiblePopupAtom);
  const showError = useSetAtom(showErrorAtom);
  const { t } = useI18n("History_Call");
  const api = useClientgateApi();
  let gridRef: any = useRef<any>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["Cpn_CampaignCustomer_GetCallHist", param.data],
    queryFn: async () => {
      const dataParam = param.data;
      const phoneNo = dataParam?.CustomerPhoneNo ?? "";
      const phoneNo1 = dataParam?.CustomerPhoneNo1 ?? "";
      const phoneNo2 = dataParam?.CustomerPhoneNo2 ?? "";
      const getPhone = () => {
        let str = "";
        if (phoneNo !== "") {
          str = str + phoneNo;
        }
        if (phoneNo1 !== "") {
          str = str + "," + phoneNo1;
        }
        if (phoneNo2 !== "") {
          str = str + "," + phoneNo2;
        }

        return str;
      };

      const response = await api.Cpn_CampaignCustomer_GetCallHist({
        CampaignCode: dataParam?.CampaignCode ?? "",
        CustomerPhoneNo: getPhone(),
      });

      if (response.isSuccess) {
        return response;
      } else {
        showError({
          message: t(response?.errorCode),
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
      }
    },
  });

  console.log("param ", param);

  const columns = useMemo(() => {
    return [
      {
        dataField: "CallOutDTimeUTC",
        caption: "CallOutDTimeUTC", // thời điểm gọi ra
      },
      {
        dataField: "AgentCode", // agent phụ trách
        caption: "AgentCode",
      },
      {
        dataField: "CustomerPhoneNo", // số điện thoại gọi ra
        caption: "CustomerPhoneNo",
      },
      {
        dataField: "RecordFileName", // file ghi âm
        caption: "RecordFileName",
      },
      {
        dataField: "CallTime", // thời gian gọi
        caption: "CallTime",
      },
      {
        dataField: "CampaignCustomerCallStatus", // trạng thái
        caption: "CampaignCustomerCallStatus",
      },
      {
        dataField: "CustomerFeedBack", // Khách hàng phản hồi
        caption: "CustomerFeedBack",
      },
      {
        dataField: "Remark", // ghi chú
        caption: "Remark",
      },
    ] as ColumnOptions[];
  }, [isLoading]);

  return (
    <Popup
      className="popup-history"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={`Add Field`}
      width={900}
      height={700}
      visible={popupVisible}
    >
      {/* <ScrollView className="popup-customer-content" width={"100%"}> */}
      <GridViewCustomize
        isLoading={isLoading}
        dataSource={data?.isSuccess ? data.Data : []}
        columns={columns}
        keyExpr={["CampaignCode", "AgentCode"]}
        onReady={(ref: any) => (gridRef = ref)}
        allowSelection={true}
        onSelectionChanged={() => {}}
        onSaveRow={() => {}}
        onEditorPreparing={() => {}}
        onEditRowChanges={() => {}}
        onDeleteRows={() => {}}
        onEditRow={() => {}}
        storeKey={"popup-history"}
        isSingleSelection
        toolbarItems={[]}
        isHiddenCheckBox={true}
      />
      {/* </ScrollView> */}

      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Close")}
          stylingMode={"contained"}
          onClick={onCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default memo(History_Call);
