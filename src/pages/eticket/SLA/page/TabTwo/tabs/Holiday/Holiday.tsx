import { useI18n } from "@/i18n/useI18n";
import { SLA_EditType } from "@/pages/eticket/SLA/components/store";
import { useAtomValue } from "jotai";
import HolidayForm from "./HolidayForm";
import HolidayTable from "./HolidayTable";

const Holiday = () => {
  const type = useAtomValue(SLA_EditType);

  const { t } = useI18n("SLA_Holidays");

  return (
    <div className="mt-2 p-2 pb-[100px]">
      <h3 className="pb-2">{t("List of holidays")}</h3>
      {type != "detail" && <HolidayForm />}
      <HolidayTable />
    </div>
  );
};

export default Holiday;
