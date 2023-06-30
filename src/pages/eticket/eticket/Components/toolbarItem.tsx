import { useI18n } from "@/i18n/useI18n";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { Button } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";

interface PropsToolBar {
  onClose: (data: ETICKET_REPONSE[]) => void;
  onDelete: (data: ETICKET_REPONSE[]) => void;
  onSetStatus: (title: string) => void;
}

interface DropDownInferface {
  title: string;
  onclick: any;
}

export const useToolbar = ({
  onClose,
  onDelete,
  onSetStatus,
}: PropsToolBar): GridCustomerToolBarItem[] => {
  const { t } = useI18n("eticket_toolbar");

  const listCheckOne: DropDownInferface[] = [
    {
      title: t("Tách"),
      onclick: (data: ETICKET_REPONSE[]): any => {},
    },
    {
      title: t("Chuyển phụ trách"),
      onclick: (data: ETICKET_REPONSE[]): any => {},
    },
    {
      title: t("Workflow"),
      onclick: (data: ETICKET_REPONSE[]): any => {},
    },
    {
      title: t("Đánh giá"),
      onclick: (data: ETICKET_REPONSE[]): any => {},
    },
  ];

  const listCheckMulti: DropDownInferface[] = [
    {
      title: t("Đóng"),
      onclick: onClose,
    },
  ];

  const listButtonMoreWhenCheck = (ref: any) => {
    const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
    const count = ref.instance.getSelectedRowsData().length;
    let arr: any = [];
    if (count === 1) {
      arr = listCheckOne;
    }
    if (count > 1) {
      arr = [...listCheckOne, ...listCheckMulti];
    }

    return (
      <DropDownButton
        showArrowIcon={false}
        keyExpr={"id"}
        className="menu-items"
        displayExpr={"text"}
        wrapItemText={false}
        dropDownOptions={{
          width: 150,
          wrapperAttr: {
            class: "headerform__menuitems",
          },
        }}
        icon="/images/icons/more.svg"
      >
        {arr.map((item: DropDownInferface) => {
          return (
            <DropDownButtonItem
              render={(itemRe: any) => {
                return (
                  <Button onClick={() => item.onclick(listData)}>
                    {t(`${item.title}`)}
                  </Button>
                );
              }}
            />
          );
        })}
      </DropDownButton>
    );
  };

  // Phản hồi, Ghi chú nội bộ 1
  // Tách 1
  // Chuyển phụ trách 1
  // Đóng m
  // Workflow 1
  // Đánh giá 1
  // Export Excel

  return [
    {
      text: t(`Tôi phụ trách (0)`),
      onClick: () => onSetStatus(""),
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
      text: t(`All`),
      onClick: () => onSetStatus("All"),
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
          if (ref.instance.getSelectedRowsData().length === 1) {
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
      onClick: (e: any, ref: any) => {
        const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
        onDelete(listData);
      },
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
      text: "",
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length === 0) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
      widget: "customize",
      customize: (ref: any) => (
        <DropDownButton
          showArrowIcon={false}
          keyExpr={"id"}
          className="menu-items"
          displayExpr={"text"}
          wrapItemText={false}
          dropDownOptions={{
            width: 150,
            wrapperAttr: {
              class: "headerform__menuitems",
            },
          }}
          icon="/images/icons/more.svg"
        >
          <DropDownButtonItem
            render={(item: any) => {
              console.log("item ======================", item);
              return <Button>{t("Chưa giao")}</Button>;
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              return <Button>{t("Đã hoàn thành")}</Button>;
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              return <Button>{t("Tôi tạo")}</Button>;
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              return <Button>{t("Đang xử lý")}</Button>;
            }}
          />
        </DropDownButton>
      ),
    },
    {
      text: "",
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
      widget: "customize",
      customize: (ref: any) => listButtonMoreWhenCheck(ref),
    },
  ];
};
