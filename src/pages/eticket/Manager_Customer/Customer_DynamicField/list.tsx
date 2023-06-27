import { useI18n } from "@/i18n/useI18n";
import { showErrorAtom } from "@/packages/store";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import { logger } from "@packages/logger";
import {
  MdMetaColGroup,
  MdMetaColGroupSpecDto,
  MstTicketColumnConfig,
  MstTicketColumnConfigDto,
  MstTicketColumnConfigParam,
} from "@packages/types";
import { Icon } from "@packages/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { Accordion, CheckBox, LoadPanel, Switch } from "devextreme-react";
import Button from "devextreme-react/button";
import List, { ItemDragging } from "devextreme-react/list";
import { confirm } from "devextreme/ui/dialog";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useMemo, useReducer } from "react";
import { toast } from "react-toastify";
import { EditForm } from "./components/edit-form";
import { currentItemAtom, flagAtom, showPopupAtom } from "./components/store";
import "./list.scss";
import { Response_TicketColumnConfig } from "@/packages/api/clientgate/Mst_TicketColumnConfigApi";
import { useAuth } from "@/packages/contexts/auth";

const FakeListDataField = [
  {
    TicketColCfgCodeSys: "TKCOLCFG.20230622A",
    OrgID: "7206207001",
    TicketColCfgCode: "CF01",
    NetworkID: "7206207001",
    TicketColCfgDataType: "Text",
    TicketColCfgName: "Trường động 01",
    TicketColCfgDateUse: "2023-06-22 17:00:00",
    JsonListOption: "[]",
    FlagCheckDuplicate: "1",
    FlagCheckRequire: "0",
    FlagIsDynamic: "0",
    FlagActive: "1",
    LogLUDTimeUTC: "2023-06-22 11:02:34",
    LogLUBy: "0317844394@INOS.VN",
    Lst_MD_OptionValue: null,
  },
];

const fakeGroup = [
  {
    OrgID: "7206207001",
    ColGrpCodeSys: "COLGRPCODESYS.2023.06",
    NetworkID: "7206207001",
    ScrTplCodeSys: "SCRTPLCODESYS.2023",
    ColGrpCode: "COLGRPCODESYS.2023.02",
    ColGrpName: "Thông tin hệ thống",
    OrderIdx: 60,
    FlagActive: true,
    LogLUDTimeUTC: "2023-01-01",
    LogLUBy: "SYS",
  },
];

