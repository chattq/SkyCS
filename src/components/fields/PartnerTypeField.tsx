import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";
import { useEffect, useState } from "react";

const PartnerTypeField = ({ param, customOptions }: any) => {
  const { component, formData } = param;

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  const { data }: any = useQuery(
    ["PartnerTypeField"],
    api.Mst_PartnerType_GetAllActive
  );

  useEffect(() => {
    if (formData["PartnerType"]) {
      setValue(formData["PartnerType"]);
    } else {
      if (data?.DataList?.length > 0) {
        setValue("CUSTOMER");
        component.updateData("PartnerType", "CUSOMTER");
      }
    }
  }, [data]);

  return (
    <SelectBox
      dataSource={data?.DataList ?? []}
      valueExpr="PartnerType"
      displayExpr="PartnerTypeName"
      onValueChanged={(e: any) => {
        component.updateData("PartnerType", e.value);
        setValue(e.value);
      }}
      value={value}
      readOnly={customOptions?.editType == "detail"}
    ></SelectBox>
  );
};

export default PartnerTypeField;