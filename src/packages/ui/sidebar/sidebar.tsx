import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import TreeView from 'devextreme-react/tree-view';
import { useScreenSize } from '@/utils/media-query';
import 'src/packages/ui/sidebar/sidebar.scss';

import * as events from 'devextreme/events';
import dxTreeView, { ItemClickEvent } from 'devextreme/ui/tree_view';
import { useLocation } from "react-router-dom";
import { useI18n } from '@/i18n/useI18n';
import ScrollView from "devextreme-react/scroll-view";
import {useAuth} from "@packages/contexts/auth";

export interface SidebarProps {
  selectedItemChanged: (e: ItemClickEvent) => void;
  openMenu: (e: React.PointerEvent) => void;
  compactMode: boolean;
  onMenuReady: (e: events.EventInfo<dxTreeView>) => void;
  items: any[];
}
export function Sidebar(props: React.PropsWithChildren<SidebarProps>) {
  const {
    children,
    selectedItemChanged,
    openMenu,
    compactMode,
    onMenuReady,
    items
  } = props;

  const {auth: {networkId} } = useAuth();
  const { t } = useI18n("Common");
  const { pathname: currentPath } = useLocation();

  const { isLarge } = useScreenSize();
  function normalizePath() {
    return items.filter(item => !item.isHidden).map((item) => (
      { ...item, text: t(item.text), expanded: isLarge, path: item.path && !(/^\//.test(item.path)) ? `/${item.path}` : item.path }
    ));
  }
  const treeItems = useMemo(
    normalizePath,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );

  const treeViewRef = useRef<TreeView>(null);
  const wrapperRef = useRef<HTMLDivElement>();
  const getWrapperRef = useCallback((element: HTMLDivElement) => {
    const prevElement = wrapperRef.current;
    if (prevElement) {
      events.off(prevElement, 'dxclick');
    }

    wrapperRef.current = element;
    events.on(element, 'dxclick', (e: React.PointerEvent) => {
      openMenu(e);
    });
  }, [openMenu]);

  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (!treeView) {
      return;
    }
    if (currentPath !== undefined) {
      const cleanedPath = currentPath.replace(`/${networkId}`, '');
      treeView.selectItem(cleanedPath);
      treeView.expandItem(cleanedPath);
    }

    if (compactMode) {
      treeView.collapseAll();
    }
  }, [currentPath, compactMode, items]);
  return (
    <div
      className={'dx-swatch-additional side-navigation-menu'}
      ref={getWrapperRef}
    >
      {children}
      <div className={'menu-container pl-2'}>
        <ScrollView className={'pb-4'} showScrollbar={'always'}>
          <TreeView
            className={'pb-4 mb-6 menu-list'}
            visible={!compactMode}
            ref={treeViewRef}
            items={treeItems}
            keyExpr={'path'}
            selectionMode={'single'}
            focusStateEnabled={false}
            expandEvent={'click'}
            onItemClick={selectedItemChanged}
            onContentReady={onMenuReady}
          />
        </ScrollView>
      </div>
    </div>
  );
}
