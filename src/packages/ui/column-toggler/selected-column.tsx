import {ColumnOptions} from "@packages/ui/base-gridview";
import {Button} from "devextreme-react";
import React from "react";
import {Icon} from "@packages/ui/icons";

interface SelectedColumnProps {
  onClick: () => void;
  item: ColumnOptions;
}
export function SelectedColumn({item, onClick}: SelectedColumnProps) {
  return <div className={"flex justify-end items-center"}>
    <Button 
            stylingMode={"text"} className={"ml-auto icon-remove"} onClick={onClick}>
      <Icon name={'remove'} color={'#FF0000'} size={10} />
    </Button>
    {item.caption}
  </div>;
}
