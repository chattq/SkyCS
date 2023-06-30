import { useClientgateApi } from "@/packages/api";
import { BaseGridView } from "@/packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useMst_CustomerHist_Column } from "./use-columns";
import { PopupViewComponent } from "./use-popup-view";

const Tab_CustomerHist = () => {
  const customerCodeSys = "CTMCS.D6G.10104";

  const api = useClientgateApi();

  let gridRef: any = useRef(null);

  const { data, isLoading } = useQuery(["CustomerHist", customerCodeSys], () =>
    api.Mst_CustomerHist_Search({
      CustomerCodeSys: customerCodeSys,
    })
  );

  const result = data?.DataList?.map((item: any) => {
    return JSON.parse(item?.JsonCustomerInfoHist || "[]");
  });

  console.log(result);

  const columns = useMst_CustomerHist_Column({ data: data?.DataList || [] });

  return (
    <div className="w-full">
      <BaseGridView
        isLoading={isLoading}
        dataSource={data?.isSuccess ? data.DataList ?? [] : []}
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
        hidePagination
      />
      <PopupViewComponent />
    </div>
  );
};

export default Tab_CustomerHist;
