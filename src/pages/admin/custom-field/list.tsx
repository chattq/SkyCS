import { Accordion, CheckBox, LoadPanel, Switch } from "devextreme-react";
import Button from "devextreme-react/button";
import { useAtomValue, useSetAtom } from "jotai";
import { currentItemAtom, flagAtom, showPopupAtom } from "./components/store";
import { EditForm } from "./components/edit-form";
import React, { useMemo, useReducer } from "react";
import List, { ItemDragging } from "devextreme-react/list";
import { Icon } from "@packages/ui/icons";
import "./list.scss";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@packages/api";
import { MdMetaColGroup, MdMetaColGroupSpecDto } from "@packages/types";
import { showErrorAtom } from "@/packages/store";
import { confirm } from "devextreme/ui/dialog";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { nanoid } from "nanoid";
import {logger} from "@packages/logger";
import {toast} from "react-toastify";
import {useI18n} from "@/i18n/useI18n";

export const CustomFieldListPage = () => {
  const {t} = useI18n("CustomField")
  const showError = useSetAtom(showErrorAtom);

  const api = useClientgateApi();
  const { data: listColGroups } = useQuery({
    queryFn: async () => {
      const resp = await api.MdMetaColGroupApi_Search({});
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdMetaColGroupApi_Search"],
  });

  const {
    data: listFields,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const resp = await api.MdMetaColGroupSpec_Search({});
      if (resp.isSuccess) {
        const fields = resp.DataList ?? [];
        return fields?.map((item: any) => {
          if (item?.Lst_MD_OptionValue) {
            return {
              ...item,
              dataSource: {
                type: "master",
                sourceId: "province",
              },
              FlagIsNotNull: item?.FlagIsNotNull
                ? item?.FlagIsNotNull === "1"
                : false,
              FlagIsCheckDuplicate: item?.FlagIsCheckDuplicate
                ? item?.FlagIsCheckDuplicate === "1"
                : false,
              FlagIsQuery: item?.FlagIsQuery
                ? item?.FlagIsQuery === "1"
                : false,
              OrderIdx: 2,
            };
          }

          return {
            ...item,
            IsRequired: item?.FlagIsNotNull === "1",
            IsUnique: item?.FlagIsCheckDuplicate === "1",
            IsSearchable: item?.FlagIsQuery === "1",
          };
        });
      } else {
        showError({
          message: resp.errorCode,
          debugInfo: resp.debugInfo,
          errorInfo: resp.errorInfo,
        });
      }
    },
    queryKey: ["MdMetaColGroupSpec_Search"],
  });

  const onSaved = async (data: MdMetaColGroupSpecDto) => {
    await refetch();
  };

  const onDelete = async (data: MdMetaColGroupSpecDto) => {
    const result = confirm(
      "<string>Are You Want To Delete</string>",
      "Confirm Change"
    );
    result.then(async (dialogResult: any) => {
      if (dialogResult) {
        const resp = await api.MDMetaColGroupSpec_Delete(data);
        if (resp.isSuccess) {
          await refetch();
          toast.success(t("common.deleteSuccess"))
        } else {
          showError({
            message: resp.errorCode,
            debugInfo: resp.debugInfo,
            errorInfo: resp.errorInfo,
          });
        }
      }
    });
  };

  if (isLoading || !listFields) {
    return <LoadPanel />;
  }

  if (listColGroups && listColGroups.length > 0) {
    return (
      <CustomFieldListPageContent
        listColGroups={listColGroups ?? []}
        listFields={listFields}
        onSaved={onSaved}
        onDelete={onDelete}
      />
    );
  }
  return <LoadPanel />;
};

interface ContentProps {
  listColGroups: MdMetaColGroup[];
  listFields: MdMetaColGroupSpecDto[];
  onSaved: (data: MdMetaColGroupSpecDto) => void;
  onDelete: (data: MdMetaColGroupSpecDto) => void;
}

const buildKey = (rawKey: string) => {
  return rawKey.replace(/\./g, "").toLowerCase();
};

