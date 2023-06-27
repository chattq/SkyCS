import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";

import { Form } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../list/Content_Managent.scss";
import { useNavigate } from "react-router-dom";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { valueIDAtom, valueIDZNSAtom, zaloTemplatetom } from "../store";
import { useQuery } from "@tanstack/react-query";
import { showErrorAtom } from "@/packages/store";
import Zalo_Parent from "./Zalo_Parent";
import Content_SMS from "./Content_SMS";
import Content_Email from "./Content_Email";
import { toast } from "react-toastify";

export default function Content_Edit() {
  const { t } = useI18n("Content_Edit");
  const navigate = useNavigate();
  const validateRef = useRef<any>();
  const formRef = useRef<any>();
  const [formData, setFormData] = useState({});
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const [valueSelect, setValueSelect] = useState("");
  const [valueID, setValueID] = useAtom(valueIDAtom);
  const [saveFormType, setSaveFormType] = useState("");

  const setZaloTemplateAtom = useSetAtom(zaloTemplatetom);
  const dataTabChanel = [
    {
      id: "ZALO",
      component: <Zalo_Parent formRef={validateRef} />,
    },
    {
      id: "SMS",
      component: <Content_SMS formRef={validateRef} />,
    },
    {
      id: "EMAIL",
      component: <Content_Email formRef={validateRef} />,
    },
  ];
  const [listZNS, setListZNS] = useState<any>();
  const outlet = dataTabChanel?.filter((item: any) => {
    if (item?.id === valueSelect) {
      return item?.component;
    }
  })[0]?.component;
  const { data: listMstChannelType } = useQuery(["listMstChannelType"], () =>
    api.MstChannelType_GetAllActive()
  );
  const { data: listMstBulletinType } = useQuery(["listMstBulletinType"], () =>
    api.MstBulletinType_GetAllActive()
  );
  const { data: listGetByTemplate } = useQuery(["listGetByTemplate"], () =>
    api.ZaloTemplate_GetByTemplate()
  );

  useEffect(() => {
    if (listGetByTemplate?.Data) {
      setListZNS([
        { templateName: "---", templateId: "" },
        ...listGetByTemplate?.Data,
      ]);
    }
  }, [listGetByTemplate?.Data]);

  const formSettings: any = [
    {
      colCount: 2,
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
              dataField: "SubFormCode",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("SubFormCode"),
              },
              editorType: "dxTextBox",
              caption: t("SubFormCode"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "ChannelType",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: listMstChannelType?.DataList || [],
                displayExpr: "ChannelTypeName",
                valueExpr: "ChannelType",
                onValueChanged: (e: any) => setSaveFormType(e.value),
              },
              editorType: "dxSelectBox",
              caption: t("ChannelType"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "IDZNS",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: listZNS,
                displayExpr: "templateName",
                valueExpr: "templateId",
                onValueChanged: async (e: any) => {
                  if (e.value !== "") {
                    const resp = await api.ZaloTemplate_GetByTemplateId(
                      e.value
                    );
                    if (resp.isSuccess) {
                      setValueID(true);
                      setZaloTemplateAtom(resp.Data);
                    } else {
                      showError({
                        message: t(resp.errorCode),
                        debugInfo: resp.debugInfo,
                        errorInfo: resp.errorInfo,
                      });
                    }
                  } else {
                    setValueID(false);
                  }
                },
              },
              editorType: "dxSelectBox",
              caption: t("IDZNS"),
              visible: false,
            },
          ],
        },
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 1,
          cssClass: "",
          items: [
            {
              dataField: "SubFormName",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("SubFormName"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "BulletinType",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: listMstBulletinType?.DataList || [],
                valueExpr: "BulletinType",
                displayExpr: "BulletinTypeName",
              },
              editorType: "dxSelectBox",
              caption: t("BulletinType"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "FlagActive",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxSwitch",
              caption: t("FlagActive"),
              visible: true,
            },
          ],
        },
      ],
    },
  ];
  const handleSubmitPopup = async (e: any) => {
    validateRef.current.instance.validate();
    const dataForm = new FormData(formRef.current);
    const dataSaveForm: any = Object.fromEntries(dataForm.entries());
    const formData = validateRef.current.instance.option("formData");
    if (
      formData.BulletinType !== "" &&
      formData.ChannelType !== "" &&
      formData.SubFormCode !== "" &&
      formData.SubFormName !== ""
    ) {
      if (valueID === true && saveFormType === "ZALO") {
        const newData = Object.entries(formData.strJsonZNS || {}).map(
          ([key, value]: any) => {
            return {
              SubFormCode: dataSaveForm.SubFormCode ?? "",
              ParamValue: null,
              ...value,
            };
          }
        );
        const dataSave = {
          ...dataSaveForm,
          FlagActive: dataSaveForm.FlagActive === true ? "1" : "0",
          ...{ strJsonZNS: JSON.stringify(newData) },
        };
        const resp = await api.MstSubmissionForm_Save(dataSave);
        if (resp.isSuccess) {
          toast.success(t("Create Successfully"));
          // await refetch();
          return true;
        }
        showError({
          message: t(resp.errorCode),
          debugInfo: resp.debugInfo,
          errorInfo: resp.errorInfo,
        });
        throw new Error(resp.errorCode);
      }
      if (valueID === false && saveFormType === "ZALO") {
        const dataSave = {
          ...dataSaveForm,
          FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
          IDZNS: "",
          ...{
            strJsonMessage: JSON.stringify([
              {
                SubFormCode: dataSaveForm.SubFormCode,
                Message: formData.MessageZalo ?? "",
              },
            ]),
          },
        };
        const resp = await api.MstSubmissionForm_Save(dataSave);
        if (resp.isSuccess) {
          toast.success(t("Create Successfully"));
          // await refetch();
          return true;
        }
        showError({
          message: t(resp.errorCode),
          debugInfo: resp.debugInfo,
          errorInfo: resp.errorInfo,
        });
        throw new Error(resp.errorCode);
      }
      if (valueID === false && saveFormType === "SMS") {
        const dataSave = {
          ...dataSaveForm,
          IDZNS: "",
          FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
          ...{
            strJsonMessage: JSON.stringify([
              {
                SubFormCode: dataSaveForm.SubFormCode,
                Message: formData.MessageSMS ?? "",
              },
            ]),
          },
        };
        const resp = await api.MstSubmissionForm_Save(dataSave);
        if (resp.isSuccess) {
          toast.success(t("Create Successfully"));
          // await refetch();
          return true;
        }
        showError({
          message: t(resp.errorCode),
          debugInfo: resp.debugInfo,
          errorInfo: resp.errorInfo,
        });
        throw new Error(resp.errorCode);
      }
      if (valueID === false && saveFormType === "EMAIL") {
        const dataSave = {
          ...dataSaveForm,
          IDZNS: "",
          FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
          ...{
            strJsonMessage: JSON.stringify([
              {
                SubFormCode: dataSaveForm.SubFormCode,
                SubTitle: formData.MessageTitleEmail ?? "",
                Message: formData.MessageEmail ?? "",
              },
            ]),
          },
        };
        const resp = await api.MstSubmissionForm_Save(dataSave);
        if (resp.isSuccess) {
          toast.success(t("Create Successfully"));
          // await refetch();
          return true;
        }
        showError({
          message: t(resp.errorCode),
          debugInfo: resp.debugInfo,
          errorInfo: resp.errorInfo,
        });
        throw new Error(resp.errorCode);
      }
    }
  };

  const customizeItem = useCallback(
    (item: any) => {
      if (["IDZNS"].includes(item.dataField)) {
        if (valueSelect === "ZALO") {
          item.visible = true;
        }
        // console.log(126, value);
      }
      if (item.dataField === "FlagActive") {
        item.editorOptions.value = true;
      }
    },
    [valueSelect]
  );

  const handleFieldDataChanged = useCallback((changedData: any) => {
    // Handle the changed field data
    if (changedData.dataField === "ChannelType") {
      setValueSelect(changedData.value);
    }
    // if (changedData.dataField === "IDZNS") {
    //   setIdZNS(changedData.value);
    // }
  }, []);

  return (
    <AdminContentLayout className={"Content_Managent"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="flex gap-2 justify-end w-full px-4 py-1">
          <div
            className="cursor-pointer px-4 py-[7px] rounded border-[#078850] font-semibold border-[2px] shadow-lg bg-[#078850] text-white"
            onClick={handleSubmitPopup}
          >
            {t("Save")}
          </div>
          <div
            className="cursor-pointer px-4 py-[7px] rounded font-semibold border-[2px] shadow-md bg-white text-black"
            onClick={() => navigate(-1)}
          >
            {t("Cancel")}
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div>
          <form action="" ref={formRef} onSubmit={handleSubmitPopup}>
            <div className="flex mx-5 my-2 gap-5">
              <div className="w-full">
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
                    .map((value: any, index: any) => {
                      return (
                        <GroupItem key={index} colCount={value.colCount}>
                          {value.items.map((items: any, index: any) => {
                            return (
                              <GroupItem key={index} colSpan={items.colSpan}>
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
              </div>
            </div>
            {outlet}
          </form>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
}
