import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { customerType } from "./CustomerCodeSysERPField";

const CustomerTypeField = ({ param, customOptions }: any) => {
  const { component, formData } = param;

  const setCustomerTypeValue = useSetAtom(customerType);

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  const { data }: any = useQuery(
    ["CustomerTypeField"],
    api.Mst_CustomerType_GetAllCustomerType
  );

  useEffect(() => {
    if (formData["CustomerType"]) {
      setValue(formData["CustomerType"]);
      setCustomerTypeValue(formData["CustomerType"]);
    } else {
      if (data?.Data?.Lst_Mst_CustomerType?.length > 0) {
        console.log(data?.Data?.Lst_Mst_CustomerType);
        setValue("CANHAN");
        setCustomerTypeValue("CANHAN");
        component.updateData("CustomerType", "CANHAN");
      }
    }
  }, [data]);

  return (
    <SelectBox
      dataSource={data?.Data?.Lst_Mst_CustomerType ?? []}
      valueExpr="CustomerType"
      displayExpr="CustomerTypeName"
      onValueChanged={(e: any) => {
        component.updateData("CustomerType", e.value);
        setValue(e.value);
        setCustomerTypeValue(e.value);
      }}
      value={value}
      readOnly={customOptions?.editType == "detail"}
    ></SelectBox>
  );
};

export default CustomerTypeField;
