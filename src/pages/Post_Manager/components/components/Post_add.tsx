import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { ContentSearchPanelLayout } from "@/packages/layouts/content-searchpanel-layout";
import React, { useCallback, useRef } from "react";
import { HeaderPart } from "../header-part";
import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";
import { Form, TagBox } from "devextreme-react";
import { GroupItem, Item, SimpleItem } from "devextreme-react/form";
import Custombotton from "../Custombotton";
import TreeView from "devextreme-react/tree-view";

import HtmlEditor, {
  Toolbar,
  MediaResizing,
  ImageUpload,
  Item as ItemEditor,
} from "devextreme-react/html-editor";
import TagboxCustom from "./TagboxCustom";
import { TestUploadPage } from "@/pages/admin/test-upload/test-upload";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { currentInfo } from "../store";
import { useAtomValue } from "jotai";

export default function Post_add() {
  const { t } = useI18n("Post_Manager");

  const formData = useAtomValue(currentInfo);

  const api = useClientgateApi();
  const validateRef = useRef<any>();
  const formRef = useRef<any>();
  const formRef2 = useRef<any>();
  const treeViewRef = useRef<any>();
  const PostStatus = [
    { text: t("Published"), value: "PUBLISHED" },
    { text: t("Draft"), value: "DRAFT" },
  ];
  const shareType = [
    { text: t("ORGANIZATION"), value: "ORGANIZATION" },
    { text: t("NETWORK"), value: "NETWORK" },
    { text: t("PRIVATE"), value: "PRIVATE" },
  ];

  const { data: dataTagbox } = useQuery(["dataTagbox"], () =>
    api.Mst_Tag_GetAllActive()
  );
  const handleAddNew = () => {
    console.log("a");
    const formData = validateRef.current.instance.option("formData");
    const formData2 = formRef2.current.instance.option("formData");
    console.log(formData);
    console.log(formData2);
  };
  const formSettings: any = [
    {
      colCount: 1,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 1,
          cssClass: "",
          items: [
            {
              dataField: "Title",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("Title"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "Detail",
              editorOptions: {
                // readOnly: false,
                // placeholder: t("Input"),
                // height: 340,
                // maxLength: 200,
              },
              render: (param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <HtmlEditor
                    height="340px"
                    // defaultValue={markup}
                    onValueChanged={(e) => {
                      formComponent.updateData(dataField, e.value);
                    }}
                  >
                    <MediaResizing enabled={true} />
                    <ImageUpload
                      // tabs={this.state.currentTab}
                      fileUploadMode="base64"
                    />
                    <Toolbar

                    // multiline={this.state.isMultiline}
                    >
                      <ItemEditor name="undo" />
                      <ItemEditor name="redo" />
                      <ItemEditor name="separator" />
                      {/* <Item name="size" acceptedValues={sizeValues} />
                      <Item name="font" acceptedValues={fontValues} /> */}
                      <ItemEditor name="separator" />
                      <ItemEditor name="bold" />
                      <ItemEditor name="italic" />
                      <ItemEditor name="strike" />
                      <ItemEditor name="underline" />
                      <ItemEditor name="separator" />
                      <ItemEditor name="alignLeft" />
                      <ItemEditor name="alignCenter" />
                      <ItemEditor name="alignRight" />
                      <ItemEditor name="alignJustify" />
                      <ItemEditor name="separator" />
                      <ItemEditor name="orderedList" />
                      <ItemEditor name="bulletList" />
                      <ItemEditor name="separator" />
                      {/* <Item name="header" acceptedValues={headerValues} /> */}
                      <ItemEditor name="separator" />
                      <ItemEditor name="color" />
                      <ItemEditor name="background" />
                      <ItemEditor name="separator" />
                      <ItemEditor name="link" />
                      <ItemEditor name="image" />
                      <Item name="separator" />
                      <ItemEditor name="clear" />
                      <ItemEditor name="codeBlock" />
                      <ItemEditor name="blockquote" />
                      <ItemEditor name="separator" />
                      <ItemEditor name="insertTable" />
                      <ItemEditor name="deleteTable" />
                      <ItemEditor name="insertRowAbove" />
                      <ItemEditor name="insertRowBelow" />
                      <ItemEditor name="deleteRow" />
                      <ItemEditor name="insertColumnLeft" />
                      <ItemEditor name="insertColumnRight" />
                      <ItemEditor name="deleteColumn" />
                    </Toolbar>
                  </HtmlEditor>
                );
              },
              editorType: "dxTextArea",
              caption: t("Detail"),
              visible: true,
            },
            {
              dataField: "UploadFiles", // file đính kèm
              caption: t("UploadFiles"),
              colSpan: 2,
              label: {
                location: "left",
                text: "Upload files",
              },
              editorOptions: {
                readOnly: true,
              },
              // render: ({ dataField, component: formRef }: any) => {
              //   // console.log("formRef:", formRef);
              //   // console.log("editorOptions:", dataField);
              //   // const { component: formComponent, dataField } = param;
              //   return (
              //     <UploadFilesField
              //       formInstance={formRef}
              //       onValueChanged={(files: any) => {
              //         // console.log("file ", files);
              //         formRef.updateData(dataField, files);
              //       }}
              //     />
              //   );
              // },
              render: (param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <UploadFilesField
                    formInstance={formComponent}
                    onValueChanged={(files: any) => {
                      formComponent.updateData("UploadFiles", files);
                    }}
                  />
                );
              },
            },
            {
              dataField: "Synopsis",
              editorOptions: {
                readOnly: false,
                placeholder: t("Input"),
                height: 70,
                maxLength: 200,
              },
              editorType: "dxTextArea",
              caption: t("Synopsis"),
              visible: true,
            },
          ],
        },
      ],
    },
    {
      colCount: 1,
      labelLocation: "left",
      typeForm: "FormRight",
      hidden: false,
      items: [
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 1,
          cssClass: "",
          items: [
            {
              dataField: "PostStatus",
              editorOptions: {
                dataSource: PostStatus,
                valueExpr: "value",
                displayExpr: "text",
                placeholder: t("Select"),
              },
              editorType: "dxSelectBox",
              caption: t("PostStatus"),
              visible: true,
            },
            {
              dataField: "ShareType",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: shareType,
                valueExpr: "value",
                displayExpr: "text",
              },
              editorType: "dxSelectBox",
              caption: t("ShareType"),
              visible: true,
            },
            {
              dataField: "OrgID",
              label: { text: "Quản lý danh mục" },
              editorOptions: {
                placeholder: t("Input Select"),
              },
              render: ({ e }: any) => {
                return (
                  <TreeView
                    id="treeview"
                    displayExpr="fullName"
                    ref={treeViewRef}
                    width={"100%"}
                    showCheckBoxesMode="normal"
                    selectionMode="multiple"
                    className="max-h-[190px] overflow-y-auto"
                    items={[
                      {
                        id: 1,
                        fullName: "John Heart",
                        prefix: "Dr.",
                        position: "CEO",
                        expanded: true,
                        items: [
                          {
                            id: 2,
                            fullName: "Samantha Bright",
                            prefix: "Dr.",
                            position: "COO",
                            expanded: true,
                            items: [
                              {
                                id: 3,
                                fullName: "Kevin Carter",
                                prefix: "Mr.",
                                position: "Shipping Manager",
                              },
                              {
                                id: 14,
                                fullName: "Victor Norris",
                                prefix: "Mr.",
                                selected: true,
                                position: "Shipping Assistant",
                              },
                            ],
                          },
                          {
                            id: 4,
                            fullName: "Brett Wade",
                            prefix: "Mr.",
                            position: "IT Manager",
                            expanded: true,
                            items: [
                              {
                                id: 5,
                                fullName: "Amelia Harper",
                                prefix: "Mrs.",
                                position: "Network Admin",
                                selected: true,
                              },
                              {
                                id: 6,
                                fullName: "Wally Hobbs",
                                prefix: "Mr.",
                                position: "Programmer",
                              },
                              {
                                id: 7,
                                fullName: "Brad Jameson",
                                prefix: "Mr.",
                                position: "Programmer",
                              },
                              {
                                id: 8,
                                fullName: "Violet Bailey",
                                prefix: "Ms.",
                                position: "Jr Graphic Designer",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        id: 9,
                        fullName: "Barb Banks",
                        prefix: "Mrs.",
                        position: "Support Manager",
                        expanded: true,
                        items: [
                          {
                            id: 10,
                            fullName: "Kelly Rodriguez",
                            prefix: "Ms.",
                            position: "Support Assistant",
                          },
                          {
                            id: 11,
                            fullName: "James Anderson",
                            prefix: "Mr.",
                            position: "Support Assistant",
                          },
                        ],
                      },
                    ]}
                    // selectNodesRecursive={this.state.selectNodesRecursive}
                    // selectByClick={this.state.selectByClick}
                    // showCheckBoxesMode={this.state.showCheckBoxesMode}
                    // selectionMode={this.state.selectionMode}
                    // onSelectionChanged={this.treeViewSelectionChanged}
                    // onContentReady={this.treeViewContentReady}
                  />
                );
              },
            },
            {
              dataField: "Select",
              caption: t("Select"),
              label: {
                text: "Tags",
              },
              visible: true,
              render: ({ editorOptions, component: formRef }: any) => {
                return <TagboxCustom data={dataTagbox?.Data?.Lst_Mst_Tag} />;
              },
            },
          ],
        },
      ],
    },
  ];
  const handleSubmitPopup = useCallback(async (e: any) => {
    validateRef.current.instance.validate();
    const dataForm = new FormData(formRef.current);
    const dataSaveForm: any = Object.fromEntries(dataForm.entries()); // chuyển thành form chính
    console.log(dataSaveForm);
  }, []);

  const customizeItem = useCallback((item: any) => {
    if (["OrgID", "CustomerGrpCode"].includes(item.dataField)) {
    }
  }, []);

  const handleFieldDataChanged = (changedData: any) => {
    // Handle the changed field data
    if (changedData.dataField === "EMail") {
    }
  };
  const dataform = {
    // Title: "abc",
  };
  return (
    <AdminContentLayout className={"Post_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div onClick={handleAddNew}>handleAddNew</div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div className="flex mx-5 my-2 gap-5">
          <div className="w-[65%]">
            <form action="" ref={formRef} onSubmit={handleSubmitPopup}>
              <Form
                className="form_detail_post"
                ref={validateRef}
                validationGroup="PostData"
                onInitialized={(e) => {
                  validateRef.current = e.component;
                }}
                readOnly={false}
                formData={formData}
                labelLocation="left"
                customizeItem={customizeItem}
                onFieldDataChanged={handleFieldDataChanged}
              >
                {formSettings
                  .filter((item: any) => item.typeForm === "textForm")
                  .map((value: any) => {
                    return (
                      <GroupItem colCount={value.colCount}>
                        {value.items.map((items: any) => {
                          return (
                            <GroupItem colSpan={items.colSpan}>
                              {items.items.map((valueFrom: any) => {
                                return (
                                  <SimpleItem
                                    key={valueFrom.caption}
                                    {...valueFrom}
                                  />
                                );
                              })}
                            </GroupItem>
                          );
                        })}
                      </GroupItem>
                    );
                  })}
              </Form>
            </form>
          </div>
          <div className="w-[34%]">
            <form action="" ref={formRef}>
              <Form
                className="form_detail_post"
                ref={formRef2}
                validationGroup="PostData"
                onInitialized={(e) => {
                  formRef2.current = e.component;
                }}
                readOnly={false}
                formData={{}}
                labelLocation="left"
                customizeItem={customizeItem}
                onFieldDataChanged={handleFieldDataChanged}
              >
                {formSettings
                  .filter((item: any) => item.typeForm === "FormRight")
                  .map((value: any) => {
                    return (
                      <GroupItem colCount={value.colCount}>
                        {value.items.map((items: any) => {
                          return (
                            <GroupItem colSpan={items.colSpan}>
                              {items.items.map((valueFrom: any) => {
                                return (
                                  <SimpleItem
                                    key={valueFrom.caption}
                                    {...valueFrom}
                                  />
                                );
                              })}
                            </GroupItem>
                          );
                        })}
                      </GroupItem>
                    );
                  })}
              </Form>
            </form>
          </div>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
}
