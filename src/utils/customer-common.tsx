import { AvatarField } from "@/components/fields/AvatarField";
import CreateByField from "@/components/fields/CreateByField";
import CreateDTimeUTCField from "@/components/fields/CreateDTimeUTCField";
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
import { useClientgateApi } from "@/packages/api";
import { useApiHeaders } from "@/packages/api/headers";
import { requiredType } from "@/packages/common/Validation_Rules";
import { MdMetaColGroupSpecDto } from "@/packages/types";
import { FileUploader, Switch } from "devextreme-react";
import { useState } from "react";
import { match } from "ts-pattern";

export const mapEditorType = (dataType: string) => {
  return (
    match(dataType)
      .with("SELECTONERADIO", () => "dxRadioGroup")
      .with("SELECTONEDROPBOX", () => "dxSelectBox")
      .with("DATE", () => "dxDateBox")
      .with("DATETIME", () => "dxDateBox")
      .with("EMAIL", () => "dxTextBox")
      // .with("FLAG", () => "dxSwitch")
      .with("MASTERDATA", () => "dxSelectBox")
      .with("SELECTMULTIPLESELECTBOX", () => "dxRadioGroup")
      .with("SELECTMULTIPLEDROPBOX", () => "dxTagBox")
      .with("SELECTONEDROPDOWN", () => "dxSelectBox")
      .with("SELECTMULTIPLEDROPDOWN", () => "dxTagBox")
      .with("MASTERDATASELECTMULTIPLE", () => "dxTagBox")
      .with("PERCENT", () => "dxNumberBox")
      .otherwise(() => "dxTextBox")
  );
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
      // .with("FLAG", () => {
      //   return {
      //     defaultValue: true,
      //     ...commonOptions,
      //   };
      // })
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
          searchEnabled: true,
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
  const regexMST = /^(?:\d{10}|\d{10}-\d{3})$/;

  if (field?.ColCodeSys == "MST") {
    return [
      {
        type: "pattern",
        pattern: regexMST,
      },
    ];
  }

  if (field?.FlagIsNotNull == "1") {
    return [requiredType];
  }
};

