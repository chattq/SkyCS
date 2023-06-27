import { SLA_EditType } from "@/pages/eticket/SLA/components/store";
import { Button, DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { useAtomValue, useSetAtom } from "jotai";
import { holidayListAtom } from "./store";

const HolidayTable = () => {
  const holidayList = useAtomValue(holidayListAtom);
  const setHolidayList = useSetAtom(holidayListAtom);

  const handleDelete = (id: string) => {
    setHolidayList(holidayList.filter((item: any) => item.id != id));
  };

  const type = useAtomValue(SLA_EditType);

  const columns = [
    {
      dataField: "id",
      caption: "",
      cellRender: ({ data }: any) => {
        return (
          <Button icon="trash" onClick={() => handleDelete(data.id)}></Button>
        );
      },
      width: type == "detail" ? 0 : 100,
    },

    {
      dataField: "day",
      caption: "Day",
      cellRender: ({ data }: any) => {
        return (
          <>
            {`0${data.Day}`.slice(-2)}-{`0${data.Month}`.slice(-2)}
          </>
        );
      },
      width: 200,
    },
    {
      dataField: "Event",
      caption: "Event",
    },
  ];
  return (
    <DataGrid dataSource={holidayList} keyExpr="id" width={"50%"}>
      {columns.map((item: any) => (
        <Column {...item} key={item.id} />
      ))}
    </DataGrid>
  );
};

export default HolidayTable;
