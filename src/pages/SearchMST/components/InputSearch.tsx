import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export default function InputSearch() {
  const { t } = useI18n("SearchMST");
  const [searchVoice, setSearchVoice] = useState("inActive");
  const [activeBottom, setActiveBottom] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSpeechRecognition = () => {
    setSearchVoice("Active");
    const recognition = new ((window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition)();
    // recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
    };

    recognition.onend = () => {
      recognition.stop();
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };
  };
  // console.log(searchQuery);

  const nav = [
    {
      id: 1,
      title: t("Search Results"),
      icon: "/images/icons/search.svg",
      pathName: "/admin/SearchMST/Detail",
      active: true,
    },
    {
      id: 2,
      title: t("History"),
      icon: "/images/icons/search.svg",
      pathName: "/admin/SearchMST/History",
      active: true,
    },
    {
      id: 3,
      title: t("Category"),
      icon: "/images/icons/search.svg",
      pathName: "/admin/SearchMST/Category",
      active: true,
    },
  ];

  return (
    <div className="flex justify-center">
      <div>
        <div className="w-[250px] m-auto">
          <img
            src="https://igoss.ecore.vn/Content/images/myigoss_bg.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="border h-[44px] w-[600px] m-auto rounded-lg shadow-md">
          <div className="flex items-center justify-between px-[12px]">
            <div className="flex items-center h-[43px]">
              <div className="h-[15px] w-[15px] ">
                <img
                  src="/images/icons/search.svg"
                  alt=""
                  className="h-full w-full"
                />
              </div>
              <input
                defaultValue={searchQuery}
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
        <div className="text-center py-3">
          {searchQuery === ""
            ? searchVoice === "inActive"
              ? t(`Say 'Lookup igoss' to start a voice search`)
              : t(`Please say`)
            : t(`Looking for: "${searchQuery}"`)}
        </div>
        <div className="flex items-center justify-center gap-3">
          {nav.map((item) => {
            return (
              <NavNetworkLink to={item.pathName}>
                <div
                  key={item.id}
                  className={`${
                    activeBottom ? "bg-[#EAF9F2]" : ""
                  } hover:bg-[#EAF9F2] flex items-center border-[2px] rounded-md gap-1 px-2 py-[7px] cursor-pointer`}
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
      </div>
    </div>
  );
}
