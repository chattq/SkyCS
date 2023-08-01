import { ColumnOptions } from "@packages/ui/base-gridview";
import { useI18n } from "@/i18n/useI18n";
import { Mst_DepartmentControl } from "@packages/types";
import { useAtom, useSetAtom } from "jotai";
import {
  UserAutoAssignTicketAtom,
  dataFormAtom,
  dataTableAtom,
  dataTableUserAtom,
  flagEdit,
  showDetail,
  showPopup,
  viewingDataAtom,
} from "@/pages/Department_Control/components/store";
import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import { StatusButton } from "@/packages/ui/status-button";
import { filterByFlagActive } from "@/packages/common";
import { useClientgateApi } from "@/packages/api";

interface Mst_DepartmentControlColumnsProps {
  data?: any;
}

export const useDepartMentGridColumns = ({
  data,
}: Mst_DepartmentControlColumnsProps) => {
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const api = useClientgateApi();
  const setDataForm = useSetAtom(dataFormAtom);
  const setDataUser = useSetAtom(dataTableUserAtom);
  const setFlagEdit = useSetAtom(flagEdit);
  const setUserAutoAssignTicket = useSetAtom(UserAutoAssignTicketAtom);

  const viewRow = async (rowIndex: number, data: any) => {
    setPopupVisible(true);
    setFlagEdit(false);
    setShowDetail(true);
    const resp = await api.Mst_DepartmentControl_GetByDepartmentCode(
      data.DepartmentCode
    );
    if (resp.isSuccess) {
      console.log(44, resp?.Data);
      setDataUser(
        resp?.Data?.Lst_Sys_UserMapDepartment.map((item: any) => {
          return {
            UserCode: item.UserCode,
            UserName: item.FullName,
            EMail: item.Email,
            PhoneNo: item.PhoneNo,
            OrgID: item.OrgID,
          };
        })
      );
      setUserAutoAssignTicket(
        resp?.Data?.Lst_Sys_UserAutoAssignTicket?.map((item: any) => {
          return {
            ...item,
            UserName: item?.su_UserName,
          };
        })
      );
      setDataForm({
        ...resp?.Data?.Mst_Department,
        FlagActive:
          resp?.Data?.Mst_Department?.FlagActive === "1" ? true : false,
      });
    }
  };

  const { t } = useI18n("Department_Control");
  const columns: ColumnOptions[] = [
    {
      dataField: "DepartmentCode",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("DepartmentCode"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      cellRender: ({ data, rowIndex, value }: any) => {
        return (
          <LinkCell
            key={nanoid()}
            onClick={() => viewRow(rowIndex, data)}
            value={value}
          />
        );
      },
    },
    {
      dataField: "DepartmentName",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("DepartmentName"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "md_DepartmentNameParent",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("md_DepartmentNameParent"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "su_QtyUser",
      editorOptions: {
        readOnly: true,
      },
      caption: t("su_QtyUser"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "DepartmentDesc",
      editorOptions: {
        readOnly: true,
      },
      caption: t("DepartmentDesc"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "FlagActive",
      caption: t("Status"),
      editorType: "dxSwitch",
      columnIndex: 2,
      headerFilter: {
        dataSource: filterByFlagActive(data ?? [], {
          true: t("Active"),
          false: t("Inactive"),
        }),
      },
      groupKey: "BASIC_INFORMATION",
      visible: true,
      width: 100,
      cellRender: ({ data }: any) => {
        return <StatusButton key={nanoid()} isActive={data.FlagActive} />;
      },
    },
  ];
  // return array of the first item only

  return columns;
};
