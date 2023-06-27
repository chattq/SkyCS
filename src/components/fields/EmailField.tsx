import { Icon } from "@/packages/ui/icons";
import { Button, TextBox } from "devextreme-react";
import { nanoid } from "nanoid";
import { useState } from "react";

export const EmailField = ({ component, formData, field, editType }: any) => {
  // init data
  // component.updateData("CtmEmail", formData["CtmEmail"] || []);
  const [emails, setEmails] = useState<any>(formData["CtmEmail"] || []);
  const handleRemoveItem = (id: string) => {
    /// remove item at `index` from `emails` list
    const result = emails.filter((_: any, i: number) => _.id !== id);
    component.updateData("CtmEmail", result);
    setEmails(result);
  };
  const handleEditItem = (id: string, val: any) => {
    /// edit item at `index` from `emails` list
    const result = emails.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          CtmEmail: val,
        };
      }
      return item;
    });
    component.updateData("CtmEmail", result);
    setEmails(result);
  };
  // setFormValue(formData);

  const handleCheck = (id: string) => {
    const result = emails.map((item: any) => {
      return {
        ...item,
        FlagDefault: item.id == id ? "1" : "0",
      };
    });

    component.updateData("CtmEmail", result);

    setEmails(result);
  };

  return (
    <>
      {emails.map((item: any, index: any) => {
        return (
          <div key={item.id} className={"flex items-center"}>
            <input
              type={"radio"}
              className="mr-2"
              onChange={async (e: any) => {
                handleCheck(item.id);
              }}
              checked={item.FlagDefault == "1"}
              disabled={!item.CtmEmail || editType == "detail"}
              readOnly={editType == "detail"}
            />
            <TextBox
              onValueChanged={async (e: any) =>
                handleEditItem(item.id, e.value)
              }
              validationMessageMode={"always"}
              value={item.CtmEmail}
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
            const data = formData["CtmEmail"] || [];
            component.updateData("CtmEmail", [
              ...emails,
              {
                id: nanoid(),
                FlagDefault: emails.length == 0 ? "1" : "0",
                CtmEmail: null,
              },
            ]);
            setEmails([
              ...emails,
              {
                id: nanoid(),
                FlagDefault: emails.length == 0 ? "1" : "0",
                CtmEmail: null,
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
