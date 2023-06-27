import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  Button,
  DataGrid,
  Form,
  List,
  LoadPanel,
  Switch,
} from "devextreme-react";
import {
  ButtonItem,
  ButtonOptions,
  GroupItem,
  IItemProps,
  SimpleItem,
} from "devextreme-react/form";
import { useSetAtom } from "jotai";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { match } from "ts-pattern";
import "./../../../eticket.scss";
import { Icon } from "@/packages/ui/icons";
import { useAuth } from "@/packages/contexts/auth";
import { requiredType } from "@/packages/common/Validation_Rules";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
const Mst_TicketEstablishInfo_Save = () => {
  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const { auth } = useAuth();
  const formRef = useRef<any>(null);
  const { t } = useI18n("Mst_TicketEstablishInfo_Save");
  const [valueApi, setValueApi] = useState<any[]>([]);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Mst_TicketEstablishInfo_Save"],
    queryFn: async () => {
      const response = await api.Mst_TicketEstablishInfoApi_GetAllInfo();
      if (response.isSuccess) {
        const newReponse = Object.keys(response.Data).map((item) => {
          return {
            title: item,
            list: response.Data[item],
          };
        });
        setValueApi(newReponse);
        return newReponse ?? [];
      } else {
        showError({
          message: t("response.errorCode"),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    },
  });

  useEffect(() => {
    refetch();
    return () => {};
  }, []);

  const defaultData = {
    Lst_Mst_TicketStatus: [],
    Lst_Mst_TicketPriority: [],
    Lst_Mst_TicketType: [],
    Lst_Mst_TicketSource: [],
    Lst_Mst_ReceptionChannel: [],
    Lst_Mst_ContactChannel: [],
    Lst_Mst_TicketCustomType: [],
  };

  // const ButtonResponse = (item: any) => {
  //   return match(item.title)
  //     .with("Lst_Mst_TicketStatus", () => {
  //       console.log("Lst_Mst_TicketStatus");
  //       return (
  //         <Button
  //           onClick={() => handleSave(item, item.title)}
  //           visible={isSaveStatus}
  //         >
  //           Save
  //         </Button>
  //       );
  //     })
  //     .with("Lst_Mst_TicketPriority", () => {
  //       console.log("Lst_Mst_TicketPriority");
  //       return (
  //         <Button
  //           onClick={() => handleSave(item, item.title)}
  //           visible={isSavePriority}
  //         >
  //           Save
  //         </Button>
  //       );
  //     })
  //     .with("Lst_Mst_TicketType", () => {
  //       console.log("Lst_Mst_TicketType");
  //       return (
  //         <Button
  //           onClick={() => handleSave(item, item.title)}
  //           visible={isSaveType}
  //         >
  //           Save
  //         </Button>
  //       );
  //     })
  //     .with("Lst_Mst_TicketSource", () => {
  //       console.log("Lst_Mst_TicketSource");
  //       return (
  //         <Button
  //           onClick={() => handleSave(item, item.title)}
  //           visible={isSaveSource}
  //         >
  //           Save
  //         </Button>
  //       );
  //     })
  //     .with("Lst_Mst_ReceptionChannel", () => {
  //       console.log("Lst_Mst_ReceptionChannel");
  //       return (
  //         <Button
  //           onClick={() => handleSave(item, item.title)}
  //           visible={isSaveReceptionChannel}
  //         >
  //           Save
  //         </Button>
  //       );
  //     })
  //     .with("Lst_Mst_ContactChannel", () => {
  //       console.log("Lst_Mst_ContactChannel");
  //       return (
  //         <Button
  //           onClick={() => handleSave(item, item.title)}
  //           visible={isSaveContactChannel}
  //         >
  //           Save
  //         </Button>
  //       );
  //     })
  //     .with("Lst_Mst_TicketCustomType", () => {
  //       console.log("Lst_Mst_TicketCustomType");
  //       return (
  //         <Button
  //           onClick={() => handleSave(item, item.title)}
  //           visible={isSaveCustomType}
  //         >
  //           Save
  //         </Button>
  //       );
  //     })
  //     .otherwise(() => {
  //       return <></>;
  //     });
  // };

  const defaultFormData: IItemProps[] = [
    {
      dataField: "AgentTicket",
      caption: "AgentTicket",
      editorType: "dxTextBox",
    },
    {
      dataField: "CustomerTicket",
      caption: "CustomerTicket",
      editorType: "dxTextBox",
    },
    {
      dataField: "FlagActive",
      caption: "FlagActive",
      editorType: "dxSwitch",
      editorOptions: {
        defaultValue: false,
      },
    },
  ];

  // const getVisible = useCallback((group: string) => {
  //   console.log("group", group);
  //   match(group)
  //     .with("Lst_Mst_TicketStatus", () => {
  //       setIsSaveStatus(true);
  //     })
  //     .with("Lst_Mst_TicketPriority", () => {
  //       setIsSavePriority(true);
  //     })
  //     .with("Lst_Mst_TicketType", () => {
  //       setIsSaveType(true);
  //     })
  //     .with("Lst_Mst_TicketSource", () => {
  //       setIsSaveSource(true);
  //     })
  //     .with("Lst_Mst_ReceptionChannel", () => {
  //       setIsSaveReceptionChannel(true);
  //     })
  //     .with("Lst_Mst_ContactChannel", () => {
  //       setIsSaveContactChannel(true);
  //     })
  //     .with("Lst_Mst_TicketCustomType", () => {
  //       setIsSaveCustomType(true);
  //     })
  //     .otherwise(() => "");
  // }, []);

  // const listFormData = [
  //   "Lst_Mst_TicketStatus",
  //   "Lst_Mst_TicketPriority",
  //   "Lst_Mst_TicketType",
  //   "Lst_Mst_TicketSource",
  //   "Lst_Mst_TicketCustomType",
  //   "Lst_Mst_ReceptionChannel",
  //   "Lst_Mst_ContactChannel",
  // ];

  const getKey = useCallback((text: string) => {
    return match(text)
      .with("Lst_Mst_TicketStatus", () => "TicketStatus")
      .with("Lst_Mst_TicketPriority", () => "TicketPriority")
      .with("Lst_Mst_TicketType", () => "TicketType")
      .with("Lst_Mst_TicketSource", () => "TicketSource")
      .with("Lst_Mst_ReceptionChannel", () => "ReceptionChannel")
      .with("Lst_Mst_ContactChannel", () => "ContactChannel")
      .with("Lst_Mst_TicketCustomType", () => "TicketCustomType")
      .otherwise(() => "");
  }, []);

  const CallSave = useCallback(async (param: any) => {
    const response = await api.Mst_TicketEstablishInfoApi_Save(param);
    if (response.isSuccess) {
      toast.success("Save successfully");
      await refetch();
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  }, []);

  const handleDelete = async (title: any, itemList: any) => {
    const key = getKey(title);
    if (itemList?.idCreate) {
      console.log("idCreate ");
      const newValue = valueApi?.map((itemMap) => {
        if (itemMap.title === title) {
          return {
            ...itemMap,
            list: itemMap.list.filter((itemFilter: any) => {
              return itemFilter.idCreate !== itemList.idCreate;
            }),
          };
        } else {
          return itemMap;
        }
      });
      // console.log("newValue ", newValue);
      setValueApi(newValue);
      // getVisible(title);
    } else {
      console.log("case ", itemList);
      const newValue = valueApi?.map((itemMap) => {
        if (itemMap.title === title) {
          return {
            ...itemMap,
            list: itemMap.list.filter((itemFilter: any) => {
              return itemFilter[key] !== itemList[key];
            }),
          };
        } else {
          return itemMap;
        }
      });
      // console.log("newValue ", newValue);
      setValueApi(newValue);
      // getVisible(title);
    }
  };

  // const handleSave = async (item: any, title: string) => {
  //   const { isValid } = formRef.current?.instance.validate();
  //   if (isValid) {
  //     const valueAdd = valueApi.find((item) => item.title === title);
  //     const newValue = data
  //       ?.map((itemMap) => {
  //         if (itemMap.title === title) {
  //           return {
  //             ...itemMap,
  //             FlagActive:
  //               item.FlagActive && item.FlagActive !== "0" ? "1" : "0",
  //             list: valueAdd.list,
  //           };
  //         } else {
  //           return {
  //             ...itemMap,
  //             FlagActive: item.FlagActive ? "1" : "0",
  //           };
  //         }
  //       })
  //       .reduce((acc: any, item: any) => {
  //         return {
  //           ...acc,
  //           [item.title]: item.list,
  //         };
  //       }, {});
  //     console.log("newValue ", newValue, "valueAdd ", valueAdd);
  //     await CallSave(newValue);
  //   }
  // };

  const handleAdd = (group: string) => {
    const defaultValue = {
      OrgID: auth.orgData?.Id,
      TicketSource: "", // hệ thống tự nhập
      NetworkID: auth.networkId,
      // AgentTicketSourceName: "", // để người dùng nhập
      // CustomerTicketSourceName: "", // để người dùng nhập
      FlagUseType: "TYPE3",
      FlagActive: "1",
      Remark: "",
      flagRemoveWhenEdit: true,
      LogLUDTimeUTC: "2023-06-22 11:41:40", // ??
      LogLUBy: "0317844394@INOS.VN", // ??
    };
    // console.log("group ", group, "value ", valueApi);
    const newValue = valueApi.map((itemValue: any) => {
      if (itemValue.title === group) {
        let obj = {};
        obj = match(itemValue.title)
          .with("Lst_Mst_TicketStatus", () => {
            return {
              AgentTicketStatusName: "",
              CustomerTicketStatusName: "",
              idCreate: nanoid(),
            };
          })
          .with("Lst_Mst_TicketPriority", () => {
            return {
              AgentTicketPriorityName: "",
              CustomerTicketPriorityName: "",
              idCreate: nanoid(),
            };
          })
          .with("Lst_Mst_TicketType", () => {
            return {
              AgentTicketTypeName: "",
              CustomerTicketTypeName: "",
              idCreate: nanoid(),
            };
          })
          .with("Lst_Mst_TicketSource", () => {
            return {
              AgentTicketSourceName: "",
              CustomerTicketSourceName: "",
              idCreate: nanoid(),
            };
          })
          .with("Lst_Mst_TicketCustomType", () => {
            return {
              AgentTicketCustomTypeName: "",
              CustomerTicketCustomTypeName: "",
              idCreate: nanoid(),
            };
          })
          .with("Lst_Mst_ReceptionChannel", () => {
            return {
              AgentReceptionChannelName: "",
              CustomerReceptionChannelName: "",
              idCreate: nanoid(),
            };
          })
          .with("Lst_Mst_ContactChannel", () => {
            return {
              AgentContactChannelName: "",
              CustomerContactChannelName: "",
              idCreate: nanoid(),
            };
          })
          .otherwise(() => {
            return {};
          });
        let newItem = {
          ...defaultValue,
          ...obj,
        };
        // console.log("newItem ", newItem);
        return {
          ...itemValue,
          list: [...itemValue.list, newItem],
        };
      } else {
        return itemValue;
      }
    });

    setValueApi(newValue);
    // getVisible(group);
  };

  // const handleUpdate = async (title: string) => {
  //   const { isValid } = formRef.current?.instance.validate();
  //   if (isValid) {
  //     const getListValueForm = valueApi.find((item) => {
  //       return item.title === title;
  //     });
  //     console.log("data ", data);
  //     const newData = data
  //       ?.map((item) => {
  //         if (item.title === title) {
  //           return getListValueForm;
  //         } else {
  //           return item;
  //         }
  //       })
  //       .reduce((acc: any, item: any) => {
  //         return {
  //           ...acc,
  //           [item.title]: item.list,
  //         };
  //       }, {});

  //     await CallSave(newData);
  //   } else {
  //     toast.error("Please input value !");
  //   }
  // };

  const handleUpdateAll = async () => {
    const { isValid } = formRef.current?.instance.validate();
    if (isValid) {
      const param = valueApi
        .map((item) => {
          return {
            ...item,
            list: item.list.map((itemList: any) => {
              return {
                ...itemList,
                FlagActive:
                  itemList.FlagActive && itemList.FlagActive !== "0"
                    ? "1"
                    : "0",
              };
            }),
          };
        })
        .reduce((acc: any, item: any) => {
          return {
            ...acc,
            [item.title]: item.list,
          };
        }, {});
      await CallSave(param);
    }
  };

  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name={"Header"}>
        <Button onClick={() => handleUpdateAll()}>Save</Button>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div className="form-builder">
          <LoadPanel
            container={".dx-viewport"}
            shadingColor="rgba(0,0,0,0.4)"
            position={"center"}
            visible={isLoading}
            showIndicator={true}
            showPane={true}
          />
          <Form ref={formRef} validationGroup="Mst_TicketEstablishInfo_Form">
            <SimpleItem
              render={() => {
                return (
                  <Accordion
                    className="eticket-list"
                    collapsible={true}
                    multiple={true}
                    dataSource={valueApi}
                    itemTitleRender={(item) => item.title}
                    itemRender={(item) => {
                      let formList: any[] = [];
                      formList = match(item.title)
                        .with("Lst_Mst_TicketStatus", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentTicketStatusName",
                                caption: "AgentTicketStatusName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerTicketStatusName",
                                caption: "CustomerTicketStatusName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_TicketPriority", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentTicketPriorityName",
                                caption: "AgentTicketPriorityName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerTicketPriorityName",
                                caption: "CustomerTicketPriorityName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_TicketType", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentTicketTypeName",
                                caption: "AgentTicketTypeName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerTicketTypeName",
                                caption: "CustomerTicketTypeName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_TicketSource", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentTicketSourceName",
                                caption: "AgentTicketSourceName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerTicketSourceName",
                                caption: "CustomerTicketSourceName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_TicketCustomType", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentTicketCustomTypeName",
                                caption: "AgentTicketCustomTypeName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerTicketCustomTypeName",
                                caption: "CustomerTicketCustomTypeName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_ReceptionChannel", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentReceptionChannelName",
                                caption: "AgentReceptionChannelName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerReceptionChannelName",
                                caption: "CustomerReceptionChannelName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_ContactChannel", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentContactChannelName",
                                caption: "AgentContactChannelName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerContactChannelName",
                                caption: "CustomerContactChannelName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .otherwise(() => {
                          return defaultFormData;
                        });
                      return (
                        <>
                          <List
                            dataSource={item.list}
                            keyExpr="ColCodeSys"
                            allowItemDeleting={false}
                            itemRender={(itemList) => {
                              return (
                                <Form
                                  formData={itemList}
                                  labelMode="hidden"
                                  validationGroup="Mst_TicketEstablishInfo_Form"
                                >
                                  <GroupItem colCount={4}>
                                    {formList.map(
                                      (itemForm: any, index: number) => {
                                        if (
                                          itemList.FlagActive === "0" &&
                                          itemForm.dataField === "FlagActive"
                                        ) {
                                          return (
                                            <SimpleItem
                                              key={nanoid()}
                                              {...itemForm}
                                              disable={
                                                itemList.FlagUseType ===
                                                  "TYPE2" ||
                                                itemList.FlagUseType === "TYPE1"
                                              }
                                              editorOptions={{
                                                readOnly:
                                                  itemList.FlagUseType ===
                                                    "TYPE2" ||
                                                  itemList.FlagUseType ===
                                                    "TYPE1",
                                                value:
                                                  itemList.FlagActive === "1",
                                              }}
                                            />
                                          );
                                        } else {
                                          return (
                                            <SimpleItem
                                              key={nanoid()}
                                              {...itemForm}
                                              editorOptions={{
                                                readOnly:
                                                  itemList.FlagUseType ===
                                                    "TYPE2" ||
                                                  itemList.FlagUseType ===
                                                    "TYPE1",
                                              }}
                                            />
                                          );
                                        }
                                      }
                                    )}

                                    <ButtonItem>
                                      <ButtonOptions
                                        disabled={
                                          itemList.FlagUseType !== "TYPE3"
                                        }
                                        onClick={
                                          () =>
                                            handleDelete(item.title, itemList)
                                          // handleSave(itemList, item.title)
                                        }
                                        stylingMode={"text"}
                                      >
                                        <Icon
                                          name={"trash"}
                                          color={"#ff0000"}
                                          size={10}
                                        />
                                      </ButtonOptions>
                                    </ButtonItem>
                                  </GroupItem>
                                </Form>
                              );
                            }}
                          ></List>
                          <Button onClick={() => handleAdd(item.title)}>
                            Add
                          </Button>
                        </>
                      );
                    }}
                  ></Accordion>
                );
              }}
            ></SimpleItem>
          </Form>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Mst_TicketEstablishInfo_Save;
