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

export default function Post_detail() {
  const { t } = useI18n("Post_Manager");
  const handleAddNew = () => {};
  const validateRef = useRef<any>();
  const formRef = useRef<any>();
  const treeViewRef = useRef<any>();
  const dataSelect = [
    { text: "Thêm", value: "abc" },
    { text: "Lựa chọn", value: "bca" },
  ];
  const dataTagbox = [
    {
      ID: 1,
      Name: "HD Video Player",
      Price: 330,
      Current_Inventory: 225,
      Backorder: 0,
      Manufacturing: 10,
      Category: "Video Players",
      IconSrc: "video-player.svg",
    },
    {
      ID: 2,
      Name: "SuperHD Player",
      Price: 400,
      Current_Inventory: 150,
      Backorder: 0,
      Manufacturing: 25,
      Category: "Video Players",
      IconSrc: "video-player.svg",
    },
    {
      ID: 3,
      Name: "SuperPlasma 50",
      Price: 2400,
      Current_Inventory: 0,
      Backorder: 0,
      Manufacturing: 0,
      Category: "Televisions",
      IconSrc: "tv.svg",
    },
    {
      ID: 4,
      Name: "SuperLED 50",
      Price: 1600,
      Current_Inventory: 77,
      Backorder: 0,
      Manufacturing: 55,
      Category: "Televisions",
      IconSrc: "tv.svg",
    },
    {
      ID: 5,
      Name: "SuperLED 42",
      Price: 1450,
      Current_Inventory: 445,
      Backorder: 0,
      Manufacturing: 0,
      Category: "Televisions",
      IconSrc: "tv.svg",
    },
  ];

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
              dataField: "Content",
              editorOptions: {
                // readOnly: false,
                // placeholder: t("Input"),
                // height: 340,
                // maxLength: 200,
              },
              render: () => {
                return (
                  <HtmlEditor
                    height="340px"
                    // defaultValue={markup}
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
              caption: t("Content"),
              visible: true,
            },
            {
              dataField: "uploadFiles", // file đính kèm
              caption: t("uploadFiles"),
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
            },
            {
              dataField: "ContentSumary",
              editorOptions: {
                readOnly: false,
                placeholder: t("Input"),
                height: 70,
                maxLength: 200,
              },
              editorType: "dxTextArea",
              caption: t("ContentSumary"),
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
              dataField: "Status",
              editorOptions: {
                placeholder: t("Select"),
              },
              editorType: "dxSelectBox",
              caption: t("Status"),
              visible: true,
            },
            {
              dataField: "ShareType",
              editorOptions: {
                placeholder: t("Select"),
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
                return <TagboxCustom data={dataTagbox} />;
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
    Title: "abc",
  };
  return (
    <AdminContentLayout className={"Post_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart onAddNew={handleAddNew} searchCondition={{}}></HeaderPart>
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
                formData={dataform}
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
                ref={validateRef}
                validationGroup="PostData"
                onInitialized={(e) => {
                  validateRef.current = e.component;
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
