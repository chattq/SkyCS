import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox, TextBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { valueIDZNSAtom } from "../../store";

export default function UiZNS({
  item,
  listMstBulletinType,
  key,
  setLocalState,
  onChange,
}: any) {
  const { t } = useI18n("Content_Managent");
  const [valueSelect, setValueSelect] = useState(undefined);

  const api = useClientgateApi();
  const { data: listSubmissionForm } = useQuery(["listSubmissionForm"], () =>
    api.Mst_SubmissionForm_GetAllActive()
  );

  const handleChangeValue = (value: any, name: any, valueSelect: any) => {
    const obj = {
      [name]: {
        SourceDataType: valueSelect,
        ParamSFCode: value,
        ParamSFCodeZNS: item.name,
      },
    };
    onChange(obj);
  };
  return (
    <div className="flex justify-between mt-3" key={key}>
      <div>
        <TextBox readOnly={true} value={item.name} />
      </div>
      <div>
        <SelectBox
          dataSource={listMstBulletinType || []}
          displayExpr="SourceDataTypeName"
          valueExpr="SourceDataType"
          readOnly={false}
          onValueChanged={(e) => setValueSelect(e.value)}
        />
      </div>
      <div>
        {valueSelect === "INPUT" ? (
          <TextBox
            placeholder={t("Nhập")}
            onValueChanged={(e) =>
              handleChangeValue(e.value, item.name, valueSelect)
            }
          />
        ) : (
          <SelectBox
            items={listSubmissionForm?.DataList || []}
            placeholder={
              valueSelect === undefined
                ? t("Vui lòng chọn dữ liệu")
                : t("Select")
            }
            displayExpr="ParamSFName"
            valueExpr="ParamSFCode"
            searchEnabled={true}
            onValueChanged={(e) =>
              handleChangeValue(e.value, item.name, valueSelect)
            }
            defaultValue={listSubmissionForm?.DataList[0].ParamSFCode}
            readOnly={valueSelect === undefined ? true : false}
          />
        )}
      </div>
    </div>
  );
}
