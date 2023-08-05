import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useNetworkNavigate } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { getListField } from "@/utils/customer-common";
import { editTypeAtom } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, LoadPanel } from "devextreme-react";
import { GroupItem, Item } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import Customer_Tabs from "./components/Customer_Tabs";
import "./style.scss";
export const CustomerPrimaryPage = () => {
  const api = useClientgateApi();

  const { t } = useI18n("Mst_Customer");

  const { auth } = useAuth();

  const params: any = useParams();

  const { CustomerCodeSys: currentCustomerCodeSys } = params;

  const showError = useSetAtom(showErrorAtom);

  const [customerInfo, setCustomerInfo]: any = useState<any>({});

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

  const getListDynamic = useMemo(() => {
    if (!isLoadingCodeField && customer && customer?.Lst_Mst_Customer[0]) {
      const list = JSON.parse(customer?.Lst_Mst_Customer[0].JsonCustomerInfo);

      const listDynamic = listCodeField?.reduce((prev: any, cur: any) => {
        if (cur?.FlagIsColDynamic == "1") {
          prev[cur.ColCodeSys] =
            list?.find((item: any) => item.ColCodeSys == cur.ColCodeSys)
              ?.ColValue || customer?.Lst_Mst_Customer[0][cur.ColCodeSys];

          return prev;
        }

        return prev;
      }, {} as { [key: string]: any[] });

      return listDynamic;
    }
  }, [isLoadingCodeField, customer, listCodeField]);

  const getFormField = useMemo(() => {
    if (!isLoadingCodeField && customer && customer?.Lst_Mst_Customer[0]) {
      const list = JSON.parse(customer?.Lst_Mst_Customer[0].JsonCustomerInfo);

      const listDynamic = listCodeField?.reduce((prev: any, cur: any) => {
        if (cur?.FlagIsColDynamic == "1") {
          prev[cur.ColCodeSys] =
            list?.find((item: any) => item.ColCodeSys == cur.ColCodeSys)
              ?.ColValue || customer?.Lst_Mst_Customer[0][cur.ColCodeSys];

          return prev;
        }

        return prev;
      }, {} as { [key: string]: any[] });

      const listFieldCustom = listCodeField?.map((item: any) => {
        return {
          ...item,
          ColDataType: match(item?.ColDataType)
            .with("EMAIL", () => "SELECTONEDROPDOWN")
            .with("PARTNERTYPE", () => "SELECTMULTIPLEDROPDOWN")
            .with("PHONE", () => "CUSTOMIZEPHONE")
            .otherwise(() => item?.ColDataType),

          JsonListOption: match(item?.ColDataType)
            .with("EMAIL", () =>
              JSON.stringify(
                customer?.Lst_Mst_CustomerEmail?.map((item: any) => {
                  return {
                    ...item,
                    IsSelected: item.FlagDefault == "1",
                    Value: item.CtmEmail,
                  };
                })
              )
            )
            .with("PHONE", () =>
              JSON.stringify(
                customer?.Lst_Mst_CustomerPhone?.map((item: any) => {
                  return {
                    ...item,
                    IsSelected: item.FlagDefault == "1",
                    Value: item.CtmPhoneNo,
                  };
                })
              )
            )
            .with("PARTNERTYPE", () =>
              JSON.stringify(
                customer?.Lst_Mst_CustomerInPartnerType?.map((item: any) => {
                  return {
                    ...item,
                    IsSelected: true,
                    Value: item.PartnerType,
                  };
                })
              )
            )
            .otherwise(() => item?.JsonListOption),
        };
      });

      const listField = getListField({
        listField: listFieldCustom,
        listDynamic: listDynamic,
        customOptions: {
          editType: "update",
        },
      });

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

      return listGroup;
    } else {
      return [];
    }
  }, [isLoadingCodeField, customer, listCodeField]);

  const setEditType = useSetAtom(editTypeAtom);

  const navigate: any = useNetworkNavigate();

  const handleEdit = () => {
    navigate(`/customer/edit/${currentCustomerCodeSys}/direct`);
  };

  const handleDelete = async () => {
    const deleteConfirm = confirm(
      `Bạn có muốn xóa khách hàng ${currentCustomerCodeSys} không?`
    );

    if (deleteConfirm) {
      const response = await api.Mst_Customer_Delete({
        OrgID: auth?.orgData?.Id,
        CustomerCodeSys: currentCustomerCodeSys,
        NetworkID: auth?.networkId,
      });
      if (response.isSuccess) {
        toast.success(t("Delete Success"));
        navigate(`/customer/list`);
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    }
  };

  return (
    <AdminContentLayout className={"province-management"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2 py-3">
          <div className="breakcrumb flex gap-1">
            <NavNetworkLink to="/customer" className="text-black">
              Khách hàng
            </NavNetworkLink>
            <p>{`>`}</p>
            <p>Chi tiết khách hàng</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleEdit}
              style={{
                background: "#00703c",
                color: "white",
                padding: "10px 20px",
              }}
            >
              Chỉnh sửa
            </Button>
            <Button
              style={{
                padding: "10px 20px",
              }}
              onClick={handleDelete}
            >
              Xóa
            </Button>
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
        <div className="flex gap-3 items-center py-2 pl-[50px]">
          <div
            className="overflow-hidden h-[120px] w-[120px]"
            style={{ borderRadius: "50%" }}
          >
            <div className="h-full w-full">
              <img
                alt=""
                className="w-full h-full object-cover"
                src={
                  customerInfo?.CustomerAvatarPath ??
                  "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180"
                }
              />
              {/* <input type="file" ref={imgRef} hidden onChange={onFileChange} /> */}
            </div>
          </div>
          {listCodeField && customer && (
            <CustomerContent
              customer={customer}
              listCodeField={listCodeField}
              formField={getFormField}
              listDynamic={getListDynamic}
            />
          )}
        </div>

        <Customer_Tabs />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

const CustomerContent = ({
  customer,
  listCodeField,
  formField,
  listDynamic,
}: any) => {
  const formRef = useRef(null);
  const handleInitialization = (e: any) => {
    formRef.current = e.component;
  };

  const formValue = {
    ...listDynamic,
    ...customer?.Lst_Mst_Customer[0],
    CtmEmail: customer?.Lst_Mst_CustomerEmail ?? [],
    CtmPhoneNo: customer?.Lst_Mst_CustomerPhone ?? [],
    PartnerType: customer?.Lst_Mst_CustomerInPartnerType ?? [],
  };

  const editType = useAtomValue(editTypeAtom);

  return (
    <form ref={formRef} className="pt-[20px] form-customer">
      <Form
        className="form-customer-content"
        formData={formValue}
        validationGroup="customerData"
        // onInitialized={handleInitialization}
        showValidationSummary={true}
        labelMode="outside"
        labelLocation="left"
      >
        <GroupItem colCount={2}>
          {formField.map((item: any) => {
            return (
              <GroupItem key={nanoid()}>
                {item.map((c: any) => {
                  if (c?.ColCodeSys == "CtmPhoneNo") {
                    return <Item {...c} key={nanoid()} />;
                  }
                  return <Item {...c} disabled key={nanoid()} />;
                })}
              </GroupItem>
            );
          })}
        </GroupItem>
      </Form>
    </form>
  );
};