export const CustomFieldListPageContent = ({
  listColGroups,
  listFields,
  onSaved,
  onDelete,
}: ContentProps) => {
  const setFlag = useSetAtom(flagAtom);
  const fieldByGroup = useMemo(() => {
    return listFields.reduce<{ [key: string]: MdMetaColGroupSpecDto[] }>(
      (result, curr) => {
        result[buildKey(curr.ColGrpCodeSys)] =
          result[buildKey(curr.ColGrpCodeSys)] ?? [];
        result[buildKey(curr.ColGrpCodeSys)].push({
          ...curr,
          IsUnique: curr.FlagIsCheckDuplicate === "1",
          IsRequired: curr.FlagIsNotNull === "1",
          IsSearchable: curr.FlagIsQuery === "1",
          // @ts-ignore
          Enabled: curr.FlagActive, // is boolean as we converted in response
        });
        return result;
      },
      {}
    );
  }, [listFields]);

  const api = useClientgateApi();

  const setPopupVisible = useSetAtom(showPopupAtom);
  const setCurrentItem = useSetAtom(currentItemAtom);
  const handleSave = async (data: MdMetaColGroupSpecDto) => {
    logger.debug('saved item:', data)
    onSaved(data);
    setPopupVisible(false);
  };
  const [loadingKey, reloading] = useReducer(() => nanoid(), "0");

  const handleEdit = (item: MdMetaColGroupSpecDto) => {
    const obj = {
      ...item,
      ListOption: JSON.parse(item.JsonListOption),
    };
    if(item.ColDataType === "MASTERDATA") {
      obj.DataSource = JSON.parse(item.JsonListOption)[0].Value;
    }
    logger.debug('obj:', obj)
    setFlag("update");
    setCurrentItem(obj);
    setPopupVisible(true);
  };
  const handleAdd = async () => {
    setFlag("add");
    const resp = await api.Seq_GetColCodeSys();
    if (resp.isSuccess) {
      setCurrentItem({
        ColCodeSys: resp.Data,
        ColCode: resp.Data,
        ListOption: [],
        IsRequired: false,
        FlagIsNotNull: "0",
        IsUnique: false,
        FlagIsCheckDuplicate: "0",
        IsSearchable: false,
        FlagIsQuery: "0",
        Enabled: true,
        FlagActive: "1"
      });
      setPopupVisible(true);
    }
  };

  const handleDelete = async (item: MdMetaColGroupSpecDto) => {
    onDelete(item);
  };

  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div className={"w-full h-full my-2"} id={"form-builder"}>
          <div className={"m-1"}>
            <Button type={"default"} text={"Add New"} onClick={handleAdd} />
          </div>
          <EditForm
            onCancel={() => {
              setPopupVisible(false);
            }}
            onSave={handleSave}
          />
          <LoadPanel
            container={".dx-viewport"}
            shadingColor="rgba(0,0,0,0.4)"
            position={"center"}
            showIndicator={true}
            showPane={true}
          />
          <Accordion
            collapsible={true}
            multiple={true}
            dataSource={listColGroups}
            itemTitleRender={(item) => item.ColGrpName}
            itemRender={(item) => {
              return (
                <List
                  dataSource={fieldByGroup[buildKey(item.ColGrpCodeSys)]}
                  keyExpr="ColCodeSys"
                  allowItemDeleting={false}
                  itemRender={(item) => {
                    return (
                      <div className={"w-full flex items-center"}>
                        <div className={"w-[80px]"}>
                          <Button
                            onClick={() => handleEdit(item)}
                            stylingMode={"text"}
                          >
                            <Icon name={"edit"} size={10} />
                          </Button>
                          <Button
                            onClick={() => handleDelete(item)}
                            stylingMode={"text"}
                          >
                            <Icon name={"trash"} color={"#ff0000"} size={10} />
                          </Button>
                        </div>
                        <div className={"w-[300px] items-center"}>
                          {item.ColCode}
                        </div>
                        <div className={"w-[300px]"}>{item.ColCaption}</div>
                        <div className={"w-[300px]"}>{item.ColDataType}</div>
                        <div className={"w-[150px]"}>
                          <CheckBox
                            readOnly={true}
                            stylingMode={"filled"}
                            text={"Required Field"}
                            value={item.IsRequired}
                          />
                        </div>
                        <div className={"w-[150px]"}>
                          <CheckBox
                            readOnly={true}
                            stylingMode={"filled"}
                            text={"Unique Field"}
                            value={item.IsUnique}
                          />
                        </div>
                        <div className={"w-[150px] flex items-center"}>
                          <Switch
                            value={item.FlagActive}
                            readOnly={true}
                            stylingMode={"filled"}
                            switchedOnText={"FlagActive"}
                            switchedOffText={"Disabled"}
                          />
                          <span className={"ml-3"}>
                            {item.FlagActive ? "FlagActive" : "Disabled"}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                >
                  <ItemDragging allowReordering={true}></ItemDragging>
                </List>
              );
            }}
          />
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
