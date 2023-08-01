import { Popup, ToolbarItem } from "devextreme-react/popup";
import { useSetAtom } from "jotai";
import Button from "devextreme-react/button";
import ScrollView from "devextreme-react/scroll-view";
import { useClientgateApi } from "@packages/api";
import { useI18n } from "@/i18n/useI18n";
import { useQuery } from "@tanstack/react-query";
import { showErrorAtom } from "@packages/store";
import { FlagActiveEnum, MdMetaColGroupSpec } from "@packages/types";
import { useRef, useState } from "react";
import { useConfiguration } from "@packages/hooks";
import { SearchCustomerResult } from "@/pages/admin/Cpn_Campaign/components/search-customer-popup/search-customer-result";
import { DataGrid } from "devextreme-react";
import { distinguish } from "@/components/ulti";
import { useWindowSize } from "@/packages/hooks/useWindowSize";

interface DataFilter {
  staticField: MdMetaColGroupSpec[];
  dynamicFields: MdMetaColGroupSpec[];
  listMasterField: string[];
  listSearchRange: MdMetaColGroupSpec[];
  listQuery: MdMetaColGroupSpec[];
}

interface SearchCustomerPopupProps {
  onCancel: any;
  onSave: (data: any) => void;
}

export const SearchCustomerPopup = ({
  onCancel,
  onSave,
}: SearchCustomerPopupProps) => {
  const config = useConfiguration();
  const { t } = useI18n("EditForm_Campaign");
  const api = useClientgateApi(); // api
  const showError = useSetAtom(showErrorAtom);
  const [formValue, setFormValue] = useState({});
  const windowSize = useWindowSize();
  const [dataFilter, setDataFilter] = useState<DataFilter>({
    staticField: [],
    dynamicFields: [],
    listMasterField: [],
    listSearchRange: [],
    listQuery: [],
  });
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "Mst_Customer",
      JSON.stringify(searchCondition),
      JSON.stringify(formValue),
    ],
    queryFn: async () => {
      const response = await api.Mst_Customer_Search({
        ...searchCondition,
        ...formValue,
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
    queryKey: ["ListColumn_1"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search({});
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
            if (item.ColDataType === "MASTERDATA") {
              objField.listMasterField.push(item);
            }
            if (item.FlagIsQuery === "1") {
              objField.listQuery.push(item);
            }
            if (item.FlagIsColDynamic === "1") {
              objField.dynamicFields.push(item);
            }
            if (item.FlagIsColDynamic === "0") {
              objField.staticField.push(item);
            }
            if (item.FlagIsQuery === "1") {
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
        console.log("resp");
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

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = () => {
    onSave(gridRef.current?.instance.getSelectedRowsData());
  };

  const gridRef = useRef<DataGrid>(null);

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
      // CustomerCode: data["CUSTOMERCODE"] ?? null,
      // CustomerName: data["CUSTOMERNAME"] ?? null,
      JsonColDynamicSearch: JSON.stringify(value),
    };

    // delete obj?.CUSTOMERCODE;
    // delete obj?.CUSTOMERNAME;

    console.log("obj ", obj);

    setFormValue(obj);
  };

  return (
    <Popup
      className="popup-customer"
      position={"center"}
      showCloseButton={true}
      onHiding={handleCancel}
      title={t(`Select Customers`)}
      visible={true}
    >
      {!isLoading &&
        !isLoadingColumn &&
        !isLoadingDynamic &&
        !isLoadingDynamic &&
        !isLoadingListGroup && (
          // <ScrollView
          //   className="popup-customer-content"
          //   width={"100%"}
          //   height={windowSize.height - 310}
          // >
            <SearchCustomerResult
              customizeClass={``}
              ref={gridRef}
              data={data?.DataList!}
              listColumn={listColumn!}
              listGroup={listGroup!}
              listDynamic={listDynamic!}
              onSearch={handleSearch}
            />
          // </ScrollView>
        )}
      <ToolbarItem toolbar={"bottom"} location={"center"}>
        <Button
          text={t("Select")}
          type={"default"}
          stylingMode={"contained"}
          onClick={handleSave}
        />
        <Button
          text={t("Cancel")}
          stylingMode={"contained"}
          onClick={handleCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};
