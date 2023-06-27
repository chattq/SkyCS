import { useI18n } from "@/i18n/useI18n";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";

export const useToolbar = (): GridCustomerToolBarItem[] => {
  const { t } = useI18n("eticket_toolbar");
  return [
    {
      text: t(`Tôi phụ trách (0)`),
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length < 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Chưa xử lý (0)`),
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length < 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Quá hạn (0)`),
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length < 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Tôi theo dõi (0)`),
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length < 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Tất cả`),
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length < 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Phản hồi`),
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length > 0) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Sửa`),
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length > 0) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Gộp`),
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length > 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Xóa`),
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length > 0) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
  ];
};
