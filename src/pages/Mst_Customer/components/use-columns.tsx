import { ColumnOptions } from "@packages/ui/base-gridview";
import { requiredType } from "@packages/common/Validation_Rules";
import { filterByFlagActive, uniqueFilterByDataField } from "@packages/common";
import { StatusButton } from "@packages/ui/status-button";
import { useI18n } from "@/i18n/useI18n";
import { useSetAtom } from "jotai";
import { viewingDataAtom } from "@/pages/Mst_Customer/components/store";
import NavNetworkLink from "@/components/Navigate";
import { flagCustomer } from "@/pages/Mst_Customer/components/Customer/store";
interface UseDealerGridColumnsProps {
  data: any[];
  dataField: any[];
  dataGroup: any;
}
export const useColumn = ({
  data,
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
      const listField = dataField.filter(
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
  const columns: ColumnOptions[] = getColumnFieldByGroup.map((item: any) => {
    return {
      dataField: item.ColCodeSys, // Điện thoại
      caption: t(`${item.ColCaption}`),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: true,
      },
      visible: item.FlagActive,
      columnIndex: 1,
      cellRender: ({ data }: any) => {
        if (item.FlagIsColDynamic === "1") {
          if (item.ColDataType === "MASTERDATA") {
            const dataJson = JSON.parse(data.JsonCustomerInfo).find(
              (itemJson: any) => itemJson.ColCodeSys === item.ColCodeSys
            );
            if (dataJson) {
              console.log("dataJSOn ", dataJson, dataJson.ColValueNameOfMaster);
              return <>{dataJson.ColValueNameOfMaster ?? dataJson.ColValue}</>;
            } else {
              return <></>;
            }
          } else {
            const dataJson = JSON.parse(data.JsonCustomerInfo).find(
              (itemJson: any) => itemJson.ColCodeSys === item.ColCodeSys
            );
            if (dataJson) {
              return <>{dataJson.ColValue}</>;
            } else {
              return <></>;
            }
          }
        }
        if (item.ColCodeSys === "CUSTOMERCODE") {
          return (
            <NavNetworkLink
              onClick={() => setFlagCustomer("update")}
              to={`/customer/Customer_Detail/${data.CustomerCodeSys}`}
            >
              {data[item.ColCode]}
            </NavNetworkLink>
          );
        } else {
          return <>{data[item.ColCode]}</>;
        }
      },
    };
  });
  return columns;
};
