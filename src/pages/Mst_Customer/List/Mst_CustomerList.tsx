import { distinguish } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import {
  useConfiguration,
  useNetworkNavigate,
  useVisibilityControl,
} from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { authAtom, showErrorAtom } from "@/packages/store";
import {
  FlagActiveEnum,
  MdMetaColGroupSpec,
  Mst_Customer,
} from "@/packages/types";
import { BaseGridView } from "@/packages/ui/base-gridview";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import {
  flagCustomer,
  selecteItemsAtom,
} from "@/pages/Mst_Customer/components/store";
import { useQuery } from "@tanstack/react-query";
import { DataGrid, LoadPanel } from "devextreme-react";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import HeaderPart from "../components/header-part";
import { useColumn } from "../components/use-columns";
import { useColumnsSearch } from "../components/use-columns-search";

interface DataFilter {
  staticField: MdMetaColGroupSpec[];
  dynamicFields: MdMetaColGroupSpec[];
  listMasterField: string[];
  listSearchRange: MdMetaColGroupSpec[];
  listQuery: MdMetaColGroupSpec[];
}

interface Props {
  bePopUp?: boolean;
  isHideHeader?: Boolean;
}

export const Mst_CustomerList = ({ bePopUp, isHideHeader = false }: Props) => {
  const navigate = useNetworkNavigate();
  const [formValue, setFormValue] = useState({});
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom); // state lưu trữ trạng thái đóng mở của nav search
  const setSelectedItems = useSetAtom(selecteItemsAtom); // state lưu trữ thông tin của items khi mà click radio
  let gridRef: any = useRef<DataGrid | null>(null);
  const auth = useAtomValue(authAtom);
  const { t } = useI18n("Mst_Customer"); // file biên dịch
  const [dataFilter, setDataFilter] = useState<DataFilter>({
    staticField: [],
    dynamicFields: [],
    listMasterField: [],
    listSearchRange: [],
    listQuery: [],
  });
  const [storeData, setStoreData] = useState({});
  const config = useConfiguration();
  const setFlagCustomer = useSetAtom(flagCustomer);
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
  const showError = useSetAtom(showErrorAtom); // state lưu trữ lỗi khi call api
  const loadingControl = useVisibilityControl({ defaultVisible: false });
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
      console.log(
        "dataFilter.dynamicFields ",
        dataFilter.listMasterField.length
      );
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

  const api = useClientgateApi(); // api
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

  useEffect(() => {
    refetch();
    refetchColumn();
    refetchDynamic();
  }, []);

  const handleSearch = async (data: any) => {
    let list: any[] = [];
    const getListFieldKey = Object.keys(data);
    dataFilter.staticField.forEach((item) => {
      const filter = getListFieldKey.filter((itemField) => {
        console.log("itemField", itemField, item.ColCodeSys);

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
        console.log("item ", item, "type", data[item]);
        return {
          ColCodeSys: item,
          ColValue1: distinguish(data[item]),
          ColValue2: data[item + "_To"]
            ? distinguish(data[item + "_To"])
            : null,
        };
      })
      .filter((item) => {
        return dataFilter.staticField.every((itemStatic) => {
          return itemStatic.ColCodeSys !== item.ColCodeSys;
        });
      });

    console.log("value ", value);

    const obj = {
      ...list,
      CustomerCode: data["CUSTOMERCODE"] ?? null,
      CustomerName: data["CUSTOMERNAME"] ?? null,
      JsonColDynamicSearch: JSON.stringify(value),
    };

    // delete obj?.CUSTOMERCODE;
    // delete obj?.CUSTOMERNAME;

    console.log("obj ", obj);

    setFormValue(obj);
  };

  console.log(listColumn);

  // các cột của gridview
  const columns = useColumn({
    data: data?.DataList ?? [],
    dataField: listColumn ?? [],
    dataGroup: listGroup ?? [],
  });

  // console.log(columns);

  // hàm thêm cột ở trong trường hợp popup thì là mở popup
  const handleAddNew = () => {
    setFlagCustomer("add");
    navigate("/customer/add");
  };

  const handleSubmit = () => {
    gridRef.current?._instance?.saveEditData();
  };

  const handleCancel = () => {
    gridRef.current?.instance?.cancelEditData();
  };

  // hàm delete
  const onDelete = async (id: Partial<any>) => {};

  // call api tạo
  const onCreate = async (data: Partial<Mst_Customer>) => {};

  // call api delete multiple
  const handleDeleteRow = async (a: any) => {
    if (a.length > 1) {
    } else {
      const deleteValue = data?.DataList?.filter((item) => {
        return item.CustomerCodeSys === a[0].CustomerCodeSys;
      });
      if (deleteValue?.length) {
        const response = await api.Mst_Customer_Delete(deleteValue[0]);
        if (response.isSuccess) {
          toast.success(t("Delete Success"));
          await refetch();
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
        }
      }
    }
  };

  // call api update
  const onModify = async (
    key: Partial<Mst_Customer>,
    data: Partial<Mst_Customer>
  ) => {};

  // Thực thi action thêm sửa xóa
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

  // setting popup ( title , button )
  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: "Mst_Customer",
    toolbarItems: [
      {
        toolbar: "bottom",
        location: "after",
        widget: "dxButton",
        options: {
          text: t("Save"),
          stylingMode: "contained",
          type: "default",
          onClick: handleSubmit,
        },
      },
      {
        toolbar: "bottom",
        location: "after",
        widget: "dxButton",
        options: {
          text: t("Cancel"),
          type: "default",
          onClick: handleCancel,
        },
      },
    ],
  };

  // setup form

  // popup detail
  const handleEditorPreparing = (e: EditorPreparingEvent) => {};
  // set các row khi check vào state lưu trữ
  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };

  // action đóng mở nav search (show or not show)
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  // hàm sửa row ( mở popup )
  const handleEdit = (rowIndex: number) => {
    gridRef.current?.instance?.editRow(rowIndex);
  };

  const handleEditRowChanges = () => {};

  const getColumn = useColumnsSearch({
    listColumn: listColumn ?? [],
    listMapField: listDynamic ?? {},
  });

  console.log(getColumn);

  const handleCustomerEdit = (e: any) => {
    const { data } = e;
    const { CustomerCodeSys } = data;
    setFlagCustomer("update");
    navigate(`/customer/detail/${CustomerCodeSys}`);
  };

  return (
    <AdminContentLayout className={"Mst_Customer"}>
      {/* Header */}
      <AdminContentLayout.Slot name={"Header"}>
        {/* có tác dụng là tạo dữ liệu vào trong data và thực thi các action nhự import excel , export excel*/}
        <HeaderPart
          onAddNew={handleAddNew}
          searchCondition={searchCondition}
        ></HeaderPart>
      </AdminContentLayout.Slot>
      {/* Content */}
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          {/* Search */}
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <div className={"w-[200px]"}>
              {/* Search Component */}
              <SearchPanelV2
                conditionFields={getColumn}
                storeKey="Mst_Customer_Search"
                data={storeData}
                onSearch={handleSearch}
              />
            </div>
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <LoadPanel
              container={".dx-viewport"}
              shadingColor="rgba(0,0,0,0.4)"
              position={"center"}
              visible={loadingControl.visible}
              showIndicator={true}
              showPane={true}
            />
            {!loadingControl.visible && (
              <>
                {/* GridView */}
                <BaseGridView
                  isLoading={isLoading} // props dùng để render
                  dataSource={data?.isSuccess ? data?.DataList ?? [] : []} // dữ liệu của gridview lấy từ api
                  columns={columns} // các cột ở trong grid view
                  keyExpr={["CustomerCodeSys"]} // khóa chính
                  popupSettings={popupSettings} // popup editor
                  formSettings={{}} // các cột ở trong popup
                  onReady={(ref) => (gridRef = ref)} // gắn ref
                  allowSelection={true} //cho phép chọn row hay không
                  onSelectionChanged={handleSelectionChanged} // dùng để lấy hàng khi tích chọn checkbox
                  onSaveRow={handleSavingRow} // thực hiện các action thêm sửa xóa
                  onEditorPreparing={handleEditorPreparing} // thực hiện hành động trước khi show màn hình thêm sửa xóa
                  // onEditRow={handleOnEditRow}
                  onCustomerEditing={handleCustomerEdit}
                  inlineEditMode="row"
                  onDeleteRows={handleDeleteRow} // hàm này để xóa multiple (  )
                  onEditRowChanges={handleEditRowChanges}
                  toolbarItems={[
                    //  button search và action của nó
                    {
                      location: "before",
                      widget: "dxButton",
                      options: {
                        icon: "search",
                        onClick: handleToggleSearchPanel,
                      },
                    },
                  ]}
                  storeKey={"Mst_Customer_Column"} // key lưu trữ giá trị grid view trong localstorage
                />
                {/* popup detail*/}
              </>
            )}
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
