import { useClientgateApi } from "@/packages/api";
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

  const { data, isLoading, refetch }: any = useQuery(
    ["CustomerContact", customerCodeSys],
    async () => {
      if (customerCodeSys) {
        const resp: any = await api.Mst_CustomerContact_Search({
          CustomerCodeSys: customerCodeSys,
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
                JSON.parse(item?.mc_JsonCustomerInfo) ?? [];

              const fields = curJson?.reduce((prev: any, cur: any) => {
                return { ...prev, [cur?.ColCodeSys]: cur?.ColValue };
              }, {});

              return {
                ...item,
                CustomerName: item?.mc_CustomerName,
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
        keyExpr={"LUDTimeUTC"}
        popupSettings={{}}
        formSettings={{}}
        onReady={(ref) => (gridRef = ref)}
        allowSelection={false}
        onSelectionChanged={() => {}}
        onSaveRow={() => {}}
        onEditorPreparing={() => {}}
        onEditRowChanges={() => {}}
        onDeleteRows={() => {}}
        storeKey={"Mst_CustomerHist-columns"}
        editable={false}
        showCheck="none"
      />

      {popupView}

      <LoadPanel visible={isLoading} />

      <PopupViewComponent />
    </div>
  );
};

export default Tab_CustomerContract;
