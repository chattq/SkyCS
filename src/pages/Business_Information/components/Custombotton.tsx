import { SelectBox, TextBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import React, { memo, useState } from "react";
import { dataBotton } from "./store";

export default function Custombotton({ dataSelect, data, formRef }: any) {
  const [check, setCheck] = useState("");
  const setDataBotton = useSetAtom(dataBotton);
  return (
    <div className={"flex items-center"}>
      {check === "abc" ? (
        <TextBox
          width={400}
          onValueChanged={(e: any) => {
            // setDataBotton(e.value);
            formRef.instance().updateData("OrgID", e.value);
          }}
        ></TextBox>
      ) : (
        <SelectBox
          width={400}
          dataSource={data}
          displayExpr="OrgID"
          valueExpr="OrgID"
          placeholder="Input"
          onValueChanged={(e: any) => {
            // setDataBotton(e.value);
            formRef.instance().updateData("OrgID", e.value);
          }}
        ></SelectBox>
      )}
      -
      <SelectBox
        width={150}
        dataSource={dataSelect}
        displayExpr="text"
        valueExpr="value"
        onValueChanged={(e: any) => {
          setCheck(e.value);
        }}
        defaultValue={dataSelect[1].value}
      ></SelectBox>
    </div>
  );
}
