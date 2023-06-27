import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { ScrollView } from "devextreme-react";
import HtmlEditor, {
  Toolbar,
  MediaResizing,
  ImageUpload,
  Item,
} from "devextreme-react/html-editor";
import React, { useRef } from "react";

export default function Zalo_UserID({ formRef }: any) {
  const editorRef = useRef<any>();
  const cursorPositionRef = useRef<any>(0);
  const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
  const fontValues = [
    "Arial",
    "Courier New",
    "Georgia",
    "Impact",
    "Lucida Console",
    "Tahoma",
    "Times New Roman",
    "Verdana",
  ];
  const headerValues = [false, 1, 2, 3, 4, 5];
  //defaultValue={""}
  const api = useClientgateApi();
  const { data: listMst_BizColumn } = useQuery(["Mst_BizColumn"], () =>
    api.Mst_BizColumn_GetAllActive()
  );

  const onFocusOut = (e: any) => {
    cursorPositionRef.current = e.component.getSelection();
  };

  const handleCLick = (item: any) => {
    editorRef.current.instance.insertText(
      cursorPositionRef.current.index,
      `{${item.BizCol}}`
    );
  };
  const valueChanged = (e: any) => {
    formRef.current.instance.updateData("MessageZalo", e.value);
  };
  return (
    <div className="flex px-6">
      <div className="w-[80%]">
        <div className="mb-[15px]">Nội dung tin nhắn</div>
        <HtmlEditor
          valueType="html"
          height="300px"
          width={"80%"}
          ref={editorRef}
          onValueChanged={valueChanged}
          onFocusOut={onFocusOut}
        >
          <MediaResizing enabled={true} />
          <ImageUpload tabs={["file"]} fileUploadMode="base64" />
          <Toolbar multiline={false}>
            <Item name="undo" />
            <Item name="redo" />
            <Item name="separator" />
            <Item name="size" acceptedValues={sizeValues} />
            <Item name="font" acceptedValues={fontValues} />
            <Item name="separator" />
            <Item name="bold" />
            <Item name="italic" />
            <Item name="strike" />
            <Item name="underline" />
            <Item name="separator" />
            <Item name="alignLeft" />
            <Item name="alignCenter" />
            <Item name="alignRight" />
            <Item name="alignJustify" />
            <Item name="separator" />
            <Item name="orderedList" />
            <Item name="bulletList" />
            <Item name="separator" />
            <Item name="header" acceptedValues={headerValues} />
            <Item name="separator" />
            <Item name="color" />
            <Item name="background" />
            <Item name="separator" />
            <Item name="link" />
            <Item name="image" />
            <Item name="separator" />
            <Item name="clear" />
            <Item name="codeBlock" />
            <Item name="blockquote" />
            <Item name="separator" />
            <Item name="insertTable" />
            <Item name="deleteTable" />
            <Item name="insertRowAbove" />
            <Item name="insertRowBelow" />
            <Item name="deleteRow" />
            <Item name="insertColumnLeft" />
            <Item name="insertColumnRight" />
            <Item name="deleteColumn" />
          </Toolbar>
        </HtmlEditor>
      </div>
      <div className="w-[30%]">
        <div className="mb-[15px]">Các tham số hệ thống</div>
        <div className="border pl-2 max-h-[300px] overflow-hidden">
          <ScrollView height={300} showScrollbar="always">
            <div>
              {listMst_BizColumn?.DataList?.map((item: any) => {
                return (
                  <div
                    className="flex hover:text-red-500 cursor-pointer"
                    onClick={() => handleCLick(item)}
                  >
                    <div className="hover:text-red-500 cursor-pointer py-[4px] w-[50%] font-bold">{`{${item.BizCol}}`}</div>
                    <div className="hover:text-red-500 cursor-pointer py-[4px] w-[50%] font-bold">{`${item.BizColName}`}</div>
                  </div>
                );
              })}
            </div>
          </ScrollView>
        </div>
      </div>
    </div>
  );
}
