import { Form } from "devextreme-react";
import { GroupItem, Item } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { forwardRef } from "react";
import { useFormSettings } from "./form-settings";
import { SLA_EditType, headerForm } from "./store";

const HeaderForm = forwardRef(({}, ref: any) => {
  const formSettings = useFormSettings();

  const formValue = useAtomValue(headerForm);

  const setFormValue = useSetAtom(headerForm);

  const type = useAtomValue(SLA_EditType);

  return (
    <form className="p-2">
      <Form
        ref={ref}
        onInitialized={(e) => {
          ref.current = e.component;
        }}
        formData={formValue}
        labelLocation="left"
        readOnly={type == "detail"}
        onFieldDataChanged={({ dataField, value }: any) => {
          setFormValue({ ...formValue, [dataField]: value });
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
  );
});

export default HeaderForm;
