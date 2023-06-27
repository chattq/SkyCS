import { useI18n } from "@/i18n/useI18n";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SearchDetail() {
  const { t } = useI18n("SearchMST");
  const navigate = useNavigate();
  return (
    <div>
      <div className="px-[16px] py-[14px]">
        <div className="flex gap-2 items-center">
          <div className="h-[15px] cursor-pointer" onClick={() => navigate(-1)}>
            <img
              src="/images/icons/arrow_back.png"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="line-clamp-2 text-[16px] font-medium">
            {t(
              "Lưu ý quan trọng dành cho các doanh nghiệp còn sử dụng hóa đơn giấy? Và các doanh nghiệp cần lưu ý gì khi chọn Tổ chức (phần mềm) cung cấp hóa đơn điện tử?"
            )}
          </div>
        </div>
        <div className="mt-1 flex gap-2 items-center">
          <div className="flex">
            <div className="h-[15px]">
              <img
                src="/images/icons/search.svg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="line-clamp-2 ml-[12px]">{t("Trịnh Quang")}</div>
          </div>
          <div className="border-r-[2px] border-l-[2px] px-3">05/09/2002</div>
          <div className="px-2">
            Hỗ trợ hỏi đáp Qinvoice, Hỗ trợ tạo hóa đơn điện tử
          </div>
        </div>
        <div className="flex justify-between justify-center">
          <div>tag</div>
          <div className="flex gap-1 items-center bg-red-600 px-1 py-[7px] rounded">
            <div>
              <img src="/images/icons/search.svg" alt="" />
            </div>
            <div className="text-white">{t("Report needs fixing")}</div>
          </div>
        </div>
      </div>
      <div>nội dung</div>
    </div>
  );
}
