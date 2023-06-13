import {useMemo} from "react";

export interface LinkCellProps<T extends string, E> {
  value: T;
  onClick: () => void;
}
export const LinkCell = <T extends string, E>({value, onClick}: LinkCellProps<T, E>) => {
  return useMemo(() => (
    <a href={'#'} onClick={onClick}>{value}</a>
  ), [])
}