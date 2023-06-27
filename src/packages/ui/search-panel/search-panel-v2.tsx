import { useI18n } from "@/i18n/useI18n";
import { useSetAtom } from "jotai";
import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import Form, {
  ButtonItem,
  ButtonOptions,
  GroupItem,
  IItemProps,
  SimpleItem,
} from "devextreme-react/form";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Header } from "./header";
import { useVisibilityControl } from "@packages/hooks";
import { SearchPanelSettings } from "@packages/ui/search-panel/search-panel-settings";
import { useSavedState } from "@packages/ui/base-gridview/components/use-saved-state";
import CustomColumnChooser from "@packages/ui/column-toggler/custom-column-chooser";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { LoadPanel } from "devextreme-react";
import { useWindowSize } from "@packages/hooks/useWindowSize";

import "./search-panel-v2.scss";
import { useAtomValue } from "jotai";

interface ItemProps extends IItemProps {
  order?: number;
}

interface SearchPanelProps {
  conditionFields: ItemProps[];
  data?: any;
  onSearch?: (data: any) => void;
  storeKey: string;
  enableColumnToggler?: boolean;
}

export const SearchPanelV2 = ({
  conditionFields = [],
  data,
  onSearch,
  storeKey,
  enableColumnToggler = true,
}: SearchPanelProps) => {
  const { t } = useI18n("Common");
  const { loadState, saveState } = useSavedState<ColumnOptions[]>({
    storeKey: `search-panel-settings-${storeKey}`,
  });
  const searchPanelVisible = useAtomValue(searchPanelVisibleAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [realColumns, setRealColumns] = useReducer(
    (state: any, changes: any) => {
      // save changes into localStorage
      saveState(changes);
      return changes;
    },
    conditionFields
  );

  useEffect(() => {
    setIsLoading(true);
    const savedState = loadState();
    if (savedState) {
      // savedState is an array of ColumnOptions objects
      // we need merge this array with `columns` array.
      // which column exists in savedState will be set to be visible
      // otherwise will be hide
      const outputColumns = conditionFields.map((column: ColumnOptions) => {
        const filterResult = savedState.filter(
          (c: ColumnOptions) => c.dataField === column.dataField && c.visible
        );
        column.visible = filterResult.length > 0;
        return column;
      });
      setRealColumns(outputColumns);
    }
    setIsLoading(false);
  }, []);

  const setSearchPanelVisible = useSetAtom(searchPanelVisibleAtom);
  const onToggleSettings = () => {
    settingPopupVisible.toggle();
  };
  const onClose = () => {
    setSearchPanelVisible(false);
  };
  const formRef = useRef<Form | null>(null);
  const settingPopupVisible = useVisibilityControl({ defaultVisible: false });
  const handleSearch = (e: any) => {
    const data = formRef.current?.instance?.option("formData");
    onSearch?.(data);
    e.preventDefault();
  };
  const items = useMemo(() => {
    return [...realColumns];
  }, [realColumns]);

  const handleApplySettings = useCallback((items: ItemProps[]) => {
    setRealColumns(items);
    settingPopupVisible.close();
  }, []);

  const handleCloseSearchSettings = useCallback(() => {
    settingPopupVisible.close();
  }, []);
  const windowSize = useWindowSize();
  const htmlFormRef = useRef(null);
  return (
    <div
      className={`${
        searchPanelVisible ? "search-panel-visible" : "search-panel-hidden"
      }`}
      id={"search-panel"}
    >
      <Header
        enableColumnToggler={enableColumnToggler}
        onCollapse={onClose}
        onToggleSettings={onToggleSettings}
      />
      <div>
        <LoadPanel visible={isLoading} />
        {!isLoading && (
          <form ref={htmlFormRef} className={"h-full"} onSubmit={handleSearch}>
            <Form
              ref={(r) => (formRef.current = r)}
              formData={data}
              labelLocation={"top"}
              colCount={1}
              height={windowSize.height - 200}
              className={"p-2 h-full"}
              scrollingEnabled
            >
              {items.map((item, idx) => {
                return <SimpleItem key={idx} {...item} />;
              })}

              <ButtonItem
                horizontalAlignment={"center"}
                cssClass={"btn-search"}
              >
                <ButtonOptions
                  text={"Search"}
                  icon={"search"}
                  stylingMode={"contained"}
                  width={"90%"}
                  type={"default"}
                  useSubmitBehavior={true}
                />
              </ButtonItem>
            </Form>
          </form>
        )}
      </div>
      {enableColumnToggler && (
        <CustomColumnChooser
          title={t("SearchPanelSettings")}
          applyText={t("Apply")}
          cancelText={t("Cancel")}
          selectAllText={t("SelectAll")}
          container={"body"}
          button={"#toggle-search-settings"}
          onHiding={handleCloseSearchSettings}
          onApply={handleApplySettings}
          visible={settingPopupVisible.visible}
          columns={conditionFields}
          actualColumns={realColumns}
          position={"left"}
          storeKey={storeKey}
        />
      )}
    </div>
  );
};
