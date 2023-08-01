import { useI18n } from "@/i18n/useI18n";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { ColumnOptions } from "@/types";
import { useRef } from "react";

export const Tab_Attachments = ({ data }: any) => {
  const { Lst_ET_TicketAttachFile } = data;
  const { t } = useI18n("Eticket_Detail");
  let gridRef = useRef(null);
  const column: ColumnOptions[] = [
    {
      dataField: "Idx",
      visible: true,
      caption: t("Idx"), // thời gian tải lên
    },
    {
      dataField: "LogLUDTimeUTC",
      visible: true,
      caption: t("LogLUDTimeUTC"), // thời gian tải lên
    },
    {
      dataField: "LogLUDTimeUTC",
      visible: true,
      caption: t("LogLUDTimeUTC"), // Người tải lên
    },
    {
      dataField: "FileName",
      visible: true,
      caption: t("FileName"), // tên file
    },
    {
      dataField: "FileType",
      visible: true,
      caption: t("FileType"), // Định dạng
    },
    {
      dataField: "LogLUDTimeUTC",
      visible: true,
      caption: t("LogLUDTimeUTC"), // Dung lượng
    },
    {
      dataField: "LogLUDTimeUTC",
      visible: true,
      caption: t("LogLUDTimeUTC"), // Ký số
    },
  ];

  const handleDelete = (row: any) => {
    console.log("row ", row);
  };

  const handleDownload = (row: any) => {
    console.log("download row ", row);
  };

  const handleSign = (row: any) => {
    console.log("sign row ", row);
  };

  if (Array.isArray(Lst_ET_TicketAttachFile)) {
    return (
      <>
        <GridViewCustomize
          onReady={(ref) => {
            gridRef = ref;
          }}
          isLoading={false}
          formSettings={{}}
          onSelectionChanged={() => {}}
          dataSource={Lst_ET_TicketAttachFile}
          columns={column}
          keyExpr={["Idx"]}
          allowSelection={true}
          storeKey="Attachments"
          toolbarItems={[]}
          customToolbarItems={[
            {
              text: t(`Delete`),
              // text: t(`Responsibility`),
              onClick: (e: any, ref: any) => {
                handleDelete(ref.instance.getSelectedRowsData());
              },
              shouldShow: () => {
                return true;
              },
            },
            {
              text: t(`Download`),
              // text: t(`Responsibility`),
              onClick: (e: any, ref: any) => {
                handleDownload(ref.instance.getSelectedRowsData());
              },
              shouldShow: () => {
                return true;
              },
            },
            {
              text: t(`Sign`),
              // text: t(`Responsibility`),
              onClick: (e: any, ref: any) => {
                handleSign(ref.instance.getSelectedRowsData());
              },
              shouldShow: () => {
                return true;
              },
            },
          ]}
        />
      </>
    );
  } else {
    return <>No Data</>;
  }
};
