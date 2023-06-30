import { useI18n } from "@/i18n/useI18n";
import { CheckBox } from "devextreme-react";
import React from "react";

export default function Email_Channel({ data, setFlagEmail }: any) {
  const { t } = useI18n("Omi_Chanel");
  const handleFlagEmail = (e: any) => {
    setFlagEmail.current = e.value;
  };
  return (
    <div className="ml-6 mt-4">
      <div>
        <div className="font-bold">Cấu hình kết nối</div>
        <div className="ml-5 mt-5">
          <div>
            {t("MailForm")}:{" "}
            <span className="font-bold">
              {data?.MailFrom ? data?.MailFrom : t("Đang cập nhật")}
            </span>
          </div>
          <div className="mt-2">
            {t("DisplayNameMailFrom")}:{" "}
            <span className="font-bold">
              {data?.DisplayNameMailFrom
                ? data?.DisplayNameMailFrom
                : t("Đang cập nhật")}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="font-bold">Cấu hình nội dung gửi</div>
        <div className="ml-5 mt-5 flex items-center">
          <CheckBox
            defaultValue={data?.FlagIsCreateET === "1" ? true : false}
            onValueChanged={(e: any) => handleFlagEmail(e)}
          />
          <div className="ml-3">
            {t("Tự động tạo eTicket khi nhận được email")}
          </div>
        </div>
      </div>
    </div>
  );
}
