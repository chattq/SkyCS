import { SysUserData } from "@packages/types";
import { atom } from "jotai";
export const selectedItemsAtom = atom<string[]>([]);

export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<SysUserData | undefined>(undefined);
export const showPopup = atom<boolean>(false);
export const showPopupUser = atom<boolean>(false);
export const AvatarData = atom<any>("");
export const showDetail = atom<boolean>(false);
export const dataTableAtom = atom<any>([]);
export const dataFormAtom = atom<any>([]);
export const keywordAtom = atom<string>("");
export const flagEdit = atom<boolean>(false);
export const checkDataPopPup = atom<boolean>(true);
export const avatar = atom<any>(undefined);
export const fileAtom = atom<any>(undefined);

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

interface formValue {
  SLALevel: string;
  SLADesc: string;
  FirstResTime: number;
  ResolutionTime: number;
  SLAStatus: boolean;
}

export const defaultSLAHeaderForm: formValue = {
  SLALevel: "",
  SLADesc: "",
  FirstResTime: -21600000,
  ResolutionTime: -21600000,
  SLAStatus: true,
};

export const headerForm = atom<formValue>(defaultSLAHeaderForm);

interface ticketInfo {
  TicketType: any[];
  TicketCustomType: any[];
  Customer: any[];
  CustomerGroup: any[];
  CustomerEnterprise: any[];
  CustomerEnterpriseGroup: any[];
}

export const defaultTicketInfo: ticketInfo = {
  TicketType: [],
  TicketCustomType: [],
  Customer: [],
  CustomerGroup: [],
  CustomerEnterprise: [],
  CustomerEnterpriseGroup: [],
};

export const ticketInfo = atom<ticketInfo>(defaultTicketInfo);

export const SLA_EditType = atom<string>("detail");
