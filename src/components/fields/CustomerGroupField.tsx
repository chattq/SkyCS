import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { TagBox } from "devextreme-react";
import { useEffect, useState } from "react";

const CustomerGroupField = ({ param, customOptions }: any) => {
  const { component, formData } = param;

  const api = useClientgateApi();

  const [value, setValue] = useState<any>([]);

  const { data }: any = useQuery(
    ["CustomerGroupField"],
    api.Mst_CustomerGroup_GetAllActive
  );

  useEffect(() => {
    if (formData["CustomerGrpCode"]) {
      setValue(formData["CustomerGrpCode"]);
    }
  }, []);

  return (
    <>
      <TagBox
        dataSource={data?.DataList ?? []}
        valueExpr="CustomerGrpCode"
        displayExpr="CustomerGrpName"
        onValueChanged={(e: any) => {
          component.updateData("CustomerGrpCode", e.value);
          setValue(e.value);
        }}
        value={value}
        readOnly={customOptions?.editType == "detail"}
        name="CustomerGrpCode"
        validationMessagePosition="bottom"
      ></TagBox>
    </>
  );
};

export default CustomerGroupField;
