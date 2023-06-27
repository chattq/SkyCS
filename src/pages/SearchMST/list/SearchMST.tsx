import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  BaseGridView,
  ColumnOptions,
  GridViewPopup,
} from "@packages/ui/base-gridview";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useI18n } from "@/i18n/useI18n";

import SearchHistory from "../components/SearchHistory";
import SearchCategory from "../components/SearchCategory";
import SearchDetail from "../components/SearchDetail";
import NavNetworkLink from "@/components/Navigate";
import InputSearch from "../components/InputSearch";
import { useLocation } from "react-router-dom";

const isSpeechRecognitionSupported = () =>
  "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

interface Window {
  webkitSpeechRecognition: any;
}

export const SearchMSTPage = () => {
  const { t } = useI18n("SearchMST");

  const [checkSearchService, setCheckSearchService] = useState("History");
  const [searchVoice, setSearchVoice] = useState("inActive");
  const [searchText, setSearchText] = useState("");
  // const handleVoiceSearch = () => {
  //   setSearchVoice("Active");
  //   const recognition =
  //     window.webkitSpeechRecognition || window.SpeechRecognition;
  //   const recognitionInstance = new recognition();

  //   recognitionInstance.onresult = (event: any) => {
  //     console.log(event);
  //     const transcript = event.results[0][0].transcript;
  //     setSearchText(transcript);
  //   };

  //   recognitionInstance.start();
  // };
  // console.log(searchText);

  return (
    <AdminContentLayout className={"SearchMST"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div>Thêm mới</div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <InputSearch />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
