import { atom } from "jotai";

interface holidayDefaultValue {
  id: string;
  Month: number;
  Day: number;
  Event: string;
}

export const holidayListAtom = atom<holidayDefaultValue[]>([]);
