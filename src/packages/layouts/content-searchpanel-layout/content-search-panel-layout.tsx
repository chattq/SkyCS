import {useSlot, withSlot} from "@packages/hooks/useSlot";
import React, {PropsWithChildren, useMemo} from "react";
import Drawer from "devextreme-react/drawer";
import {useAtomValue} from "jotai";
import {searchPanelVisibleAtom} from "./store";
import {ScrollView} from "devextreme-react";
import {useWindowSize} from "@packages/hooks/useWindowSize";
import "./content-search-panel-layout.scss"

interface ContentSearchPanelLayoutProps {
}

export const InnerContentSearchPanelLayout = ({children}: PropsWithChildren<ContentSearchPanelLayoutProps>) => {
  const searchPanelVisible = useAtomValue(searchPanelVisibleAtom)
  const windowSize = useWindowSize()
  const SearchPanelSlot = useSlot({
    children,
    name: "SearchPanel",
  });
  const ContentPanelSlot = useSlot({
    children,
    name: "ContentPanel",
  });
  // avoid re-render when toggling search panel 
  const contentMemo = useMemo(() => (
    <ContentPanelSlot/>
  ), [])

  // avoid re-render when toggling search panel 
  const searchMemo = useMemo(() => (
    <SearchPanelSlot/>
  ), [])

  return (
    <div className={'h-full content-with-search-layout'}>
      <Drawer
        opened={searchPanelVisible}
        openedStateMode={'shrink'}
        position='left'
        revealMode={'slide'}
        height={'100%'}
        render={() =>
          <ScrollView className={'p-2'} id={'search-pane'}>
            {searchMemo}
          </ScrollView>
        }
      >
          {contentMemo}
      </Drawer>
    </div>
  )
}

export const ContentSearchPanelLayout = withSlot(InnerContentSearchPanelLayout)