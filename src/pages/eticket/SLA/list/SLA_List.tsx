import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { PageHeaderLayout } from "@/packages/layouts/page-header-layout";
import { showErrorAtom } from "@/packages/store";
import { BaseCardView } from "@/packages/ui/card-view/card-view";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HeaderPart } from "../components/header-part";
import { SLA_EditType } from "../components/store";
import { useMst_SLAColumns } from "../components/use-columns";

const SLA_List = () => {
  const { t } = useI18n("SLA");

  const api = useClientgateApi();

  const showError = useSetAtom(showErrorAtom);

  const config = useConfiguration();

  const navigate = useNavigate();

  const { auth } = useAuth();

  const setType = useSetAtom(SLA_EditType);

  const [searchCondition, setSearchCondition] = useState<any>({
    SLALevel: "",
    SLADesc: "",
    SLAStatus: "",
    KeyWord: "",
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
  });

  const { data, isLoading, refetch }: any = useQuery(
    ["Mst_SLA", JSON.stringify(searchCondition)],

    async () => {
      return await api.Mst_SLA_Search({ ...searchCondition });
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  let gridRef: any = useRef();

  const handleAddNew = () => {
    setType("create");
    navigate(`/${auth.networkId}/eticket/SLA-Add`);
  };

  const handleSearch = async (params: any) => {
    setSearchCondition({
      ...searchCondition,
      KeyWord: params,
    });
    await refetch();
  };

  const columns = useMst_SLAColumns();

  const formSettings = {};

  const handleSelectionChanged = (rows: string[]) => {};

  const handleSavingRow = () => {};

  const handleEditorPreparing = () => {};

  const handleEditRowChanges = () => {};

  const handleDeleteRows = async (key: any) => {
    const req = {
      Mst_SLA: {
        SLAID: key[0],
        OrgID: auth.orgData?.Id,
      },
      Lst_Mst_SLATicketType: [],
      Lst_Mst_SLATicketCustomType: [],
      Lst_Mst_SLACustomer: [],
      Lst_Mst_SLACustomerGroup: [],
      Lst_Mst_SLAHoliday: [],
      Lst_Mst_SLAWorkingDay: [],
    };

    const resp: any = await api.Mst_SLA_Delete(req);

    if (resp.isSuccess) {
      toast.success("Xoá thành công!");
      refetch();
    } else {
      showError({
        message: resp?.errorCode,
        debugInfo: resp?.debugInfo,
        errorInfo: resp?.errorInfo,
      });
    }
  };

  const handleOnEditRow = ({ row }: any) => {
    setType("edit");
    navigate(`/${auth.networkId}/eticket/SLA/${row.key}`);
  };

  const customCard = (item: any) => {
    return (
      <div className="p-2 bg-sky-300 mb-2 flex justify-between cursor-pointer">
        <div className="flex flex-col gap-2">
          <div>Mức SLA: {item.SLA_Level}</div>
          <div>Mô tả: {item.description}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div>Trạng thái: {item.status}</div>
          <div>Thời gian cập nhật: {item.upd_time}</div>
        </div>
      </div>
    );
  };

  const customPopup = () => {};

  return (
    <AdminContentLayout className={"Category_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderLayout>
          <PageHeaderLayout.Slot name={"Before"}>
            <div className="font-bold dx-font-m">{t("SLA Manager")}</div>
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"Center"}>
            <HeaderPart
              refetch={refetch}
              onAddNew={handleAddNew}
              onSearch={handleSearch}
            />
          </PageHeaderLayout.Slot>
        </PageHeaderLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <BaseCardView
          isLoading={isLoading}
          dataSource={data?.isSuccess ? data.DataList ?? [] : []}
          columns={columns}
          keyExpr={"SLAID"}
          formSettings={formSettings}
          onReady={(ref) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          onEditorPreparing={handleEditorPreparing}
          onEditRowChanges={handleEditRowChanges}
          onDeleteRows={handleDeleteRows}
          onEditRow={handleOnEditRow}
          storeKey={"card-view"}
          ref={null}
          customCard={customCard}
          defaultOption="table"
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default SLA_List;
