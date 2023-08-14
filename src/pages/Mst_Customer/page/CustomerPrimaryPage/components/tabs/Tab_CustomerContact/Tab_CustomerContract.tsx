import { useClientgateApi } from "@/packages/api";
import { useConfiguration } from "@/packages/hooks";
import { BaseGridView } from "@/packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel } from "devextreme-react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { PopupViewComponent } from "../Tab_CustomerHist/use-popup-view";
import { useMst_CustomerContact_Column } from "./use-columns";
import usePopupCustomerContract from "./use-popup";

const Tab_CustomerContract = () => {
  const { CustomerCodeSys: customerCodeSys }: any = useParams();

  const api = useClientgateApi();

  let gridRef: any = useRef(null);

  const config = useConfiguration();

  const { data, isLoading, refetch }: any = useQuery(
    ["Tab_CustomerContact", customerCodeSys],
    async () => {
      if (customerCodeSys) {
        const resp: any = await api.Mst_CustomerContact_Search({
          CustomerCodeSys: customerCodeSys,
          FlagActive: 1,
          Ft_PageIndex: 0,
          Ft_PageSize: config.MAX_PAGE_ITEMS, // config.MAX_PAGE_ITEMS = 999999
        });

        if (resp?.isSuccess) {
          const col: any = await api.MdMetaColGroupSpec_Search(
            {},
            "SCRTCS.CTM.CONTACT.2023"
          );

          if (col?.isSuccess) {
            const list: any[] = resp?.DataList;

            const result = list?.map((item: any) => {
              const curJson: any[] =
                JSON.parse(item?.mcc_JsonCustomerInfo) ?? [];

              const fields = curJson?.reduce((prev: any, cur: any) => {
                return { ...prev, [cur?.ColCodeSys]: cur?.ColValue };
              }, {});

              const emailListJson =
                JSON.parse(item?.mcc_CustomerEmailJson) ?? [];
              const email =
                emailListJson?.find((item: any) => item?.FlagDefault == "1")
                  ?.CtmEmail ?? "";

              const phoneListJson =
                JSON.parse(item?.mcc_CustomerPhoneJson) ?? [];
              const phoneNo =
                phoneListJson?.find((item: any) => item?.FlagDefault == "1")
                  ?.CtmPhoneNo ?? "";

              return {
                ...item,
                CustomerName: item?.mcc_CustomerName,
                CustomerCode: item?.mcc_CustomerCode,
                CtmEmail: email,
                CtmPhoneNo: phoneNo,
                ...fields,
              };
            });

            return result;
          }

          return [];
        }
      }

      return [];
    }
  );

  const columns: any = useMst_CustomerContact_Column({
    refetch: refetch,
  });

  console.log("columns outside ", columns);

  const popupView = usePopupCustomerContract({
    refetchList: refetch,
    listContact: data ?? [],
  });

  return (
    <div className="w-full relative">
      <BaseGridView
        isLoading={isLoading}
        dataSource={data ?? []}
        columns={columns}
        keyExpr={["CustomerName"]}
        popupSettings={{}}
        formSettings={{}}
        onReady={(ref) => (gridRef = ref)}
        allowSelection={false}
        onSelectionChanged={() => {}}
        onSaveRow={() => {}}
        onEditorPreparing={() => {}}
        onEditRowChanges={() => {}}
        onDeleteRows={() => {}}
        storeKey={"Tab_CustomerContact-columns"}
        editable={false}
        showCheck="none"
      />

      {popupView}

      {/* <LoadPanel visible={isLoading} /> */}

      <PopupViewComponent />
    </div>
  );
};

export default Tab_CustomerContract;
