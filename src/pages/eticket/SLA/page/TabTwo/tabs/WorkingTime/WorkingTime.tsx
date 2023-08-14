import { Switch } from "devextreme-react";

import { useI18n } from "@/i18n/useI18n";
import { SLA_EditType } from "@/pages/eticket/SLA/components/store";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import RangeTimeSlider from "./RangeTimeSlider";
import { flag247, workingTimeList } from "./store";
import "./style.scss";

const WorkingTime = () => {
  const { t: dayTranslate } = useI18n("SLA_Days");
  const { t } = useI18n("SLA_WorkingTime");

  const daysInTheWeek = [
    dayTranslate("Monday"),
    dayTranslate("Tuesday"),
    dayTranslate("Wednesday"),
    dayTranslate("Thursday"),
    dayTranslate("Friday"),
    dayTranslate("Saturday"),
    dayTranslate("Sunday"),
  ];

  const list = useAtomValue(workingTimeList);

  const setList = useSetAtom(workingTimeList);

  const setFlag247 = useSetAtom(flag247);

  const handleToggle = (checked: boolean) => {
    setFlag247(checked);
    if (checked) {
      const result = list.map((item: any) => {
        return {
          ...item,
          Check: true,
          hasMoreSlide: true,
          Slider: item.Slider.map((c: any) => {
            return {
              ...c,
              TimeStart: 0,
              TimeEnd: 1440,
            };
          }),
        };
      });

      setList(result);
    }
  };

  const type = useAtomValue(SLA_EditType);

  return (
    <div className="mt-5 p-2">
      <div className="flex gap-3 ">
        <Switch
          onValueChanged={(e: any) => {
            handleToggle(e.value);
          }}
          disabled={type == "detail"}
        />
        <div>{t("Working 24/7")}</div>
      </div>

      {list.map((item: any, index: any) => {
        return <RangeTimeSlider item={item} key={nanoid()} />;
      })}
    </div>
  );
};

export default WorkingTime;
