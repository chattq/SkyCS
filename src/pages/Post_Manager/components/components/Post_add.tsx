import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { ContentSearchPanelLayout } from "@/packages/layouts/content-searchpanel-layout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HeaderPart } from "../header-part";
import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";
import { Button, Form, TagBox } from "devextreme-react";
import { GroupItem, Item, SimpleItem } from "devextreme-react/form";
import TreeView from "devextreme-react/tree-view";

import HtmlEditor, {
  Toolbar,
  MediaResizing,
  ImageUpload,
  Item as ItemEditor,
} from "devextreme-react/html-editor";
import TagboxCustom from "./TagboxCustom";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { currentInfo, refechAtom } from "../store";
import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, showErrorAtom } from "@/packages/store";
import { format } from "date-fns";
import { getYearMonthDate } from "@/components/ulti";
import { transformCategory } from "./FormatCategory";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";

export default function Post_add() {
  const { t } = useI18n("Post_Manager");
  const formData = useAtomValue(currentInfo);
  const api = useClientgateApi();
  const validateRef = useRef<any>();
  const formRef = useRef<any>();
  const formRef2 = useRef<any>();
  const treeViewRef = useRef<any>();
  const auth = useAtomValue(authAtom);
  const showError = useSetAtom(showErrorAtom);
  const setRefech = useSetAtom(refechAtom);

  const PostStatus = [
    { text: t("Published"), value: "PUBLISHED" },
    { text: t("Draft"), value: "DRAFT" },
  ];
  const shareType = [
    { text: t("Organization"), value: "ORGANIZATION" },
    { text: t("Network"), value: "NETWORK" },
    { text: t("Private"), value: "PRIVATE" },
  ];
  const navigate = useNavigate();

  const { data: dataTagbox, refetch } = useQuery(["dataTagbox"], () =>
    api.Mst_Tag_GetAllActive()
  );
  const { data: dataCategory } = useQuery(["dataCategory"], () =>
    api.KB_Category_GetAllActive()
  );
  const handleAddNew = async () => {
    const formData = validateRef.current.instance.option("formData");
    const formData2 = formRef2.current.instance.option("formData");
    const resp = await api.Mst_Tag_GetAllActive();
    const newTag = resp?.Data?.Lst_Mst_Tag?.filter((item: any) =>
      formData2?.Tags?.includes(item?.TagName)
    );
    const dataSave = {
      KB_Post: {
        PostCode: "",
        OrgID: auth.orgId.toString(),
        Detail: formData.Detail ?? "",
        Title: formData.Title ?? "",
        Synopsis: formData.Synopsis ?? "",
        ShareType: formData2.ShareType ?? "",
        FlagShare: "1",
        PostStatus: formData2.PostStatus ?? "",
      },
      Lst_KB_PostCategory: formData2?.Category
        ? formData2?.Category.map((item: any) => ({
            CategoryCode: item?.CategoryCode ?? "",
          }))
        : [],
      Lst_KB_PostTag: newTag
        ? newTag?.map((item: any) => ({
            TagID: item.TagID,
          }))
        : [],
      Lst_KB_PostAttachFile: formData?.UploadFiles
        ? formData?.UploadFiles.map((item: any, index: any) => ({
            Idx: (index + 1)?.toString(),
            FileName: item?.FileFullName,
            FilePath: item?.FileUrlFS,
            FileType: item?.FileType,
          }))
        : [],
    };
    const respDataSave = await api.KB_PostData_Create(dataSave);
    if (respDataSave.isSuccess) {
      toast.success(t("Create Successfully"));
      setRefech(true);
      navigate(`/${auth.networkId}/admin/Post_Manager`);
      // await refetch();
      return true;
    }
    showError({
      message: t(resp.errorCode),
      debugInfo: resp.debugInfo,
      errorInfo: resp.errorInfo,
    });
    throw new Error(resp.errorCode);
  };
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
              editorOptions: {},
              render: (param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <HtmlEditor
                    height="340px"
                    // defaultValue={markup}
                    valueType={"html"}
                    onValueChanged={(e) => {
                      formComponent.updateData(dataField, e.value);
                    }}
                  >
                    <MediaResizing enabled={true} />
                    <ImageUpload fileUploadMode="base64" />
                    <Toolbar

                    // multiline={this.state.isMultiline}
                    >
                      <ItemEditor name="undo" />
                      <ItemEditor name="redo" />
                      <ItemEditor name="separator" />
                      <ItemEditor name="size" acceptedValues={sizeValues} />
                      <ItemEditor name="font" acceptedValues={fontValues} />
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
                maxLength: 400,
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
              dataField: "Category",
              label: { text: "Quản lý danh mục" },
              editorOptions: {
                placeholder: t("Input Select"),
              },
              render: (param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <TreeView
                    id="treeview"
                    displayExpr="CategoryName"
                    ref={treeViewRef}
                    width={"100%"}
                    scrollDirection="vertical"
                    showCheckBoxesMode="normal"
                    selectionMode="multiple"
                    className="max-h-[190px] overflow-y-auto"
                    // onSelectionChanged={(e) => {
                    //   formComponent.updateData("Category", e);
                    // }}
                    items={transformCategory(
                      dataCategory?.Data?.Lst_KB_Category
                    )}
                    onSelectionChanged={(e) => {
                      formComponent.updateData(
                        "Category",
                        e.component
                          .getSelectedNodes()
                          .map((node: any) => node.itemData)
                      );
                    }}
                  />
                );
              },
            },
            {
              dataField: "Tags",
              caption: t("Tags"),
              label: {
                text: "Tags",
              },
              visible: true,
              render: (param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <TagboxCustom
                    formComponent={formComponent}
                    data={dataTagbox?.Data?.Lst_Mst_Tag}
                  />
                );
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
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="flex gap-3 items-center">
              <div
                className="font-bold dx-font-m hover:underline cursor-pointer hover:text-green-600"
                onClick={() => navigate(-1)}
              >
                {t("Post Manager")}
              </div>
              <div className="">{">"}</div>
              <div className="font-bold dx-font-m">{t("Post add")}</div>
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot name={"After"}>
            <Button
              stylingMode={"contained"}
              type="default"
              text={t("Add new")}
              onClick={handleAddNew}
            />
            <Button
              stylingMode={"contained"}
              type="default"
              className="Cancel_Post_Detail"
              text={t("Cancel")}
              onClick={() => navigate(-1)}
            />
          </PageHeaderNoSearchLayout.Slot>
        </PageHeaderNoSearchLayout>
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
                formData={{}}
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
