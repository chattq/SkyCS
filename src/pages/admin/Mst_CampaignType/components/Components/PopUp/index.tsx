import { Popup, ToolbarItem } from "devextreme-react/popup";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  InfoDetailCampaignValue,
  ListInfoDetailCampaignValue,
  defaultValue,
  defaultValuePopUp,
  flagSelection,
  popupVisibleAtom,
  typeSelectAtom,
} from "./../../store";
import Button from "devextreme-react/button";
import { useEffect, useMemo, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import TextBox from "devextreme-react/text-box";
import { Icon } from "@packages/ui/icons";
import ScrollView from "devextreme-react/scroll-view";
import { useClientgateApi } from "@packages/api";
import { useQuery } from "@tanstack/react-query";
import {
  MdMetaColGroupSpecDto,
  Mst_CampaignColumnConfig,
} from "@packages/types";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
// import "./edit-form.scss";
import { CheckboxField } from "@/pages/admin/custom-field/components/checkbox-field";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import { useAuth } from "@packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import { toast } from "react-toastify";
import { CheckBox } from "devextreme-react";
import { useI18n } from "@/i18n/useI18n";

interface EditFormProps {
  onCancel: any;
  onSave: (data: Mst_CampaignColumnConfig) => void;
  onSuccess: any;
  data: any;
  dataType: any;
}

const isSearchableType = (dataType: string) => {
  return "FLAG" !== dataType;
};

export const EditForm = ({
  onCancel,
  onSave,
  onSuccess,
  data,
  dataType,
}: EditFormProps) => {
  const listValue: any[] = useAtomValue(ListInfoDetailCampaignValue);
  const setListValue = useSetAtom(ListInfoDetailCampaignValue);
  const { t } = useI18n("EditForm_Campaign");
  const popupVisible = useAtomValue(popupVisibleAtom);
  const currentItem = useAtomValue(InfoDetailCampaignValue);
  const typeSelect = useAtomValue(typeSelectAtom);
  const api = useClientgateApi();

  const { data: listMasterData } = useQuery({
    queryFn: async () => {
      const resp = await api.MDOptionValue_GetAllMasterDataTable();
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdOptionValueApi"],
  });

  useEffect(() => {
    reset();
    setValue("ListOption", []);
    setValue("FlagIsDynamic", "1");
    setValue("CampaignColCfgDataType", "");
  }, [currentItem]);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const {
    register,
    reset,
    unregister,
    watch,
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      FlagIsDynamic: "1",
      ListOption: [{}],
      FlagRequired: false,
      ...currentItem,
    },
    values: currentItem as any,
  });

  console.log("currentItem", currentItem);

  const {
    fields: singleChoiceValuesFields,
    append,
    prepend,
    remove,
    swap,
    move,
    insert,
    replace,
    update,
  } = useFieldArray<Mst_CampaignColumnConfig>({
    name: "ListOption",
    control: control,
  });

  console.log("singleChoiceValuesFields ", singleChoiceValuesFields);

  const handleSave = async (data: any) => {
    if (Object.keys(errors).length === 0) {
      if (listValue.length) {
        const checked = listValue.find((item: any) => {
          return item.CampaignColCfgCodeSys === data.CampaignColCfgCodeSys;
        });
        console.log("checked ", checked);
        if (!checked) {
          setListValue([...listValue, data]);
          toast.success("add success");
          onCancel();
        } else {
          toast.error(t("This field is already exist"));
        }
      } else {
        console.log("dataa", data);
        setListValue([...listValue, data]);
        toast.success("add success");
        onCancel();
      }
    }
  };

  const formRef = useRef<HTMLFormElement>(null);
  const handleSaveClick = () => {
    triggerSubmit();
  };
  const refSubmitButton = useRef<HTMLButtonElement>(null);
  const triggerSubmit = () => {
    refSubmitButton?.current?.click();
  };
  const dataTypeValue = watch("CampaignColCfgDataType");
  const choiceValues = watch("ListOption");
  useEffect(() => {
    if (!["SELECTMULTIPLE", "SELECTONE"].includes(dataTypeValue)) {
      unregister("ListOption");
      unregister("DefaultIndex");
    }
  }, [dataTypeValue]);

  const canAddMore = (choiceValues: any) => {
    return (
      !choiceValues ||
      choiceValues.every((item: any) => {
        return item.Value !== "" && !!item.Value;
      })
    );
  };

  function renderSelectOneField() {
    const onAddNewItem = () => {
      // if this is the first item, we need set the DefaultIndex value
      append({
        Value: "",
        isSelected: false,
        id: "",
      });
      if (!choiceValues || choiceValues.length === 0) {
        setValue("DefaultIndex", "0");
      }
    };
    const onRemoveItem = (index: number) => {
      remove(index);
    };
    return (
      <div className={"w-full ml-[150px]"}>
        {singleChoiceValuesFields.map((field, index) => {
          const { ref, onChange, ...restField } = register(
            `ListOption.${index}.Value` as const,
            {
              required: true,
            }
          );
          const defaultIndexField = register("DefaultIndex", {
            required: true,
          });
          return (
            <div key={field.id} className={"flex items-center my-2"}>
              <input
                type={"radio"}
                className={"mr-2"}
                {...defaultIndexField}
                value={index}
                onChange={async (e: any) => {
                  await onChange({
                    target: {
                      name: defaultIndexField.name,
                      value: e.target.value,
                    },
                  });
                }}
              />
              <TextBox
                ref={ref}
                {...restField}
                // defaultValue={restField?.Value ?? ""}
                onValueChanged={async (e: any) => {
                  await onChange({
                    target: {
                      name: restField.name,
                      value: e.value,
                    },
                  });
                }}
                validationMessageMode={"always"}
                // isValid={!errors.ListOption?.[index]}
              />
              <Button onClick={() => onRemoveItem(index)} stylingMode={"text"}>
                <Icon name={"trash"} size={14} color={"#ff5050"} />
              </Button>
            </div>
          );
        })}
        <Button
          type={"default"}
          stylingMode={"text"}
          hoverStateEnabled={false}
          activeStateEnabled={false}
          focusStateEnabled={false}
          onClick={() => onAddNewItem()}
          disabled={!canAddMore(choiceValues)}
          className={"flex items-center"}
        >
          <Icon name={"plus"} size={20} />
          <span className={"mx-2"}>Add New</span>
        </Button>
      </div>
    );
  }

  return (
    <Popup
      position={"center"}
      showCloseButton={true}
      onHiding={handleCancel}
      title={`Add Field`}
      visible={popupVisible}
    >
      <ScrollView width={"100%"} height={400}>
        <form
          id={"formPopup"}
          ref={formRef}
          onSubmit={handleSubmit(handleSave)}
        >
          <Controller
            name={"CampaignColCfgCode"}
            control={control}
            render={({ field }) => {
              const obj = {
                ...field,
                searchEnabled: true,
              };

              return (
                <SelectboxField
                  field={obj}
                  label={"CampaignColCfgName"}
                  dataSource={data}
                  required
                  error={errors.CampaignColCfgCode}
                  valueExpr={"CampaignColCfgCodeSys"}
                  displayExpr={"CampaignColCfgName"}
                  onValueChanged={(newValue: string) => {
                    const value = data.find(
                      (item: any) => item.CampaignColCfgCodeSys === newValue
                    );
                    //
                    if (value.JsonListOption) {
                      const getValue = JSON.parse(value?.JsonListOption ?? "");
                      if (
                        value.CampaignColCfgDataType === "MASTERDATA" ||
                        (typeSelect.includes(value.CampaignColCfgDataType) &&
                          getValue !== "")
                      ) {
                        if (value.CampaignColCfgDataType === "MASTERDATA") {
                          if (getValue.length > 0) {
                            setValue("DataSource", getValue[0].Value);
                          }
                        }
                        if (typeSelect.includes(value.CampaignColCfgDataType)) {
                          if (getValue.length > 0) {
                            console.log("value 12321321", getValue);
                            setValue("ListOption", getValue);
                          }
                        }
                      } else {
                        setValue("ListOption", []);
                        setValue("DataSource", "");
                      }
                    } else {
                      setValue("ListOption", []);
                      setValue("DataSource", "");
                    }

                    console.log("item ", value);
                    const objKey = Object.keys(value);
                    objKey.forEach((item) => {
                      if (item === "CampaignColCfgCode") {
                      } else {
                        setValue(item, value[item]);
                      }
                    });
                  }}
                  // validationMessageMode={"always"}
                  // isValid={!errors.ListOption?.[index]}
                />
              );
            }}
            rules={{
              required: { value: true, message: "FieldCodeIsRequired" },
            }}
          />
          <Controller
            name={"CampaignColCfgCode"}
            control={control}
            render={({ field }) => {
              return (
                <TextboxField
                  disabled={true}
                  field={field}
                  label={"CampaignColCfgCode"}
                  required={true}
                  error={errors.CampaignColCfgCode}
                />
              );
            }}
          />
          <Controller
            name={"CampaignColCfgDataType"}
            control={control}
            render={({ field }) => {
              const obj = {
                ...field,
                disabled: true,
              };
              return (
                <SelectboxField
                  field={obj}
                  label={"CampaignColCfgDataType"}
                  dataSource={dataType}
                  required
                  error={errors.CampaignColCfgDataType}
                  valueExpr={"ColDataType"}
                  displayExpr={"ColDataTypeDesc"}
                  // onValueChanged={(newValue: string) => {
                  //   if (!["SELECTONE", "SELECTMULTIPLE"].includes(newValue)) {
                  //     unregister("ListOption");
                  //     setValue("ListOption", []);
                  //     singleChoiceValuesFields.forEach((item, index) => {
                  //       remove(index);
                  //     });
                  //   }
                  // }}
                />
              );
            }}
            rules={{
              required: { value: true, message: "CampaignColCfgDataType" },
            }}
          />
          {(dataTypeValue === "SELECTONERADIO" ||
            dataTypeValue === "SELECTONERADIO") &&
            renderSelectOneField()}
          {(dataTypeValue === "SELECTMULTIPLEDROPDOWN" ||
            dataTypeValue === "SELECTMULTIPLESELECTBOX") && (
            <div className={"w-full ml-[150px]"}>
              {singleChoiceValuesFields.map((field, index) => {
                const { ref, onChange, ...restField } = register(
                  `ListOption.${index}.Value` as const,
                  {
                    required: true,
                  }
                );
                console.log("field ", field);
                const { onChange: onDefaultChange, ...restDefaultField } =
                  register(`ListOption.${index}.IsDefault` as const, {});
                return (
                  <div key={field.id} className={"flex items-center my-2"}>
                    <CheckBox
                      disabled={true}
                      className={"mr-2"}
                      {...restDefaultField}
                      onValueChanged={async (e: any) => {
                        await onDefaultChange({
                          target: {
                            name: restDefaultField.name,
                            value: e.value,
                          },
                        });
                      }}
                    />
                    <TextBox
                      disabled={true}
                      ref={ref}
                      {...restField}
                      defaultValue={field?.Value ?? ""}
                      onValueChanged={async (e: any) => {
                        await onChange({
                          target: {
                            name: restField.name,
                            value: e.value,
                          },
                        });
                      }}
                      validationMessageMode={"always"}
                      isValid={!errors.ListOption?.[index]}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {dataTypeValue === "MASTERDATA" && (
            <Controller
              name={"DataSource"}
              control={control}
              render={({ field }) => {
                const obj = {
                  ...field,
                  disabled: true,
                };

                return (
                  <SelectboxField
                    field={obj}
                    label={"Data Source"}
                    dataSource={listMasterData}
                    valueExpr={"Key"}
                    required
                    error={errors.DataSource}
                    displayExpr={"Value"}
                  />
                );
              }}
            />
          )}
          <Controller
            name={"FlagRequired"}
            control={control}
            render={({ field }) => {
              return <CheckboxField field={field} label={"Is Required"} />;
            }}
          />
          <button
            hidden={true}
            ref={refSubmitButton}
            type={"submit"}
            form={"formPopup"}
          />
        </form>
      </ScrollView>
      <ToolbarItem toolbar={"bottom"} location={"center"}>
        <Button
          text={"Save"}
          type={"default"}
          stylingMode={"contained"}
          onClick={handleSaveClick}
        />
        <Button
          text={"Cancel"}
          stylingMode={"contained"}
          onClick={handleCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};
