import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
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
import { showErrorAtom } from "@/packages/store";
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
import { getFullTime } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { DataGrid, LoadPanel } from "devextreme-react";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "../components/custom.scss";
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

interface searchForm {
  CtmEmail: string;
  CtmPhoneNo: string;
  CustomerCode: string;
  CustomerCodeSysERP: string;
  CustomerGrpCode: any;
  CustomerName: string;
  CustomerType: string;
  MST: string;
  PartnerType: any;
  JsonColDynamicSearch: any;
  FlagActive: any;
  Ft_PageIndex: number;
  Ft_PageSize: number;
  KeyWord: string;
  ScrTplCodeSys: string;
}

export const Mst_CustomerList = ({ bePopUp, isHideHeader = false }: Props) => {
  const navigate = useNetworkNavigate();
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom); // state lưu trữ trạng thái đóng mở của nav search
  const setSelectedItems = useSetAtom(selecteItemsAtom); // state lưu trữ thông tin của items khi mà click radio
  let gridRef: any = useRef<DataGrid | null>(null);
  const { auth } = useAuth();

  const { t } = useI18n("Mst_Customer"); // file biên dịch

  const config = useConfiguration();

  const [dataFilter, setDataFilter] = useState<DataFilter>({
    staticField: [],
    dynamicFields: [],
    listMasterField: [],
    listSearchRange: [],
    listQuery: [],
  });

  const [searchCondition, setSearchCondition] = useState<searchForm>({
    CtmEmail: "",
    CtmPhoneNo: "",
    CustomerCode: "",
    CustomerCodeSysERP: "",
    CustomerGrpCode: [],
    CustomerName: "",
    CustomerType: "",
    MST: "",
    PartnerType: [],
    JsonColDynamicSearch: "[]",
    FlagActive: FlagActiveEnum.All, // FlagActiveEnum.All = ""
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS, // config.MAX_PAGE_ITEMS = 999999
    KeyWord: "",
    ScrTplCodeSys: "SCRTPLCODESYS.2023",
  });

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

  const [search, setSearch] = useState<any>({
    CtmEmail: "",
    CtmPhoneNo: "",
    CustomerCode: "",
    CustomerCodeSysERP: "",
    CustomerGrpCode: [],
    CustomerName: "",
    CustomerType: "",
    MST: "",
    PartnerType: [],
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
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Mst_Customer", JSON.stringify(search)],
    queryFn: async () => {
      const response = await api.Mst_Customer_Search({
        ...search,
      });

      if (response.isSuccess) {
        const customizeResponse = {
          ...response,
          DataList: response?.DataList?.map((item) => {
            const listJson: any[] = item.JsonCustomerInfo
              ? JSON.parse(item.JsonCustomerInfo) ?? []
              : [];
            const customize = listJson.reduce((acc, item) => {
              return {
                ...acc,
                [`${item.ColCodeSys}`]: item.ColValue ?? "",
              };
            }, {});

            return {
              ...item,
              ...customize,
            };
          }),
        };

        return customizeResponse;
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
      }
    },
  });

  useEffect(() => {
    refetch();
    refetchColumn();
    refetchDynamic();
  }, []);

  const handleSearch = async (data: any) => {
    const staticValue = Object.entries(data)
      ?.map(([key, value]) => {
        if (
          listColumn?.find(
            (c: any) => c?.ColCodeSys === key && c?.FlagIsColDynamic != "1"
          )
        ) {
          return {
            key: key,
            value: value,
          };
        }
      })
      ?.filter((item: any) => item);

    const dynamicValue = Object.entries(data)
      ?.map(([key, value]) => {
        if (!staticValue?.some((c: any) => c?.key == key)) {
          return {
            key: key,
            value: value,
          };
        }
      })
      ?.filter(
        (item: any) =>
          item &&
          item?.key != "JsonColDynamicSearch" &&
          item?.key != "FlagActive" &&
          item?.key != "Ft_PageIndex" &&
          item?.key != "Ft_PageSize" &&
          item?.key != "KeyWord" &&
          item?.key != "ScrTplCodeSys"
      );

    const result = dynamicValue
      ?.map((item: any) => {
        if (item?.key == "COLD66187") {
          return {
            ColCodeSys: item?.key,
            ColValue1: getFullTime(item?.value),
            ColValue2: getFullTime(
              new Date(
                dynamicValue?.find((item: any) => item?.key == "COLD66187_To")
                  ?.value as string
              )
            ),
          };
        }
        return {
          ColCodeSys: item?.key,
          ColValue1: item?.value,
        };
      })
      ?.filter((item: any) => item?.ColCodeSys != "COLD66187_To");

    setSearch({
      CtmEmail: data?.CtmEmail,
      CtmPhoneNo: data?.CtmPhoneNo,
      CustomerCode: data?.CustomerCode,
      CustomerCodeSysERP: data?.CustomerCodeSysERP,
      CustomerName: data?.CustomerName,
      CustomerType: data?.CustomerType,
      MST: data?.MST,
      Ft_PageIndex: searchCondition?.Ft_PageIndex,
      Ft_PageSize: searchCondition?.Ft_PageSize,
      CustomerGrpCode: data?.CustomerGrpCode?.join(","),
      PartnerType: data?.PartnerType?.join(","),
      JsonColDynamicSearch: JSON.stringify(result),
    });

    refetch();
  };

  // các cột của gridview
  const columns = useColumn({
    data: data?.DataList ?? [],
    dataField: listColumn ?? [],
    dataGroup: listGroup ?? [],
  });

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
    const response = await api.Mst_Customer_Delete({
      OrgID: auth?.orgData?.Id,
      CustomerCodeSys: a[0]?.CustomerCodeSys,
      NetworkID: auth?.networkId,
    });
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
    // if (a.length > 1) {
    // } else {
    //   const deleteValue = data?.DataList?.filter((item) => {
    //     return item.CustomerCodeSys === a[0].CustomerCodeSys;
    //   });
    //   if (deleteValue?.length) {
    //     const response = await api.Mst_Customer_Delete(deleteValue[0]);
    //     if (response.isSuccess) {
    //       toast.success(t("Delete Success"));
    //       await refetch();
    //     } else {
    //       showError({
    //         message: t(response.errorCode),
    //         debugInfo: response.debugInfo,
    //         errorInfo: response.errorInfo,
    //       });
    //     }
    //   }
    // }
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

  const handleCustomerEdit = (e: any) => {
    const { data } = e;
    const { CustomerCodeSys } = data;
    setFlagCustomer("update");
    navigate(`/customer/edit/${CustomerCodeSys}`);
  };

  return (
    <div className="w-full h-full pb-[10px]">
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
                  data={searchCondition}
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
              {!isLoading && (
                <>
                  {/* GridView */}
                  <BaseGridView
                    isLoading={isLoading} // props dùng để render
                    dataSource={data?.isSuccess ? data?.DataList ?? [] : []} // dữ liệu của gridview lấy từ api
                    columns={columns} // các cột ở trong grid view
                    keyExpr={["CustomerCodeSys"]} // khóa chính
                    popupSettings={popupSettings} // popup editor
                    onReady={(ref) => (gridRef = ref)} // gắn ref
                    allowSelection={false} //cho phép chọn row hay không
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
    </div>
  );
};
