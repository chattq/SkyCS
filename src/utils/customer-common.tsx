import { AvatarField } from "@/components/fields/AvatarField";
import { EmailField } from "@/components/fields/EmailField";
import MultiSelectBox from "@/components/fields/MultiSelectBox";
import { PhoneField } from "@/components/fields/PhoneField";
import { ZaloField } from "@/components/fields/ZaloField";
import { RequiredField } from "@/packages/common/Validation_Rules";
import { MdMetaColGroupSpecDto } from "@/packages/types";
import { Switch } from "devextreme-react";
import { match } from "ts-pattern";

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
  return match(field.ColDataType)
    .with("PERCENT", () => {
      return {
        min: 0,
        max: 100,
      };
    })
    .with("DATE", () => {
      return {
        type: "date",
        displayFormat: "yyyy/MM/dd",
        openOnFieldClick: true,
      };
    })
    .with("DATETIME", () => {
      return {
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

const flagFieldRender = ({
  data,
  customOption,
}: {
  data: any;
  customOption?: any;
}) => {
  // console.log("data:", data);
  let valueChanged = (e: any) => {
    data.component.updateData(data.dataField, e.value ? "1" : "0");
  };

  return (
    <Switch
      readOnly={customOption?.editType == "detail"}
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
      render: (data: any) => flagFieldRender({ data: data, customOption: {} }),
    }))
    .otherwise(() => ({}));
};

export const getListField = ({
  listField,
  listDynamic,
  customOptions,
}: {
  listField: any;
  listDynamic?: any;
  customOptions?: any;
}) => {
  return listField?.map((field: any) => {
    return match(field?.ColDataType)
      .with("SELECTMULTIPLESELECTBOX", () => {
        const options = JSON.parse(field.JsonListOption || "[]");
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          itemType: "group",
          ColCodeSys: field.ColCodeSys,
          // dataField: field.ColCodeSys,
          label: {
            text: field.ColCaption,
          },
          render: (param: any) => {
            const { component, formData } = param;
            // init data
            component.updateData(
              field.ColCodeSys,
              options
                .filter((opt: any) => opt.IsSelected)
                .map((opt: any) => opt.Value)
            );
            return (
              <MultiSelectBox
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
                listOption={options}
              />
            );
          },
        };
      })

      .with("EMAIL", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          // dataField: field.ColCodeSys,
          render: (param: any) => {
            const { component, formData } = param;
            return (
              <EmailField
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("ZALOUSERFOLLOWER", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          // dataField: field.ColCodeSys,
          render: (param: any) => {
            const { component, formData } = param;
            return (
              <ZaloField
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("PHONE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          // dataField: field.ColCodeSys,
          render: (param: any) => {
            const { component, formData } = param;
            return (
              <PhoneField
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("IMAGE", () => {
        return match(field.ColCode)
          .with("AVATAR", () => {
            return {
              FlagIsColDynamic: field.FlagIsColDynamic,
              ColDataType: field.ColDataType,
              groupKeys: field.ColGrpCodeSys,
              ColCodeSys: field.ColCodeSys,

              itemType: "group",
              label: {
                text: field.ColCaption,
              },
              // dataField: field.ColCodeSys,
              render: (param: any) => {
                const { component, formData } = param;
                return (
                  <AvatarField
                    field={field}
                    component={component}
                    formData={formData}
                    editType={customOptions?.editType}
                  />
                );
              },
            };
          })
          .otherwise(() => {
            return {
              FlagIsColDynamic: field.FlagIsColDynamic,
              groupKeys: field.ColGrpCodeSys,
              dataField: field.ColCodeSys,
              editorType: mapEditorType(field.ColDataType!),
              ColCodeSys: field.ColCodeSys,

              ColDataType: field.ColDataType,
              label: {
                text: field.ColCaption,
              },
              validationMessagePosition: "bottom",
              editorOptions: mapEditorOption({
                field: field,
                listDynamic: listDynamic ?? {},
              }),
              validationRules: mapValidationRules(field),
              ...mapCustomOptions(field),
            };
          });
      })
      .otherwise(() => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          groupKeys: field.ColGrpCodeSys,
          dataField: field.ColCodeSys,
          editorType: mapEditorType(field.ColDataType!),
          ColCodeSys: field.ColCodeSys,

          ColDataType: field.ColDataType,
          label: {
            text: field.ColCaption,
          },
          validationMessagePosition: "bottom",
          editorOptions: mapEditorOption({
            field: field,
            listDynamic: listDynamic ?? {},
            customOption: customOptions ?? {},
          }),
          validationRules: mapValidationRules(field),
          ...mapCustomOptions(field),
        };
      });
  });
};
