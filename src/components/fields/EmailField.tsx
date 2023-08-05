import { Icon } from "@/packages/ui/icons";
import { Button, TextBox, Validator } from "devextreme-react";
import { CustomRule, RequiredRule } from "devextreme-react/form";
import { nanoid } from "nanoid";
import React, { useState } from "react";

export const checkEmail = (list: any[]) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const allValid = list?.every((item) => {
    return emailRegex.test(item?.CtmEmail);
  });

  return allValid;
};

export const EmailField = ({ component, formData, field, editType }: any) => {
  const [emails, setEmails] = useState<any>(formData["CtmEmail"] || []);

  const validatorRef: any = React.useRef(null);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleRemoveItem = (id: string) => {
    const result = emails.filter((_: any, i: number) => _.id !== id);

    const check = result?.some((_: any) => _?.FlagDefault == "1");

    if (!check) {
      const expectedResult = result?.map((_: any, i: number) => {
        if (i == 0) {
          return {
            ..._,
            FlagDefault: "1",
          };
        }
        return _;
      });

      component.updateData("CtmEmail", expectedResult);
      setEmails(expectedResult);
    } else {
      component.updateData("CtmEmail", result);

      setEmails(result);
    }
  };

  const handleEditItem = (id: string, val: any) => {
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
    <div className="flex items-center">
      <div>
        {emails.map((item: any, index: any) => {
          return (
            <div key={item.id} className={"flex items-center my-2"}>
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
              >
                <Validator ref={validatorRef}>
                  <RequiredRule message="Vui lòng nhập Email!" />
                  <CustomRule
                    message="Vui lòng nhập đúng định dạng Email!"
                    validationCallback={(options) => {
                      const value: any = options.value;
                      return emailRegex.test(value);
                    }}
                  />
                </Validator>
              </TextBox>

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
      </div>

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
    </div>
  );
};
