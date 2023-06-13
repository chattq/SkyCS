import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { ContentSearchPanelLayout } from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, LoadPanel } from "devextreme-react";
import { useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "./store";

const DetailComponent = () => {
  const { t } = useI18n("Mst_Customer_Detail");
  const showError = useSetAtom(showErrorAtom);
  const param = useParams();
  const api = useClientgateApi();
  const [formValue, setFormvalue] = useState({} as any);
  const {
    data: detailCustomer,
    isLoading: isLoadingCustomer,
    refetch,
  } = useQuery({
    queryKey: ["detailCustomer", param],
    queryFn: async () => {
      if (param.CustomerCodeSys) {
        const response = await api.Mst_Customer_Search({
          CustomerCodeSys: param.CustomerCodeSys,
        });
        if (response.isSuccess) {
          return response.DataList;
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
          return [];
        }
      } else {
        return [];
      }
    },
  });

  const { data: listStaticField, refetch: refetchStaticField } = useQuery({
    queryKey: ["ListStaticField"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search({});
      if (response.isSuccess) {
        console.log("respone ", response);
        const data = response?.DataList ?? [];
        console.log("data ", data);
        return (
          data.filter((item: any) => {
            return item.FlagIsColDynamic !== "1";
          }) ?? []
        );
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
        return [];
      }
    },
  });

  useEffect(() => {
    refetchStaticField();
    refetch();
  }, []);

  console.log("detailCustomer ", detailCustomer);
  console.log("listStaticField ", listStaticField);

  return (
    <AdminContentLayout className={"Mst_Customer"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header d-flex justify-space-between">
          <div className="breakcrumb">
            <p>{t("Mst_Customer")}</p>
            <p>{`>`}</p>
            <p>{t("Mst_Customer Detail")}</p>
          </div>
          <div className="list-button">
            <Button>{t("Edit")}</Button>
            <Button>{t("Delete")}</Button>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <Tabs />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default DetailComponent;
