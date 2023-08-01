import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { useAtomValue } from "jotai";
import React, { useEffect } from "react";
import { dataSearchAtom, keySearchAtom } from "./store";
import { useClientgateApi } from "@/packages/api";
import { authAtom } from "@/packages/store";
import { formatText } from "@/pages/Post_Manager/components/components/FormatCategory";
import { ScrollView } from "devextreme-react";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { useNavigate } from "react-router-dom";
import { useNetworkNavigate } from "@/packages/hooks";

export default function SearchResults() {
  const { t } = useI18n("SearchMST");
  const windowSize = useWindowSize();
  const auth = useAtomValue(authAtom);
  const keySearch = useAtomValue(keySearchAtom);
  const dataSearch = useAtomValue(dataSearchAtom);
  const api = useClientgateApi();
  const handleLastView = async (item: any) => {
    const resp = await api.KB_Post_UpdateLastView({
      KB_Post: {
        PostCode: item,
        OrgID: auth.orgId,
      },
    });
  };
  const navigate = useNetworkNavigate();
  useEffect(() => {
    if (dataSearch === null) {
      navigate("/search/SearchInformation");
    }
  }, [dataSearch]);

  return (
    <div>
      <div className="font-bold border-b pb-3 px-4 text-[15px]">
        {t(`Kết quả tìm kiếm cho từ khóa: "${keySearch ?? keySearch}"`)}
      </div>
      <div>
        {dataSearch === undefined ? (
          <div className="mt-[145px] text-center">{t("Không có dữ liệu")}</div>
        ) : (
          dataSearch?.Lst_KB_Post?.map((item: any, index: any) => {
            return (
              <div
                key={index}
                className=" hover:bg-[#EAF9F2] px-6 cursor-pointer search_history-bg"
              >
                <div className="py-[16px]">
                  <div className=" ">
                    <div>
                      <NavNetworkLink
                        to={`/search/SearchInformation/Detail/${item.PostCode}`}
                      >
                        <div
                          className="text-[14px] search_history-title font-bold line-clamp-2"
                          onClick={() => handleLastView(item?.PostCode)}
                        >
                          {item.Title}
                        </div>
                        <div className="flex justify-between mt-[12px]">
                          <div
                            className="line-clamp-2 text-[14px] text-black"
                            dangerouslySetInnerHTML={{
                              __html: formatText(
                                item?.Detail,
                                100000000000
                              ).replace(
                                new RegExp(keySearch, "gi"),
                                (match: any) =>
                                  `<mark className="Search_key_mark">${match}</mark>`
                              ),
                            }}
                          ></div>
                        </div>
                      </NavNetworkLink>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
