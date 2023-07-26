import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { authAtom, showErrorAtom } from "@/packages/store";
import { getDay, getMonth } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { Button, Tabs } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HeaderForm from "../components/header-form";
import {
  SLA_EditType,
  defaultSLAHeaderForm,
  defaultTicketInfo,
  headerForm,
  ticketInfo,
} from "../components/store";
import TabOne from "./TabOne/TabOne";
import TabTwo from "./TabTwo/TabTwo";
import { holidayListAtom } from "./TabTwo/tabs/Holiday/store";
import {
  initWorkingTimeList,
  workingTimeList,
} from "./TabTwo/tabs/WorkingTime/store";

interface formValue {
  SLALevel: string;
  SLADesc: string;
  FirstResTime: string;
  ResolutionTime: string;
  SLAStatus: "0" | "1";
}

const SLA_Page = () => {
  const { SLAID }: any = useParams();

  const headerFormRef: any = useRef();

  const tabOneRef: any = useRef();

  const api = useClientgateApi();

  const navigate = useNavigate();

  const { auth } = useAuth();

  const authAtomValue = useAtomValue(authAtom);

  const showError = useSetAtom(showErrorAtom);

  const setHolidayList = useSetAtom(holidayListAtom);

  const setFormValue = useSetAtom(headerForm);

  const workingTime = useAtomValue(workingTimeList);

  const setWorkingTimeList = useSetAtom(workingTimeList);

  const setTicketInfo = useSetAtom(ticketInfo);

  const { data, isLoading, refetch }: any = useQuery(
    ["Mst_SLA_Deatail", SLAID],
    async () => {
      if (!SLAID) {
        if (type != "create") {
          setType("create");
        }
        setFormValue(defaultSLAHeaderForm);
        setHolidayList([]);
        setTicketInfo(defaultTicketInfo);
        setWorkingTimeList(initWorkingTimeList);
        return;
      }
      const resp: any = await api.Mst_SLA_GetBySLAID(SLAID);

      if (resp.isSuccess && SLAID) {
        const firstTime = (resp?.Data?.Mst_SLA?.FirstResTime - 420) * 60000;

        const resolutionTime =
          (resp?.Data?.Mst_SLA?.ResolutionTime - 420) * 60000;

        setFormValue({
          ...resp?.Data?.Mst_SLA,
          FirstResTime: firstTime,
          ResolutionTime: resolutionTime,
        });

        setTicketInfo({
          TicketType:
            resp?.Data?.Lst_Mst_SLATicketType?.map((item: any) => {
              return item?.TicketType;
            }) || [],
          TicketCustomType:
            resp?.Data?.Lst_Mst_SLATicketCustomType?.map(
              (item: any) => item?.TicketCustomType
            ) || [],
          Customer:
            resp?.Data?.Lst_Mst_SLACustomerCN.filter((item: any) => {
              if (
                item?.CustomerCodeSys &&
                item?.CustomerCodeSys != "null" &&
                item?.CustomerCodeSys != undefined
              ) {
                return item;
              }
            })?.map((item: any) => {
              return item?.CustomerCodeSys;
            }) || [],
          CustomerGroup:
            resp?.Data?.Lst_Mst_SLACustomerGroupCN?.filter((item: any) => {
              if (
                item?.CustomerGrpCode &&
                item?.CustomerGrpCode != "null" &&
                item?.CustomerGrpCode != undefined
              ) {
                return item;
              }
            })?.map((item: any) => {
              return item?.CustomerGrpCode;
            }) || [],
          CustomerEnterprise:
            resp?.Data?.Lst_Mst_SLACustomerDN?.filter((item: any) => {
              if (
                item?.CustomerCodeSys &&
                item?.CustomerCodeSys != "null" &&
                item?.CustomerCodeSys != undefined
              ) {
                return item;
              }
            })?.map((item: any) => {
              return item?.CustomerCodeSys;
            }) || [],
          CustomerEnterpriseGroup:
            resp?.Data?.Lst_Mst_SLACustomerGroupDN?.filter((item: any) => {
              if (
                item?.CustomerGrpCode &&
                item?.CustomerGrpCode != "null" &&
                item?.CustomerGrpCode != undefined
              ) {
                return item;
              }
            })?.map((item: any) => {
              return item?.CustomerGrpCode;
            }) || [],
        });

        if (resp?.Data?.Lst_Mst_SLAHoliday) {
          setHolidayList(
            resp?.Data?.Lst_Mst_SLAHoliday?.map((item: any) => {
              return {
                Day: getDay(item?.SLAHoliday),
                Month: getMonth(item?.SLAHoliday),
                Event: item?.SLAHolidayName,
                id: nanoid(),
              };
            })
          );
        }

        if (resp?.Data?.Lst_Mst_SLAWorkingDay) {
          const list: any = resp?.Data?.Lst_Mst_SLAWorkingDay;

          const currentList = workingTime.map((item: any) => {
            const findItem = list?.filter(
              (c: any) => c?.SLAWorkingDayCode == item.Day
            );
            if (findItem && findItem?.length > 0) {
              return {
                ...item,
                Check: true,
                hasMoreSlide: findItem?.length == 2,
                Slider: item.Slider.map((s: any) => {
                  const f = findItem.find((fc: any) => fc.Idx == s.Idx);
                  if (f) {
                    return {
                      ...s,
                      TimeStart: f.WorkingDTimeFrom,
                      TimeEnd: f.WorkingDTimeTo,
                    };
                  }
                  return s;
                }),
              };
            }
            return item;
          });

          setWorkingTimeList(currentList);
        }
        return resp;
      } else {
        showError({
          message: resp?.errorCode,
          debugInfo: resp?.debugInfo,
          errorInfo: resp?.errorInfo,
        });
      }
    }
  );

  useEffect(() => {
    if (SLAID) {
      refetch();
    }
  }, [SLAID]);

  const tabOptions = [
    {
      text: "Thiết lập phạm vi áp dụng SLA",
      key: 0,
      component: <TabOne ref={tabOneRef}></TabOne>,
    },
    {
      text: "Thiết lập khung thời gian hỗ trợ",
      key: 1,
      component: <TabTwo />,
    },
  ];

  const [currentTab, setCurrentTab] = useState<any>(0);

  const currentComponent = tabOptions.find(
    (item: any) => item.key == currentTab
  )?.component;

  const type = useAtomValue(SLA_EditType);

  const setType = useSetAtom(SLA_EditType);

  const handleEdit = () => {
    setType("edit");
  };

  const handleCancel = () => {
    navigate(`/${auth.networkId}/eticket/SLA`);
  };

  const headerFormValue = useAtomValue(headerForm);
  const ticketInfoValue = useAtomValue(ticketInfo);
  const holidayListValue = useAtomValue(holidayListAtom);

  const handleSave = async () => {
    if (!headerFormRef?.current?.instance?.validate()?.isValid) {
      toast.error("Vui lòng nhập đủ các trường!");
      return;
    }

    const Lst_Mst_SLATicketType =
      ticketInfoValue.TicketType?.map((item: any) => {
        return {
          TicketType: item,
        };
      }) ?? [];

    const Lst_Mst_SLATicketCustomType =
      ticketInfoValue.TicketCustomType?.map((item: any) => {
        return {
          TicketCustomType: item,
        };
      }) ?? [];

    const Lst_Mst_SLACustomerCN = ticketInfoValue.Customer?.map((item: any) => {
      return {
        CustomerCodeSys: item,
        CustomerType: "CANHAN",
      };
    });

    const Lst_Mst_SLACustomerDN = ticketInfoValue.CustomerEnterprise?.map(
      (item: any) => {
        return {
          CustomerCodeSys: item,
          CustomerType: "DOANHNGHIEP",
        };
      }
    );

    const Lst_Mst_SLACustomerGroupCN = ticketInfoValue.CustomerGroup?.map(
      (item: any) => {
        return {
          CustomerGrpCode: item,
          CustomerGrpType: "CANHAN",
        };
      }
    );

    const Lst_Mst_SLACustomerGroupDN =
      ticketInfoValue.CustomerEnterpriseGroup?.map((item: any) => {
        return {
          CustomerGrpCode: item,
          CustomerGrpType: "DOANHNGHIEP",
        };
      });

    const Lst_Mst_SLAHoliday =
      holidayListValue?.map((item: any) => {
        return {
          SLAHoliday: `${`0${item.Day}`.slice(-2)}-${`0${item.Month}`.slice(
            -2
          )}`,
          SLAHolidayName: item.Event,
        };
      }) ?? [];

    const Lst_Mst_SLAWorkingDay =
      workingTime
        .filter((item: any) => item.Check)
        .reduce((prev: any, cur: any) => {
          if (cur.hasMoreSlide) {
            cur.Slider.map((c: any) => {
              prev.push({
                SLAWorkingDayCode: cur.Day,
                WorkingDTimeFrom: c.TimeStart,
                WorkingDTimeTo: c.TimeEnd,
                Idx: c.Idx,
              });
            });
          } else {
            prev.push({
              SLAWorkingDayCode: cur.Day,
              WorkingDTimeFrom: cur.Slider[0].TimeStart,
              WorkingDTimeTo: cur.Slider[0].TimeEnd,
              Idx: cur.Slider[0].Idx,
            });
          }
          return prev;
        }, []) ?? [];

    const Mst_SLA = {
      SLAID: "",
      OrgID: authAtomValue.orgId,
      ANDConditionDetails: null,
      ORConditionDetails: null,
      EveryResTime: "",
      ...headerFormValue,
      FirstResTime: Math.floor(headerFormValue.FirstResTime / 60000) + 420,
      ResolutionTime: Math.floor(headerFormValue.ResolutionTime / 60000) + 420,
      FlagAllTicketCustomType:
        Lst_Mst_SLATicketCustomType.length > 0 ? "0" : "1",
      FlagAllTicketType: Lst_Mst_SLATicketType.length > 0 ? "0" : "1",
      FlagAllCustomerCN: Lst_Mst_SLACustomerCN.length > 0 ? "0" : "1",
      FlagAllCustomerDN: Lst_Mst_SLACustomerCN.length > 0 ? "0" : "1",
      FlagAllCustomerGrpCN: Lst_Mst_SLACustomerGroupCN.length > 0 ? "0" : "1",
      FlagAllCustomerGrpDN: Lst_Mst_SLACustomerGroupDN.length > 0 ? "0" : "1",
    };

    const result = {
      Mst_SLA,
      Lst_Mst_SLATicketType,
      Lst_Mst_SLATicketCustomType,
      Lst_Mst_SLACustomerCN,
      Lst_Mst_SLACustomerDN,
      Lst_Mst_SLACustomerGroupCN,
      Lst_Mst_SLACustomerGroupDN,
      Lst_Mst_SLAHoliday,
      Lst_Mst_SLAWorkingDay,
    };

    const resp: any = await api.Mst_SLA_Create(result);

    if (resp.isSuccess) {
      toast.success("Tạo mới thành công!");
      navigate(`/${auth.networkId}/eticket/SLA`);
    } else {
      showError({
        message: resp?.errorCode,
        debugInfo: resp?.debugInfo,
        errorInfo: resp?.errorInfo,
      });
    }
  };

  const handleUpdate = async () => {
    if (!headerFormRef?.current?.instance?.validate()?.isValid) {
      toast.error("Vui lòng nhập đủ các trường!");
      return;
    }

    const Lst_Mst_SLATicketType =
      ticketInfoValue.TicketType?.map((item: any) => {
        return {
          TicketType: item,
        };
      }) ?? [];

    const Lst_Mst_SLATicketCustomType =
      ticketInfoValue.TicketCustomType?.map((item: any) => {
        return {
          TicketCustomType: item,
        };
      }) ?? [];

    const Lst_Mst_SLAHoliday =
      holidayListValue?.map((item: any) => {
        return {
          SLAHoliday: `${`0${item.Day}`.slice(-2)}-${`0${item.Month}`.slice(
            -2
          )}`,
          SLAHolidayName: item.Event,
        };
      }) ?? [];

    const Lst_Mst_SLAWorkingDay =
      workingTime
        .filter((item: any) => item.Check)
        .reduce((prev: any, cur: any) => {
          if (cur.hasMoreSlide) {
            cur.Slider.map((c: any) => {
              prev.push({
                SLAWorkingDayCode: cur.Day,
                WorkingDTimeFrom: c.TimeStart,
                WorkingDTimeTo: c.TimeEnd,
                Idx: c.Idx,
              });
            });
          } else {
            prev.push({
              SLAWorkingDayCode: cur.Day,
              WorkingDTimeFrom: cur.Slider[0].TimeStart,
              WorkingDTimeTo: cur.Slider[0].TimeEnd,
              Idx: cur.Slider[0].Idx,
            });
          }
          return prev;
        }, []) ?? [];

    const Lst_Mst_SLACustomerCN = ticketInfoValue.Customer?.map((item: any) => {
      return {
        CustomerCodeSys: item,
        CustomerType: "CANHAN",
      };
    });

    const Lst_Mst_SLACustomerDN = ticketInfoValue.CustomerEnterprise?.map(
      (item: any) => {
        return {
          CustomerCodeSys: item,
          CustomerType: "DOANHNGHIEP",
        };
      }
    );

    const Lst_Mst_SLACustomerGroupCN = ticketInfoValue.CustomerGroup?.map(
      (item: any) => {
        return {
          CustomerGrpCode: item,
          CustomerGrpType: "CANHAN",
        };
      }
    );

    const Lst_Mst_SLACustomerGroupDN =
      ticketInfoValue.CustomerEnterpriseGroup?.map((item: any) => {
        return {
          CustomerGrpCode: item,
          CustomerGrpType: "DOANHNGHIEP",
        };
      });

    const Mst_SLA = {
      SLAID: SLAID,
      OrgID: authAtomValue.orgId,
      ANDConditionDetails: null,
      ORConditionDetails: null,
      EveryResTime: "",

      ...headerFormValue,
      FirstResTime: Math.floor(headerFormValue.FirstResTime / 60000) + 420,
      ResolutionTime: Math.floor(headerFormValue.ResolutionTime / 60000) + 420,
      FlagAllTicketCustomType:
        Lst_Mst_SLATicketCustomType.length > 0 ? "0" : "1",
      FlagAllTicketType: Lst_Mst_SLATicketType.length > 0 ? "0" : "1",
      FlagAllCustomerCN: Lst_Mst_SLACustomerCN.length > 0 ? "0" : "1",
      FlagAllCustomerDN: Lst_Mst_SLACustomerCN.length > 0 ? "0" : "1",
      FlagAllCustomerGrpCN: Lst_Mst_SLACustomerGroupCN.length > 0 ? "0" : "1",
      FlagAllCustomerGrpDN: Lst_Mst_SLACustomerGroupDN.length > 0 ? "0" : "1",
    };

    const result = {
      Mst_SLA,
      Lst_Mst_SLATicketType,
      Lst_Mst_SLATicketCustomType,
      Lst_Mst_SLACustomerCN,
      Lst_Mst_SLACustomerDN,
      Lst_Mst_SLACustomerGroupCN,
      Lst_Mst_SLACustomerGroupDN,
      Lst_Mst_SLAHoliday,
      Lst_Mst_SLAWorkingDay,
    };

    const resp: any = await api.Mst_SLA_Update(result);

    if (resp.isSuccess) {
      toast.success("Cập nhật thành công!");
      navigate(`/${auth.networkId}/eticket/SLA`);
    } else {
      showError({
        message: resp?.errorCode,
        debugInfo: resp?.debugInfo,
        errorInfo: resp?.errorInfo,
      });
    }
  };

  const handleDelete = async () => {
    const req = {
      Mst_SLA: {
        SLAID: SLAID,
        OrgID: auth.orgData?.Id,
      },
      Lst_Mst_SLATicketType: [],
      Lst_Mst_SLATicketCustomType: [],
      Lst_Mst_SLACustomer: [],
      Lst_Mst_SLACustomerGroup: [],
      Lst_Mst_SLAHoliday: [],
      Lst_Mst_SLAWorkingDay: [],
    };

    const resp: any = await api.Mst_SLA_Delete(req);

    if (resp.isSuccess) {
      toast.success("Xoá thành công!");
      navigate(`/${auth.networkId}/eticket/SLA`);
    } else {
      showError({
        message: resp?.errorCode,
        debugInfo: resp?.debugInfo,
        errorInfo: resp?.errorInfo,
      });
    }
  };

  return (
    <>
      <div className="flex justify-end">
        {SLAID && type == "detail" && (
          <>
            <Button
              style={{
                padding: 10,
                margin: 10,
                background: "green",
                color: "white",
              }}
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
            <Button
              style={{
                padding: 10,
                margin: 10,
              }}
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </>
        )}

        {SLAID && type == "edit" && (
          <>
            <Button
              style={{
                padding: 10,
                margin: 10,
                background: "green",
                color: "white",
              }}
              onClick={handleUpdate}
            >
              Cập nhật
            </Button>
            <Button
              style={{
                padding: 10,
                margin: 10,
              }}
              onClick={handleCancel}
            >
              Thoát
            </Button>
          </>
        )}

        {(!SLAID || type == "create") && (
          <>
            <Button
              style={{
                padding: 10,
                margin: 10,
                background: "green",
                color: "white",
              }}
              onClick={handleSave}
            >
              Lưu
            </Button>
            <Button
              style={{
                padding: 10,
                margin: 10,
              }}
              onClick={handleCancel}
            >
              Thoát
            </Button>
          </>
        )}
      </div>

      <HeaderForm ref={headerFormRef} />

      <Tabs
        dataSource={tabOptions}
        selectedIndex={currentTab}
        onItemClick={(value: any) => {
          setCurrentTab(value.itemIndex);
        }}
      ></Tabs>

      {currentComponent}
    </>
  );
};

export default SLA_Page;
