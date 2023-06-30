import { useClientgateApi } from "@/packages/api";
import { TagBox } from "devextreme-react";
import React, { useState } from "react";

export default function TagboxCustom({ data }: any) {
  console.log(5, data);

  const [datatag, setDataTag] = useState(data);
  const api = useClientgateApi();
  const handleCustomItemCreating = async (e: any) => {
    // const resp = await api.Mst_Tag_Create({
    //   TagName: e.text,
    //   TagDesc: e.text,
    // });
    // console.log(resp);
    const newItem = {
      TagName: e.text,
      TagDesc: e.text,
    };
    const isItemInDataSource = datatag.some(
      (item: any) => item.TagName === newItem.TagName
    );
    if (!isItemInDataSource) {
      e.component.option("value", [
        ...e.component.option("value"),
        newItem.TagName,
      ]);
      setDataTag([newItem, ...datatag]);
    }
    // Select the newly created item

    return Promise.resolve();
  };
  return (
    <TagBox
      dataSource={datatag}
      inputAttr={{ "aria-label": "Product" }}
      displayExpr="TagName"
      valueExpr="TagName"
      searchEnabled={true}
      // hideSelectedItems={true}
      onCustomItemCreating={handleCustomItemCreating}
      acceptCustomValue={true}
      onValueChanged={(e) => console.log(e.value)}
    />
  );
}
