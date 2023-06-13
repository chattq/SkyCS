import React from "react";
import { ReactComponent as RemoveIcon } from './svg/remove.svg'
import { ReactComponent as EditIcon } from './svg/edit.svg'
import { ReactComponent as AddIcon } from './svg/add.svg'
import { ReactComponent as TrashIcon } from './svg/trash.svg'
import { ReactComponent as PlusIcon } from './svg/plus-circle.svg'
export type Dict = {
  [key: string]: any;
};
const ICONS = {
  'remove': RemoveIcon,
  'add': AddIcon,
  'edit': EditIcon,
  trash: TrashIcon,
  plus: PlusIcon
}
export type IconName = keyof typeof ICONS;

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  name: IconName;
  style?: Dict;
};

export const Icon = ({name, size = 10, className, style, ...restProps}: IconProps) => {
  const Component = ICONS[name];
  return (
    <Component className={className} width={size} height={size} {...restProps} style={style}/>
  );
};
