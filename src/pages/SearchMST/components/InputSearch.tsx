import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  checkIconAtom,
  dataSearchAtom,
  keySearchAtom,
  showInputhAtom,
} from "./store";
import { useNetworkNavigate } from "@/components/useNavigate";
import { useQuery } from "@tanstack/react-query";
import SearchHistory from "./SearchHistory";
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export default function InputSearch(hidenInput: any) {
  const { t } = useI18n("SearchMST");
  const [searchVoice, setSearchVoice] = useState("inActive");
  const { pathname, search } = useLocation();
  const tabResults = pathname.split("/").pop();
  const [searchTerm, setSearchTerm] = useState("");
  const [dataSearch, setDataSearch] = useAtom(dataSearchAtom);
  const [searchQuery, setKeySearch] = useAtom(keySearchAtom);
  const navigate = useNetworkNavigate();
  const api = useClientgateApi();
  const [select, setSelect] = useState(
    t(`Say 'Lookup igoss' to start a voice search`)
  );

  const handleSpeechRecognition = async () => {
    setSearchVoice("Active");
    const recognition = new ((window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition)();
    // recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;

      setKeySearch(transcript);
      if (transcript) {
        const response = await api.KB_PostData_SearchKeyWord(transcript);
        if (response.isSuccess) {
          setDataSearch(response?.Data);
          navigate("search/SearchInformation/Results");
          return response.Data;
        }
      }
    };

    recognition.onend = () => {
      recognition.stop();
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setSelect(t(`Không nhận dạng được giọng nói! Vui lòng thử lại...!`));
    };
  };

  const [nav, setMapItems] = useState([
    {
      id: 2,
      title: t("History"),
      icon: "/images/icons/search.svg",
      pathName: "/search/SearchInformation/History",
      active: tabResults === "SearchInformation" ? true : false,
    },
    {
      id: 3,
      title: t("Category"),
      icon: "/images/icons/search.svg",
      pathName: "/search/SearchInformation/Category",
      active: false,
    },
  ]);

  const handleItemClick = (itemId: any) => {
    const updatedMapItems = nav.map((item) => {
      if (item.title === itemId.split("/").pop()) {
        return { ...item, active: true };
      }

      return { ...item, active: false };
    });
    setMapItems(updatedMapItems);
  };
  useEffect(() => {
    if (tabResults === "Results") {
      const updatedMapItems = nav.map((item) => {
        return { ...item, active: false };
      });
      setMapItems(updatedMapItems);
    }
  }, [tabResults]);

  const handleKeyPress = async (event: any) => {
    if (event.key === "Enter") {
      const resp = await api.KB_PostData_SearchKeyWord(searchTerm);
      if (resp.isSuccess) {
        setDataSearch(resp?.Data);
        navigate("search/SearchInformation/Results");
      }
      setKeySearch(searchTerm);
    }
  };
  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (searchVoice === "Active") {
      // console.log(searchVoice);
      setSelect(t(`Please say`));
    }
    if (searchQuery !== "" && tabResults === "Results") {
      setSelect(t(`Looking for: "${searchQuery}"`));
    }
  }, [searchVoice, tabResults]);

  return (
    <div className="flex justify-center ">
      <div>
        <div
          className={`${
            tabResults === "Results" ? "hidden" : ""
          } w-[250px] m-auto`}
        >
          <img
            src="https://igoss.ecore.vn/Content/images/myigoss_bg.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={` ${
            tabResults === "Results" ? "mt-3" : ""
          }  border h-[44px] w-[600px] m-auto rounded-lg shadow-md`}
        >
          <div className={`flex items-center justify-between px-[12px]`}>
            <div
              className={`flex  ${
                hidenInput ? "" : "hidden"
              } items-center h-[43px]`}
            >
              <div className="h-[15px] w-[15px] ">
                <img
                  src="/images/icons/search.svg"
                  alt=""
                  className="h-full w-full"
                />
              </div>
              <input
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
                defaultValue={tabResults === "Results" ? searchQuery : ""}
                type="text"
                placeholder={t("Search")}
                className="w-[530px] SearchMST-input border-none focus:rounded-xl outline-none "
              />
            </div>
            <div
              className="h-[20px] w-[15px] cursor-pointer"
              onClick={handleSpeechRecognition}
            >
              <img
                src="/images/icons/micro.png"
                alt=""
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
        <div className="text-center py-3">{select}</div>
        <div className="flex items-center justify-center gap-3 mb-[30px]">
          {tabResults === "Results" ? (
            <NavNetworkLink to={"/search/SearchInformation/Results"}>
              <div
                className={`${
                  tabResults === "Results"
                    ? `bg-[#EAF9F2] text-[#63be95] border-[#a4e6c8]`
                    : ""
                } hover:bg-[#EAF9F2] hover:border-[#a4e6c8] hover:text-[#63be95] flex items-center border-[2px] rounded-md gap-1 px-2 py-[7px] cursor-pointer`}
              >
                <div className="h-[15px] w-[15px]">
                  <img
                    src={"/images/icons/search.svg"}
                    alt=""
                    className="h-full w-full"
                  />
                </div>
                <div>{t("Search Results")}</div>
              </div>
            </NavNetworkLink>
          ) : (
            ""
          )}
          {nav.map((item) => {
            return (
              <NavNetworkLink to={item.pathName}>
                <div
                  onClick={() => handleItemClick(item.pathName)}
                  key={item.id}
                  className={`${
                    item.active || tabResults === item.title
                      ? "bg-[#EAF9F2] text-[#63be95] border-[#a4e6c8]"
                      : ""
                  } hover:bg-[#EAF9F2] flex items-center border-[2px] hover:text-[#63be95] rounded-md gap-1 px-2 py-[7px] cursor-pointer hover:border-[#a4e6c8]`}
                >
                  <div className="h-[15px] w-[15px]">
                    <img src={item.icon} alt="" className="h-full w-full" />
                  </div>
                  <div>{item.title}</div>
                </div>
              </NavNetworkLink>
            );
          })}
        </div>
        {tabResults === "SearchInformation" ? <SearchHistory /> : ""}
      </div>
    </div>
  );
}
