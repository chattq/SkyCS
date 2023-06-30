import { useI18n } from "@/i18n/useI18n";
import { CheckBox } from "devextreme-react";
import React from "react";

export default function Zalo_channel({ data, setFlagZalo }: any) {
  const { t } = useI18n("Omi_Chanel");
  const handleFlagZalo = (e: any) => {
    setFlagZalo.current = e.value;
  };
  return (
    <div className="ml-6">
      <div className="ml-5 mt-3">
        <div className="flex items-center gap-3">
          <div className="h-[50px] w-[50px] rounded-full overflow-hidden">
            <img
              src="https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            {t("ZaloOAID")}:{" "}
            <span className="font-bold">
              {data?.ZaloOAID ? data?.ZaloOAID : t("Đang cập nhật")}
            </span>{" "}
          </div>
        </div>
        <button className="bg-[#ffc107] px-2 py-1 mt-4 rounded hover:bg-[#098850] hover:text-[#fff]">
          {t("Disconnect")}
        </button>
      </div>
      <div className="mt-5">
        <div className="font-bold">Cấu hình nội dung gửi</div>
        <div className="ml-5 mt-5 flex items-center">
          <CheckBox
            defaultValue={data?.FlagIsCreateET === "1" ? true : false}
            onValueChanged={(e: any) => handleFlagZalo(e)}
          />
          <div className="ml-3">
            {t("Tự động tạo eTicket khi nhận được tin nhắn đến Zalo OA")}
          </div>
        </div>
      </div>
    </div>
  );
}
