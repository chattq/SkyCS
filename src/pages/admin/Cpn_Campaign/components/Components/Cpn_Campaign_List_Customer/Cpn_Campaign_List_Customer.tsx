import { useI18n } from "@/i18n/useI18n";
import { Button, TagBox } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CampaignTypeAtom,
  flagSelectorAtom,
  listCampaignAgentAtom,
  listCampaignAtom,
  visiblePopupAtom,
} from "../../store";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { showErrorAtom } from "@/packages/store";
import { useAuth } from "@/packages/contexts/auth";
import { useColumn, UseCustomerGridColumnsProps } from "./use_Column";
import { SearchCustomerPopup } from "@/pages/admin/Cpn_Campaign/components/search-customer-popup/search-customer-popup";
import { GridViewRaw } from "@/packages/ui/base-gridview/GridViewRaw";
import DistrictBution_Agent from "./../PopUp/Distribution_Agent";
import { UploadDialog } from "@/packages/ui/upload-dialog/upload-dialog";
import { toast } from "react-toastify";
import DataGrid from "devextreme-react/data-grid";

interface Props {
  ref: any;
}

export const ListCustomerContent = forwardRef(
  (
    {
      handleSavingRow,
      listCampaign,
      isLoadingDynamicField,
      listDynamicField,
      defaultFieldDynamic,
      handleShowSelectCustomer,
      handleShowPopUpDistributionAgent,
      handleImport,
      handleRemoveCampaign,
      listCampaignAgent,
    }: any,
    ref
  ) => {
    const columns = useColumn({
      dataField: listDynamicField ?? {
        dataSource: [],
        dynamicField: [],
      },
      customeField: defaultFieldDynamic ?? {
        t: "",
      },
    } as UseCustomerGridColumnsProps);

    const handleStartEditing = (e: any) => {
      if (e.column.dataField === "AgentName") {
        e.column.editorOptions = {
          displayExpr: "UserName",
          valueExpr: "UserCode",
          dataSource: listCampaignAgent,
        };
        e.column.setCellValue = (newData: any, value: any) => {
          const item = listCampaignAgent.find(
            (item) => !!item && item.UserCode === value
          );
          if (item) {
            newData.AgentName = item.UserName;
            newData.AgentCode = value;
          }
        };
      }
    };
    const handleEditRowChanges = (
      e: { key: string; type: string }[] | undefined
    ) => {
      // console.log("handleEditRowChanges", e);
      if (e) {
        // remove each item in e from listCampaign
        // console.log("remove each item in e from listCampaign", e);
        for (const item of e) {
          if (item.type === "remove") {
            handleRemoveCampaign(item.key);
          }
        }
      }
    };

    console.log("listCampaign", listCampaign);

    const gridContent = useMemo(() => {
      return (
        <GridViewRaw
          storeKey="Mst_CustomerCampaign"
          keyExpr={"CustomerCodeSys"}
          isLoading={isLoadingDynamicField}
          ref={ref}
          onReady={(r) => {}}
          dataSource={listCampaign}
          columns={columns}
          allowSelection={true}
          onSelectionChanged={() => {}}
          onSaveRow={handleSavingRow}
          inlineEditMode="row"
          onCustomerEditing={handleStartEditing}
          onEditRowChanges={handleEditRowChanges}
          toolbarItems={[
            {
              location: "before",
              render: () => {
                return (
                  <Button
                    stylingMode={"contained"}
                    type={"default"}
                    text={"Select"}
                    onClick={() => {
                      handleShowSelectCustomer();
                    }}
                  />
                );
              },
            },
            {
              location: "before",
              render: () => {
                return (
                  <Button
                    type={"default"}
                    stylingMode={"contained"}
                    text={"Import Excel"}
                    onClick={handleImport}
                  />
                );
              },
            },
            {
              location: "before",
              render: () => {
                return (
                  <Button
                    stylingMode={"contained"}
                    type={"default"}
                    onClick={handleShowPopUpDistributionAgent}
                    text={"Distribution Agent"}
                  />
                );
              },
            },
          ]}
        ></GridViewRaw>
      );
    }, [columns, listCampaignAgent]);
    return gridContent;
  }
);
const Cpn_Campaign_List_Customer = forwardRef(
  ({ commonRef }: any, ref: ForwardedRef<DataGrid>) => {
    const { t } = useI18n("Cpn_Campaign_List_Customer");
    const { auth } = useAuth();
    const api = useClientgateApi();
    const showError = useSetAtom(showErrorAtom);
    const CampaignType = useAtomValue(CampaignTypeAtom);
    const setVisiblePopup = useSetAtom(visiblePopupAtom);
    const [listCampaign, setListCampaign] = useState<any[]>([]);
    const flagSelector = useAtomValue(flagSelectorAtom);
    const [currentCode, setCurrentCode] = useState(<></>);
    const listCampaignAtomValue = useAtomValue(listCampaignAtom);
    useEffect(() => {
      const newArr = listCampaignAtomValue
        .map((item) => {
          return {
            ...item,
            UserCode: item.AgentCode,
          };
        })
        .map((item) => {
          delete item.AgentCode;
          return item;
        });

      setListCampaign(listCampaignAtomValue);
    }, [listCampaignAtomValue]);

    const { data: listDynamicField, isLoading: isLoadingDynamicField } =
      useQuery({
        queryKey: ["listDynamicField", CampaignType],
        queryFn: async () => {
          if (CampaignType !== "") {
            const response = await api.Mst_CampaignType_GetByCode(
              CampaignType,
              auth.orgData?.Id ?? ""
            );
            if (response.isSuccess) {
              if (response.Data?.Lst_Mst_CustomColumnCampaignType) {
                const arr =
                  response.Data?.Lst_Mst_CustomColumnCampaignType ?? [];
                const getCodeSys = arr.map((item: any) => {
                  return item.CampaignColCfgCodeSys;
                });

                const responseDateSource =
                  await api.Mst_CampaignColumnConfig_GetListOption(getCodeSys);

                if (responseDateSource.isSuccess) {
                  const data = responseDateSource.DataList ?? [];
                  const obj = data.reduce((result: any, item: any) => {
                    result[item.CampaignColCfgCodeSys] =
                      item.Lst_MD_OptionValue;
                    return result;
                  }, {} as { [key: string]: any[] });

                  return {
                    dataSource: {
                      ...obj,
                    },
                    dynamicField:
                      response.Data?.Lst_Mst_CustomColumnCampaignType,
                  };
                } else {
                  showError({
                    message: responseDateSource?.errorCode,
                    debugInfo: responseDateSource?.debugInfo,
                    errorInfo: responseDateSource?.errorInfo,
                  });
                }
              }
              return response.Data?.Lst_Mst_CustomColumnCampaignType ?? {};
            } else {
              return {};
            }
          } else {
            return {};
          }
        },
      });
    const getCustomerData = async (param: string[]) => {
      const response = await api.Mst_Customer_GetByCustomerCode(param);
      if (response.isSuccess) {
        toast.success("Call Success");
        const newArr = response.Data;
        const newCustomer = newArr?.Lst_Mst_Customer ?? [];
        const newEmail = newArr?.Lst_Mst_CustomerEmail ?? [];
        const newPhone = newArr?.Lst_Mst_CustomerPhone ?? [];
        const getArr = newCustomer.map((item) => {
          const getEmail = newEmail.filter((itemEmail) => {
            return itemEmail.CustomerCodeSys === item.CustomerCodeSys;
          });
          const getDefaultEmail = getEmail.find((itemEmail) => {
            return itemEmail.FlagDefault === "1";
          });

          const getPhone = newPhone.filter((itemPhone) => {
            return itemPhone.CustomerCodeSys === item.CustomerCodeSys;
          });

          const getCurrentPhone = getPhone.find(
            (itemPhone) => itemPhone.FlagDefault === "0"
          );

          const getDefaultPhone = getPhone.find((itemPhone) => {
            return itemPhone.FlagDefault === "1";
          });

          let obj = {
            CustomerPhoneNo1: "",
            CustomerPhoneNo2: "",
            CustomerEmail: "",
            AgentCode: "",
            AgentName: "",
          };

          if (getDefaultPhone) {
            obj.CustomerPhoneNo1 = getDefaultPhone.CtmPhoneNo;
          }

          if (getCurrentPhone) {
            obj.CustomerPhoneNo2 = getCurrentPhone.CtmPhoneNo;
          } else {
            if (getDefaultPhone) {
              obj.CustomerPhoneNo2 = getDefaultPhone.CtmPhoneNo;
            }
          }

          if (getDefaultEmail) {
            obj.CustomerEmail = getDefaultEmail.CtmEmail;
          }

          return {
            ...item,
            ...obj,
          };
        });
        const arr = [...listCampaign, ...getArr];
        setListCampaign(arr);
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
      }
    };

    const { data: getMapping, isLoading: isLoadingMapping } = useQuery({
      queryKey: ["CpnCampaign/MappingColumn"],
      queryFn: async () => {
        const response = await api.Cpn_Campaign_MappingColumn();
        if (response.isSuccess) {
          return response.Data;
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
        }
      },
    });

    const defaultFieldDynamic = {};

    const onClosePopup = () => {
      setVisiblePopup(false);
      setCurrentCode(<></>);
    };

    const handleImportExcel = async (file: File[]) => {
      if (CampaignType !== "" && CampaignType) {
        const response = await api.Cpn_Campaign_Import(file, CampaignType);
        if (response.isSuccess) {
          toast.success(t("Import Success"));
          const obj = response.Data;
          setListCampaign([...obj]);
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
        }
      } else {
        toast.error(t("Please Input Campaign Type"));
      }
    };

    const exportTemplateExcel = async () => {
      if (CampaignType !== "" && CampaignType) {
        const response = await api.Cpn_Campaign_ExportTemplate(CampaignType);
        if (response.Data) {
          toast.success(t("Export template Success"));
          if (response.Data) {
            window.location.href = response.Data.Url ?? "";
          } else {
            toast.error(t("Dont have Url Excel"));
          }
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
        }
      } else {
        toast.error(t("Please Input Campaign Type"));
      }
    };

    const handleSave = async (data: any[]) => {
      if (listCampaign.length) {
        const fil = listCampaign.every((item) => {
          return data.find(
            (itemFil) => itemFil.CustomerCodeSys === item.CustomerCodeSys
          );
        });
        if (fil) {
          toast.error(
            "The customer is exist so please select different customer!"
          );
        } else {
          const param = data.map((item) => {
            return item.CustomerCodeSys;
          });
          await getCustomerData(param);
          onClosePopup();
        }
      } else {
        if (data.length) {
          const param = data.map((item) => {
            return item.CustomerCodeSys;
          });
          await getCustomerData(param);
          onClosePopup();
        } else {
          onClosePopup();
        }
      }
    };

    const handleShowSelectCustomer = () => {
      setVisiblePopup(true);
      setCurrentCode(
        <SearchCustomerPopup
          onSave={handleSave}
          onCancel={() => {
            setCurrentCode(<></>);
          }}
        />
      );
    };

    const handleImport = () => {
      setCurrentCode(
        <UploadDialog
          visible={true}
          onUpload={handleImportExcel}
          onDownloadTemplate={exportTemplateExcel}
          onCancel={() => {
            setCurrentCode(<></>);
          }}
        />
      );
    };

    const handleSavingRow = useCallback(
      (e: any) => {
        e.cancel = false;
      },
      [listCampaign]
    );

    const handleSaveDistrictButionAgent = (data: any): void => {
      setListCampaign(data);
      toast.success(t("district bution success"));
    };

    const handleShowPopUpDistributionAgent = () => {
      setVisiblePopup(true);
      setCurrentCode(
        <DistrictBution_Agent
          onSave={handleSaveDistrictButionAgent}
          listCustomer={listCampaign}
          onCancel={() => {
            setCurrentCode(<></>);
          }}
        />
      );
    };

    const arrayStatus = [
      {
        item: t("PENDING"),
        value: "PENDING",
      },
      {
        item: t("APPROVE"),
        value: "APPROVE",
      },
      {
        item: t("STARTED"),
        value: "STARTED",
      },
      {
        item: t("PAUSED"),
        value: "PAUSED",
      },
      {
        item: t("CONTINUED"),
        value: "CONTINUED",
      },
      {
        item: t("FINISH"),
        value: "FINISH",
      },
    ];
    const listCampaignAgentValue = useAtomValue(listCampaignAgentAtom);
    const handleRemoveCampaign = (key: string) => {
      const newArr = [...listCampaign].filter((item) => {
        return item.CustomerCodeSys !== key;
      });
      setListCampaign(newArr);
    };

    return (
      <>
        {flagSelector !== "add" && (
          <div className="w-[400px] box-status">
            <p className="mr-2">{t("Status")}</p>
            <TagBox
              className=""
              dataSource={arrayStatus}
              valueExpr="value"
              displayExpr="item"
            ></TagBox>
          </div>
        )}
        <ListCustomerContent
          ref={ref}
          handleSavingRow={handleSavingRow}
          listCampaign={listCampaign}
          isLoadingDynamicField={isLoadingDynamicField}
          listDynamicField={listDynamicField}
          defaultFieldDynamic={getMapping ?? defaultFieldDynamic}
          handleShowSelectCustomer={handleShowSelectCustomer}
          handleShowPopUpDistributionAgent={handleShowPopUpDistributionAgent}
          handleImport={handleImport}
          handleRemoveCampaign={handleRemoveCampaign}
          listCampaignAgent={listCampaignAgentValue}
        />
        {currentCode}
      </>
    );
  }
);

export default Cpn_Campaign_List_Customer;
