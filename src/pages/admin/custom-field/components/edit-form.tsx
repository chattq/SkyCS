import { Popup, ToolbarItem } from "devextreme-react/popup";
import { useAtomValue, useSetAtom } from "jotai";
import { currentItemAtom, flagAtom, showPopupAtom } from "./store";
import Button from "devextreme-react/button";
import { useEffect, useMemo, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import TextBox from "devextreme-react/text-box";
import { Icon } from "@packages/ui/icons";
import ScrollView from "devextreme-react/scroll-view";
import { useClientgateApi } from "@packages/api";
import { useQuery } from "@tanstack/react-query";
import {
  MdMetaColGroup,
  MdMetaColGroupSpecDto,
  MdMetaColumnDataType,
} from "@packages/types";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
import "./edit-form.scss";
import { CheckboxField } from "@/pages/admin/custom-field/components/checkbox-field";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import { useAuth } from "@packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import { toast } from "react-toastify";
import { CheckBox, LoadPanel } from "devextreme-react";
import { logger } from "@packages/logger";
import { useI18n } from "@/i18n/useI18n";

interface EditFormProps {
  onCancel: () => void;
  onSave: (data: MdMetaColGroupSpecDto) => void;
}

const isSearchableType = (dataType: string) => {
  return "FLAG" !== dataType;
};

const SelectOneField = ({
  control,
  setValue,
  getValues,
  watch,
  register,
  errors,
}: any) => {
  const canAddMore = (choiceValues: any) => {
    return (
      !choiceValues ||
      choiceValues.every((item: any) => {
        return item.Value !== "" && !!item.Value;
      })
    );
  };

  const choiceValues = watch("ListOption");
  const defaultIndexValue = choiceValues.find(
    (item: any) => item.IsSelected
  )?.OrderIdx;
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
  } = useFieldArray<MdMetaColGroupSpecDto>({
    name: "ListOption",
    control: control,
  });

  const onAddNewItem = () => {
    // if this is the first item, we need set the DefaultIndex value
    append({
      Value: "",
      IsSelected: false,
      id: "",
    });
    if (!choiceValues || choiceValues.length === 0) {
      setValue("DefaultIndex", "0");
    }
  };
  const onRemoveItem = (index: number) => {
    // if remove the default one, we set the DefaultIndex value to the first item
    if (defaultIndexValue === index.toString()) {
      setValue("DefaultIndex", "0");
    }
    remove(index);
  };
  const defaultIndexField = register("DefaultIndex", {
    required: true,
  });

  return (
    <div className={"w-full ml-[150px]"}>
      {singleChoiceValuesFields.map((field, index) => {
        const { ref, onChange, ...restField } = register(
          `ListOption.${index}.Value` as const,
          {
            required: true,
          }
        );
        return (
          <div key={field.id} className={"flex items-center my-2"}>
            <input
              type={"radio"}
              className={"mr-2"}
              {...defaultIndexField}
              defaultChecked={defaultIndexValue === index}
              value={index}
              onChange={async (e: any) => {
                setValue("DefaultIndex", e.target.value);
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
              value={getValues("ListOption." + index + ".Value") ?? ""}
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
};

export const EditForm = ({ onCancel, onSave }: EditFormProps) => {
  const { t } = useI18n("CustomField");
  const popupVisible = useAtomValue(showPopupAtom);
  const currentItem = useAtomValue(currentItemAtom);
  const { auth } = useAuth();
  const api = useClientgateApi();
  const flag = useAtomValue(flagAtom);

  const showError = useSetAtom(showErrorAtom);
  const { data: listGroup, isLoading: isGettingGroups } = useQuery({
    queryFn: async () => {
      const resp = await api.MdMetaColGroupApi_Search({});
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdMetaColGroupApi"],
  });
  const { data: listDataType, isLoading: isGettingDataTypes } = useQuery({
    queryFn: async () => {
      const resp = await api.MDMetaColumnDataType_GetAllActive();
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdMetaColDataTypeApi"],
  });

  const { data: listOperators, isLoading: isGettingOperators } = useQuery({
    queryFn: async () => {
      const resp = await api.MDMetaColumnOperatorType_GetAllActive();
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdMetaColOperatorApi"],
  });
  const { data: listMasterData, isLoading: isGettingMasterData } = useQuery({
    queryFn: async () => {
      const resp = await api.MDOptionValue_GetAllMasterDataTable();
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdOptionValueApi"],
  });

  const handleCancel = () => {
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
    getValues,
    formState: { errors },
  } = useForm<MdMetaColGroupSpecDto>({
    defaultValues: {
      Enabled: true,
      FlagActive: "1",
      IsRequired: true,
      FlagIsNotNull: "1",
      IsSearchable: true,
      FlagIsQuery: "1",
      IsUnique: true,
      FlagIsCheckDuplicate: "1",
      ListOption: currentItem ? currentItem.ListOption : [{}],
      ...currentItem,
    },
    values: currentItem as MdMetaColGroupSpecDto,
  });
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
  } = useFieldArray<MdMetaColGroupSpecDto>({
    name: "ListOption",
    control: control,
  });

  useEffect(() => {
    if (flag !== "add") {
      const getKey = Object.keys(currentItem);
      const getValue = Object.values(currentItem);
    } else {
      // console.log("else =======================================");
      reset();
      setValue("ListOption", []);
      setValue("DefaultIndex", "0");
      setValue("ColOperatorType", "");
    }
  }, [currentItem]);

  const handleSave = async (data: MdMetaColGroupSpecDto) => {
    if (Object.keys(errors).length === 0) {
      if(!data.ColDataType) {
        setError("ColDataType", {
          message: "Please select at least one option",
        });
        return;
      }
      if (
        ["SELECTONERADIO", "SELECTONEDROPBOX", "SELECTMULTIPLESELECTBOX", "SELECTMULTIPLEDROPBOX"].includes(data.ColDataType) &&
        (!data.ListOption || data.ListOption.length === 0)
      ) {
        setError("ColDataType", {
          message: "Please select at least one option",
        });
        return;
      }
      if(data.IsSearchable && !data.ColOperatorType) {
        setError("ColOperatorType", {
          message: "Please select at least one option",
        });
        return;
      }
      if (flag === "add") {
        const response = await api.MDMetaColGroupSpec_Create({
          ...data,
          OrgID: auth.orgData?.Id,
          NetworkID: auth.networkId,
          OrderIdx: 0,
          // JsonListOption: JSON.stringify(data.ListOption),
        });
        if (response.isSuccess) {
          toast.success("Add success");
          onSave({ ...data });
          reset();
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
        }
      } else {
        const response = await api.MDMetaColGroupSpec_Update({
          ...data,
          OrgID: auth.orgData?.Id,
          NetworkID: auth.networkId,
          OrderIdx: 0,
        });
        if (response.isSuccess) {
          toast.success("Edit success");
          onSave({ ...data });
          reset();
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
        }
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
  const dataTypeValue = watch("ColDataType");
  const isSearchable = watch("IsSearchable");
  const choiceValues = watch("ListOption");
  // const defaultIndexValue = watch("DefaultIndex");
  useEffect(() => {
    if (
      ![
        "SELECTONERADIO",
        "SELECTONEDROPDOWN",
        "SELECTMULTIPLESELECTBOX",
        "SELECTMULTIPLEDROPDOWN",
      ].includes(dataTypeValue)
    ) {
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

  if (
    isGettingGroups ||
    !listGroup ||
    !listDataType ||
    isGettingDataTypes ||
    isGettingMasterData ||
    isGettingOperators
  ) {
    return <LoadPanel visible={true} />;
  }

  return (
    <Popup
      position={"center"}
      showCloseButton={true}
      onHiding={handleCancel}
      title={`${flag.toLocaleUpperCase()} Field`}
      visible={popupVisible}
    >
      <ScrollView width={"100%"} height={600}>
        <form id={"editForm"} ref={formRef} onSubmit={handleSubmit(handleSave)}>
          <Controller
            name={"ColGrpCodeSys"}
            control={control}
            render={({ field }) => {
              return (
                <SelectboxField
                  field={field}
                  label={"Column Group"}
                  dataSource={listGroup}
                  valueExpr={"ColGrpCodeSys"}
                  displayExpr={"ColGrpName"}
                  error={errors.ColGrpCodeSys}
                  required={true}
                />
              );
            }}
            rules={{
              required: { value: true, message: "ColumnGroupIsRequired" },
            }}
          />
          <Controller
            name={"ColCode"}
            control={control}
            render={({ field }) => {
              return (
                <TextboxField
                  disabled={flag !== "add"}
                  field={field}
                  label={"Field Code"}
                  required={true}
                  error={errors.ColCode}
                />
              );
            }}
            rules={{
              required: { value: true, message: "FieldCodeIsRequired" },
            }}
          />
          <Controller
            name={"ColCaption"}
            control={control}
            render={({ field }) => {
              return (
                <TextboxField
                  field={field}
                  label={"Field Name"}
                  required={true}
                  error={errors.ColCaption}
                />
              );
            }}
            rules={{
              required: { value: true, message: "FieldNameIsRequired" },
            }}
          />
          <Controller
            name={"IsRequired"}
            control={control}
            render={({ field }) => {
              return <CheckboxField field={field} label={"Is Required"} />;
            }}
          />
          <Controller
            name={"IsUnique"}
            control={control}
            render={({ field }) => {
              return <CheckboxField field={field} label={"Is Unique"} />;
            }}
          />
          <Controller
            name={"ColDataType"}
            control={control}
            render={({ field }) => {
              return (
                <SelectboxField
                  field={field}
                  label={"Data Type"}
                  dataSource={listDataType}
                  required
                  readonly={flag !== "add"}
                  error={errors.ColDataType}
                  valueExpr={"ColDataType"}
                  displayExpr={"ColDataTypeDesc"}
                  onValueChanged={(newValue: string) => {
                    if (
                      ![
                        "SELECTONERADIO",
                        "SELECTONEDROPDOWN",
                        "SELECTMULTIPLESELECTBOX",
                        "SELECTMULTIPLEDROPDOWN",
                      ].includes(newValue)
                    ) {
                      singleChoiceValuesFields.forEach((item, index) => {
                        remove(index);
                      });
                    }
                  }}
                />
              );
            }}
          />
          {(dataTypeValue === "SELECTONEDROPDOWN" ||
            dataTypeValue === "SELECTONERADIO") && (
            <SelectOneField
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              watch={watch}
            />
          )}
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
                const { onChange: onDefaultChange, ...restDefaultField } =
                  register(`ListOption.${index}.IsSelected` as const, {});
                return (
                  <div key={field.id} className={"flex items-center my-2"}>
                    <CheckBox
                      className={"mr-2"}
                      {...restDefaultField}
                      value={field?.IsSelected ?? false}
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
                    <Button onClick={() => remove(index)} stylingMode={"text"}>
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
                onClick={() =>
                  append({
                    Value: "",
                    IsSelected: false,
                    id: "",
                  })
                }
                disabled={!canAddMore(choiceValues)}
                className={"flex items-center"}
              >
                <Icon name={"plus"} size={20} />
                <span className={"mx-2"}>Add New</span>
              </Button>
            </div>
          )}
          {dataTypeValue === "MASTERDATA" && (
            <Controller
              name={"DataSource"}
              control={control}
              render={({ field }) => {
                const jsonListOption = getValues("JsonListOption");
                const options = JSON.parse(jsonListOption ?? "[]");
                return (
                  <SelectboxField
                    field={field}
                    label={"Data Source"}
                    dataSource={listMasterData}
                    defaultValue={
                      options.length > 0 ? options?.[0].Value : null
                    }
                    required
                    error={errors.DataSource}
                    displayExpr={"Value"}
                    valueExpr={"Key"}
                  />
                );
              }}
            />
          )}
          {isSearchableType(dataTypeValue) && (
            <Controller
              name={"IsSearchable"}
              control={control}
              render={({ field }) => {
                return <CheckboxField field={field} label={"Can search"} />;
              }}
            />
          )}
          {isSearchable && isSearchableType(dataTypeValue) && (
            <Controller
              name={"ColOperatorType"}
              control={control}
              render={({ field }) => {
                return (
                  <SelectboxField
                    field={field}
                    required
                    label={"Search Type"}
                    defaultValue={undefined}
                    error={errors.ColOperatorType}
                    dataSource={listOperators}
                    valueExpr={"ColOperatorType"}
                    displayExpr={"ColOperatorTypeDesc"}
                  />
                );
              }}
            />
          )}
          <Controller
            name={"Enabled"}
            control={control}
            render={({ field }) => {
              return (
                <CheckboxField
                  field={field}
                  label={t("IsActive")}
                  readonly={flag === "add"}
                />
              );
            }}
          />
          <button
            hidden={true}
            ref={refSubmitButton}
            type={"submit"}
            form={"editForm"}
          />
        </form>
      </ScrollView>
      <ToolbarItem toolbar={"bottom"} location={"center"}>
        <Button
          text={"Save"}
          type={"default"}
          stylingMode={"contained"}
          onClick={handleSaveClick}
          className={"mx-2 w-[100px]"}
        />
        <Button
          text={"Cancel"}
          stylingMode={"outlined"}
          type={"normal"}
          onClick={handleCancel}
          className={"mx-2 w-[100px]"}
        />
      </ToolbarItem>
    </Popup>
  );
};
