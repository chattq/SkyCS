import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { Form } from "devextreme-react";
import {
  GroupItem,
  Tab,
  TabPanelOptions,
  TabbedItem,
} from "devextreme-react/form";
import React, { ReactNode, useRef, useState } from "react";
import Zalo_channel from "../components/Zalo_channel";
import Email_Channel from "../components/Email_Channel";
import SMS_Channel from "../components/SMS_Channel";
import Call_Channel from "../components/Call_Channel";
import { useAuth } from "@/packages/contexts/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { HeaderPart } from "../components/header-part";
import { toast } from "react-toastify";
import { useSetAtom } from "jotai";
import { showErrorAtom } from "@/packages/store";
interface tabInterface {
  title: string;
  component: ReactNode;
}
export default function OmiChanelPage() {
  const { t } = useI18n("OmiChanel");
  const formRef = useRef<any>();
  const {
    auth: { orgData },
  } = useAuth();
  const api = useClientgateApi();
  const { data: dataChanel, refetch } = useQuery(["dataChanel"], () =>
    api.Mst_Channel_GetByOrgID(orgData?.Id)
  );
  const zaloRef = useRef<any>(undefined);
  const EmailRef = useRef<any>(undefined);
  const showError = useSetAtom(showErrorAtom);
  console.log(39, dataChanel?.Data.Lst_Mst_ChannelZalo[0]);
  const tab = [
    {
      title: t("Email"),
      component: (
        <Email_Channel
          data={dataChanel?.Data.Lst_Mst_ChannelEmail[0]}
          setFlagEmail={EmailRef}
        />
      ),
    },
    {
      title: t("Zalo"),
      component: (
        <Zalo_channel
          data={dataChanel?.Data.Lst_Mst_ChannelZalo[0]}
          setFlagZalo={zaloRef}
        />
      ),
    },
    {
      title: t("SMS"),
      component: <SMS_Channel />,
    },
    {
      title: t("Call"),
      component: <Call_Channel />,
    },
  ];

  const handleSave = async () => {
    const dataZalo = [
      {
        AppID: "1266699208786638596",
        ZaloOAID: "1358767a413636684272",
        RefreshToken: "RefreshToken",
        AccessToken: "AccessToken",
        FlagIsCreateET:
          zaloRef.current !== undefined
            ? zaloRef.current === true
              ? "1"
              : "0"
            : dataChanel?.Data.Lst_Mst_ChannelZalo[0]?.FlagIsCreateET,
      },
    ];

    const dataEmail = EmailRef.current.instance.option("formData");
    const dataSaveEmail = {
      ...dataEmail,
      FlagIsCreateET:
        dataEmail.FlagIsCreateET !==
        dataChanel?.Data.Lst_Mst_ChannelEmail[0]?.FlagIsCreateET
          ? dataEmail.FlagIsCreateET === false
            ? "0"
            : "1"
          : dataChanel?.Data.Lst_Mst_ChannelEmail[0]?.FlagIsCreateET,
    };

    const resp = await api.Mst_Channel_Save(dataZalo, [
      {
        ...dataSaveEmail,
        FlagIsCreateET: dataSaveEmail.FlagIsCreateET === false ? "0" : "1",
      },
    ]);
    if (resp.isSuccess) {
      toast.success(t("Save Successfully"));
      // await refetch();
      return true;
    }
    showError({
      message: t(resp.errorCode),
      debugInfo: resp.debugInfo,
      errorInfo: resp.errorInfo,
    });
    throw new Error(resp.errorCode);
  };
  return (
    <AdminContentLayout className={"SearchMST"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart onSave={handleSave} />
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <Form validationGroup="campaignForm" ref={formRef}>
          <GroupItem>
            <TabbedItem>
              <TabPanelOptions deferRendering={false} />
              {tab.map((item: tabInterface) => {
                return (
                  <Tab key={item.title} title={item.title}>
                    {item.component}
                  </Tab>
                );
              })}
            </TabbedItem>
          </GroupItem>
        </Form>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
}
