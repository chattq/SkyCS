import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, TextBox } from "devextreme-react";
import HtmlEditor, {
  Toolbar,
  MediaResizing,
  ImageUpload,
  Item,
} from "devextreme-react/html-editor";
import { useRef } from "react";
export default function Content_Email({ formRef, markup }: any) {
  const { t } = useI18n("Content_Managent");
  const cursorPositionRef = useRef<any>(0);
  const cursorPositionTitleRef = useRef<any>(0);
  const onFocusInRef = useRef<any>();
  const editorTitleRef = useRef<any>();
  const editorRef = useRef<any>();
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
  const api = useClientgateApi();
  const { data: listMst_BizColumn } = useQuery(["Mst_BizColumn"], () =>
    api.Mst_BizColumn_GetAllActive()
  );
  const handleCLick = (item: any) => {
    if (onFocusInRef.current) {
      editorRef.current.instance.insertText(
        cursorPositionRef.current.index,
        `$\{${item.BizCol}\}`
      );
    } else {
      editorTitleRef.current.instance.insertText(
        cursorPositionTitleRef.current.index,
        `$\{${item.BizCol}\}`
      );
    }
  };

  const onFocusOut = (e: any) => {
    cursorPositionRef.current = e.component.getSelection();
  };

  const onFocusTitleOut = (e: any) => {
    cursorPositionTitleRef.current = e.component.getSelection();
  };
  const onFocusIn = (e: any) => {
    onFocusInRef.current = true;
  };
  const onFocusTitleIn = (e: any) => {
    onFocusInRef.current = false;
  };

  const handleValueChangeTitle = (e: any) => {
    formRef.current.instance.updateData("MessageTitleEmail", e.value);
    // setContentLength(newContentLength);
  };
  const handleValueChange = (e: any) => {
    formRef.current.instance.updateData("MessageEmail", e.value);
    // setContentLength(newContentLength);
  };
  return (
    <div className="flex px-6">
      <div className="w-[80%]">
        <div className="pb-4">
          <div className="pb-[5px]">{t("Title")}</div>
          <HtmlEditor
            className="Email_title"
            width={"80%"}
            defaultValue={
              markup?.Lst_Mst_SubmissionFormMessage[0]?.SubTitle || ""
            }
            ref={editorTitleRef}
            onFocusIn={onFocusTitleIn}
            onFocusOut={onFocusTitleOut}
            onValueChanged={handleValueChangeTitle}
          />
        </div>
        <div className="mb-[5px]">{t("Message Content")}</div>
        <HtmlEditor
          height="300px"
          width={"80%"}
          defaultValue={markup?.Lst_Mst_SubmissionFormMessage[0]?.Message || ""}
          ref={editorRef}
          onFocusOut={onFocusOut}
          onFocusIn={onFocusIn}
          onValueChanged={handleValueChange}
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
            <Item name="variable" />
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
      <div className="w-[420px]">
        <div className="mb-[15px]">{t("System Parameters")}</div>
        <div className="border pl-2 max-h-[300px] overflow-hidden">
          <ScrollView height={300} showScrollbar="always">
            <div>
              {listMst_BizColumn?.DataList?.map((item: any, index: any) => {
                return (
                  <div
                    key={index}
                    className="flex hover:text-red-500 cursor-pointer"
                    onClick={() => handleCLick(item)}
                  >
                    <div className="hover:text-red-500 cursor-pointer py-[4px] w-[50%] font-bold">
                      {`$\{${item.BizCol}\}`}
                    </div>
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
