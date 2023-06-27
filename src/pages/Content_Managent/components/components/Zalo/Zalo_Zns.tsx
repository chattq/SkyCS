import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";

// import SelectBox from "devextreme-react/select-box";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { valueIDAtom, valueIDZNSAtom, zaloTemplatetom } from "../../store";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { SelectBox, TextBox } from "devextreme-react";
import UiZNS from "./UiZNS";

export default function Zalo_Zns({ formRef }: any) {
  const { t } = useI18n("Zalo_Parent");
  const validateRef = useRef<any>();

  const api = useClientgateApi();
  const zaloTemplate = useAtomValue(zaloTemplatetom);
  const { data: listMstBulletinType } = useQuery(["listMstSourceData"], () =>
    api.Mst_SourceData_GetAllActive()
  );
  const valueIDZNS = useAtomValue(valueIDZNSAtom);
  const handleSave = (data: any) => {
    const newState = {
      ...valueIDZNS,
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
        <div className="flex justify-between">
          <div>{t("Tham số Zalo ZNS")}</div>
          <div>{t("Nguồn dữ liệu")}</div>
          <div>{t("Giá trị")}</div>
        </div>
        {zaloTemplate?.listParams?.map((item: any, index: any) => {
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
          src={zaloTemplate.previewUrl}
          width="400px"
          height="auto"
        ></iframe>
      </div>
    </div>
  );
}
