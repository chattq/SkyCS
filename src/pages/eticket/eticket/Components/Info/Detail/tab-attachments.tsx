import { useI18n } from "@/i18n/useI18n";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { ColumnOptions } from "@/types";
import { Button } from "devextreme-react";
import { useRef } from "react";

export const Tab_Attachments = ({ data }: any) => {
  console.log("dataAttack ", data);
  const { Lst_ET_TicketAttachFile } = data;
  const { t } = useI18n("Eticket_Detail");
  let gridRef = useRef(null);
  console.log("Lst_ET_TicketAttachFile ", Lst_ET_TicketAttachFile);
  // {
  //   "TicketID": "TKID.D7P.00152",
  //   "OrgID": "7206207001",
  //   "Idx": 1,
  //   "NetworkID": "7206207001",
  //   "FileName": "params.txt",
  //   "FilePath": "https://ftest.ecore.vn/20230725/037P30Y12.677D49D0EDD64C458EE7CE779D56212B.txt",
  //   "FileType": "txt",
  //   "LogLUDTimeUTC": "2023-07-25 03:56:41",
  //   "LogLUBy": "0317844394@INOS.VN"
  // },

  const column: ColumnOptions[] = [
    {
      dataField: "LogLUDTimeUTC",
      caption: "LogLUDTimeUTC", // thời gian tải lên
    },
    {
      dataField: "LogLUDTimeUTC",
      caption: "LogLUDTimeUTC", // Người tải lên
    },
    {
      dataField: "FileName",
      caption: "FileName", // tên file
    },
    {
      dataField: "FileType",
      caption: "FileType", // Định dạng
    },
    {
      dataField: "LogLUDTimeUTC",
      caption: "LogLUDTimeUTC", // Dung lượng
    },
  ];

  const handleDelete = (ref: any) => {
    console.log("ref ", ref);
  };

  const handleDownLoad = () => {};

  const handleSyn = () => {};

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
          keyExpr={["FilePath", "FileName"]}
          allowSelection={true}
          storeKey=""
          toolbarItems={[]}
          customToolbarItems={[
            {
              text: t(`Delete`),
              // text: t(`Responsibility`),
              onClick: (e: any, ref: any) => {
                console.log("delete ", ref);

                handleDelete(ref);
              },
              shouldShow: () => {
                return true;
              },
            },
            {
              text: t(`Download`),
              // text: t(`Responsibility`),
              onClick: (e: any, ref: any) => {
                console.log("delete ", ref);

                handleDelete(ref);
              },
              shouldShow: () => {
                return true;
              },
            },
            {
              text: t(`Sign`),
              // text: t(`Responsibility`),
              onClick: (e: any, ref: any) => {
                console.log("delete ", ref);
                handleDelete(ref);
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
