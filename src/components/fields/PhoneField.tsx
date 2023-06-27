import { Icon } from "@/packages/ui/icons";
import { Button, TextBox } from "devextreme-react";
import { nanoid } from "nanoid";
import { useState } from "react";

export const PhoneField = ({ component, formData, field, editType }: any) => {
  // init data
  // component.updateData("CtmPhoneNo", formData["CtmPhoneNo"] || []);
  const [phones, setPhones] = useState<any>(formData["CtmPhoneNo"] || []);
  const handleRemoveItem = (id: string) => {
    /// remove item at `index` from `phones` list
    const result = phones.filter((_: any, i: number) => _.id !== id);
    component.updateData("CtmPhoneNo", result);
    setPhones(result);
  };
  const handleEditItem = (id: string, val: any) => {
    /// edit item at `index` from `phones` list
    const result = phones.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          CtmPhoneNo: val,
        };
      }
      return item;
    });
    component.updateData("CtmPhoneNo", result);
    setPhones(result);
  };
  // setFormValue(formData);

  const handleCheck = (id: string) => {
    const result = phones.map((item: any) => {
      return {
        ...item,
        FlagDefault: item.id == id ? "1" : "0",
      };
    });
    component.updateData("CtmPhoneNo", result);

    setPhones(result);
  };

  return (
    <>
      {phones.map((item: any, index: any) => {
        return (
          <div key={item.id} className={"flex items-center my-2"}>
            <input
              type={"radio"}
              className={"mr-2"}
              onChange={async (e: any) => {
                handleCheck(item.id);
              }}
              checked={item.FlagDefault == "1"}
              disabled={!item.CtmPhoneNo || editType == "detail"}
            />
            <TextBox
              onValueChanged={async (e: any) =>
                handleEditItem(item.id, e.value)
              }
              validationMessageMode={"always"}
              value={item.CtmPhoneNo}
              readOnly={editType == "detail"}
            />
            {editType != "detail" && (
              <Button
                onClick={() => handleRemoveItem(item.id)}
                stylingMode={"text"}
              >
                <Icon name={"trash"} size={14} color={"#ff5050"} />
              </Button>
            )}
          </div>
        );
      })}

      {editType != "detail" && (
        <Button
          text={"Add"}
          type={"default"}
          stylingMode={"contained"}
          onClick={() => {
            const formData = component.option("formData");
            const data = formData["CtmPhoneNo"] || [];
            component.updateData("CtmPhoneNo", [
              ...phones,
              {
                id: nanoid(),
                FlagDefault: phones.length == 0 ? "1" : "0",
                CtmPhoneNo: null,
              },
            ]);
            setPhones([
              ...phones,
              {
                id: nanoid(),
                FlagDefault: phones.length == 0 ? "1" : "0",
                CtmPhoneNo: null,
              },
            ]);
            // setFormValue(formData);
            // console.log(formData);
          }}
          className={"mx-2 w-[100px]"}
        />
      )}
    </>
  );
};
