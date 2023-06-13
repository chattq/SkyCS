import {atom} from "jotai";

interface GridState {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
}
export const popupGridStateAtom = atom<GridState>({
  pageIndex: 0,
  pageSize: 100,
  pageCount: 0,
  totalCount: 0
})
