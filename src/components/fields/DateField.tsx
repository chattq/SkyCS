import { getDMY } from "@/utils/time";
import { DateBox } from "devextreme-react";

const DateField = ({ param, customOptions, field, editType }: any) => {
  const { component, formData } = param;

  const date: any = new Date(formData[field?.ColCodeSys]);

  return (
    <DateBox
      defaultValue={isNaN(date) ? new Date() : date}
      displayFormat="yyyy/MM/dd"
      name={field?.ColCodeSys}
      onValueChanged={(e: any) => {
        component.updateData(field?.ColCodeSys, getDMY(e.value));
      }}
      openOnFieldClick
      type="date"
      readOnly={editType == "detail"}
    />
  );
};

export default DateField;
