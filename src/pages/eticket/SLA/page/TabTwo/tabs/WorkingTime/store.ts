import { atom } from "jotai";

interface Slider {
  TimeStart: number;
  TimeEnd: number;
  Idx: number;
}

interface WorkingTimeList {
  Day: number;
  Slider: Slider[];
  Check: boolean;
  hasMoreSlide: boolean;
}

export const initWorkingTimeList = Array.from(
  { length: 7 },
  (v: any, k: any) => {
    return {
      Day: k + 1,
      Slider: Array.from({ length: 2 }, (v: any, i: any) => {
        return {
          TimeStart: 0,
          TimeEnd: 0,
          Idx: k * 2 + i + 1,
        };
      }),
      Check: false,
      hasMoreSlide: false,
    };
  }
);

export const workingTimeList = atom<WorkingTimeList[]>(initWorkingTimeList);

export const flag247 = atom<boolean>(false);
