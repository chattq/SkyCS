import { useMemo } from "react";
import { MenuBarItem } from "@/types";
import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "@packages/contexts/auth";
import { useLocation } from "react-router-dom";
import { usePermissions } from "../contexts/permission";

export const useHeaderItems = () => {
  const { t } = useI18n("Common");
  const { auth: { networkId } } = useAuth();
  const { hasMenuPermission } = usePermissions();
  const { pathname } = useLocation();


  const menuBarItems = useMemo<{ mainItems: MenuBarItem[], extraItems: MenuBarItem[]; }>(() => {
    let mainItems: MenuBarItem[] = [
      {
        text: t('Sales'),
        path: `/sales`,
        permissionCode: "MNU_SALES"
      },
      {
        text: t('Contract'),
        path: `/contract`,
        permissionCode: "MNU_CONTRACT"
      },
      {
        text: t('Payment'),
        path: `/payment`,
        permissionCode: "MNU_PAYMENT"
      },
      {
        text: t('Logistic'),
        path: `/logistic`,
        permissionCode: "MNU_LOGISTIC"
      },
      {
        text: t('Purchase'),
        path: `/purchase`,
        permissionCode: "MNU_PURCHASE"
      },
      {
        text: t('Admin'),
        path: `/admin`,
        permissionCode: "MNU_ADMIN"
      },
      {
        text: t("Report"),
        path: '/report',
        permissionCode: "MNU_REPORT"
      },
      {
        text: t("DealerSales"),
        path: '/dealer-sales',
        permissionCode: "MNU_DEALER_SALES"
      }
    ].filter(item => item.permissionCode && hasMenuPermission(item.permissionCode));
    let extraItems: MenuBarItem[] = [];
    if (mainItems.length > 5) {
      extraItems = mainItems.slice(5);
      mainItems = mainItems.slice(0, 5);
    }

    const selected = extraItems.find(item => pathname.startsWith(`/${networkId}${item.path}`));

    // if selected item is extra item.
    if (!selected) {
      return {
        mainItems: mainItems.concat(extraItems.slice(0, 1)),
        extraItems: extraItems.slice(1)
      };
    } else {
      return {
        mainItems: mainItems.concat([selected]),
        extraItems: extraItems.filter(item => item.path !== selected.path)
      };
    }
  }, [t, pathname]);

  return { items: menuBarItems.mainItems, extraItems: menuBarItems.extraItems };
};