export const Eticket_Custom_Field_Dynamic = () => {
  const { t } = useI18n("Eticket_Custom_Field_Dynamic");
  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const { auth } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [""],
    queryFn: async () => {
      const response = await api.Mst_TicketColumnConfig_GetAll();
      if (response.isSuccess) {
        return response.Data?.Lst_Mst_TicketColumnConfig;
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    },
  });

  // const { data: listColGroups } = useQuery({
  //   queryFn: async () => {
  //     const resp = await api.MdMetaColGroupApi_Search({});
  //     if (resp.isSuccess) {
  //       return resp.DataList;
  //     }
  //     return [];
  //   },
  //   queryKey: ["MdMetaColGroupApi_Search"],
  // });

  // const {
  //   data: listFields,
  //   isLoading,
  //   refetch,
  // } = useQuery({
  //   queryFn: async () => {
  //     const resp = await api.MdMetaColGroupSpec_Search(
  //       {},
  //       "SCRTPLCODESYS.2023"
  //     );
  //     if (resp.isSuccess) {
  //       const fields = resp.DataList ?? [];
  //       return fields?.map((item: any) => {
  //         if (item?.Lst_MD_OptionValue) {
  //           return {
  //             ...item,
  //             dataSource: {
  //               type: "master",
  //               sourceId: "province",
  //             },
  //             FlagIsNotNull: item?.FlagIsNotNull
  //               ? item?.FlagIsNotNull === "1"
  //               : false,
  //             FlagIsCheckDuplicate: item?.FlagIsCheckDuplicate
  //               ? item?.FlagIsCheckDuplicate === "1"
  //               : false,
  //             FlagIsQuery: item?.FlagIsQuery
  //               ? item?.FlagIsQuery === "1"
  //               : false,
  //             OrderIdx: 2,
  //           };
  //         }

  //         return {
  //           ...item,
  //           IsRequired: item?.FlagIsNotNull === "1",
  //           IsUnique: item?.FlagIsCheckDuplicate === "1",
  //           IsSearchable: item?.FlagIsQuery === "1",
  //         };
  //       });
  //     } else {
  //       showError({
  //         message: resp.errorCode,
  //         debugInfo: resp.debugInfo,
  //         errorInfo: resp.errorInfo,
  //       });
  //     }
  //   },
  //   queryKey: ["Eticket_MdMetaColGroupSpec_Search"],
  // });

  const onSaved = async (data: MstTicketColumnConfig) => {
    await refetch();
  };

  const onDelete = async (data: MstTicketColumnConfig) => {
    console.log("data ", data);
    const param = [
      {
        TicketColCfgCodeSys: data.TicketColCfgCodeSys,
        OrgID: auth.orgData?.Id ?? "",
      },
    ];

    const result = confirm(
      "<string>Are You Want To Delete</string>",
      "Confirm Change"
    );

    result.then(async (dialogResult: any) => {
      if (dialogResult) {
        const resp = await api.Mst_TicketColumnConfig_Delete(param);
        if (resp.isSuccess) {
          await refetch();
          toast.success(t("common.deleteSuccess"));
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

  if (isLoading || !data) {
    return <LoadPanel />;
  }

  // if (fakeGroup && fakeGroup.length > 0) {
  return (
    <CustomFieldListPageContent
      listFields={data ?? []}
      onSaved={onSaved}
      onDelete={onDelete}
    />
  );
  // }
  // return <LoadPanel />;
};

interface ContentProps {
  listFields: MstTicketColumnConfig[];
  onSaved: (data: MstTicketColumnConfig) => void;
  onDelete: (data: MstTicketColumnConfig) => void;
}

// const buildKey = (rawKey: string) => {
//   return rawKey.replace(/\./g, "").toLowerCase();
// };

export const CustomFieldListPageContent = ({
  listFields,
  onSaved,
  onDelete,
}: ContentProps) => {
  const setFlag = useSetAtom(flagAtom);
  const api = useClientgateApi();

  const setPopupVisible = useSetAtom(showPopupAtom);
  const setCurrentItem = useSetAtom(currentItemAtom);
  const handleSave = async (data: MdMetaColGroupSpecDto) => {
    logger.debug("saved item:", data);
    onSaved(data);
    setPopupVisible(false);
  };
  const [loadingKey, reloading] = useReducer(() => nanoid(), "0");

  const handleEdit = (item: MstTicketColumnConfig) => {
    console.log("item ", item);
    const obj = {
      ...item,
      ListOption: JSON.parse(item.JsonListOption),
      FlagCheckDuplicate: item.FlagCheckDuplicate === "1" ? true : false,
      FlagCheckRequire: item.FlagCheckRequire === "1" ? true : false,
      FlagIsDynamic: item.FlagIsDynamic === "1" ? true : false,
      FlagActive: item.FlagActive === "1" ? true : false,
    };
    if (item.TicketColCfgDataType === "MASTERDATA") {
      obj.DataSource = JSON.parse(item.JsonListOption)[0].Value;
    }
    if (item.TicketColCfgDataType === "MASTERDATASELECTMULTIPLE") {
      obj.DataSource = JSON.parse(item.JsonListOption)[0].Value;
    }
    console.log("obj ", obj);
    setFlag("update");
    setCurrentItem(obj);
    setPopupVisible(true);
  };
  const handleAdd = async () => {
    setFlag("add");
    const resp = await api.Seq_GetTicketColCfgCodeSys();
    if (resp.isSuccess) {
      setCurrentItem({
        TicketColCfgCodeSys: resp.Data,
        TicketColCfgCode: resp.Data,
        ListOption: [],
        FlagActive: true,
        FlagCheckRequire: true,
        FlagCheckDuplicate: true,
      });
      setPopupVisible(true);
    }
  };

  const handleDelete = async (item: MstTicketColumnConfig) => {
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
          <List
            dataSource={listFields}
            keyExpr="TicketColCfgCodeSys"
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
                    {item.TicketColCfgCode}
                  </div>
                  <div className={"w-[300px]"}>{item.TicketColCfgName}</div>
                  <div className={"w-[300px]"}>{item.TicketColCfgDataType}</div>
                  <div className={"w-[150px]"}>
                    <CheckBox
                      readOnly={true}
                      stylingMode={"filled"}
                      text={"Required Field"}
                      value={item.FlagCheckRequire === "1"}
                    />
                  </div>
                  <div className={"w-[150px]"}>
                    <CheckBox
                      readOnly={true}
                      stylingMode={"filled"}
                      text={"Unique Field"}
                      value={item.FlagCheckDuplicate === "1"}
                    />
                  </div>
                  <div className={"w-[150px] flex items-center"}>
                    <Switch
                      value={item.FlagIsDynamic === "1"}
                      readOnly={true}
                      stylingMode={"filled"}
                      switchedOnText={"FlagIsDynamic"}
                      switchedOffText={"Disabled"}
                    />
                    <span className={"ml-3"}>
                      {item.FlagIsDynamic ? "FlagIsDynamic" : "Disabled"}
                    </span>
                  </div>
                </div>
              );
            }}
          >
            {/* <ItemDragging allowReordering={true}></ItemDragging> */}
          </List>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
