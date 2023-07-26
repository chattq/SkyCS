import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration, useNetworkNavigate } from "@/packages/hooks";
import { useWindowSize } from "@/packages/hooks/useWindowSize";

import { showErrorAtom } from "@/packages/store";
import {
  Cpn_CampaignCustomerData,
  FlagActiveEnum,
  Mst_Customer,
} from "@/packages/types";
import {
  Button,
  DropDownBox,
  Form,
  LoadPanel,
  ScrollView,
  SelectBox,
  TextBox,
} from "devextreme-react";
import { useSetAtom } from "jotai";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import "../styles.scss";
import { ColumnOptions } from "@/types";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/packages/ui/icons";

export const Cpn_CustomerInfo = forwardRef(
  (
    { cpnCustomerData }: { cpnCustomerData: Cpn_CampaignCustomerData },
    ref: any
  ) => {
    const { auth } = useAuth();
    const { t } = useI18n("Cpn_CampaignPerformPage");
    const api = useClientgateApi();

    const showError = useSetAtom(showErrorAtom);
    const config = useConfiguration();
    const navigate = useNetworkNavigate();
    const [data, setData] = useState<Mst_Customer | null>(cpnCustomerData);
    const [isExpand, setExpand] = useState(true);
    const [listCompany, setListCompany] = useState<any[]>([]);
    // const refetchData = async () => {
    //   if (cpnCustomerData.CustomerCodeSys) {
    //     const response = await api.Mst_Customer_GetByCustomerCode([
    //       cpnCustomerData.CustomerCodeSys,
    //     ]);
    //     if (
    //       response.isSuccess &&
    //       response.Data &&
    //       response.Data.Lst_Mst_Customer &&
    //       response.Data.Lst_Mst_Customer.length > 0
    //     ) {
    //       setData(response.Data.Lst_Mst_Customer[0]);
    //     } else {
    //       showError({
    //         message: t(response.errorCode),
    //         debugInfo: response.debugInfo,
    //         errorInfo: response.errorInfo,
    //       });
    //     }
    //   }
    // };

    // const refetchSearch = async () => {
    //   if (cpnCustomerData.CustomerCodeSys) {
    //     const response = await api.Mst_Customer_Search({
    //       FlagActive: FlagActiveEnum.Active,
    //       Ft_PageSize: config.MAX_PAGE_ITEMS,
    //       Ft_PageIndex: 0,
    //     });
    //     if (response.isSuccess && response.DataList) {
    //       console.log("response ", response);
    //       setListCompany(response.DataList ?? []);
    //     } else {
    //       showError({
    //         message: t(response.errorCode),
    //         debugInfo: response.debugInfo,
    //         errorInfo: response.errorInfo,
    //       });
    //     }
    //   }
    // };

    const { data: dataListCompany, isLoading: isLoadingListCompany } = useQuery(
      {
        queryKey: ["Mst_Customer_Search"],
        queryFn: async () => {
          const response = await api.Mst_Customer_Search({
            FlagActive: FlagActiveEnum.Active,
            Ft_PageSize: config.MAX_PAGE_ITEMS,
            Ft_PageIndex: 0,
          });
          if (response.isSuccess) {
            return response.DataList;
          } else {
            showError({
              message: t(response.errorCode),
              debugInfo: response.debugInfo,
              errorInfo: response.errorInfo,
            });
          }
        },
      }
    );

    const { data: checked, isLoading: isLoadingCheck } = useQuery({
      queryKey: ["Mst_Customer_Search_Check", JSON.stringify(cpnCustomerData)],
      queryFn: async () => {
        const response = await api.Mst_Customer_Search({
          FlagActive: FlagActiveEnum.Active,
          Ft_PageSize: config.MAX_PAGE_ITEMS,
          Ft_PageIndex: 0,
          CustomerCodeSys: cpnCustomerData.CustomerCodeSys,
        });
        if (response.isSuccess) {
          return response.DataList;
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
        }
      },
    });

    const listField: ColumnOptions[] = [
      {
        dataField: "CustomerName",
        editorType: "dxTextBox",
        label: {
          text: t("CustomerName"),
        },
        editorOptions: {
          height: "30px",
        },
      },
      {
        dataField: "CustomerEmail",
        editorType: "dxTextBox",
        label: {
          text: t("CustomerEmail"),
        },
        editorOptions: {
          height: "30px",
        },
      },
      {
        dataField: "CustomerAddress",
        editorType: "dxTextBox",
        label: {
          text: t("CustomerAddress"),
        },
        editorOptions: {
          height: "30px",
        },
      },
      {
        dataField: "RepresentPosition",
        editorType: "dxTextBox",
        label: {
          text: t("RepresentPosition"),
        },
        editorOptions: {
          height: "30px",
        },
      },
      {
        dataField: "CustomerCodeSys",
        editorType: "dxSelectBox",
        editorOptions: {
          dataSource: dataListCompany ?? [],
          height: "30px",
          displayExpr: "CustomerName",
          valueExpr: "CustomerCodeSys",
          searchExpr: ["CustomerName", "CustomerCodeSys"],
          searchEnabled: true,
        },
      },
    ];

    useEffect(() => {}, [isLoadingListCompany]);

    if (isLoadingListCompany || isLoadingCheck) {
      return <LoadPanel />;
    }

    const handleNavigate = () => {
      if (checked) {
      }
    };

    const handleNavigation = () => {};

    const ButtonComponent = () => {
      if (isLoadingCheck || isLoadingListCompany) {
        return <></>;
      } else {
        if (checked?.length) {
          return (
            <button
              className="mr-1"
              onClick={() => {
                navigate(`/customer/edit/${checked[0].CustomerCodeSys}`);
              }}
            >
              <Icon name="edit" />
            </button>
          );
        } else {
          return (
            <button
              className="mr-1"
              onClick={() => {
                navigate("/customer/add");
              }}
            >
              <Icon name="add" />
            </button>
          );
        }
      }
    };

    return (
      <>
        {!!data && (
          <>
            <div className="group-head w-full pl-1 pr-1">
              <span>Thông tin khách hàng</span>
              <div className="float-right">
                {ButtonComponent()}
                {isExpand && (
                  <button
                    onClick={() => {
                      setExpand(false);
                    }}
                  >
                    <Icon name="expandCampaign"></Icon>
                  </button>
                )}
                {!isExpand && (
                  <button
                    onClick={() => {
                      setExpand(true);
                    }}
                  >
                    <Icon
                      style={{ transform: "rotate(180deg)" }}
                      name="expandCampaign"
                    ></Icon>
                  </button>
                )}
              </div>
            </div>
            <div className="w-ful p-2">
              {isExpand && (
                <Form formData={data} ref={ref}>
                  <GroupItem>
                    {listField.map((item: any, index: number) => {
                      return <SimpleItem {...item} key={index} />;
                    })}
                  </GroupItem>
                </Form>
              )}
            </div>
          </>
        )}
      </>
    );
  }
);
