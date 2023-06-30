import { Button, Form } from "devextreme-react";
import { GroupItem, Item } from "devextreme-react/form";
import { nanoid } from "nanoid";
import { useRef } from "react";
import { useFormSettings } from "./components/form-settings";
import { useSideFormSettings } from "./components/side-form-settings";

const EticketAdd = () => {
  const ref: any = useRef();

  const formValue = {};

  const formSettings = useFormSettings();

  const sideFormSettings = useSideFormSettings();
  return (
    <div className="w-full">
      <div className="flex justify-end">
        <Button
          style={{
            padding: 10,
            margin: 10,
            background: "green",
            color: "white",
          }}
        >
          Save
        </Button>
        <Button
          style={{
            padding: 10,
            margin: 10,
          }}
        >
          Cancel
        </Button>
      </div>
      <div className="flex">
        <form className="p-2 w-[80%]">
          <Form
            ref={ref}
            onInitialized={(e) => {
              ref.current = e.component;
            }}
            formData={formValue}
            labelLocation="left"
            readOnly={false}
            onFieldDataChanged={({ dataField, value }: any) => {
              // setFormValue({ ...formValue, [dataField]: value });
            }}
          >
            {formSettings.map((value: any) => {
              return (
                <GroupItem colCount={value.colCount} key={nanoid()}>
                  {value?.items?.map((items: any) => {
                    return <Item {...items} key={nanoid()} />;
                  })}
                </GroupItem>
              );
            })}
          </Form>
        </form>
        <form className="p-2 col-span-2">
          <Form
            ref={ref}
            onInitialized={(e) => {
              ref.current = e.component;
            }}
            formData={formValue}
            labelLocation="top"
            readOnly={false}
            onFieldDataChanged={({ dataField, value }: any) => {
              // setFormValue({ ...formValue, [dataField]: value });
            }}
          >
            {sideFormSettings.map((value: any) => {
              return (
                <GroupItem colCount={value.colCount} key={nanoid()}>
                  {value?.items?.map((items: any) => {
                    return <Item {...items} key={nanoid()} />;
                  })}
                </GroupItem>
              );
            })}
          </Form>
        </form>
      </div>
    </div>
  );
};

export default EticketAdd;
