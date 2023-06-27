import { useAtomValue } from "jotai";
import { popupGridStateAtom } from "@packages/ui/base-gridview/store/popup-grid-store";
import Button from "devextreme-react/button";

export interface GridCustomerToolBarItem {
  text: string;
  onClick: any;
  shouldShow: any;
  widget?: string;
}

export const GridCustomToolbar = ({ items }: any) => {
  const { ref } = useAtomValue(popupGridStateAtom);
  // console.log(ref?.instance.getSelectedRowsData());
  if (!items || !items.length || !ref) return null;
  return (
    <div>
      {items.map((item: GridCustomerToolBarItem, idx: number) => {
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
      })}
    </div>
  );
};
