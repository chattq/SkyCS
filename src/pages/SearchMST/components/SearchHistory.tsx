import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import React from "react";
import InputSearch from "./InputSearch";

export default function SearchHistory() {
  const { t } = useI18n("SearchMST");
  return (
    <AdminContentLayout className={"SearchMST"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div>Thêm mới</div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <InputSearch />
        <div className="mt-[27px] m-auto w-[853px] hover:bg-[#EAF9F2] cursor-pointer">
          <div className="w-[740px] border-b m-auto border-[#E3EBF1] py-[16px]">
            <div className="flex justify-center gap-2 ">
              <div className="h-[15px]">
                <img
                  src="/images/icons/lock.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <NavNetworkLink to="/admin/SearchMST/Detail">
                  <div className="text-[14px] w-[711px] search_history-title font-bold line-clamp-2">
                    {t(
                      "Lưu ý quan trọng dành cho doanh nghiệp còn sử dụng hóa đơn giấy. Doanh nghiệp cần lưu ý gì khi chọn Tổ chức cung cấp hóa đơn điện tử? Doanh nghiệp cần lưu ý gì khi chọn Tổ chức cung cấp hóa đơn điện tử chúng tôi cần nhiều thứ"
                    )}
                  </div>
                </NavNetworkLink>
                <div className="flex justify-between mt-[12px]">
                  <div>{t("Hỗ trợ hỏi đáp Qinvoice, Hỗ trợ tạo hóa đơn")}</div>
                  <div className="flex items-center">
                    <div className="mr-1">{t(`Cập nhật:`)}</div>
                    <div>05/09/2002</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
}
