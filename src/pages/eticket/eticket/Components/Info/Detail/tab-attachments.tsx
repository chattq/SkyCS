import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { ColumnOptions } from "@/types";
import { useSetAtom } from "jotai";
import { memo, useRef } from "react";
import { toast } from "react-toastify";

export const Tab_Attachments = memo(({ onReload, data }: any) => {
  const { Lst_ET_TicketAttachFile } = data;
  const { t } = useI18n("Eticket_Detail");
  let gridRef = useRef(null);
  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const column: ColumnOptions[] = [
    {
      dataField: "LogLUDTimeUTC",
      visible: true,
      caption: t("LogLUDTimeUTC"), // thời gian tải lên
    },
    {
      dataField: "LogLUBy",
      visible: true,
      caption: t("LogLUBy"), // Người tải lên
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
      dataField: "FileSize",
      visible: true,
      caption: t("FileSize"), // Dung lượng
    },
  ];

  const handleDelete = async (row: any) => {
    console.log("row ", row);
    const param = row.map((item: any) => {
      return {
        TicketID: item.TicketID,
        Idx: item.Idx,
      };
    });

    const response = await api.ETTicketAttachFile_DeleteMultiple(param);
    if (response.isSuccess) {
      toast.success(t("Delete Success"));
      onReload();
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const handleDownload = async (row: any) => {
    const param = row.map((item: any) => {
      return {
        TicketID: item.TicketID,
        Idx: item.Idx,
        FileName: item.FileName,
        FilePath: item.FilePath,
        FileType: item.FileType,
      };
    });

    const response = await api.ETTicketAttachFile_Download(param);
    if (response.isSuccess) {
      toast.success(t("Download Success"));
      console.log("response ", response);
      if (response.Data) {
        window.location.href = response.Data.ZipFileUrl;
      }
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
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
              shouldShow: (ref: any) => {
                if (ref) {
                  if (ref.instance.getSelectedRowKeys().length > 0) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              },
            },
            {
              text: t(`Download`),
              onClick: (e: any, ref: any) => {
                handleDownload(ref.instance.getSelectedRowsData());
              },
              shouldShow: (ref: any) => {
                if (ref) {
                  if (ref.instance.getSelectedRowKeys().length > 0) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              },
            },
            {
              text: t(`Sign`),
              onClick: (e: any, ref: any) => {
                handleSign(ref.instance.getSelectedRowsData());
              },
              shouldShow: (ref: any) => {
                // if (ref) {
                //   if (ref.instance.getSelectedRowKeys().length > 0) {
                //     return true;
                //   } else {
                //     return false;
                //   }
                // } else {
                //   return false;
                // }
                return false;
              },
            },
          ]}
        />
      </>
    );
  } else {
    return <>No Data</>;
  }
});
