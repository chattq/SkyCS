import { SearchDataGrid } from "@/pages/admin/Cpn_Campaign/components/search-grid/search-grid";
import { forwardRef, useState } from "react";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { useSetAtom } from "jotai";
import { SearchPanelV2 } from "@packages/ui/search-panel";
import { useColumnsSearch } from "@/pages/admin/Cpn_Campaign/components/Components/PopUp/Mst_Customer_Clone/components/use-columns-search";
import { useColumn } from "../Components/PopUp/Mst_Customer_Clone/components/use-columns";

interface SearchCustomerResultProps {
  listColumn: any[];
  listGroup: any[];
  listDynamic: { [key: string]: any[] };
  data: any[];
  onSelectionChanged?: (e: any) => void;
  onSearch?: (data: any) => void;
}

export const SearchCustomerResult = forwardRef(
  (
    {
      listColumn,
      listGroup,
      listDynamic,
      data,
      onSelectionChanged,
      onSearch,
    }: SearchCustomerResultProps,
    ref: any
  ) => {
    const columns = useColumn({
      dataField: listColumn ?? [],
      dataGroup: listGroup ?? [],
    });

    const handleSelectionChanged = (e: any) => {
      onSelectionChanged?.(e);
    };

    const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom); // state lưu trữ trạng thái đóng mở của nav search

    const handleToggleSearchPanel = () => {
      setSearchPanelVisibility((visible: boolean) => !visible);
    };

    const searchColumns = useColumnsSearch({
      listColumn: listColumn ?? [],
      listMapField: listDynamic,
    });
    const [storeData, setStoreData] = useState({});
    const handleSearch = async (data: any) => {
      setStoreData(data);
      onSearch?.(data);
    };

    return (
      <ContentSearchPanelLayout>
        <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
          <div className={"w-[200px]"}>
            <SearchPanelV2
              conditionFields={searchColumns}
              storeKey="Mst_Customer_Search_2"
              onSearch={handleSearch}
            />
          </div>
        </ContentSearchPanelLayout.Slot>
        <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
          <SearchDataGrid
            keyExpr={["CustomerCodeSys"]}
            columns={columns ?? []}
            dataSource={data}
            onSelectionChanged={() => {}}
            ref={ref}
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
          ></SearchDataGrid>
        </ContentSearchPanelLayout.Slot>
      </ContentSearchPanelLayout>
    );
  }
);
