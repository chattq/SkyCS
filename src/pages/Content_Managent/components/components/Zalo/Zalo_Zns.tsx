import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";

// import SelectBox from "devextreme-react/select-box";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { memo, useContext, useEffect, useRef, useState } from "react";
import {
  checkUIZNSAtom,
  dataFormAtom,
  valueIDAtom,
  valueIDZNSAtom,
  zaloTemplatetom,
} from "../../store";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { SelectBox, TextBox } from "devextreme-react";
import UiZNS from "./UiZNS";
import UiZNSEdit from "./UiZNSEdit";

export default function Zalo_Zns({ formRef, dataForm }: any) {
  const { t } = useI18n("Zalo_Parent");
  const api = useClientgateApi();
  const zaloTemplate = useAtomValue(zaloTemplatetom);
  const checkUiZNS = useAtomValue(checkUIZNSAtom);
  const { data: listMstBulletinType } = useQuery(["listMstSourceData"], () =>
    api.Mst_SourceData_GetAllActive()
  );
  const { data: templateZalo } = useQuery(["templateZalo"], () =>
    api.ZaloTemplate_GetByTemplateId(dataForm?.Lst_Mst_SubmissionForm[0].IDZNS)
  );
  const handleSave = (data: any) => {
    const newState = {
      ...data,
    };

    if (formRef) {
      formRef.current.instance.updateData("strJsonZNS", newState);
    }
  };

  // console.log(30, localState);
  return (
    <div className="flex justify-center gap-[10%] px-6">
      <div className="w-[60%]">
        <div className="my-[20px] bg-lime-200 px-2 py-1 text-[14px]">
          {t("Cấu hình tham số Zalo ZNS")}
        </div>
        <div className="flex justify-between mb-3">
          <div>{t("Tham số Zalo ZNS")}</div>
          <div>{t("Nguồn dữ liệu")}</div>
          <div>{t("Giá trị")}</div>
        </div>
        {checkUiZNS
          ? dataForm?.Lst_Mst_SubmissionFormZNS.map((item: any, index: any) => {
              // console.log(dataForm);
              return (
                <UiZNSEdit
                  onChange={handleSave}
                  // setLocalState={setLocalState}
                  key={index}
                  item={item}
                  listMstBulletinType={listMstBulletinType?.DataList}
                />
              );
            })
          : zaloTemplate?.listParams?.map((item: any, index: any) => {
              return (
                <UiZNS
                  onChange={handleSave}
                  // setLocalState={setLocalState}
                  key={index}
                  item={item}
                  listMstBulletinType={listMstBulletinType?.DataList}
                />
              );
            })}
      </div>
      <div>
        <div className="my-[20px] bg-lime-200 px-2 py-1 text-[14px] text-center">
          {t("Xem trước mẫu")}
        </div>
        <iframe
          className="overflow-hidden"
          src={
            checkUiZNS
              ? templateZalo?.Data?.previewUrl
              : zaloTemplate?.previewUrl
          }
          width="400px"
          height="auto"
        ></iframe>
      </div>
    </div>
  );
}
