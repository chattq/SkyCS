import { useAtomValue } from "jotai";
import Zalo_Zns from "./Zalo/Zalo_Zns";
import { valueIDAtom } from "../store";
import Zalo_UserID from "./Zalo/Zalo_UserID";

export default function Zalo_Parent({ formRef }: any) {
  const valueID = useAtomValue(valueIDAtom);
  console.log(8, valueID);

  return (
    <>
      {!valueID ? (
        <Zalo_UserID formRef={formRef} />
      ) : (
        <Zalo_Zns formRef={formRef} />
      )}
    </>
  );
}
