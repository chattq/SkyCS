import { Button, Form } from "devextreme-react";
import { Item } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { holidayListAtom } from "./store";

const HolidayForm = () => {
  const defaultFormValue = {
    id: nanoid(),
    Month: undefined,
    Day: undefined,
    Event: undefined,
  };

  const [formValue, setFormValue] = useState<any>(defaultFormValue);

  const [dayList, setDayList] = useState<any>([]);

  const holidayList = useAtomValue(holidayListAtom);

  const setHolidayList = useSetAtom(holidayListAtom);

  const listMonth = Array.from({ length: 12 }, (v: any, i: any) => {
    return i + 1;
  });

  const maxDayOfMonth = (month: any) => {
    return new Date(2000, month, 0).getDate();
  };

  const generateDay = () => {
    if (formValue.Day > maxDayOfMonth(formValue.Month)) {
      setFormValue({ ...formValue, Day: undefined });
    }
    return Array.from(
      { length: maxDayOfMonth(formValue.Month) },
      (v: any, i: any) => {
        return i + 1;
      }
    );
  };

  const formRef: any = useRef(null);

  const handleAdd = () => {
    if (formRef.current.instance.validate().isValid) {
      if (
        holidayList.some(
          (item: any) =>
            item?.Day == formValue?.Day && item?.Month == formValue?.Month
        )
      ) {
        toast.error("Ngày bạn chọn đã tồn tại!");
        return;
      }
      setHolidayList([
        ...holidayList,
        {
          ...formValue,
          id: nanoid(),
        },
      ]);
      setFormValue(defaultFormValue);
    }
  };

  return (
    <Form
      className="flex items-center mt-3 gap-3"
      formData={formValue}
      colCount={4}
      labelMode="hidden"
      ref={formRef}
      onFieldDataChanged={({ dataField, value }: any) => {
        setFormValue({ ...formValue, [dataField]: value });
        if (dataField === "Month") {
          setDayList(generateDay());
        }
      }}
    >
      <Item
        editorType="dxSelectBox"
        editorOptions={{
          dataSource: listMonth,
          placeholder: "Tháng",
        }}
        dataField="Month"
        validationRules={[
          {
            type: "required",
          },
        ]}
        name="Month"
      />
      <Item
        editorType="dxSelectBox"
        editorOptions={{
          placeholder: "Ngày",
          dataSource: dayList,
        }}
        dataField="Day"
        name="Day"
        validationRules={[
          {
            type: "required",
          },
        ]}
      />
      <Item
        editorType="dxTextBox"
        editorOptions={{
          placeholder: "Sự kiện",
        }}
        dataField="Event"
        cssClass="flex-grow"
        name="Event"
        validationRules={[
          {
            type: "required",
          },
        ]}
      />
      <Item
        render={() => (
          <Button
            onClick={handleAdd}
            style={{ padding: 10, background: "green", color: "white" }}
          >
            Thêm
          </Button>
        )}
      />
    </Form>
  );
};

export default HolidayForm;
