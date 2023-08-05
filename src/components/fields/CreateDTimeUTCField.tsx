import { useClientgateApi } from "@/packages/api";
import { getFullTime } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { DateBox } from "devextreme-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CreateDTimeUTCField = ({ param }: any) => {
  const { component, formData } = param;

  const { CustomerCodeSys } = useParams();

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  const { data: currentTime } = useQuery(["currentTime"], async () => {
    const resp: any = await api.Api_GetDTime();

    return resp?.Data?.DTimeServer ?? new Date();
  });

  function isValidDate(dateString: string) {
    const date: any = new Date(dateString);

    return !isNaN(date) && date.toISOString() !== "Invalid Date";
  }

  useEffect(() => {
    if (isValidDate(formData["CreateDTimeUTC"])) {
      setValue(formData["CreateDTimeUTC"]);
    } else {
      component.updateData("CreateDTimeUTC", getFullTime(currentTime));
      setValue(getFullTime(currentTime));
    }
  }, [currentTime]);

  return (
    <DateBox
      readOnly
      value={new Date(value)}
      type="datetime"
      displayFormat="yyyy/MM/dd hh:mm:ss"
    ></DateBox>
  );
};

export default CreateDTimeUTCField;
