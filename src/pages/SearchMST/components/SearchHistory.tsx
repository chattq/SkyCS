import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import React, { useEffect, useState } from "react";
import InputSearch from "./InputSearch";
import "../list/SearchMST.scss";

import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";

export default function SearchHistory() {
  const { t } = useI18n("SearchMST");
  const api = useClientgateApi();
  const { data, isLoading, refetch } = useQuery(["Post_Manager_History"], () =>
    api.KB_PostData_SearchMore("")
  );
  return (
    <div>
      {data?.Data?.Lst_KB_PostLastView === undefined ? (
        <div className="mt-[145px] text-center">{t("Không có dữ liệu")}</div>
      ) : (
        data?.Data?.Lst_KB_PostLastView?.map((item: any, index: any) => {
          return (
            <div className="m-auto w-[853px] hover:bg-[#EAF9F2] cursor-pointer search_history-bg">
              <div className="w-[740px] border-b m-auto border-[#E3EBF1] py-[16px]">
                <div className="flex justify-center gap-2 ">
                  <div className="h-[15px]">
                    <img
                      src={`/images/icons/${
                        item.ShareType === "PRIVATE"
                          ? "lock.png"
                          : item.ShareType === "NETWORK"
                          ? "ORGANIZATION.png"
                          : item.ShareType === "ORGANIZATION"
                          ? "public.png"
                          : ""
                      }`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <NavNetworkLink
                      to={`/admin/SearchInformation/Detail/${item.PostCode}`}
                    >
                      <div className="text-[14px] w-[711px] search_history-title font-bold line-clamp-2">
                        {item.Title}
                      </div>
                    </NavNetworkLink>
                    <div className="flex justify-between mt-[12px]">
                      <div>
                        {item.kbc_CategoryName ? item.kbc_CategoryName : null}
                      </div>
                      <div className="flex items-center">
                        <div className="mr-1">{t(`Cập nhật:`)}</div>
                        <div>
                          {item.LogLUDTimeUTC ? item.LogLUDTimeUTC : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
