import { Button, Form, LoadPanel, Popup, RadioGroup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useAtomValue, useSetAtom } from "jotai";
import React, {
  memo,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { popupVisibleAtom } from "../store";
import { useI18n } from "@/i18n/useI18n";
import { ButtonItem, SimpleItem } from "devextreme-react/form";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { useConfiguration } from "@/packages/hooks";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import "./style.scss";
import { nanoid } from "nanoid";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { dataClone } from "./data";
import { Mst_Customer } from "@/packages/types";
import { toast } from "react-toastify";
interface Props {
  onCancel: () => void;
  onSave: () => void;
  dataRow: ETICKET_REPONSE[];
}

const index = ({ onCancel, onSave, dataRow }: Props) => {
  const { t } = useI18n("TransformCustomer");
  const formRef: any = useRef(null);
  const api = useClientgateApi();
  const config = useConfiguration();
  const popupVisible = useAtomValue(popupVisibleAtom);
  const [customer, setCustomer] = useState("");
  const [loadingKey, reloading] = useReducer(() => {
    return nanoid();
  }, "0");
  console.log("loadingKey ", loadingKey);
  const formRadioRef: any = useRef(null);

  console.log("dataRow ", dataRow);

  const { auth } = useAuth();
  const showError = useSetAtom(showErrorAtom);
  const [formValue, setFormValue] = useState({
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    OrgId: auth.orgData?.Id,
  });
  const {
    data: listCustomer,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Mst_Customer_Search", loadingKey],
    queryFn: async () => {
      if (loadingKey !== "0") {
        const response = await api.Mst_Customer_Search(formValue);
        if (response.isSuccess) {
          return response.DataList;
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
        }
      } else {
        return [];
      }
    },
  });

  const handleSave = useCallback(async () => {
    console.log("customer ", customer);
    if (customer !== "") {
      const obj = {
        TicketID: dataRow[0].TicketID,
        // CustomerCodeSys: dataRow[0].CustomerCodeSys,
        CustomerCodeSys: customer,
        // Lst_ET_TicketCustomer: [
        //   {
        //     CustomerCodeSys: customer,
        //   },
        // ],
      };
      const response = await api.ET_Ticket_UpdateCustomer(obj);
      if (response.isSuccess) {
        toast.success(t("ET_Ticket_UpdateCustomer success! "));
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    } else {
      toast.error(t("Please select customer!"));
    }
  }, [customer]);

  const onSearch = () => {
    const { isValid } = formRef.current.instance.validate();
    if (isValid) {
      reloading();
      refetch();
    } else {
    }
  };

  const handleChange = (item: any) => {
    setCustomer(item.value);
  };

  console.log("listCustomer ", listCustomer);

  return (
    <Popup
      className="popup"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={`Transform-Customer`}
      width={700}
      height={450}
      visible={popupVisible}
    >
      <LoadPanel
        visible={isLoading}
        showIndicator={true}
        showPane={true}
        container={".dx-viewport"}
        shadingColor="rgba(0,0,0,0.4)"
      />
      <div className="popup-content">
        <div className="tag flex items-center justify-between mb-4">
          <div className="left">
            <p className="strong">
              {t(
                `Hộ trợ tạo đơn hàng DMS cho khách hàng ${dataRow[0].CustomerCodeSys}`
              )}
            </p>
            <p>{t(`Nguyễn Văn A - KH0001`)}</p>
          </div>
          <div className="right">
            <p>{`${dataRow[0].TicketID}`}</p>
            <p>
              {t("Phone: ")}
              {`0987654321`}
            </p>
          </div>
        </div>
        <div className="form">
          <p>{t("Info of new Customer")}</p>
          <div className="flex items-center">
            <Form
              colCount={1}
              labelMode="hidden"
              formData={formValue}
              ref={formRef}
              showRequiredMark={true}
              validationGroup="form-transformCustomer"
              className="form-transformCustomer flex items-center"
            >
              <SimpleItem
                dataField={"KeyWord"}
                validationRules={[requiredType]}
              />
            </Form>

            <Button
              type={"default"}
              stylingMode={"contained"}
              onClick={onSearch}
              className="mr-1"
              text={t("Search")}
            />
          </div>
          {loadingKey !== "0" && listCustomer?.length ? (
            <RadioGroup
              items={listCustomer ?? []}
              valueExpr={"CustomerCodeSys"}
              onValueChanged={(item) => handleChange(item)}
              itemRender={(item: Mst_Customer) => {
                return (
                  <div className="flex item-center justify-between mb-2 container-content">
                    <div className="w-full">
                      <p className="strong">{item.CustomerName}</p>
                      <div className="flex items-center justify-between">
                        <p>
                          {t("ContactPhone")}: {`${item.ContactPhone ?? "---"}`}
                        </p>
                        <p>
                          {t("ContactEmail")}: {`${item.ContactEmail ?? "---"}`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          ) : (
            <>{t("No data")}</>
          )}
        </div>
      </div>
      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Save")}
          disabled={loadingKey === "0"}
          type={"default"}
          stylingMode={"contained"}
          onClick={handleSave}
        />
        <Button
          text={t("Close")}
          stylingMode={"contained"}
          onClick={onCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default memo(index);
