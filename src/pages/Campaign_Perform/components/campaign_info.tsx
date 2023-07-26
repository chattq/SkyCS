import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";
import { useWindowSize } from "@/packages/hooks/useWindowSize";

import { showErrorAtom } from "@/packages/store";
import {
  Cpn_CampaignCustomerData,
  Cpn_Campaign,
  FlagActiveEnum,
  Mst_Customer,
} from "@/packages/types";
import {
  Button,
  DropDownBox,
  ScrollView,
  SelectBox,
  TextBox,
} from "devextreme-react";
import { useSetAtom } from "jotai";
import { memo, useEffect, useMemo, useState } from "react";
import "../styles.scss";
import { Icon } from "@/packages/ui/icons";

export const Cpn_CampaignInfo = memo(
  ({
    cpnCampainData,
    cpnCustomerData,
  }: {
    cpnCampainData: Cpn_Campaign | undefined;
    cpnCustomerData: Cpn_CampaignCustomerData;
  }) => {
    const { auth } = useAuth();
    const { t } = useI18n("Cpn_CampaignPerformPage");
    const api = useClientgateApi();

    const showError = useSetAtom(showErrorAtom);

    const [isExpand, setExpand] = useState(true);

    return (
      <>
        {!!cpnCampainData && (
          <>
            <div className="group-head w-full pl-1 pr-1">
              <span>Thông tin chiến dịch</span>
              <div className="float-right">
                {isExpand && (
                  <button
                    onClick={() => {
                      setExpand(false);
                    }}
                  >
                    <Icon name="expandCampaign"></Icon>
                  </button>
                )}
                {!isExpand && (
                  <button
                    onClick={() => {
                      setExpand(true);
                    }}
                  >
                    <Icon
                      style={{ transform: "rotate(180deg)" }}
                      name="expandCampaign"
                    ></Icon>
                  </button>
                )}
              </div>
            </div>
            {isExpand && (
              <div className={`w-full`}>
                <div className="w-full p-2 pb-3">
                  <span className="font-customer float-left">Chiến dịch</span>
                  <span className="font-customer font-customer--content float-right">
                    {cpnCampainData.CampaignName}
                  </span>
                </div>
                <div className="w-full p-2 pb-3">
                  <span className="font-customer float-left">Khách hàng</span>
                  <span className="font-customer font-customer--content float-right">
                    {cpnCustomerData.CustomerName}
                  </span>
                </div>
                <div className="w-full p-2 pb-3">
                  <span className="font-customer float-left">SĐT</span>
                  <span className="font-customer font-customer--content float-right">
                    {cpnCustomerData.CustomerPhoneNo1 ??
                      cpnCustomerData.CustomerPhoneNo2 ??
                      cpnCustomerData.CustomerPhoneNo}
                  </span>
                </div>
                <div className="w-full p-2 pb-3">
                  <span className="font-customer float-left">Thời điểm gọi ra</span>
                  <span className="font-customer font-customer--content float-right">
                    {cpnCustomerData.CallOutDTimeUTC}
                  </span>
                </div>
                <div className="w-full p-2 pb-3">
                  <span className="font-customer float-left">Số lần gọi</span>
                  <span className="font-customer font-customer--content float-right">{cpnCustomerData.QtyCall}</span>
                </div>
                <div className="w-full p-2 pb-3">
                  <span className="font-customer float-left">Agent Phụ trách</span>
                  <span className="font-customer font-customer--content float-right">
                    {cpnCustomerData.AgentName}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </>
    );
  }
);
