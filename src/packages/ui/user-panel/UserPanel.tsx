import React, { useMemo} from 'react';
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import type { UserPanelProps } from '@/types';
import {useAuthService} from "@packages/services/auth-services";
import {useAuth} from "@packages/contexts/auth";
import {useNetworkNavigate} from "@packages/hooks";

import './UserPanel.scss';
export function UserPanel({ menuMode }: UserPanelProps) {
  const {auth: {currentUser}} = useAuth()
  const navigate = useNetworkNavigate();
  const { signOut } = useAuthService();

  function navigateToProfile() {
    navigate("/user/profile");
  }
  const menuItems = useMemo(() => ([
    {
      text: 'Profile',
      icon: 'user',
      onClick: navigateToProfile
    },
    {
      text: 'Logout',
      icon: 'runner',
      onClick: signOut
    }
  ]), [signOut]);
  return (
    <div className={'user-panel'}>
      <div className={'user-info'}>
        <div className={'image-container'}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              backgroundImage: `url(${currentUser?.Avatar})`,
              backgroundSize: 'cover'
            }}
            className={'user-image'} />
        </div>
      </div>

      {menuMode === 'context' && (
        <ContextMenu
          items={menuItems}
          target={'.user-button'}
          showEvent={'dxclick'}
          cssClass={'user-menu'}
        >
          <Position my={'top center'} at={'bottom center'} />
        </ContextMenu>
      )}
      {menuMode === 'list' && (
        <List className={'dx-toolbar-menu-action'} items={menuItems} />
      )}
    </div>
  );
}
