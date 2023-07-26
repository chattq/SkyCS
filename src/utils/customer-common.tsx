import { AvatarField } from "@/components/fields/AvatarField";
import CustomerCodeSysERPField from "@/components/fields/CustomerCodeSysERPField";
import CustomerGroupField from "@/components/fields/CustomerGroupField";
import CustomerTypeField from "@/components/fields/CustomerTypeField";
import CustomizePhoneField from "@/components/fields/CustomizePhoneField";
import DateField from "@/components/fields/DateField";
import DateTimeField from "@/components/fields/DateTimeField";
import { EmailField } from "@/components/fields/EmailField";
import MultiSelectBox from "@/components/fields/MultiSelectBox";
import PartnerTypeField from "@/components/fields/PartnerTypeField";
import { PhoneField } from "@/components/fields/PhoneField";
import { UploadField } from "@/components/fields/UploadField";
import { ZaloField } from "@/components/fields/ZaloField";
import { revertEncodeFileType } from "@/components/ulti";
import { RequiredField } from "@/packages/common/Validation_Rules";
import { MdMetaColGroupSpecDto } from "@/packages/types";
import { Switch } from "devextreme-react";
import { match } from "ts-pattern";

export const mapEditorType = (dataType: string) => {
  return match(dataType)
    .with("SELECTONERADIO", () => "dxRadioGroup")
    .with("SELECTONEDROPBOX", () => "dxSelectBox")
    .with("DATE", () => "dxDateBox")
    .with("DATETIME", () => "dxDateBox")
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
  defaultValue,
}: {
  field: Partial<MdMetaColGroupSpecDto>;
  listDynamic?: any;
  listFormData?: any;
  customOption?: any;
  defaultValue?: any;
}) => {
  const commonOptions = {
    searchEnabled: true,
    validationMessageMode: "always",
  };

  return (
    match(field.ColDataType)
      .with("PERCENT", () => {
        return {
          min: 0,
          max: 100,
        };
      })
      // .with("DATE", () => {
      //   return {
      //     type: "date",
      //     displayFormat: "yyyy/MM/dd",
      //     openOnFieldClick: true,
      //   };
      // })
      // .with("DATETIME", () => {
      //   return {
      //     type: "datetime",
      //     openOnFieldClick: true,
      //     displayFormat: "yyyy/MM/dd HH:MM",
      //   };
      // })
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
          defaultValue: defaultValue
            ? defaultValue[`${field.ColCodeSys}`]
            : undefined,
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
        const items = JSON.parse(field.JsonListOption ?? "[]");

        const currentValue = defaultValue
          ? defaultValue[`${field.ColCodeSys}`]
          : undefined;

        const list = listFormData
          ? Object.entries(listFormData)
              .map(([key, value]) => {
                if (value == currentValue) {
                  return value;
                }
              })
              .filter((item: any) => item)
          : [];

        const checkItem = currentValue
          ? items?.map((item: any) => {
              return {
                ...item,
                IsSelected: list.find((c: any) => c == item.Value),
              };
            })
          : items?.find((item: any) => item.IsSelected);
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
      })
  );
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

const flagFieldRender = (data: any, customOption?: any) => {
  // console.log("data:", data);
  let valueChanged = (e: any) => {
    data.component.updateData(data.dataField, e.value ? "1" : "0");
  };

  return (
    <Switch
      disabled={customOption?.editType == "detail"}
      defaultValue={data.editorOptions.value === "1"}
      onValueChanged={valueChanged}
    ></Switch>
  );
};

export const mapCustomOptions = (
  field: Partial<MdMetaColGroupSpecDto>,
  customOptions?: any
) => {
  return match(field.ColDataType)
    .with("SELECTONE", () => ({
      validationMessagePosition: "top",
    }))
    .with("SELECTMANY", () => ({
      validationMessagePosition: "top",
    }))
    .with("FLAG", () => ({
      render: (data: any) => flagFieldRender(data, customOptions),
    }))
    .otherwise(() => ({}));
};

export const getListField = ({
  listField,
  listDynamic,
  customOptions,
  defaultValue,
}: {
  listField: any;
  listDynamic?: any;
  customOptions?: any;
  defaultValue?: any;
}) => {
  return listField?.map((field: any) => {
    return match(field?.ColDataType)
      .with("SELECTMULTIPLESELECTBOX", () => {
        const currentValue = listDynamic[`${field.ColCodeSys}`] ?? [];

        const options = JSON.parse(field.JsonListOption || "[]");

        const filterdOptions = currentValue
          ? options?.map((item: any) => {
              if (currentValue?.find((c: any) => c == item?.Value)) {
                return {
                  ...item,
                  IsSelected: true,
                };
              } else {
                return {
                  ...item,
                  IsSelected: false,
                };
              }
            })
          : options;

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
              filterdOptions
                .filter((opt: any) => opt.IsSelected)
                .map((opt: any) => opt.Value)
            );
            return (
              <MultiSelectBox
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
                listOption={filterdOptions}
              />
            );
          },
        };
      })
      .with("CUSTOMERTYPE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",

          // dataField: field.ColCodeSys,
          render: (param: any) => {
            return (
              <CustomerTypeField param={param} customOptions={customOptions} />
            );
          },
        };
      })
      .with("CUSTOMERGROUP", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          // dataField: field.ColCodeSys,
          render: (param: any) => {
            return (
              <CustomerGroupField param={param} customOptions={customOptions} />
            );
          },
        };
      })
      .with("PARTNERTYPE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          // dataField: field.ColCodeSys,
          render: (param: any) => {
            return (
              <PartnerTypeField param={param} customOptions={customOptions} />
            );
          },
        };
      })
      .with("CUSTOMERCODESYSERP", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          // dataField: field.ColCodeSys,
          render: (param: any) => {
            return (
              <CustomerCodeSysERPField
                param={param}
                customOptions={customOptions}
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
      .with("TEXTAREA", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          groupKeys: field.ColGrpCodeSys,
          dataField: field.ColCodeSys,
          editorType: "dxTextArea",
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
      .with("CUSTOMIZEPHONE", () => {
        const options = JSON.parse(field?.JsonListOption) ?? [];

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
            return <CustomizePhoneField param={param} options={options} />;
          },
        };
      })
      .with("IMAGE", () => {
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
      .with("FILE", () => {
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
            const { component: formComponent, dataField } = param;

            return (
              <UploadField
                field={field}
                formInstance={formComponent}
                onValueChanged={(files: any) => {
                  formComponent.updateData(
                    field?.ColCodeSys,
                    files?.map((item: any) => {
                      return {
                        ...item,
                        FileType: revertEncodeFileType(item?.FileType),
                      };
                    })
                  );
                }}
                readonly={customOptions?.editType == "detail"}
              />
            );
          },
        };
      })
      .with("DATE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          // dataField: field.ColCodeSys,
          render: (param: any) => {
            return (
              <DateField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("DATETIME", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          // dataField: field.ColCodeSys,
          render: (param: any) => {
            return (
              <DateTimeField
                param={param}
                customOptions={customOptions}
                field={field}
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
            customOption: customOptions ?? {},
            defaultValue: defaultValue ?? {},
          }),
          validationRules: mapValidationRules(field),
          ...mapCustomOptions(field, customOptions),
        };
      });
  });
};
