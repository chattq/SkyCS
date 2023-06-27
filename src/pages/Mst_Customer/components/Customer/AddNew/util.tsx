import { RequiredField } from "@/packages/common/Validation_Rules";
import { MdMetaColGroupSpecDto } from "@/packages/types";
import { CheckBox, Switch } from "devextreme-react";
import { IItemProps } from "devextreme-react/form";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { match } from "ts-pattern";
interface FormRenderContentProps {
  datasourceMapping: { [key: string]: any };
  customFields: any[];
}

export const mapEditorType = (dataType: string) => {
  return match(dataType)
    .with("SELECTONERADIO", () => "dxRadioGroup")
    .with("SELECTONEDROPBOX", () => "dxSelectBox")
    .with("DATE", () => "dxDateBox")
    .with("EMAIL", () => "dxTextBox")
    .with("FLAG", () => "dxSwitch")
    .with("MASTERDATA", () => "dxSelectBox")
    .with("SELECTMULTIPLESELECTBOX", () => "dxRadioGroup")
    .with("SELECTMULTIPLEDROPBOX", () => "dxTagBox")
    .with("SELECTONEDROPDOWN", () => "dxSelectBox")
    .with("SELECTMULTIPLEDROPDOWN", () => "dxTagBox")
    .with("MASTERDATASELECTMULTIPLE", () => "dxTagBox")
    .with("PERCENT", () => "dxNumberBox")
    .otherwise(() => "dxTextBox");
};

export const mapEditorOption = ({
  field,
  listDynamic,
  listFormData,
  customOption,
}: {
  field: Partial<MdMetaColGroupSpecDto>;
  listDynamic?: any;
  listFormData?: any;
  customOption?: any;
}) => {
  const commonOptions = {
    searchEnabled: true,
    validationMessageMode: "always",
  };

  return match(field.ColDataType ?? "")
    .with("PERCENT", () => {
      return {
        min: 0,
        max: 100,
      };
    })
    .with("DATE", () => {
      return {
        ...commonOptions,
        type: "date",
        displayFormat: "yyyy/MM/dd",
        openOnFieldClick: true,
      };
    })
    .with("DATETIME", () => {
      return {
        ...commonOptions,
        type: "datetime",
        openOnFieldClick: true,
      };
    })
    .with("EMAIL", () => {
      return {
        ...commonOptions,
      };
    })
    .with("FLAG", () => {
      return {
        ...commonOptions,
      };
    })
    .with("SELECTONE", () => {
      return {
        dataSource: JSON.parse(field.JsonListOption || "[]"),
        displayExpr: "Value",
        valueExpr: "Value",
      };
    })
    .with("SELECTMANY", () => {
      return {
        dataSource: JSON.parse(field.JsonListOption || "[]"),
        displayExpr: "Value",
        valueExpr: "Value",
      };
    })
    .with("MASTERDATA", () => {
      // console.log("=====================================");
      // console.log("object", listDynamic, "field ", field);
      return {
        dataSource: listDynamic[`${field.ColCodeSys}`] ?? [],
        displayExpr: "Value",
        valueExpr: "Key",
      };
    })
    .with("SELECTONEDROPBOX", () => {
      return {
        dataSource: JSON.parse(field.JsonListOption || "[]"),
        displayExpr: "Value",
        valueExpr: "Value",
      };
    })
    .with("SELECTONERADIO", () => {
      const items = JSON.parse(field.JsonListOption || "[]");

      const isExistCheckedRadio = listFormData
        ? Object.entries(listFormData).some(([key, value]) => {
            return key == field.ColCodeSys;
          })
        : false;

      const list = listFormData
        ? Object.entries(listFormData)
            .map(([key, value]) => {
              if (key == field.ColCodeSys) {
                return value;
              }
            })
            .filter((item: any) => item)
        : [];

      const checkItem = isExistCheckedRadio
        ? items.map((item: any) => {
            return {
              ...item,
              IsSelected: list.find((c: any) => c == item.Value),
            };
          })
        : items.find((item: any) => item.IsSelected);
      return {
        displayExpr: "Value",
        valueExpr: "Value",
        items: items,
        value: checkItem ? checkItem.Value : undefined,
      };
    })
    .with("SELECTMULTIPLEDROPBOX", () => {
      return {
        dataSource: JSON.parse(field.JsonListOption || "[]"),
        displayExpr: "Value",
        valueExpr: "Value",
      };
    })
    .with("SELECTMULTIPLESELECTBOX", () => {
      return {
        dataSource: JSON.parse(field.JsonListOption || "[]"),
        displayExpr: "Value",
        valueExpr: "Value",
      };
    })
    .with("SELECTONEDROPDOWN", () => {
      const list = JSON.parse(field.JsonListOption || "[]");
      return {
        dataSource: list,
        displayExpr: "Value",
        valueExpr: "Value",
        value:
          list.find((item: any) => {
            return item.IsSelected == true;
          })?.Value || undefined,
      };
    })
    .with("SELECTMULTIPLEDROPDOWN", () => {
      // console.log(JSON.parse(field.JsonListOption || "[]"));
      const list = JSON.parse(field.JsonListOption || "[]");

      return {
        dataSource: list,
        displayExpr: "Value",
        valueExpr: "Value",
        value:
          list
            .filter((item: any) => {
              return item.IsSelected == true;
            })
            .map((item: any) => {
              return item.Value;
            }) || [],
      };
    })
    .with("MASTERDATASELECTMULTIPLE", () => {
      return {
        dataSource: listDynamic[`${field.ColCodeSys}`] ?? [],
        displayExpr: "Value",
        valueExpr: "Key",
        searchEnabled: true,
      };
    })
    .otherwise(() => {
      return {
        ...commonOptions,
        ...customOption,
      };
    });
};

