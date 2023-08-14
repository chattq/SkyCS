import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useNetworkNavigate } from "@/packages/hooks";
import { showErrorAtom } from "@/packages/store";
import { LinkCell } from "@/packages/ui/link-cell";
import { Mst_CustomContact } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import { viewingDataAtom } from "./store";

interface Props {
  data?: Mst_CustomContact[] | any;
}

export const useMst_CustomerContact_Column = ({ refetch }: any) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const viewRow = (rowIndex: number, data: Mst_CustomContact) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const navigate = useNetworkNavigate();

  const showError = useSetAtom(showErrorAtom);

  const api = useClientgateApi();

  const matchIdx = (colCodeSys: any) => {
    return match(colCodeSys)
      .with("CustomerName", () => 1)
      .with("CustomerName", () => 2)
      .with("CustomerName", () => 3)
      .with("CustomerName", () => 4)
      .with("CustomerName", () => 5)

      .otherwise(() => 9999);
  };

  const { data: listColumn, isLoading: isLoadingColumn } = useQuery({
    queryKey: ["listColTabContract"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search(
        {},
        "SCRTCS.CTM.CONTACT.2023"
      );

      console.log(response?.DataList);

      if (response.isSuccess) {
        return (
          response?.DataList?.map((item: any, index: any) => {
            return {
              ...item,
              visible: true,
              OrderIdx: index,
              // CtmEmail : item?.
            };
          }) ?? []
        );
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
      }
    },
  });

  const handleDetail = (data: any) => {
    navigate(`/customer/detail/${data?.CustomerCodeSysContact}`);
  };

  const { t } = useI18n("Tab_Mst_CustomerContact");

  const columns = useMemo(() => {
    const result: any[] =
      listColumn
        ?.sort((a: any, b: any) => b?.OrderIdx - a?.OrderIdx)
        ?.map((item: any) => {
          return {
            dataField: item?.ColCodeSys,
            caption: item?.ColCaption,
            idx: item?.OrderIdx,
            visible: true,
            editorType: "dxTextBox",
            editorOptions: {
              readOnly: true,
            },
            filterType: "exclude",
            filterValue: null,
            width: 200,
            cellRender: ({ data, value }: any) => {
              if (item?.ColCodeSys == "CustomerName") {
                return (
                  <LinkCell
                    key={nanoid()}
                    onClick={() => handleDetail(data)}
                    value={value}
                  />
                );
              }

              return data[item?.ColCodeSys];
            },
          };
        }) ?? [];

    const editor = {
      dataField: "CustomerCodeSysContact",
      caption: "",
      width: 50,
      filter: false,
      cellRender: ({ data, value }: any) => {
        const handleRemove = async (item: any) => {
          const confirmDelete = confirm(
            `Bạn có muốn xóa liên hệ với ${item?.CustomerCodeSysContact}`
          );

          if (confirmDelete) {
            const req = [
              {
                OrgID: item?.OrgID,
                NetworkID: item?.NetworkID,
                CustomerCodeSys: item?.CustomerCodeSys,
                CustomerCodeSysContact: item?.CustomerCodeSysContact,
              },
            ];

            const resp: any = await api.Mst_CustomerContact_Delete(req);

            if (resp?.isSuccess) {
              toast.success("Xóa liên hệ thành công!");
              refetch();
            } else {
              showError({
                message: resp?.errorCode,
                debugInfo: resp?.debugInfo,
                errorInfo: resp?.errorInfo,
              });
            }
          }
        };

        return (
          <>
            <div
              className="flex justify-center cursor-pointer"
              onClick={() => handleRemove(data)}
            >
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.7306 11.0303L13.4927 9.77778C14.0429 9.62963 14.4899 9.34343 14.8337 8.91919C15.1776 8.49495 15.3495 8 15.3495 7.43434C15.3495 6.76094 15.1088 6.18855 14.6274 5.71717C14.146 5.24579 13.5615 5.0101 12.8738 5.0101H9.57282V3.39394H12.8738C14.0154 3.39394 14.9885 3.78788 15.7931 4.57576C16.5977 5.36364 17 6.3165 17 7.43434C17 8.20202 16.7971 8.90909 16.3914 9.55556C15.9856 10.202 15.432 10.6936 14.7306 11.0303ZM11.9248 8.24242L10.2743 6.62626H12.0485V8.24242H11.9248ZM15.1845 16L0 1.13131L1.15534 0L16.3398 14.8687L15.1845 16ZM7.92233 11.4747H4.62136C3.47977 11.4747 2.50667 11.0808 1.70206 10.2929C0.897451 9.50505 0.495146 8.55219 0.495146 7.43434C0.495146 6.50505 0.783981 5.67677 1.36165 4.94949C1.93932 4.22222 2.68204 3.74411 3.58981 3.51515L5.11651 5.0101H4.62136C3.93366 5.0101 3.34911 5.24579 2.86772 5.71717C2.38633 6.18855 2.14563 6.76094 2.14563 7.43434C2.14563 8.10774 2.38633 8.68013 2.86772 9.15152C3.34911 9.6229 3.93366 9.85859 4.62136 9.85859H7.92233V11.4747ZM5.4466 8.24242V6.62626H6.78762L8.41748 8.24242H5.4466Z"
                  fill="#00703C"
                />
              </svg>
            </div>
          </>
        );
      },
    };

    // const customerName = {
    //   dataField: "CustomerCodeSysContact",
    //   caption: "Tên khách hàng",
    //   filter: false,
    //   cellRender: ({ data }: any) => {
    //     return data?.CustomerName;
    //   },
    // };

    // return [editor, ...result];
    return [editor, ...result];
  }, [listColumn]);

  console.log("column ", columns);

  return columns;
};
