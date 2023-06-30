import { useAtomValue } from "jotai";
import { popupGridStateAtom } from "@packages/ui/base-gridview/store/popup-grid-store";
import Button from "devextreme-react/button";
import { ReactNode } from "react";

export interface GridCustomerToolBarItem {
  text: string;
  onClick: any;
  shouldShow: any;
  widget?: string;
  customize?: (ref: any) => ReactNode;
}

export const GridCustomToolbar = ({ items }: any) => {
  const { ref } = useAtomValue(popupGridStateAtom);
  // console.log(ref?.instance.getSelectedRowsData());
  if (!items || !items.length || !ref) return null;
  return (
    <div>
      {items.map((item: GridCustomerToolBarItem, idx: number) => {
        if (item?.widget === "customize") {
          if (item.shouldShow(ref)) {
            return item?.customize(ref) ?? <></>;
          } else {
            return <></>;
          }
        } else {
          return (
            <Button
              key={idx}
              text={item.text}
              onClick={(e) => {
                item.onClick(e, ref);
              }}
              visible={item.shouldShow(ref)}
            />
          );
        }
      })}
    </div>
  );
};
