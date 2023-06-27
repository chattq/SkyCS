import React from "react";
import { ReactComponent as RemoveIcon } from './svg/remove.svg'
import { ReactComponent as EditIcon } from './svg/edit.svg'
import { ReactComponent as AddIcon } from './svg/add.svg'
import { ReactComponent as TrashIcon } from './svg/trash.svg'
import { ReactComponent as PlusIcon } from './svg/plus-circle.svg'
import { ReactComponent as PdfIcon } from './svg/pdf.svg'
import { ReactComponent as XlsxIcon } from './svg/xlsx.svg'
import { ReactComponent as JpgIcon } from './svg/jpg.svg'
import { ReactComponent as DocxIcon } from './svg/docx.svg'
import { ReactComponent as ExpandDownIcon } from './svg/expand-down.svg'
import { ReactComponent as ExpandPNG } from './svg/png.svg'
export type Dict = {
  [key: string]: any;
};
//  PNG, XLSX

const ICONS = {
  'remove': RemoveIcon,
  'add': AddIcon,
  'edit': EditIcon,
  trash: TrashIcon,
  plus: PlusIcon,
  pdf: PdfIcon,
  xlsx: XlsxIcon,
  jpg: JpgIcon,
  docx: DocxIcon,
  expandDown: ExpandDownIcon,
  png: ExpandPNG,
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
