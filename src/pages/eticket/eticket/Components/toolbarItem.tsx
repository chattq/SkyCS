import { compareDates, getDateNow } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { useNetworkNavigate } from "@/packages/hooks";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { Button } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useMemo } from "react";

interface PropsToolBar {
  data: any[];
  onClose: (data: ETICKET_REPONSE[]) => void;
  onDelete: (data: ETICKET_REPONSE[]) => void;
  onSetStatus: (title: string, ref: any) => void;
  onShowPopUp: (title: string, data: ETICKET_REPONSE[]) => void;
  dataUser: any;
}

interface DropDownInferface {
  title: string;
  onclick: any;
}

export const useToolbar = ({
  data,
  onClose,
  onDelete,
  onSetStatus,
  onShowPopUp,
  dataUser,
}: PropsToolBar): GridCustomerToolBarItem[] => {
  const { t } = useI18n("eticket_toolbar");
  const navigate = useNetworkNavigate();

  const getValue = useMemo(() => {
    let obj = {
      NEW: 0,
      OPEN: 0,
      PROCESSING: 0,
      ONHOLD: 0,
      WATINGONCUSTOMER: 0,
      WAITINGONTHIRDPARTY: 0,
      SOLVED: 0,
      CLOSED: 0,
      OutOfDate: 0,
      Responsibility: 0,
    };

    obj.OPEN = data.filter((item) => item.TicketStatus === "OPEN").length;
    obj.PROCESSING = data.filter(
      (item) => item.TicketStatus === "PROCESS"
    ).length;
    obj.NEW = data.filter((item) => item.TicketStatus === "NEW").length;
    obj.ONHOLD = data.filter((item) => item.TicketStatus === "ON-HOLD").length;
    obj.WATINGONCUSTOMER = data.filter(
      (item) => item.TicketStatus === "WATING ON CUSTOMER"
    ).length;
    obj.WAITINGONTHIRDPARTY = data.filter(
      (item) => item.TicketStatus === "WAITING ON THIRD PARTY"
    ).length;
    obj.SOLVED = data.filter((item) => item.TicketStatus === "SOLVED").length;
    obj.CLOSED = data.filter((item) => item.TicketStatus === "CLOSED").length;
    obj.ONHOLD = data.filter((item) => !item.AgentCode).length;
    obj.OutOfDate = data.filter((item) => {
      return (
        compareDates(getDateNow(), item.TicketDeadline) &&
        item.TicketStatus !== "OPEN"
      );
    }).length;
    obj.Responsibility = data.filter((item) => {
      if (dataUser && item.AgentCode) {
        return item.AgentCode === dataUser.UserCode.toUpperCase()! ?? "";
      }
      return false;
    }).length;
    return obj;
  }, [data]);

  const listCheckOne: DropDownInferface[] = [
    {
      title: t("Split"),
      onclick: (data: ETICKET_REPONSE[]): any => onShowPopUp("Split", data),
    },
    {
      title: t("UpdateAgentCode"),
      onclick: (data: ETICKET_REPONSE[]): any =>
        onShowPopUp("UpdateAgentCode", data),
    },
    {
      title: t("UpdateCustomer"),
      onclick: (data: ETICKET_REPONSE[]): any =>
        onShowPopUp("UpdateCustomer", data),
    },
    {
      title: t("Workflow"),
      onclick: (data: ETICKET_REPONSE[]): any => {},
    },
    // {
    //   title: t("Đánh giá"),
    //   onclick: (data: ETICKET_REPONSE[]): any => {},
    // },
  ];

  const listCheckMulti: DropDownInferface[] = [
    {
      title: t("Closed"),
      onclick: onClose,
    },
  ];

  const listButtonMoreWhenCheck = (ref: any) => {
    const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
    const count = ref.instance.getSelectedRowsData().length;
    let arr: any = [];
    if (count === 1) {
      arr = [...listCheckOne, ...listCheckMulti];
    }
    if (count > 1) {
      arr = [];
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
              // onClick={item.onclick(listData)}
              // text={`$`}
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
      text: t(`Responsibility`) + `(${getValue.Responsibility})`,
      // text: t(`Responsibility`),
      onClick: (e: any, ref: any) => onSetStatus("Responsibility", ref),
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
      text: t(`Open`) + `(${getValue.OPEN})`,
      // text: t(`Open`),
      onClick: (e: any, ref: any) => onSetStatus("Open", ref),
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
    // {
    //   text: t(`OutOfDate`) + `(${getValue.OutOfDate})`,
    //   // text: t(`OutOfDate`),
    //   onClick: (e: any, ref: any) => onSetStatus("OutOfDate", ref),
    //   shouldShow: (ref: any) => {
    //     let check = false;
    //     if (ref) {
    //       if (ref.instance.getSelectedRowsData().length < 1) {
    //         check = true;
    //       }
    //       return check;
    //     } else {
    //       return false;
    //     }
    //   },
    // },
    // {
    //   text: t(`Follower`) + `(${getValue.Responsibility})`,
    //   // text: t(`Follower`),
    //   onClick: (e: any, ref: any) => onSetStatus("Follower", ref),
    //   shouldShow: (ref: any) => {
    //     let check = false;
    //     if (ref) {
    //       if (ref.instance.getSelectedRowsData().length < 1) {
    //         check = true;
    //       }
    //       return check;
    //     } else {
    //       return false;
    //     }
    //   },
    // },
    {
      text: t(`All`),
      onClick: (e: any, ref: any) => onSetStatus("All", ref),
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
      text: t(`response`),
      onClick: (e: any, ref: any) => {
        const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
        onShowPopUp("response", listData);
      },
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
      text: t(`Update`),
      onClick: (e: any, ref: any) => {
        const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
        navigate(`/eticket/edit/${listData[0].TicketID}`);
      },
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
      text: t(`Merge`),
      onClick: (e: any, ref: any) => {
        const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
        onShowPopUp("Merge", listData);
      },
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
      text: t(`Delete`),
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
      text: t(`Close`),
      onClick: (e: any, ref: any) => {
        const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
        onClose(listData);
      },
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
              return (
                <Button onClick={() => onSetStatus("ONHOLD", ref)}>
                  {t(`ONHOLD`)}({getValue.ONHOLD}){/* {t(`ONHOLD`)} */}
                </Button>
              );
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              return (
                <Button onClick={() => onSetStatus("Follower", ref)}>
                  {t(`Follower`) + `(${getValue.Responsibility})`}
                </Button>
              );
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              return (
                <Button onClick={() => onSetStatus("OutOfDate", ref)}>
                  {t(`OutOfDate`) + `(${getValue.OutOfDate})`}
                </Button>
              );
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              return (
                <Button onClick={() => onSetStatus("Closed", ref)}>
                  {t(`Solved (${getValue.CLOSED})`)}
                  {/* {t(`Solved`)} */}
                </Button>
              );
            }}
          />
          {/* <DropDownButtonItem
            render={(item: any) => {
              return <Button>{t("Tôi tạo")}</Button>;
            }}
          /> */}
          <DropDownButtonItem
            render={(item: any) => {
              // đang xử lý
              return (
                <Button onClick={() => onSetStatus("Process", ref)}>
                  {t(`Process (${getValue.PROCESSING}) `)}
                  {/* {t(`Process`)} */}
                </Button>
              );
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
          if (ref.instance.getSelectedRowsData().length === 1) {
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
