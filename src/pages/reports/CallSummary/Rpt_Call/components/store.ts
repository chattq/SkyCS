import { atom } from "jotai";
export const selectedItemsAtom = atom<string[]>([]);
export const keywordAtom = atom<string>("");
import { Rpt_CpnCampaignStatisticCallData } from "@packages/types";

export enum ViewMode {
  Readonly = "readonly",
  Edit = "edit",
}

export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<
  Rpt_CpnCampaignStatisticCallData | undefined
>(undefined);

export const viewingDataAtom = atom(
  (get) => {
    return {
      rowIndex: get(viewingRowAtom),
      item: get(viewingItemAtom),
    };
  },
  (get, set, data) => {
    if (!data) {
      set(viewingRowAtom, undefined);
      set(viewingItemAtom, undefined);
    } else {
      const { rowIndex, item } = data as any;
      set(viewingRowAtom, rowIndex);
      set(viewingItemAtom, item);
    }
  }
);
