import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { Button, Form, LoadPanel } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  currentInfo,
  flagSelectorAtom,
  listCampaignAgentAtom,
  listCampaignAtom,
} from "../store";
import {
  GroupItem,
  Tab,
  TabPanelOptions,
  TabbedItem,
} from "devextreme-react/form";
import Cpn_Campaign_Info_Common from "./Cpn_Campaign_Info_Common/Cpn_Campaign_Info_Common";
import Cpn_Campaign_List_Customer from "./Cpn_Campaign_List_Customer/Cpn_Campaign_List_Customer";
import { toast } from "react-toastify";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { useAuth } from "@/packages/contexts/auth";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { match } from "ts-pattern";
import { useNetworkNavigate } from "@/packages/hooks";
import { convertDate } from "@/packages/common";
import DataGrid from "devextreme-react/data-grid";
import { nanoid } from "nanoid";
import { encodeFileType, revertEncodeFileType } from "@/components/ulti";

interface tabInterface {
  title: string;
  component: ReactNode;
}

interface buttonItem {
  button: string;
  buttonComponent: ReactNode;
}

const Cpn_Campaign_Info = () => {
  const { t } = useI18n("Cpn_Campaign_Info");
  const param = useParams();
  const formRef: any = useRef(null);
  const currentItemData = useAtomValue(currentInfo);
  const setCurrentItemData = useSetAtom(currentInfo);
  const flagSelector = useAtomValue(flagSelectorAtom);
  const navigate = useNetworkNavigate();
  const listCampaign = useAtomValue(listCampaignAtom);
  const setListCampaign = useSetAtom(listCampaignAtom);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const { auth } = useAuth();
  const commonRef = useRef<Form>(null);
  const listCustomerRef = useRef<DataGrid>(null);

  const tabs = [
    {
      title: t("Common Info"),
      component: (
        <Cpn_Campaign_Info_Common
          ref={commonRef}
          listCustomerRef={listCustomerRef}
        />
      ),
    },
    {
      title: t("List Customer"),
      component: (
        <Cpn_Campaign_List_Customer
          commonRef={commonRef}
          ref={listCustomerRef}
        />
      ),
    },
  ];
  const {
    data: dataGetByCode,
    isLoading: isLoadingGetByCode,
    refetch: refetchGetByCode,
  } = useQuery({
    queryKey: ["Cpn_Campaign_GetByCode", param?.CampaignCode],
    queryFn: async () => {
      if (param.CampaignCode) {
        const response = await api.Cpn_Campaign_GetByCode(
          param.CampaignCode,
          auth.orgData?.Id ?? ""
        );
        const item: any = response.Data?.Lst_Cpn_Campaign?.[0];
        if (response.isSuccess) {
          const listAgent = response?.Data?.Lst_Cpn_CampaignAgent?.map(
            (item) => item.AgentCode ?? ""
          );
          const listUpload = response?.Data?.Lst_Cpn_CampaignAttachFile ?? [];
          console.log("listUpload ", listUpload);
          const newUpdateLoading = listUpload.map((item) => {
            console.log("item.FileType", item.FileType);
            return {
              ...item,
              FileFullName: item.FileName,
              FileType: encodeFileType(item.FileType),
              FileUrlLocal: item.FilePath,
            };
          });
          setCurrentItemData({
            ...item,
            CampaignAgent: listAgent,
            uploadFiles: newUpdateLoading ?? [],
          });
          let customizeCampaignCustomer =
            response.Data?.Lst_Cpn_CampaignCustomer ?? [];
          setListCampaign(customizeCampaignCustomer);
          return response.Data;
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
        }
      } else {
        return {};
      }
    },
  });

  useEffect(() => {
    refetchGetByCode();
  }, []);

  const handleCancel = useCallback((): void => {
    navigate("/admin/Cpn_CampaignPage");
  }, []);

  const onDelete = async () => {
    const obj = {
      Cpn_Campaign: {
        CampaignCode: currentItemData.CampaignCode,
        OrgID: auth.orgData?.Id,
      },
      Lst_Cpn_CampaignAttachFile: [],
      Lst_Cpn_CampaignCustomer: [],
      Lst_Cpn_CampaignAgent: [],
    };

    const response = await api.Cpn_Campaign_Delete(obj);
    if (response.isSuccess) {
      handleCancel();
      navigate("/admin/Cpn_Campaign_Info");
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const executeState = useCallback(
    async (url: string) => {
      const obj = {
        OrgID: auth.orgData?.Id ?? "",
        CampaignCode: currentItemData?.CampaignCode,
      };
      const response = await api.Cpn_Campaign_ExecuteState(obj, url);
      if (response.isSuccess) {
        toast.success(t(`${url} successfully`));
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    },
    [currentItemData]
  );

  const onSave = async () => {
    const { isValid } = formRef.current.instance.validate();
    if (!isValid) {
      toast.error(t("Please Input field required"));
    } else {
      const listCap =
        (listCustomerRef?.current?.props.dataSource as any[]) ?? [];
      if (listCap.length) {
        const obj = {
          Cpn_Campaign: {
            OrgID: auth.orgData?.Id,
            NetworkID: auth.networkId,
            ...currentItemData,
            DTimeStart: convertDate(currentItemData.DTimeStart),
            DTimeEnd: convertDate(currentItemData.DTimeEnd),
            CallRate: 1,
          },
          Lst_Cpn_CampaignAttachFile: currentItemData.uploadFiles.map(
            (item: any, index: any) => {
              return {
                Idx: index,
                FileName: item.FileFullName ?? "",
                FilePath: item.FileUrlLocal ?? "",
                FileType: revertEncodeFileType(item.FileType),
              };
            }
          ),
          Lst_Cpn_CampaignAgent: [
            ...currentItemData.CampaignAgent.map((item: any) => {
              return {
                AgentCode: item,
              };
            }),
          ],
          Lst_Cpn_CampaignCustomer: [],
        };
        delete obj.Cpn_Campaign.uploadFiles;
        // case add
        listCustomerRef?.current?.instance.saveEditData();
        const listCustomers =
          (listCustomerRef?.current?.instance.option("dataSource") as any[]) ??
          [];
        if (listCap.length === 0) {
          const response = await api.Cpn_Campaign_Update(
            obj,
            param?.CampaignCode
          );
          if (response.isSuccess) {
            toast.success(t("Campaign successfully created"));
          } else {
            showError({
              message: response?.errorCode,
              debugInfo: response?.debugInfo,
              errorInfo: response?.errorInfo,
            });
          }
        } else {
          const checkAgent = listCap.every((item) => item.AgentCode);
          if (checkAgent) {
            const Lst_Cpn_CampaignCustomer = listCap.map((item, index) => {
              return {
                CustomerCodeSys: item.CustomerCodeSys,
                Idx: index,
                AgentCode: item.AgentCode,
                CustomerName: item.CustomerName,
                CustomerPhoneNo1: item.CustomerPhoneNo1,
                CustomerPhoneNo2: item.CustomerPhoneNo2,
                CustomerEmail: item.CustomerEmail,
                CustomerCompany: item.CustomerCompany,
                CustomerJsonInfo: item.CustomerJsonInfo,
              };
            });
            obj.Lst_Cpn_CampaignCustomer = Lst_Cpn_CampaignCustomer;
            const response = await api.Cpn_Campaign_Update(
              obj,
              param?.CampaignCode
            );
            if (response.isSuccess) {
              toast.success(t("Campaign successfully created"));
            } else {
              showError({
                message: response?.errorCode,
                debugInfo: response?.debugInfo,
                errorInfo: response?.errorInfo,
              });
            }
          } else {
            toast.error(t("Please Distribution Agent To Customer !"));
          }
        }
      } else {
        toast.error(t("Please Select Customer !"));
      }
    }
  };

  const listButton: buttonItem[] = [
    {
      button: "ADD",
      buttonComponent: (
        <Button
          key={nanoid()}
          type={"default"}
          onClick={onSave}
          stylingMode={"contained"}
          text={t("ADD")}
        />
      ),
    },
    {
      button: "UPDATE",
      buttonComponent: (
        <Button
          key={nanoid()}
          type={"default"}
          stylingMode={"contained"}
          text={t("UPDATE")}
          onClick={onSave}
        />
      ),
    },
    {
      button: "DELETE",
      buttonComponent: (
        <Button
          key={nanoid()}
          type={"default"}
          stylingMode={"contained"}
          onClick={onDelete}
          text={t("DELETE")}
        />
      ),
    },
    {
      button: "APPROVE", // duyệt
      buttonComponent: (
        <Button
          key={nanoid()}
          type={"default"}
          onClick={() => executeState("Approve")}
          stylingMode={"contained"}
          text={t("APPROVE")}
        />
      ),
    },
    {
      button: "STARTED", //Bắt đầu
      buttonComponent: (
        <Button
          key={nanoid()}
          type={"default"}
          onClick={() => executeState("Start")}
          stylingMode={"contained"}
          text={t("STARTED")}
        />
      ),
    },
    {
      button: "PAUSED", // Tạm dừng
      buttonComponent: (
        <Button
          type={"default"}
          key={nanoid()}
          onClick={() => executeState("Pause")}
          stylingMode={"contained"}
          text={t("PAUSED")}
        />
      ),
    },
    {
      button: "CONTINUED", // Tiếp tục
      buttonComponent: (
        <Button
          key={nanoid()}
          type={"default"}
          stylingMode={"contained"}
          onClick={() => executeState("Continue")}
          text={t("CONTINUED")}
        />
      ),
    },
    {
      button: "FINISH", // kết thúc
      buttonComponent: (
        <Button
          key={nanoid()}
          type={"default"}
          onClick={() => executeState("Finish")}
          stylingMode={"contained"}
          text={t("FINISH")}
        />
      ),
    },
  ];

  const listButtonRender = useMemo(() => {
    if (currentItemData.CampaignStatus) {
      return match(currentItemData.CampaignStatus)
        .with("PENDING", () => {
          return listButton.filter((item: buttonItem) => {
            return (
              item.button === "UPDATE" ||
              item.button === "DELETE" ||
              item.button === "APPROVE"
            );
          });
        })
        .with("APPROVE", () => {
          return listButton.filter((item: buttonItem) => {
            return item.button === "STARTED" || item.button === "FINISH";
          });
        })
        .with("STARTED", () => {
          return listButton.filter((item: buttonItem) => {
            return item.button === "PAUSED" || item.button === "FINISH";
          });
        })
        .with("PAUSED", () => {
          return listButton.filter((item: buttonItem) => {
            return item.button === "CONTINUED" || item.button === "FINISH";
          });
        })
        .with("FINISH", () => {
          return [];
        })
        .otherwise(() => {
          return [];
        });
    } else {
      return listButton.filter((item: buttonItem) => {
        return item.button === "ADD";
      });
    }
  }, [currentItemData]);
  // const listCampaignAgentValue = useAtomValue(listCampaignAgentAtom);
  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header d-flex justify-space-between">
          <div className="breakcrumb">
            <p>{t("Cpn_CampaignPage")}</p>
            <p>{`>`}</p>
            <p>{`${flagSelector} Customer`}</p>
          </div>
          <div className="list-button">
            {listButtonRender.map((item: any) => {
              return item.buttonComponent;
            })}
            <Button
              type={"default"}
              stylingMode={"contained"}
              onClick={handleCancel}
              text={t("Cancel")}
            />
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        {!dataGetByCode && <LoadPanel />}
        {!!dataGetByCode && (
          <Form validationGroup="campaignForm" ref={formRef}>
            <GroupItem>
              <TabbedItem>
                <TabPanelOptions
                  deferRendering={false}
                  onSelectionChanged={(e: any) => {
                    // listCustomerRef.current?.instance.saveEditData();
                    // listCustomerRef.current?.instance.refresh();
                  }}
                />
                {tabs.map((item: tabInterface) => {
                  return (
                    <Tab key={item.title} title={item.title}>
                      {item.component}
                    </Tab>
                  );
                })}
              </TabbedItem>
            </GroupItem>
          </Form>
        )}
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Cpn_Campaign_Info;