export const mapValidationRules = (field: Partial<MdMetaColGroupSpecDto>) => {
  const rules = [];
  if (field.ColDataType !== "FLAG" && field.FlagIsNotNull === "1") {
    rules.push(RequiredField(field.ColCaption!));
  }
  if (field.ColDataType === "EMAIL") {
    rules.push({
      type: "email",
      message: "Email is not valid",
    });
  }
  return rules;
};

export const flagFieldRender = (data: any) => {
  // console.log("data:", data);
  let valueChanged = (e: any) => {
    data.component.updateData(data.dataField, e.value ? "1" : "0");
  };

  return (
    <Switch
      defaultValue={data.editorOptions.value === "1"}
      onValueChanged={valueChanged}
    ></Switch>
  );
};

export const mapCustomOptions = (field: Partial<MdMetaColGroupSpecDto>) => {
  return match(field.ColDataType)
    .with("SELECTONE", () => ({
      validationMessagePosition: "top",
    }))
    .with("SELECTMANY", () => ({
      validationMessagePosition: "top",
    }))
    .with("FLAG", () => ({
      editorType: undefined,

      render: (data: any) => flagFieldRender(data),
    }))
    .otherwise(() => ({}));
};

export const FormRenderContent = ({
  datasourceMapping,
  customFields,
}: FormRenderContentProps) => {
  const mapValidationRules = (field: Partial<MdMetaColGroupSpecDto>) => {
    const rules = [];
    if (field.ColDataType !== "FLAG" && field.FlagIsNotNull === "1") {
      rules.push(RequiredField(field.ColCaption!));
    }
    if (field.ColDataType === "EMAIL") {
      rules.push({
        type: "email",
        message: "Email is not valid",
      });
    }
    return rules;
  };

  const formSettings = useMemo<IItemProps[]>(() => {
    const items: IItemProps[] = customFields.map<IItemProps>((field) => {
      if (field.ColDataType !== "SELECTMULTIPLESELECTBOX") {
        return {
          dataField: field.ColCode,
          editorType: mapEditorType(field.ColDataType!),
          label: {
            text: field.ColCaption,
            location: "left",
          },
          validationMessagePosition: "bottom",
          editorOptions: mapEditorOption(field),
          validationRules: mapValidationRules(field),
          ...mapCustomOptions(field),
        };
      }
      const options = JSON.parse(field.JsonListOption || "[]");
      return {
        itemType: "group",
        render: (param: any) => {
          const { component, formData } = param;
          // init data
          component.updateData(
            field.ColCode,
            options
              .filter((opt: any) => opt.IsSelected)
              .map((opt: any) => opt.Value)
          );
          return (
            <div className={"flex w-full"}>
              <div className={"flex"}>
                <label className={`dx-field-item-label display-block pr-4`}>
                  <span className={"dx-field-item-label-content"}>
                    <span className={"dx-field-item-label-text"}>
                      {field.ColCaption}
                    </span>
                    {field.FlagIsNotNull === "1" && (
                      <span className={"dx-field-item-required-mark"}> *</span>
                    )}
                  </span>
                </label>
                <div className={"flex-col dx-field-item-content ml-4"}>
                  <div className={"dx-texteditor-container flex flex-col"}>
                    {options.map((opt: any) => {
                      return (
                        <CheckBox
                          className={"mb-1"}
                          key={nanoid()}
                          name={`${field.ColCode}`}
                          text={opt.Value}
                          defaultValue={opt.IsSelected}
                          onValueChanged={(e: any) => {
                            const value = e.value;
                            const formData = component.option("formData");
                            const data = formData[field.ColCode!] || [];
                            // checked
                            if (value) {
                              data.push(opt.Value);
                            } else {
                              const index = data.findIndex(
                                (item: any) => item === opt.Value
                              );
                              if (index > -1) {
                                data.splice(index, 1);
                              }
                            }
                            component.updateData(field.ColCode, data);
                          }}
                        ></CheckBox>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        },
      };
    });
    items.push({
      itemType: "button",
      buttonOptions: {
        text: "Submit",
        useSubmitBehavior: true,
      },
    });
    return items;
  }, []);

  return formSettings;
};
