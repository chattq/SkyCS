import { SLA_EditType } from "@/pages/eticket/SLA/components/store";
import { useAtomValue } from "jotai";
import HolidayForm from "./HolidayForm";
import HolidayTable from "./HolidayTable";

const Holiday = () => {
  const type = useAtomValue(SLA_EditType);

  return (
    <div className="mt-2 p-2 pb-[100px]">
      <h3 className="pb-2">Danh sách ngày nghỉ</h3>
      {type != "detail" && <HolidayForm />}
      <HolidayTable />
    </div>
  );
};

export default Holiday;