const FlagField = ({
  param,
  customOptions,
  field,
}: {
  param: any;
  customOptions?: any;
  field: any;
}) => {
  const { component, formData } = param;

  const valueChanged = (e: any) => {
    component?.updateData(field?.ColCodeSys, e.value ? "1" : "0");
  };

  return (
    <Switch
      disabled={customOptions?.editType == "detail"}
      onValueChanged={valueChanged}
      defaultValue={
        formData[field?.ColCodeSys] ? formData[field?.ColCodeSys] == "1" : true
      }
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
  if (customOptions?.editType == "detail") {
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
            OrderIdx: field?.OrderIdx,

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
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            // dataField: field.ColCodeSys,
            render: (param: any) => {
              return (
                <CustomerTypeField
                  param={param}
                  customOptions={customOptions}
                />
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
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            // dataField: field.ColCodeSys,
            render: (param: any) => {
              return (
                <CustomerGroupField
                  param={param}
                  customOptions={customOptions}
                />
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
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

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
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

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
            OrderIdx: field?.OrderIdx,

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
          if (customOptions?.editType == "detail") {
            return {
              FlagIsColDynamic: field.FlagIsColDynamic,
              ColDataType: field.ColDataType,
              groupKeys: field.ColGrpCodeSys,
              ColCodeSys: field.ColCodeSys,
              itemType: "group",
              label: {
                text: field.ColCaption,
              },
              validationMessagePosition: "bottom",
              OrderIdx: field?.OrderIdx,

              // dataField: field.ColCodeSys,
              render: (param: any) => {
                const { component, formData } = param;

                return (
                  <div className="font-semibold">
                    {formData[field?.ColCodeSys] ?? ""}
                  </div>
                );
              },
            };
          }
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
            OrderIdx: field?.OrderIdx,

            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
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
            OrderIdx: field?.OrderIdx,

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
            OrderIdx: field?.OrderIdx,

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
            OrderIdx: field?.OrderIdx,

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
            OrderIdx: field?.OrderIdx,

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
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            // dataField: field.ColCodeSys,
            render: (param: any) => {
              return (
                <DateField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                  editType={customOptions?.editType}
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
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            // dataField: field.ColCodeSys,
            render: (param: any) => {
              return (
                <DateTimeField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                  editType={customOptions?.editType}
                />
              );
            },
          };
        })
        .with("FLAG", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            render: (param: any) => {
              return (
                <FlagField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })
        .with("CREATEBY", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            // dataField: field.ColCodeSys,
            render: (param: any) => {
              return (
                <CreateByField param={param} customOptions={customOptions} />
              );
            },
          };
        })
        .with("CREATEDTIMEUTC", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            // dataField: field.ColCodeSys,
            render: (param: any) => {
              return (
                <CreateDTimeUTCField
                  param={param}
                  customOptions={customOptions}
                />
              );
            },
          };
        })
        .otherwise(() => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            // dataField: field.ColCodeSys,
            render: (param: any) => {
              const { component, formData } = param;

              return (
                <div className="font-semibold">
                  {formData[field?.ColCodeSys] ?? "---"}
                </div>
              );
            },
          };
        });
    });
  }

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
          OrderIdx: field?.OrderIdx,

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
          OrderIdx: field?.OrderIdx,

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
          OrderIdx: field?.OrderIdx,

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
          OrderIdx: field?.OrderIdx,

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
          OrderIdx: field?.OrderIdx,

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
          OrderIdx: field?.OrderIdx,

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
        if (customOptions?.editType == "detail") {
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
            OrderIdx: field?.OrderIdx,

            // dataField: field.ColCodeSys,
            render: (param: any) => {
              const { component, formData } = param;

              return (
                <div className="font-semibold">
                  {formData[field?.ColCodeSys] ?? ""}
                </div>
              );
            },
          };
        }
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
          OrderIdx: field?.OrderIdx,

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
          OrderIdx: field?.OrderIdx,

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
          OrderIdx: field?.OrderIdx,

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
          OrderIdx: field?.OrderIdx,

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
          OrderIdx: field?.OrderIdx,

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
          OrderIdx: field?.OrderIdx,

          // dataField: field.ColCodeSys,
          render: (param: any) => {
            return (
              <DateField
                param={param}
                customOptions={customOptions}
                field={field}
                editType={customOptions?.editType}
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
          OrderIdx: field?.OrderIdx,

          // dataField: field.ColCodeSys,
          render: (param: any) => {
            return (
              <DateTimeField
                param={param}
                customOptions={customOptions}
                field={field}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("FLAG", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,

          render: (param: any) => {
            return (
              <FlagField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("CREATEBY", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,

          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          // dataField: field.ColCodeSys,
          render: (param: any) => {
            return (
              <CreateByField param={param} customOptions={customOptions} />
            );
          },
        };
      })
      .with("CREATEDTIMEUTC", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,

          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          // dataField: field.ColCodeSys,
          render: (param: any) => {
            return (
              <CreateDTimeUTCField
                param={param}
                customOptions={customOptions}
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
          OrderIdx: field?.OrderIdx,

          validationRules: mapValidationRules(field),
          ...mapCustomOptions(field, customOptions),
        };
      });
  });
};

export const FileUploadCustom = (props: any) => {
  const { data } = props;
  const { headers, baseURL } = useApiHeaders();
  const [isUploading, setIsUploading] = useState(false);

  const api = useClientgateApi();
  const handleUploadFile = async (file: File, callback: any) => {
    const resp = await api.File_UploadFile(file);
    if (resp.isSuccess) {
      const obj = {
        FileSize: resp.Data?.FileSize ?? "",
        FileType: resp.Data?.FileType ?? "",
        FileUrlFS: resp.Data?.FileUrlFS ?? "",
        FileFullName: resp.Data?.FileFullName ?? "",
        FileUrlLocal: resp.Data?.FileUrlLocal ?? "",
      };
      data.setValue(obj);
    }
  };

  return (
    <FileUploader
      ref={null}
      selectButtonText="Select FILE"
      labelText=""
      uploadMode={"instantly"}
      multiple={false}
      name={"file"}
      uploadHeaders={{
        ...headers,
        "Content-Type": "multipart/form-data",
      }}
      uploadUrl={`${baseURL}/File/UploadFile`}
      disabled={isUploading}
      uploadFile={handleUploadFile}
    />
  );
};