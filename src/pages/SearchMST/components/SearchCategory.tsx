import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { ScrollView, TreeView } from "devextreme-react";
import React, { useState } from "react";
import InputSearch from "./InputSearch";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { useAtomValue } from "jotai";
import { dataSearchAtom } from "./store";
import { transformCategory } from "@/pages/Post_Manager/components/components/FormatCategory";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { authAtom } from "@/packages/store";

export default function SearchCategory() {
  const { t } = useI18n("SearchMST");
  const api = useClientgateApi();
  const { data, isLoading, refetch } = useQuery(["Post_Manager_History"], () =>
    api.KB_PostData_SearchMore("")
  );
  const auth = useAtomValue(authAtom);
  const [keyCategory, setkeyCategory] = useState<any>([]);
  const { data: dataCategory } = useQuery(
    ["Post_Manager_Category", keyCategory],
    () => api.KB_PostData_GetByCategoryCode(keyCategory, auth.orgId)
  );

  const selectItem = (e: any) => {
    setkeyCategory(e.node.key);
  };

  const handleLastView = async (item: any) => {
    await api.KB_Post_UpdateLastView({
      KB_Post: {
        PostCode: item,
        OrgID: auth.orgId,
      },
    });
  };

  return (
    <div className="w-full">
      <div className="flex mt-[27px] justify-center">
        <ScrollView height={320} showScrollbar="always">
          <div className="mt-[2px]">
            <TreeView
              displayExpr="CategoryName"
              keyExpr="CategoryCode"
              id="simple-treeview"
              items={transformCategory(data?.Data?.Lst_KB_Category)}
              width={250}
              onItemClick={selectItem}
              activeStateEnabled={true}
              expandNodesRecursive={false}
            />
          </div>
        </ScrollView>
        <div>
          {dataCategory?.Data === undefined ? (
            <div className="w-[780px] text-center py-[16px]">
              {t("No Data")}
            </div>
          ) : (
            <div className="border-l max-h-[320px] w-[780px] overflow-y-scroll">
              {dataCategory?.Data?.KB_Post?.map((item: any, index: any) => {
                return (
                  <div key={index}>
                    <div className="px-2 hover:bg-[#EAF9F2] cursor-pointer search_history-bg">
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
                              to={`/search/SearchInformation/Detail/${item.PostCode}`}
                            >
                              <div
                                className="text-[14px] w-[711px] search_history-title font-bold line-clamp-2"
                                onClick={() => handleLastView(item.PostCode)}
                              >
                                {item.Title}
                              </div>
                            </NavNetworkLink>
                            <div className="flex justify-between mt-[12px]">
                              <div>
                                {item.kbc_CategoryName
                                  ? item.kbc_CategoryName
                                  : null}
                              </div>
                              <div className="flex items-center">
                                <div className="mr-1">{t(`Cập nhật:`)}</div>
                                <div>
                                  {item.LogLUDTimeUTC
                                    ? item.LogLUDTimeUTC
                                    : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
