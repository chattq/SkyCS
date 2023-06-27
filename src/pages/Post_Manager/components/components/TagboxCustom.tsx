import { TagBox } from "devextreme-react";
import React, { useState } from "react";

export default function TagboxCustom({ data }: any) {
  const dataSource = [
    {
      text: "HD Video Player",
      value: "abc",
    },
    {
      text: "SuperHD Video Player",
      value: "abcd",
    },
    {
      text: "SuperPlasma 50",
      value: "abcde",
    },
    {
      text: "SuperLED 50",
      value: "abcef",
    },
  ];

  const [datatag, setDataTag] = useState(dataSource);
  const handleCustomItemCreating = (e: any) => {
    const newItem = {
      text: e.text,
      value: e.text,
    };
    const isItemInDataSource = datatag.some(
      (item) => item.value === newItem.value
    );
    if (!isItemInDataSource) {
      e.component.option("value", [
        ...e.component.option("value"),
        newItem.value,
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
      displayExpr="text"
      valueExpr="value"
      searchEnabled={true}
      // hideSelectedItems={true}
      onCustomItemCreating={handleCustomItemCreating}
      acceptCustomValue={true}
      onValueChanged={(e) => console.log(e.value)}
    />
  );
}
