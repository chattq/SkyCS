import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import {
  flagCustomer,
  viewingDataAtom,
} from "@/pages/Mst_Customer/components/store";
import { getDMY } from "@/utils/time";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { useSetAtom } from "jotai";
import { match } from "ts-pattern";
interface UseDealerGridColumnsProps {
  data: any[];
  dataField: any[];
  dataGroup: any[];
}
export const useColumn = ({
  dataField,
  dataGroup,
}: UseDealerGridColumnsProps) => {
  const setFlagCustomer = useSetAtom(flagCustomer);
  const setViewingItem = useSetAtom(viewingDataAtom);
  const viewRow = (rowIndex: number, data: any) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const getColumnFieldByGroup = dataGroup
    .map((item: any) => {
      const listField = dataField?.filter(
        (itemField) => itemField.ColGrpCodeSys === item.ColGrpCodeSys
      );
      return {
        group: item.ColGrpCodeSys,
        list: listField,
      };
    })
    .reduce((acc: any[], item: any) => {
      return [...acc, ...item.list];
    }, []);
  const { t } = useI18n("Mst_Customer");

  const expectedArray = [
    "CustomerCode",
    "CustomerName",
    "COLD63062",
    "CtmPhoneNo",
    "CtmEmail",
    "COLD6D296",
  ];

  function sortInitByExpected(init: any, expected: any) {
    // Create a lookup object to store the index of each value in the 'expected' array
    const expectedIndexLookup: any = {};
    expected.forEach(
      (value: any, index: any) => (expectedIndexLookup[value] = index)
    );

    // Use .map() to sort the 'init' array based on the index of 'value' in the 'expected' array
    const sortedInit = init.map((obj: any) => ({
      ...obj,
      index: expectedIndexLookup[obj?.dataField],
    }));
    sortedInit.sort((a: any, b: any) => a.index - b.index);

    return sortedInit;
  }

  const columns: ColumnOptions[] = getColumnFieldByGroup
    ?.filter((item: any) => item?.FlagActive)
    ?.map((item: any) => {
      return {
        dataField: item.ColCodeSys, // Điện thoại
        caption: t(`${item.ColCaption}`),
        editorType: "dxTextBox",
        editorOptions: {
          readOnly: true,
        },
        visible: defaultVisible(item?.ColCodeSys),
        columnIndex: 1,
        cellRender: ({ data }: any) => {
          if (item.FlagIsColDynamic === "1") {
            if (item.ColDataType === "MASTERDATA") {
              if (Array.isArray(JSON.parse(data.JsonCustomerInfo))) {
                const dataJson = JSON.parse(data.JsonCustomerInfo)?.find(
                  (itemJson: any) => itemJson.ColCodeSys === item.ColCodeSys
                );
                if (dataJson) {
                  return (
                    <>{dataJson.ColValueNameOfMaster ?? dataJson.ColValue}</>
                  );
                } else {
                  return <></>;
                }
              } else {
                return <></>;
              }
            }

            if (item.ColDataType === "DATE") {
              return getDMY(data[item.ColCodeSys]) ?? <></>;
            }

            if (Array.isArray(JSON.parse(data.JsonCustomerInfo))) {
              const dataJson = JSON.parse(data.JsonCustomerInfo)?.find(
                (itemJson: any) => itemJson.ColCodeSys === item.ColCodeSys
              );
              if (dataJson) {
                if (typeof dataJson.ColValue === "string") {
                  return <>{dataJson.ColValue}</>;
                }
                return <>{JSON.stringify(dataJson.ColValue)}</>;
              } else {
                return <></>;
              }
            } else {
              return <></>;
            }
          }

          if (item.ColCodeSys === "CustomerCode") {
            return (
              <NavNetworkLink
                onClick={() => setFlagCustomer("update")}
                to={`/customer/detail/${data.CustomerCodeSys}`}
                className="text-green-600"
              >
                {data[item.ColCode]}
              </NavNetworkLink>
            );
          }

          if (item.ColCodeSys === "CtmPhoneNo") {
            const list = JSON.parse(data?.CustomerPhoneJson) ?? [];
            const result =
              list?.find((item: any) => item?.FlagDefault == "1")?.CtmPhoneNo ??
              "";
            return result;
          }

          if (item.ColCodeSys === "CtmEmail") {
            const list = JSON.parse(data?.CustomerEmailJson) ?? [];
            const result =
              list?.find((item: any) => item?.FlagDefault == "1")?.CtmEmail ??
              "";
            return result;
          }

          if (item.ColCodeSys === "ZaloUserFollowerId") {
            const list = JSON.parse(data?.CustomerZaloUserFollowerJson) ?? [];
            const result =
              list?.find((item: any) => item?.FlagDefault == "1")
                ?.ZaloUserFollowerId ?? "";
            return result;
          }

          if (item.ColCodeSys === "CustomerAvatarPath") {
            return (
              <div className="w-full flex items-center justify-center">
                <div
                  className="overflow-hidden h-[60px] w-[60px] rounded-lg shadow-xl mt-[10px] ml-[10px] cursor-pointer"
                  style={{
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }}
                >
                  <div className="h-full w-full">
                    <img
                      alt=""
                      className="w-full h-full object-cover"
                      src={data[item.ColCodeSys]}
                    />
                  </div>
                </div>
              </div>
            );
          }

          return <>{data[item.ColCode]}</>;
        },
      };
    });

  return sortInitByExpected(columns, expectedArray);
};

const defaultVisible = (code: any) => {
  return match(code)
    .with("CustomerCode", () => true)
    .with("CustomerName", () => true)
    .with("COLD63062", () => true)
    .with("CtmPhoneNo", () => true)
    .with("CtmEmail", () => true)
    .with("COLD6D296", () => true)
    .otherwise(() => false);
};
