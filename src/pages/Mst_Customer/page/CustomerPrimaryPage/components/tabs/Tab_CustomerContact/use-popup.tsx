import { distinguish } from "@/components/ulti";
import { useClientgateApi } from "@/packages/api";
import { useConfiguration } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { FlagActiveEnum, MdMetaColGroupSpec } from "@/packages/types";
import { BaseGridView } from "@/packages/ui/base-gridview";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { selecteItemsAtom } from "@/pages/Mst_Customer/components/store";
import { useColumn } from "@/pages/Mst_Customer/components/use-columns";
import { useColumnsSearch } from "@/pages/Mst_Customer/components/use-columns-search";
import { useQuery } from "@tanstack/react-query";
import { Button, DataGrid, Popup, ScrollView } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const usePopupCustomerContract = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleAdd = () => {
    handleOpen();
  };

  return (
    <>
      <button
        className="bg-green-400 p-2 text-center m-2 hover:bg-lime-500"
        onClick={handleAdd}
      >
        Thêm liên hệ
      </button>

      <Popup
        visible={open}
        onHidden={handleClose}
        title="Tìm kiếm khách hàng"
        showCloseButton
      >
        <ScrollView showScrollbar="always">
          {contentRender({ handleClose: handleClose })}
        </ScrollView>
      </Popup>
    </>
  );
};

export default usePopupCustomerContract;

