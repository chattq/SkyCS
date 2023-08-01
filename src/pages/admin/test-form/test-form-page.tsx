import { DataGrid, Form, TextBox } from "devextreme-react";
import { ButtonItem, ButtonOptions, Item, Label } from "devextreme-react/form";
import React, { useRef } from "react";
import HtmlEditor from "devextreme-react/html-editor";
import {
  Column,
  Editing,
  GroupPanel,
  Grouping,
  HeaderFilter,
  Pager,
  Paging,
} from "devextreme-react/data-grid";

// import {text} from "msw";

export const TestFormPage = () => {
  const formData = {
    "test.key.01": "1",
  };
  const onSubmit = (e: any) => {
    console.log("formData:", formData);
    e.preventDefault();
  };
  const textPosition = useRef<any>(null);
  const handleFocusOut = (e: any) => {
    // console.log(e);
    const { element, component } = e;
    textPosition.current?.setHTML(
      `Cursor position: ${element.querySelector("input").selectionStart}`
    );
  };
  const textboxRef = useRef<TextBox>(null);

  return (
    <div>
      {/* <form onSubmit={onSubmit}>
        <Form formData={formData}>
          <Item
            dataField={`test.key.01`}
            editorType={"dxTextBox"}
            editorOptions={{}}
            colSpan={3}
          >
            <Label visible={false} />
          </Item>
          <ButtonItem cssClass={"simple-search-form__button"}>
            <ButtonOptions
              type={"default"}
              width={"150px"}
              useSubmitBehavior={true}
              text={"Search"}
            ></ButtonOptions>
          </ButtonItem>
        </Form>
      </form>
      <HtmlEditor
        valueType={"html"}
        onInitialized={(e) => {
          let htmlEditor = e.component;
          const Clipboard = htmlEditor?.get("modules/clipboard");

          class ExtendedClipboard extends Clipboard {
            constructor(quill: any, options: any) {
              quill.root.addEventListener("paste", (args: any) => {
                // console.log("custom_paste_2", args);
                const pastedData = args.clipboardData.getData("text");
                const regex =
                  /^[a-zA-Z0-9@  `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]+$/;

                if (regex.test(pastedData) !== true) {
                  // cancel on demand;
                  args.preventDefault();
                }
              });
              super(quill, options);
              // console.log("create_clipboard");
            }
          }

          const Uploader = htmlEditor?.get("modules/uploader");

          class ExtendedUploader extends Uploader {
            constructor(quill: any, options: any) {
              quill.root.addEventListener("drop", (args: any) => {
                // console.log("custom_drop");
                // cancel on demand;
                args.stopImmediatePropagation();
                args.preventDefault();
              });
              super(quill, options);
              // console.log("create_uploader");
            }
          }

          htmlEditor?.register({
            "modules/clipboard": ExtendedClipboard,
            "modules/uploader": ExtendedUploader,
          });
        }}
      />
      <TextBox onFocusOut={handleFocusOut} ref={textboxRef} />
      <div ref={textPosition}></div> */}
    </div>
  );
};
