import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import {
  ListInfoDetailCampaignValue,
  dataComponent,
  defaultValue,
  flagSelection,
  popupVisibleAtom,
} from "./../store";
import { Button, Form, List, Switch, TextBox } from "devextreme-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import "./../../style.scss";
import { Icon } from "@/packages/ui/icons";
import { ItemDragging } from "devextreme-react/list";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useQuery } from "@tanstack/react-query";
import { errorAtom, showErrorAtom } from "@/packages/store";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { toast } from "react-toastify";
import { EditForm } from "./PopUp";
import { useParams } from "react-router-dom";

const Customize = () => {
  const api = useClientgateApi();
  const { auth } = useAuth();
  const param: any = useParams();

  const { data: listDataType, isLoading: isLoadingDataType } = useQuery({
    queryFn: async () => {
      const resp = await api.MDMetaColumnDataType_GetAllActive();
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdMetaColDataTypeApi"],
  });

  const refSubmitButton = useRef<HTMLButtonElement>(null);
  const formRef = useRef(null);
  const flagSelecter = useAtomValue(flagSelection);
  const getDefaultValue = useAtomValue(defaultValue);
  const setListValue = useSetAtom(ListInfoDetailCampaignValue);
  const listValue = useAtomValue(ListInfoDetailCampaignValue);
  const setFlagSelector = useSetAtom(flagSelection);
  const dataRow = useAtomValue(dataComponent);
  const setDataRow = useSetAtom(dataComponent);
  const showError = useSetAtom(showErrorAtom);
  const setVisiable = useSetAtom(popupVisibleAtom);
  const { t } = useI18n("Mst_CampaignType");

  console.log("dataRow ", dataRow);

  const {
    register,
    unregister,
    watch,
    setValue,
    getValues,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      Enabled: true,
      IsRequired: true,
      FlagIsNotNull: "1",
      IsSearchable: true,
      FlagIsQuery: "1",
      IsUnique: true,
      FlagIsCheckDuplicate: "1",
      ...dataRow,
    },
    values: dataRow as any,
  });

  const handleSave = (): void => {
    triggerSubmit();
  };

  const triggerSubmit = () => {
    refSubmitButton?.current?.click();
  };

  const choiceValues = watch("Lst_Mst_CustomerFeedBack");
  const {
    data: listCampaign,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [""],
    queryFn: async () => {
      const response = await api.Mst_CampaignColumnConfig_GetAllActive();
      if (response.isSuccess) {
        return response?.DataList;
      } else {
        // showError({
        // });
      }
    },
  });

  const onsubmit = async (data: any) => {
    const obj = {
      ...data,
      listValueInfo: listValue,
    };
    // case add
    const buildParam = {
      Mst_CampaignType: {
        NetworkID: auth.networkId,
        CampaignTypeCode: obj.CampaignTypeCode ?? "",
        // CampaignTypeCode: obj.CampaignTypeCode,
        CampaignTypeName: obj.CampaignTypeName,
        CampaignTypeDesc: obj.CampaignTypeDesc,
        OrgID: auth.orgData?.Id,
      },
      Lst_Mst_CustomColumnCampaignType: listValue.map(
        (item: any, index: number) => {
          return {
            ...item,
            CampaignColCfgCodeSys: item.CampaignColCfgCodeSys,
            OrgID: item.OrgID,
            FlagRequired:
              item.FlagRequired && item.FlagRequired !== "0" ? "1" : "0",
            Idx: index,
          };
        }
      ),
      Lst_Mst_CustomerFeedBack: obj.Lst_Mst_CustomerFeedBack.map(
        (item: any, index: number) => {
          return {
            ...item,
            OrgID: auth.orgData?.Id,
            CusFBName: item.Value,
            CusFBCode: index,
          };
        }
      ),
    };

    if (flagSelecter === "add") {
      const responese = await api.Mst_CampaignType_Create(buildParam);
      if (responese.isSuccess) {
        toast.success("Create Campaign");
        setListValue([]);
        setDataRow(getDefaultValue);
        reset();
      } else {
        showError({
          message: t(responese.errorCode),
          debugInfo: responese.debugInfo,
          errorInfo: responese.errorInfo,
        });
      }
    } else {
      const responese = await api.Mst_CampaignType_Update(buildParam);
      if (responese.isSuccess) {
        toast.success("Update Campaign");
        // setListValue([]);
        // setDataRow(getDefaultValue);
        // reset();
      } else {
        showError({
          message: t(responese.errorCode),
          debugInfo: responese.debugInfo,
          errorInfo: responese.errorInfo,
        });
      }
    }
  };

  const {
    fields: singleChoiceValuesFields,
    append,
    remove,
  } = useFieldArray<any>({
    name: "Lst_Mst_CustomerFeedBack",
    control: control,
  });

  const { data: dataItem, isLoading: isLoadingDataItem } = useQuery({
    queryKey: ["Mst_CampaignTypeDetail", param],
    queryFn: async () => {
      if (param?.id) {
        setFlagSelector("update");
        const response = await api.Mst_CampaignType_GetByCode(
          param.id,
          auth.orgData?.Id ?? ""
        );
        if (response.isSuccess) {
          const data = response.Data;
          const obj = {
            ...data,
            ...data?.Lst_Mst_CampaignType[0],
            Lst_Mst_CustomerFeedBack: data.Lst_Mst_CustomerFeedBack.map(
              (item) => {
                return {
                  ...item,
                  Value: item.CusFBName,
                };
              }
            ),
          };
          setDataRow(obj);
          setListValue(data?.Lst_Mst_CustomColumnCampaignType ?? []);
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
        }
      } else {
        console.log("?????");
        setFlagSelector("add");
        setDataRow(getDefaultValue);
        setListValue([]);
      }
    },
  });

  const canAddMore = (choiceValues: any) => {
    return (
      !choiceValues ||
      choiceValues.every((item: any) => {
        return item.Value !== "" && !!item.Value;
      })
    );
  };
  console.log("flagSelecter ", flagSelecter);

  useEffect(() => {
    if (flagSelecter === "add") {
      console.log("render");
      setListValue([]);
      setDataRow(getDefaultValue);
      reset();
    }
    if (flagSelecter === "update") {
      // setFormValue({});
    }
  }, [flagSelecter]);
  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header d-flex justify-space-between">
          <div className="breakcrumb">
            <p>{t("Mst_Customer")}</p>
            <p>{`>`}</p>
            <p>
              {flagSelecter === "add"
                ? t("Add new Customer")
                : t("Update Customer")}
            </p>
          </div>
          <div className="list-button">
            <Button onClick={handleSave}>{t("Save")}</Button>
            <Button>{t("Save And Add")}</Button>
            <Button>{t("Cancel")}</Button>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div className="container-content">
          <form ref={formRef} id="editForm" onSubmit={handleSubmit(onsubmit)}>
            <Controller
              name={"CampaignTypeName"}
              control={control}
              render={({ field }) => {
                return (
                  <TextboxField
                    field={field}
                    label={"Campaign Type Name"}
                    required={true}
                    error={errors.CampaignTypeName}
                  />
                );
              }}
              rules={{
                required: {
                  value: true,
                  message: "CampaignTypeNameIsRequired",
                },
              }}
            />
            <Controller
              name={"CampaignTypeDesc"}
              control={control}
              render={({ field }) => {
                return (
                  <TextboxField
                    field={field}
                    label={"Campaign TypeDesc"}
                    required={true}
                    error={errors.CampaignTypeDesc}
                  />
                );
              }}
              rules={{
                required: {
                  value: true,
                  message: "CampaignTypeDescIsRequired",
                },
              }}
            />
            <Controller
              name={"FlagActive"}
              control={control}
              render={({ field }) => {
                const { ref, onChange, ...restField } = register("FlagActive");
                return (
                  <Switch
                    ref={ref}
                    {...restField}
                    value={getValues("FlagActive")}
                    onValueChange={field.onChange}
                    switchedOffText={t("Inactive")}
                    switchedOnText={t("Active")}
                    defaultValue={true}
                    // isValid={false}
                  />
                );
              }}
            />
            <div className={"w-full"}>
              <p>Phản hồi từ khách hàng</p>
              <Controller
                name={"Lst_Mst_CustomerFeedBack"}
                control={control}
                render={({ field }) => {
                  return (
                    <div className={"w-full"}>
                      {singleChoiceValuesFields.map((field, index) => {
                        console.log("field ,", field);
                        const { ref, onChange, ...restField } = register(
                          `Lst_Mst_CustomerFeedBack.${index}.Value` as const,
                          {
                            required: true,
                          }
                        );
                        const {
                          onChange: onDefaultChange,
                          ...restDefaultField
                        } = register(
                          `Lst_Mst_CustomerFeedBack.${index}.IsSelected` as const,
                          {}
                        );
                        return (
                          <div
                            key={field.id}
                            className={"flex items-center my-2"}
                          >
                            <TextBox
                              ref={ref}
                              {...restField}
                              defaultValue={field?.Value ?? ""}
                              value={
                                getValues(
                                  `Lst_Mst_CustomerFeedBack.${index}.Value`
                                ) ?? ""
                              }
                              onValueChanged={async (e: any) => {
                                await onChange({
                                  target: {
                                    name: restField.name,
                                    value: e.value,
                                  },
                                });
                              }}
                              validationMessageMode={"always"}
                              isValid={
                                !errors.Lst_Mst_CustomerFeedBack?.[index]
                              }
                            />
                            <Button
                              onClick={() => remove(index)}
                              stylingMode={"text"}
                            >
                              <Icon
                                name={"trash"}
                                size={14}
                                color={"#ff5050"}
                              />
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
                  );
                }}
              />
            </div>
            <button
              hidden={true}
              ref={refSubmitButton}
              type={"submit"}
              form={"editForm"}
            />
          </form>
          <div className="w-full">
            <p>Thông tin tùy chỉnh của chi tiết chiến dịch</p>
            <List
              dataSource={listValue}
              itemRender={(item) => {
                console.log("item ", item);
                return (
                  <div className={"w-full flex flex-column items-center"}>
                    <Form
                      colCount={1}
                      className="detail-info-campaign"
                      formData={item}
                      // showValidationSummary={true}
                      validationGroup="customerData"
                    >
                      <GroupItem caption="" alignItemLabels={true}>
                        <SimpleItem
                          dataField=""
                          render={() => {
                            return (
                              <Button
                                onClick={() => {
                                  const newValue = listValue.filter(
                                    (itemValue: any) =>
                                      itemValue.CampaignColCfgCodeSys !==
                                      item.CampaignColCfgCodeSys
                                  );
                                  setListValue(newValue);
                                }}
                                stylingMode={"text"}
                              >
                                <Icon
                                  name={"trash"}
                                  color={"#ff0000"}
                                  size={10}
                                />
                              </Button>
                            );
                          }}
                        ></SimpleItem>
                        <SimpleItem
                          dataField="CampaignColCfgName"
                          editorType="dxTextBox"
                          validationRules={[requiredType]}
                          editorOptions={{
                            disabled: true,
                          }}
                        />
                        <SimpleItem
                          dataField="CampaignColCfgDataType"
                          editorType="dxSelectBox"
                          validationRules={[requiredType]}
                          editorOptions={{
                            dataSource: listDataType,
                            displayExpr: "ColDataTypeDesc",
                            valueExpr: "ColDataType",
                            disabled: true,
                          }}
                        ></SimpleItem>
                        <SimpleItem
                          dataField="FlagActive"
                          editorType="dxCheckBox"
                          editorOptions={{
                            disabled: true,
                            value:
                              item?.FlagRequired === "1" ||
                              item?.FlagRequired === true,
                          }}
                          // validationRules={[requiredType]}
                        ></SimpleItem>
                      </GroupItem>
                    </Form>
                    {/* );
                    })} */}
                  </div>
                );
              }}
            >
              <ItemDragging allowReordering={true}></ItemDragging>
            </List>
            <Button
              type={"default"}
              stylingMode={"text"}
              hoverStateEnabled={false}
              activeStateEnabled={false}
              focusStateEnabled={false}
              onClick={() => {
                setVisiable(true);
                // setFlagSelector("add");
              }}
              className={"flex items-center"}
            >
              <Icon name={"plus"} size={20} />
              <span className={"mx-2"}>Add New</span>
            </Button>
          </div>
        </div>
        {!isLoading && !isLoadingDataType && (
          <EditForm
            onCancel={() => {
              setVisiable(false);
            }}
            onSave={() => {}}
            onSuccess={() => {}}
            // onSuccess={() => {}}
            data={listCampaign}
            dataType={listDataType}
          />
        )}
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Customize;