export const contentRender = ({ handleClose }: any) => {
  const showError = useSetAtom(showErrorAtom);

  const { CustomerCodeSys }: any = useParams();

  const api = useClientgateApi();

  let gridRef: any = useRef<DataGrid | null>(null);

  const [dataFilter, setDataFilter] = useState<any>({
    staticField: [],
    dynamicFields: [],
    listMasterField: [],
    listSearchRange: [],
    listQuery: [],
  });

  const config = useConfiguration();
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);

  const [formValue, setFormValue] = useState({});
  const [storeData, setStoreData] = useState({});
  const [searchCondition, setSearchCondition] = useState<Partial<any>>({
    // state deafult của search
    SOApprDateFrom: "",
    SOApprDateToInit: "",
    SOApprDateTo: "",
    DealerCode: "",
    JsonColDynamicSearch: "[]",
    FlagActive: FlagActiveEnum.All, // FlagActiveEnum.All = ""
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS, // config.MAX_PAGE_ITEMS = 999999
    KeyWord: "",
    ScrTplCodeSys: "SCRTPLCODESYS.2023",
  });

  const { data: listGroup, isLoading: isLoadingListGroup } = useQuery({
    queryKey: ["List_Group_Key"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupApi_Search({});
      if (response.isSuccess) {
        return response.DataList;
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
      }
    },
  });

  const {
    data: listColumn,
    isLoading: isLoadingColumn,
    refetch: refetchColumn,
  } = useQuery({
    queryKey: ["ListColumn"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search(
        {},
        "SCRTPLCODESYS.2023"
      );
      if (response.isSuccess) {
        if (response?.DataList) {
          let objField: any = {
            staticField: [],
            dynamicFields: [],
            listMasterField: [],
            listSearchRange: [],
            listQuery: [],
          };
          response?.DataList.forEach((item) => {
            if (item?.ColDataType === "MASTERDATA") {
              objField.listMasterField.push(item);
            }
            if (item?.FlagIsQuery === "1") {
              objField.listQuery.push(item);
            }
            if (item?.FlagIsColDynamic === "1") {
              objField.dynamicFields.push(item);
            }
            if (item?.FlagIsColDynamic === "0") {
              objField.staticField.push(item);
            }
            if (item?.FlagIsQuery === "1") {
              objField.listSearchRange.push(item);
            }
          });

          objField = {
            ...objField,
            listMasterField: objField.listMasterField.map(
              (item: MdMetaColGroupSpec) => item?.ColCodeSys
            ),
          };

          setDataFilter(objField);
        }

        return response?.DataList;
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
      }
    },
  });

  const {
    data: listDynamic,
    isLoading: isLoadingDynamic,
    refetch: refetchDynamic,
  } = useQuery({
    queryKey: ["ListDynamic", dataFilter],
    queryFn: async () => {
      if (dataFilter.listMasterField.length) {
        const response = await api.MDMetaColGroupSpec_GetListOption(
          dataFilter.listMasterField ?? [""]
        );
        if (response.isSuccess) {
          return response.DataList?.reduce((result, item) => {
            result[item.ColCodeSys] = item.Lst_MD_OptionValue;
            return result;
          }, {} as { [key: string]: any[] });
        } else {
          showError({
            message: response?.errorCode,
            debugInfo: response?.debugInfo,
            errorInfo: response?.errorInfo,
          });
        }
      } else {
        return {};
      }
    },
  });

  const getColumn = useColumnsSearch({
    listColumn: listColumn ?? [],
    listMapField: listDynamic ?? {},
  });

  const { data, isLoading, refetch } = useQuery(
    // call api search
    [
      "Mst_Customer",
      JSON.stringify(searchCondition),
      JSON.stringify(formValue),
    ],
    () => {
      return api.Mst_Customer_Search({
        ...searchCondition,
        ...formValue,
      });
    }
  );

  const columns = useColumn({
    data: data?.DataList ?? [],
    dataField: listColumn ?? [],
    dataGroup: listGroup ?? [],
  });

  useEffect(() => {
    refetch();
    refetchColumn();
    refetchDynamic();
  }, []);

  const handleSearch = async (data: any) => {
    let list: any[] = [];
    const getListFieldKey = Object.keys(data);
    dataFilter.staticField.forEach((item: any) => {
      const filter = getListFieldKey.filter((itemField) => {
        return itemField.includes(item.ColCodeSys);
      });
      list = [...list, ...filter];
    });

    const listFilterValueDynamic = getListFieldKey.filter((item) => {
      return !item.includes("_To");
    });

    // console.log("listDynamic ", listDynamic);
    list = list.reduce((acc, item) => {
      return {
        ...acc,
        [`${item}`]: data[`${item}`],
      };
    }, {});

    const value = listFilterValueDynamic
      .map((item) => {
        return {
          ColCodeSys: item,
          ColValue1: distinguish(data[item]),
          ColValue2: data[item + "_To"]
            ? distinguish(data[item + "_To"])
            : null,
        };
      })
      .filter((item) => {
        return dataFilter.staticField.every((itemStatic: any) => {
          return itemStatic.ColCodeSys !== item.ColCodeSys;
        });
      });

    const obj = {
      ...list,
      CustomerCode: data["CUSTOMERCODE"] ?? null,
      CustomerName: data["CUSTOMERNAME"] ?? null,
      JsonColDynamicSearch: JSON.stringify(value),
    };

    // delete obj?.CUSTOMERCODE;
    // delete obj?.CUSTOMERNAME;

    setFormValue(obj);
  };

  const setSelectedItems = useSetAtom(selecteItemsAtom);

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };

  const onDelete = async (id: Partial<any>) => {};

  const onCreate = async (data: any) => {};

  const onModify = async (key: any, data: any) => {};

  const handleSavingRow = (e: any) => {
    if (e.changes && e.changes.length > 0) {
      const { type } = e.changes[0];
      if (type === "remove") {
        const id = e.changes[0].key;
        e.promise = onDelete(id);
      } else if (type === "insert") {
        const data = e.changes[0].data!;
        e.promise = onCreate(data);
      } else if (type === "update") {
        e.promise = onModify(e.changes[0].key, e.changes[0].data!);
      }
    }
    e.cancel = true;
  };

  const handleEditorPreparing = () => {};

  const handleCustomerEdit = (e: any) => {};

  const handleDeleteRow = () => {};

  const handleEditRowChanges = () => {};

  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleAdd = async () => {
    const listCheck: any[] = gridRef?.instance?.getSelectedRowsData() ?? [];

    if (listCheck && listCheck.length > 0) {
      const req = listCheck?.map((item: any) => {
        return {
          OrgID: item?.OrgID,
          NetworkID: item?.NetworkID,
          CustomerCodeSys: item?.CustomerCodeSys,
          CustomerCodeSysContact: CustomerCodeSys,
        };
      });

      const resp: any = await api.Mst_CustomerContact_Create(req);

      if (resp.isSuccess) {
        toast.success("Thêm liên hệ thành công!");
        handleClose();
      } else {
        showError({
          message: resp?.errorCode,
          debugInfo: resp?.debugInfo,
          errorInfo: resp?.errorInfo,
        });
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-end">
        <Button
          style={{ background: "green", padding: 10, color: "white" }}
          onClick={handleAdd}
        >
          Thêm
        </Button>
      </div>
      <div className="w-full">
        <AdminContentLayout className={"Mst_Customer"}>
          <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
          <AdminContentLayout.Slot name={"Content"}>
            <ContentSearchPanelLayout>
              <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
                <div className={"w-[200px]"}>
                  <SearchPanelV2
                    conditionFields={getColumn}
                    storeKey="Mst_Customer_Search"
                    data={storeData}
                    onSearch={handleSearch}
                  />
                </div>
              </ContentSearchPanelLayout.Slot>
              <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
                <BaseGridView
                  isLoading={isLoading}
                  dataSource={data?.isSuccess ? data?.DataList ?? [] : []}
                  columns={columns}
                  keyExpr={["CustomerCodeSys"]}
                  popupSettings={{}}
                  formSettings={{}}
                  onReady={(ref) => (gridRef = ref)}
                  allowSelection={true}
                  onSelectionChanged={handleSelectionChanged}
                  onSaveRow={handleSavingRow}
                  onEditorPreparing={handleEditorPreparing}
                  onCustomerEditing={handleCustomerEdit}
                  inlineEditMode="row"
                  onDeleteRows={handleDeleteRow}
                  onEditRowChanges={handleEditRowChanges}
                  toolbarItems={[
                    {
                      location: "before",
                      widget: "dxButton",
                      options: {
                        icon: "search",
                        onClick: handleToggleSearchPanel,
                      },
                    },
                  ]}
                  storeKey={"Mst_Customer_Column"}
                  showCheck="always"
                />
              </ContentSearchPanelLayout.Slot>
            </ContentSearchPanelLayout>
          </AdminContentLayout.Slot>
        </AdminContentLayout>
      </div>
    </div>
  );
};
