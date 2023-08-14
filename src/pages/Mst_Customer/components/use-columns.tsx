import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { StatusButton } from "@/packages/ui/status-button";
import {
  flagCustomer,
  viewingDataAtom,
} from "@/pages/Mst_Customer/components/store";
import { getDMY } from "@/utils/time";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { match } from "ts-pattern";
import PopoverCustomerContact from "./popover-customer-contact";
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
    "C0LF",
    "CtmPhoneNo",
    "CtmEmail",
    "CustomerNameContact",
    "C0KS",
  ];

  // console.log(getColumnFieldByGroup);

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

  const columns: any[] = getColumnFieldByGroup
    ?.filter((item: any) => item?.FlagActive)
    ?.map((item: any) => {
      return {
        dataField: item.ColCodeSys, // Điện thoại
        caption: t(`${item.ColCaption}`),
        editorType: "dxTextBox",
        editorOptions: {
          readOnly: true,
        },
        filterType: "exclude",
        filterValue: null,
        visible: defaultVisible(item?.ColCodeSys),
        columnIndex: 1,
        width: 200,
        cellRender: ({ data, rowIndex }: any) => {
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
                if (
                  typeof dataJson.ColValue === "string" &&
                  item.ColDataType === "FLAG"
                ) {
                  return (
                    <StatusButton
                      key={nanoid()}
                      isActive={dataJson.ColValue == "1"}
                    />
                  );
                }

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

          // if (item.ColCodeSys === "CtmPhoneNo") {
          //   const list = JSON.parse(data?.CustomerPhoneJson) ?? [];
          //   const result =
          //     list?.find((item: any) => item?.FlagDefault == "1")?.CtmPhoneNo ??
          //     "";
          //   return result;
          // }

          // if (item.ColCodeSys === "CtmEmail") {
          //   const list = JSON.parse(data?.CustomerEmailJson) ?? [];
          //   const result =
          //     list?.find((item: any) => item?.FlagDefault == "1")?.CtmEmail ??
          //     "";
          //   return result;
          // }

          // console.log(data);

          // if (item.ColCodeSys === "ZaloUserFollowerId") {
          //   const list = JSON.parse(data?.CustomerZaloUserFollowerJson) ?? [];
          //   const result =
          //     list?.find((item: any) => item?.FlagDefault == "1")
          //       ?.ZaloUserFollowerId ?? "";
          //   return result;
          // }

          if (item.ColCodeSys === "CustomerType") {
            return data?.mct_CustomerTypeName;
          }

          if (item.ColCodeSys === "CustomerGrpCode") {
            const list = JSON.parse(data?.CustomerInCustomerGroupJson) ?? [];

            const result = list?.map((item: any) =>
              item?.Mst_CustomerGroup && item?.Mst_CustomerGroup[0]
                ? item?.Mst_CustomerGroup[0]?.CustomerGrpName
                : ""
            );
            return result?.join(",") ?? [];
          }

          if (item.ColCodeSys === "PartnerType") {
            const list = JSON.parse(data?.CustomerInPartnerTypeJson) ?? [];
            const result = list?.map(
              (item: any) => item?.Mst_PartnerType[0]?.PartnerTypeName
            );
            return result?.join(",") ?? [];
          }

          if (item.ColCodeSys === "CustomerNameContact") {
            const list = JSON.parse(data?.CustomerContactJson ?? "[]");

            if (list && list?.length > 1) {
              const listCustomer = list?.map((item: any) => {
                return {
                  CustomerCodeSys: item?.CustomerCodeSysContact,
                  CustomerName:
                    item?.Mst_Customer && item?.Mst_Customer?.length > 0
                      ? item?.Mst_Customer[0]?.CustomerName
                      : "",
                  CustomerAvatarPath:
                    item?.Mst_Customer && item?.Mst_Customer?.length > 0
                      ? item?.Mst_Customer[0]?.CustomerAvatarPath
                      : "",
                };
              });

              return (
                <PopoverCustomerContact
                  data={data}
                  listCustomer={listCustomer}
                />
              );
            }

            return <div>{data?.CustomerNameContact}</div>;
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

          return <>{data[item.ColCodeSys]}</>;
        },
      };
    });

  return sortInitByExpected(columns, expectedArray);
};

const defaultVisible = (code: any) => {
  return match(code)
    .with("CustomerCode", () => true)
    .with("CustomerName", () => true)
    .with("C0LF", () => true)
    .with("CtmPhoneNo", () => true)
    .with("CtmEmail", () => true)
    .with("CustomerNameContact", () => true)
    .with("C0KS", () => true)
    .otherwise(() => false);
};
