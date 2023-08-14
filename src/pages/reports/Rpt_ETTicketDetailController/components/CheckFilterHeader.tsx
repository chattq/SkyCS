import { useI18n } from "@/i18n/useI18n";
import { CheckBox } from "devextreme-react";
import { forwardRef, useState } from "react";

const CheckFilter = (ref: any) => {
  const { t } = useI18n("Rpt_ETTicketSynthesisController");
  const { dataRef, onSetStatus } = ref;
  const [checkOutofDate, setCheckOutofDate] = useState<any>("");
  const [checkSLANotResponding, setCheckSLANotResponding] = useState<any>("");
  // .with("FlagSLANotResponding", () => {
  //   if (check) {
  //     ref.instance?.filter(["FlagSLANotResponding", "=", "1"]);
  //   } else {
  //     ref.instance?.clearFilter();
  //   }
  // })
  // .with("FlagTicketOutOfDate", () => {
  //   if (check) {
  //     ref.instance?.filter(["FlagTicketOutOfDate", "=", "1"]);
  //   } else {
  //     ref.instance?.filter(["FlagSLANotResponding", "=", "1"]);
  //     // ref.instance?.clearFilter();
  //   }
  // })

  const handleOutofDate = (check: any, ref: any) => {
    setCheckOutofDate(check);
    if (check) {
      ref.instance?.filter(["FlagTicketOutOfDate", "=", "1"]);
    } else {
      ref.instance?.clearFilter();
    }
    if (check === false && checkSLANotResponding === true) {
      ref.instance?.filter(["FlagSLANotResponding", "=", "1"]);
    }
  };
  const handleSLANotResponding = (check: any, ref: any) => {
    setCheckSLANotResponding(check);
    if (check) {
      ref.instance?.filter(["FlagSLANotResponding", "=", "1"]);
    } else {
      ref.instance?.clearFilter();
    }
    if (check === false && checkOutofDate === true) {
      ref.instance?.filter(["FlagTicketOutOfDate", "=", "1"]);
    }
  };
  return (
    <div className="flex items-center">
      <div className="mt-[3px] gap-2 flex items-center">
        <CheckBox
          key="FlagTicketOutOfDate"
          className="FlagTicketOutOfDate"
          onValueChanged={(e) => handleOutofDate(e.value, dataRef)}
        />
        <span className="font-semibold">{t("eTicket quá hạn")}</span>
      </div>
      <div className="mt-[3px] ml-6 gap-2 flex items-center">
        <CheckBox
          key="FlagSLANotResponding"
          className="FlagSLANotResponding"
          onValueChanged={(e) => handleSLANotResponding(e.value, dataRef)}
        />
        <span className="font-semibold">{t("eTicket không đáp ứng SLA")}</span>
      </div>
    </div>
  );
};

export const CheckFilterHeader = forwardRef(
  ({ dataRef, onSetStatus }: any, ref: any) => {
    return <CheckFilter dataRef={dataRef} onSetStatus={onSetStatus} />;
  }
);
