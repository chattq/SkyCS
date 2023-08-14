import { getDMY } from "@/utils/time";
import { DateBox } from "devextreme-react";
import { useEffect, useState } from "react";

const DateField = ({ param, customOptions, field, editType }: any) => {
  const { component, formData } = param;

  const [value, setValue] = useState<any>(undefined);

  useEffect(() => {
    if (formData[field?.ColCodeSys]) {
      setValue(formData[field?.ColCodeSys]);
    }
  }, []);

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{value}</div>
      ) : (
        <DateBox
          defaultValue={isNaN(value) ? new Date() : value}
          displayFormat="yyyy/MM/dd"
          name={field?.ColCodeSys}
          onValueChanged={(e: any) => {
            component.updateData(field?.ColCodeSys, getDMY(e.value));
          }}
          openOnFieldClick
          type="date"
          readOnly={editType == "detail"}
        />
      )}
    </>
  );
};

export default DateField;
