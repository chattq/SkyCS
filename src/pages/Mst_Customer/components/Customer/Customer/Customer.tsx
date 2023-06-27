import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { getListField } from "@/utils/customer-common";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, LoadPanel } from "devextreme-react";
import { GroupItem, Item } from "devextreme-react/form";
import { t } from "i18next";
import { useSetAtom } from "jotai";
import { useMemo, useRef, useState } from "react";
import Customer_Tabs from "./components/Customer_Tabs";

const Customer = () => {
  const api = useClientgateApi();

  const currentCustomerCodeSys = "CTMCS.D6G.10104";

  const showError = useSetAtom(showErrorAtom);

  const [customerInfo, setCustomerInfo]: any = useState<any>({});

  const formRef: any = useRef(null);

  const { data: customer, isLoading } = useQuery({
    queryKey: ["CustomerInfo", currentCustomerCodeSys],
    queryFn: async () => {
      const resp: any = await api.Mst_Customer_GetByCustomerCode([
        currentCustomerCodeSys,
      ]);

      setCustomerInfo(resp?.Data?.Lst_Mst_Customer[0]);

      return resp?.Data;
    },
  });

  const {
    data: listCodeField,
    isLoading: isLoadingCodeField,
    refetch: refetchCodeField,
  } = useQuery({
    queryKey: ["ListCodeFieldAbout"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search(
        {},
        "SCRTCS.CTM.DTL.2023"
      );
      if (response.isSuccess) {
        return response?.DataList;
      } else {
        showError({
          message: response?.errorCode,
          debugInfo: response?.debugInfo,
          errorInfo: response?.errorInfo,
        });
      }
    },
  });

  // console.log(customer, listCodeField);

  const getFormField = useMemo(() => {
    if (!isLoadingCodeField && customer && customer?.Lst_Mst_Customer[0]) {
      const list = JSON.parse(customer?.Lst_Mst_Customer[0].JsonCustomerInfo);

      console.log(listCodeField);

      const listDynamic = listCodeField?.reduce((prev: any, cur: any) => {
        prev[cur.ColCodeSys] =
          list?.find((item: any) => item.ColCodeSys == cur.ColCodeSys)
            ?.ColValue || customer?.Lst_Mst_Customer[0][cur.ColCodeSys];
        return prev;
      }, {} as { [key: string]: any[] });

      const listFieldCustom = listCodeField?.map((item: any) => {
        return {
          ...item,
          ColDataType:
            item?.ColDataType == "EMAIL" || item?.ColDataType == "PHONE"
              ? "SELECTONEDROPDOWN"
              : item?.ColDataType,
          JsonListOption:
            item?.ColDataType === "EMAIL"
              ? JSON.stringify(
                  customer?.Lst_Mst_CustomerEmail?.map((item: any) => {
                    return {
                      ...item,
                      IsSelected: item.FlagDefault == "1",
                      Value: item.CtmEmail,
                    };
                  })
                )
              : item?.ColDataType === "PHONE"
              ? JSON.stringify(
                  customer?.Lst_Mst_CustomerPhone?.map((item: any) => {
                    return {
                      ...item,
                      IsSelected: item.FlagDefault == "1",
                      Value: item.CtmPhoneNo,
                    };
                  })
                )
              : item?.JsonListOption,
        };
      });

      // console.log(listDynamic);

      const listField = getListField({
        listField: listFieldCustom,
        listDynamic: listDynamic,
        customOptions: {
          editType: "detail",
        },
      });

      // console.log(listField);

      const listGroup = listCodeField
        ?.sort((a: any, b: any) => a.OrderIdx - b.OrderIdx)
        ?.reduce((prev: any, cur: any, index: number) => {
          const groupIndex = Math.floor(index / (listCodeField?.length / 2));
          if (!prev[groupIndex]) {
            prev[groupIndex] = [];
          }

          prev[groupIndex].push({
            ...cur,
            ...listField?.find(
              (item: any) => item.ColCodeSys == cur.ColCodeSys
            ),
          });
          return prev;
        }, []);

      const buildDynamicForm = listGroup?.map((groupItem: any) => {
        return {
          colCount: 1,
          labelLocation: "left",
          // labelLocation: "left",
          items: [
            {
              itemType: "group",
              colCount: 2,
              items: listField
                ?.filter(
                  (item: any) => item.groupKeys === groupItem.ColGrpCodeSys
                )
                .sort(function (a: any, b: any) {
                  return a.OrderIdx - b.OrderIdx;
                }),
              caption: groupItem.ColGrpName ?? "",
              cssClass: "collapsible form-group",
            },
          ],
        };
      });

      return listGroup;
    } else {
      return [];
    }
  }, [isLoadingCodeField, customer, listCodeField]);

  return (
    <AdminContentLayout className={"province-management"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header d-flex justify-space-between">
          <div className="breakcrumb">
            <p>{t("Mst_Customer")}</p>
            <p>{`>`}</p>
            <p>Detail Customer</p>
          </div>
          <div className="list-button">
            <Button onClick={() => {}}>Chỉnh sửa</Button>
            <Button>Hủy Bỏ</Button>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <LoadPanel
          container={".dx-viewport"}
          shadingColor="rgba(0,0,0,0.4)"
          position={"center"}
          visible={false}
          showIndicator={true}
          showPane={true}
        />
        <div className="flex gap-3 mt-[10px] p-6">
          <div
            className="overflow-hidden h-[100px] w-[100px]"
            style={{ borderRadius: "50%" }}
          >
            <div className="h-full w-full">
              <img
                alt=""
                className="w-full h-full object-cover"
                src={customerInfo?.CustomerAvatarPath}
              />
              {/* <input type="file" ref={imgRef} hidden onChange={onFileChange} /> */}
            </div>
          </div>
          {listCodeField && customer && (
            <CustomerContent
              customer={customer}
              listCodeField={listCodeField}
              formField={getFormField}
            />
          )}
        </div>

        <Customer_Tabs />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Customer;

const CustomerContent = ({ customer, listCodeField, formField }: any) => {
  const formRef = useRef(null);
  const handleInitialization = (e: any) => {
    formRef.current = e.component;
  };
  const formValue = {
    ...customer?.Lst_Mst_Customer[0],
    CtmEmail: customer?.Lst_Mst_CustomerEmail ?? [],
    CtmPhoneNo: customer?.Lst_Mst_CustomerPhone ?? [],
  };

  return (
    <form ref={formRef} className="overflow-auto">
      <Form
        // className="form-test"
        formData={formValue}
        validationGroup="customerData"
        // onInitialized={handleInitialization}
        showValidationSummary={true}
        labelMode="outside"
        labelLocation="left"
        // readOnly={true}
      >
        <GroupItem colCount={2}>
          {formField.map((item: any) => {
            return (
              <GroupItem>
                {item.map((c: any) => {
                  return <Item {...c} />;
                })}
              </GroupItem>
            );
          })}
        </GroupItem>
      </Form>
    </form>
  );
};
