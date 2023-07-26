import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { showErrorAtom } from "@/packages/store";
import {
  CcCall,
  Cpn_Campaign,
  Cpn_CampaignCustomerData,
  FlagActiveEnum,
} from "@/packages/types";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  DropDownBox,
  Form,
  ScrollView,
  SelectBox,
  TagBox,
  TextBox,
} from "devextreme-react";
import { Height } from "devextreme-react/range-selector";
import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import { useSetAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { CpnCustomerList } from "./components/cpn_customerList";
import "./styles.scss";
import { Cpn_CampaignPerformDetail } from "./components/cpn_perform_detail";
import { Avatar } from "../eticket/components/avatar";
import { any } from "ts-pattern/dist/patterns";
import { Cpn_CustomerInfo } from "./components/customer_info";
import { nanoid } from "nanoid";
import { Cpn_CampaignInfo } from "./components/campaign_info";
import { usePhone } from "@/packages/hooks/usePhone";
import { SimpleItem } from "devextreme-react/form";
import { toast } from "react-toastify";
import debug from "debug";
import { ColumnOptions } from "@/types";
import { Icon } from "@/packages/ui/icons";

export const Cpn_CampaignPerformPage = () => {
  const objCpn_CampaignCustomerData: Cpn_CampaignCustomerData = {
    Idx: 0,
    QtyCall: 0,
  };
  const windowSize = useWindowSize();
  const [currentCpnCustomer, setCurrentCpnCustomer] =
    useState<Cpn_CampaignCustomerData | null>(null);
  const onItemSelected = (item: Cpn_CampaignCustomerData) => {
    setCurrentCpnCustomer(item);
  };

  console.log("currentCpnCustomer ", currentCpnCustomer);
  const { t } = useI18n("Cpn_CampaignPerformPage");
  const formSearchRef = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const { auth } = useAuth();
  const [campaignListData, setCampaignListData] = useState<
    (Cpn_Campaign | undefined)[]
  >([]);

  console.log("campaignListData ", campaignListData);

  const [formData, setFormData] = useState({
    Status: ["NOANSWER", "CALLAGAIN", "FAILED"],
  });

  const [selectedCp, setSelectedCp] = useState<any>(null);
  const customerRef: any = useRef(null);
  const formDynamicRef: any = useRef(null);
  const normalRef: any = useRef(null);
  const api = useClientgateApi();
  const phone = usePhone();

  const [campaignSearchConditions] = useState<any>({
    FlagActive: FlagActiveEnum.Active,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    CampaignTypeName: "",
    CampaignTypeDesc: "",
    CampaignStatus: "STARTED,CONTINUED",
  });

  const refetchCampaignList = async () => {
    const response = await api.Cpn_Campaign_Search(campaignSearchConditions);

    if (response.isSuccess) {
      if (response.DataList) setCampaignListData(response.DataList);
    } else {
      showError({
        message: t(response.errorCode),
        debugInfo: response.debugInfo,
        errorInfo: response.errorInfo,
      });
    }
  };

  const campaignCustomerStatuses = useMemo(() => {
    return [
      { Code: "", Title: "Tất cả", icon: "", color: "" },
      {
        Code: "PENDING",
        Title: "Chưa thực hiện",
        icon: "ic-status-pending",
        color: "#CFB929",
      },
      {
        Code: "DONE",
        Title: "Thành công",
        icon: "ic-status-done",
        color: "#0FBC2B",
      },
      {
        Code: "FAILED",
        Title: "Thực hiện cuộc gọi lỗi",
        icon: "ic-status-failed",
        color: "#D62D2D",
      },
      {
        Code: "NOANSWER",
        Title: "Đã gọi nhưng không nghe máy",
        icon: "ic-status-noanswer",
        color: "#00BEA7",
      },
      {
        Code: "CALLAGAIN",
        Title: "Hẹn gọi lại",
        icon: "ic-status-callagain",
        color: "#8C62D1",
      },
      {
        Code: "NOANSWERRETRY",
        Title: "Đã gọi hết số lượt nhưng không nghe máy",
        icon: "ic-status-noanswerretry",
        color: "#E48203",
      },
      {
        Code: "DONOTCALL",
        Title: "Không liên hệ",
        icon: "ic-status-donotcall",
        color: "#777",
      },
      {
        Code: "FAILEDRETRY",
        Title: " Đã gọi hết số lượt nhưng cuộc gọi vẫn lỗi",
        icon: "ic-status-failedretry",
        color: "#298EF2",
      },
    ];
  }, []);

  useEffect(() => {
    refetchCampaignList();
  }, []);

  const [cpCustomerSearchConditions, setCpCustomerSearchConditions] =
    useState<any>({
      CampaignCode: null,
      CampaignCustomerStatus: null,
      CustomerCodeSys: null,
    });

  const [campaignCustomerData, setCampaignCustomerData] = useState<
    (Cpn_CampaignCustomerData | undefined)[]
  >([]);

  const [renderCustomer, setrenderCustomer] = useState<
    (Cpn_CampaignCustomerData | undefined)[]
  >([]);

  const refetchCampaignCustomer = async () => {
    if (!!selectedCp && selectedCp !== "") {
      const response = await api.Cpn_CampaignCustomer_Get({
        CampaignCode: selectedCp,
        // CampaignCustomerStatus: "",
        //CustomerCodeSys: null
      });

      if (response.isSuccess && !!response.Data) {
        setCampaignCustomerData(response.Data);
        setrenderCustomer(response.Data);
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    }
  };

  useEffect(() => {
    refetchCampaignCustomer();
  }, [selectedCp]);

  const doCall = (phoneNo: any) => {
    objCpn_CampaignCustomerData.CallID = undefined;
    phone.call(phoneNo, (call: CcCall) => {
      objCpn_CampaignCustomerData.CallID = returnValue(call.Id);
    });
  };

  const handleSave = async (text: string) => {
    let value: any = {
      customer: {},
      dynamic: {},
      normal: {},
    };
    if (customerRef?.current && formDynamicRef?.current && normalRef?.current) {
      value.customer = customerRef?.current.instance.option("formData");
      value.dynamic = formDynamicRef?.current.instance.option("formData");
      value.normal = normalRef?.current.instance.option("formData");
      const obj = {
        CpnCustomerSaveType: text,
        CampaignCode: currentCpnCustomer?.CampaignCode,
        OrgID: value.customer?.OrgID,
        Idx: currentCpnCustomer?.Idx ?? "",
        AgentCode: currentCpnCustomer?.AgentCode,
        CustomerName: value.customer?.CustomerName,
        CustomerEmail: value.customer?.CustomerEmail,
        CustomerAddress: value.customer?.CustomerAddress,
        CustomerCompany: currentCpnCustomer?.CustomerCompany ?? "",
        JsonCustomerInfo: JSON.stringify(value.dynamic),
        CustomerFeedBack: value.normal?.CustomerFeedBack,
        Remark: value.normal?.Remark ?? "",
        CallID: objCpn_CampaignCustomerData.CallID,
      };

      const response = await api.Cpn_CampaignCustomer_Save(obj);
      if (response.isSuccess) {
        toast.success(t(`${text} Success`));
      } else {
        showError({
          message: t(response.errorCode),
          debugInfo: response.debugInfo,
          errorInfo: response.errorInfo,
        });
      }
    }
  };

  const CustomerItem = ({ item }: { item: Cpn_CampaignCustomerData }) => {
    const phoneNo = useMemo(() => {
      let r = item.CustomerPhoneNo1;
      if (!r || r == "") r = item.CustomerPhoneNo2;
      if (!r || r == "") r = item.CustomerPhoneNo;

      return r;
    }, [item]);
    return (
      <div className="customer-item">
        <div
          className="flex  cursor-pointer"
          onClick={() => onItemSelected(item)}
        >
          <div>
            <div className="flex align-items-center">
              <Avatar
                img={item.CustomerAvatarPath}
                name={item.CustomerName}
                className={"mr-2 ml-1"}
              />
              <span className="customer-name">{item.CustomerName}</span>
            </div>
            <p className="customer-phone">{phoneNo}</p>
          </div>
        </div>
        {!!phoneNo && (
          <Button
            className="btn-call"
            onClick={() => {
              doCall(phoneNo);
            }}
          >
            <Icon name="phone"></Icon>
          </Button>
        )}
      </div>
    );
  };

  const isNullOrEmpty = function (_value: any) {
    if (
      _value !== undefined &&
      _value !== null &&
      _value.toString().trim().length > 0
    ) {
      return false;
    }
    return true;
  };

  const returnValue = function (_data: any) {
    var value = "";
    if (!isNullOrEmpty(_data)) {
      value = _data.toString().trim();
    }
    return value;
  };

  const hanldleClickSearch = (event: any) => {
    if (formSearchRef.current) {
      const formSearch = formSearchRef?.current?.instance.option("formData");
      const list = [...campaignCustomerData] ?? [];
      const value = list.filter((item: any) => {
        if (!isNullOrEmpty(formSearch.Keyword) && formSearch.Status.length) {
          return (
            (returnValue(item.CustomerCode).includes(formSearch.Keyword) ||
              returnValue(item.CustomerName).includes(formSearch.Keyword) ||
              returnValue(item.CustomerEmail).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo1).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo2).includes(
                formSearch.Keyword
              )) &&
            formSearch.Status.includes(returnValue(item.CampaignStatus))
          );
        } else {
          if (!isNullOrEmpty(formSearch.Keyword)) {
            return (
              returnValue(item.CustomerCode).includes(formSearch.Keyword) ||
              returnValue(item.CustomerName).includes(formSearch.Keyword) ||
              returnValue(item.CustomerEmail).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo1).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo2).includes(formSearch.Keyword)
            );
          } else if (formSearch.Status.length) {
            return formSearch.Status.includes(returnValue(item.CampaignStatus));
          } else {
            return true;
          }
        }
      });
      setrenderCustomer(value);
      return;
    }
    setrenderCustomer(campaignCustomerData);
    return;
  };

  const arrayField: ColumnOptions[] = [
    {
      dataField: "Status",
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: campaignCustomerStatuses,
        displayExpr: "Title",
        valueExpr: "Code",
      },
      render: (param: any) => {
        const { dataField, component: formComponent } = param;
        return (
          <TagBox
            className="mb-2"
            defaultValue={formData.Status}
            height={30}
            onValueChange={(data) => {
              formComponent.updateData(dataField, data);
            }}
            dataSource={campaignCustomerStatuses}
            searchEnabled={true}
            displayExpr="Title"
            valueExpr={"Code"}
            itemRender={(item) => (
              <span
                className={`p-1 status-${item.Code.toLowerCase()}`}
                style={{ color: item.color }}
              >
                <i className={`${item.icon} mr-2`} />
                {item.Title}
              </span>
            )}
          />
        );
      },
    },
    {
      dataField: "Keyword",
      editorType: "dxTextBox",
      editorOptions: {
        height: 30,
      },
    },
  ];

  return (
    <AdminContentLayout className={"Cpn_CampaignPerformPage"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="font-bold font-header dx-font-m">
              {t("Campaign_Perform")}
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot name={"After"}>
            <Button
              className="mr-1"
              stylingMode={"contained"}
              type="default"
              text={"Lưu"}
              onClick={() => handleSave("SAVE")}
            />
            <Button
              className="mr-1"
              stylingMode={"contained"}
              type="default"
              text={"Hẹn gọi lại"}
              onClick={() => handleSave("CALLAGAIN")}
            />
            <Button
              className="mr-1"
              stylingMode={"contained"}
              type="default"
              text={"Không liên hệ"}
              onClick={() => handleSave("DONOTCALL")}
            />
          </PageHeaderNoSearchLayout.Slot>
        </PageHeaderNoSearchLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div
          className="w-full"
          style={{ background: "#f9f9f9", height: windowSize.height - 120 }}
        >
          <ResponsiveBox className={"w-full"}>
            <Row></Row>
            <Col ratio={2}></Col>
            <Col ratio={5}></Col>
            <Col ratio={2}></Col>
            <Item>
              <Location row={0} col={0} />
              {campaignListData.length > 0 && (
                <div className="w-full pr-1 pl-1">
                  <div
                    className="w-full"
                    style={{
                      background: "#fff",
                      height: windowSize.height - 120,
                    }}
                  >
                    <div className="w-full p-2">
                      <span
                        className="block"
                        style={{
                          marginBottom: "6px",
                          fontSize: "14px",
                          color: "#5f7d95",
                        }}
                      >
                        Chiến dịch
                      </span>
                      <SelectBox
                        className="mb-2"
                        onSelectionChanged={(ddata) => {
                          // setCurrentCpnCustomer(null);
                          setSelectedCp(ddata.selectedItem.CampaignCode);
                        }}
                        onValueChange={() => {
                          setCurrentCpnCustomer(null);
                          // console.log("coming");
                        }}
                        value={selectedCp}
                        dataSource={campaignListData}
                        searchEnabled={true}
                        valueExpr="CampaignCode"
                        displayExpr="CampaignName"
                      />
                      <Form
                        className="campaign-perform"
                        formData={formData}
                        ref={formSearchRef}
                      >
                        {arrayField.map((item: any, index: number) => {
                          return <SimpleItem {...item} key={index} />;
                        })}
                      </Form>

                      <Button
                        style={{ marginTop: "14px" }}
                        className="mr-2"
                        width={"100%"}
                        stylingMode={"contained"}
                        type="default"
                        text={t("Search")}
                        onClick={(event: any) => {
                          hanldleClickSearch(event);
                        }}
                      />
                      {!!campaignCustomerData &&
                        campaignCustomerData.length > 0 && (
                          <>
                            <div className="w-full pt-3 pb-2">
                              <strong className="float-left">
                                Danh sách khách hàng
                              </strong>
                              <span className="text-grey float-right">
                                tổng: {renderCustomer.length}
                              </span>
                            </div>

                            <ScrollView
                              style={{ height: windowSize.height - 350 }}
                              className="pt-1"
                            >
                              <div className="w-full">
                                {renderCustomer.map(
                                  (
                                    item: Cpn_CampaignCustomerData | undefined
                                  ) => {
                                    return item ? (
                                      <CustomerItem
                                        key={nanoid()}
                                        item={item}
                                      />
                                    ) : (
                                      <></>
                                    );
                                  }
                                )}
                              </div>
                            </ScrollView>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </Item>
            <Item>
              <Location row={0} col={1} />

              <div className="w-full pr-1">
                <div
                  className="w-full"
                  style={{
                    background: "#fff",
                    height: windowSize.height - 120,
                  }}
                >
                  {currentCpnCustomer != null && (
                    <Cpn_CampaignPerformDetail
                      ref={formDynamicRef}
                      normalRef={normalRef}
                      cpnCustomerData={currentCpnCustomer}
                    />
                  )}
                </div>
              </div>
            </Item>

            <Item>
              <Location row={0} col={2} />
              <div
                className="w-full"
                style={{ background: "#fff", height: windowSize.height - 120 }}
              >
                <ScrollView style={{ height: windowSize.height - 120 }}>
                  <div className="w-full">
                    {currentCpnCustomer != null && (
                      <Cpn_CustomerInfo
                        ref={customerRef}
                        cpnCustomerData={currentCpnCustomer}
                      />
                    )}

                    {currentCpnCustomer != null &&
                      campaignListData != null &&
                      campaignListData.length > 0 &&
                      selectedCp && (
                        <Cpn_CampaignInfo
                          cpnCampainData={campaignListData.find(
                            (c) => c?.CampaignCode == selectedCp
                          )}
                          cpnCustomerData={currentCpnCustomer}
                        />
                      )}
                  </div>
                </ScrollView>
              </div>
            </Item>
          </ResponsiveBox>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
