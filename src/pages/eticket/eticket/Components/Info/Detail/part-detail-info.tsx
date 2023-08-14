import { splitString } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { EticketT } from "@packages/types";
import { LoadPanel, ScrollView, Tabs } from "devextreme-react";
import { ReactNode, memo, useState } from "react";
import { Avatar } from "../../../../components/avatar";
import { convertData } from "./CustomizeJson";
import "./style.scss";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { showErrorAtom } from "@/packages/store";
import { useAuth } from "@/packages/contexts/auth";
import { Link } from "react-router-dom";
import ContentFile from "./CustomizeJson/contentFIle";
export const PartDetailInfo = memo(
  ({ data, dataDynamicField }: { data: EticketT; dataDynamicField: any[] }) => {
    const windowSize = useWindowSize();
    const showError = useSetAtom(showErrorAtom);
    const scrollHeight = windowSize.height - 100;
    const { t } = useI18n("PartDetailInfo");
    const { auth } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const {
      Lst_ET_Ticket,
      Lst_ET_TicketAttachFile,
      Lst_ET_TicketCustomer,
      Lst_ET_TicketFollower,
      Lst_ET_TicketMessage,
      Lst_ET_TicketHO,
    }: any = data;

    const dataRender = [
      ...Lst_ET_Ticket,
      ...Lst_ET_TicketCustomer,
      {
        Follower: [...Lst_ET_TicketFollower],
      },
    ];

    console.log("dataRender ", dataRender);

    const dataRenderHO = [
      ...Lst_ET_Ticket,
      ...(Array.isArray(Lst_ET_TicketHO) ? Lst_ET_TicketHO : []),
      {
        Follower: [...Lst_ET_TicketFollower],
      },
    ];

    const flatArr = dataRender.reduce((acc, item) => {
      return {
        ...acc,
        ...item,
      };
    }, {});

    console.log("flatArr ", flatArr);

    const flatArrHO = dataRenderHO.reduce((acc, item) => {
      return {
        ...acc,
        ...item,
      };
    }, {});

    const listField = [
      "AgentName", // Agent phụ trách
      "TicketDeadline", // Deadline
      "AgentTicketPriorityName", // Mức ưu tiên
      "TicketJsonInfo", // Thông tin động của eTicket
      "NNTFullName", // Chi nhánh/ đại lý phụ trách
      "DepartmentName", // Phòng ban
      "AgentTicketCustomTypeName", // Phân loại tùy chọn
      "AgentTicketSourceName", // Nguồn
      "ReceptionDTimeUTC", // thời điểm tiếp nhận
      "AgentReceptionChannelName", // Kênh tiếp nhận
      "SLALevel", // SLA
      "Tags", // Tags
      "Follower", // Người theo dõi
      "CreateBy", // Người tạo
      "CreateDTimeUTC", //Thời gian tạo
      "LogLUBy", // Người cập nhật cuối cùng
      "LogLUDTimeUTC", // Thời gian cập nhật cuối cùng
      "RemindWork", // Nhắc việc
      "RemindDTimeUTC", // Vào lúc
    ];

    const newValue = listField.map((item) => {
      if (`${item}` === "TicketJsonInfo") {
        if (flatArr[item]) {
          const result = {
            [`${item}`]: convertData({
              objJSON: JSON.parse(flatArr[item]),
              dataDynamic: dataDynamicField ?? [],
            }).reduce((acc, item) => {
              return [
                ...acc,
                {
                  ...item,
                  [`${item.caption}`]: item.value,
                },
              ];
            }, []),
          };
          return result;
        } else {
          return {
            TicketJsonInfo: "",
          };
        }
      }
      return {
        [`${item}`]: flatArr[item],
      };
    });

    // const customizeValue = newValue.reduce((acc: any[], item: any) => {
    //   if (Object.keys(item)[0] === "TicketJsonInfo") {
    //     return [...acc, ...item.TicketJsonInfo];
    //   }

    //   return [...acc, item];
    // }, []);

    const customizeFunction = (data: any) => {
      const customizeValue = data.reduce((acc: any[], item: any) => {
        if (
          Object.keys(item)[0] === "TicketJsonInfo" &&
          Object.values(item)[0]
        ) {
          return [...acc, ...item.TicketJsonInfo];
        }
        return [...acc, item];
      }, []);

      return customizeValue;
    };

    const newValueHO = listField.map((item) => {
      if (`${item}` === "TicketJsonInfo" && flatArrHO[item]) {
        if (flatArr[item]) {
          return {
            [`${item}`]: convertData({
              objJSON: JSON.parse(flatArrHO[item]),
              dataDynamic: dataDynamicField ?? [],
            }).reduce((acc, item) => {
              return [
                ...acc,
                {
                  [`${item.caption}`]: item.value,
                  ...item,
                },
              ];
            }, []),
          };
        } else {
          return {
            TicketJsonInfo: "",
          };
        }
      }
      return {
        [`${item}`]: flatArrHO[item],
      };
    });

    const TagList = (tags: string) => {
      var list = tags.split(",");
      if (!list) list = [];
      if (list.length > 3) {
        list = [...[...list].splice(0, 3), `+${list.length - 3}`];
      }
      return (
        <div className="flex tag-list">
          {list.map((item, idx) => {
            return (
              <span key={idx} className={`tag ml-1`}>
                {item}
              </span>
            );
          })}
        </div>
      );
    };
    const Items = [
      {
        id: 0,
        text: "Đơn vị xử lý",
        component: (
          <ScrollView style={{ maxHeight: scrollHeight - 30 }}>
            <div className="w-full">
              <Content_Component
                data={customizeFunction(newValue)}
                TagList={TagList}
              />
            </div>
          </ScrollView>
        ),
      },
      {
        id: 1,
        text: "HO",
        component: (
          <ScrollView style={{ maxHeight: scrollHeight - 30 }}>
            <div className="w-full">
              <Content_Component
                data={customizeFunction(newValueHO)}
                TagList={TagList}
              />
            </div>
          </ScrollView>
        ),
      },
    ].filter((item) => {
      if (Lst_ET_TicketHO?.length === 0) {
        return item.id === 0;
      } else {
        return item;
      }
    });

    const currentComponent = Items.find(
      (item: any) => item.id === currentIndex
    )?.component;

    // if (isLoadingAllDynamicField) {
    //   return <LoadPanel />;
    // }

    console.log("itemItems ", Items.length);

    return (
      <>
        <div
          className={
            "w-full pt-0 sep-bottom-1 tab-ctn-1 bg-white eticket-nav-right"
          }
        >
          <Tabs
            className={`show-${Items.length}`}
            selectedIndex={currentIndex}
            dataSource={Items}
            onItemClick={(value: any) => {
              setCurrentIndex(value.itemIndex);
            }}
          />

          {currentComponent}
        </div>
      </>
    );
  }
);

interface Props {
  data: any;
  TagList: (t: string) => ReactNode;
}

export const Content_Component = memo(({ data, TagList }: Props) => {
  const { t } = useI18n("PartDetailInfo");
  return (
    <div className="flex flex-column eticket-nav-right">
      {data.map((item: any, index: number) => {
        const text: any = Object.values(data[index])[0] ?? "";
        const field = Object.keys(data[index])[0];
        const textType = [
          "TEXT",
          "TEXTAREA",
          "NUMBER",
          "DATE",
          "DATETIME",
          "DECIMAL",
          "EMAIL",
          "MST",
          "PASSWORD",
          "PERCENT",
          "PHONE",
          "INT",
          "SELECTMULTIPLEDROPDOWN",
          "SELECTMULTIPLESELECTBOX",
          "MASTERDATA",
          "MASTERDATASELECTMULTIPLE",
          "SELECTONERADIO",
        ];

        if (item?.type) {
          // các trường động
          if (textType.includes(item.type)) {
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left">
                  {t(item.TicketColCfgName)}
                </span>
                <span className="float-right part-detail-info-value">
                  {item.value ?? "--"}
                </span>
              </div>
            );
          }
          if (item.type === "URL" || item.type === "IMAGE") {
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left">
                  {t(item.TicketColCfgName)}
                </span>
                <Link to={item.value ?? ""} className="float-right">
                  {splitString(item.value, 50)}
                </Link>
              </div>
            );
          }
          if (item.type === "FLAG") {
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left">
                  {t(item.TicketColCfgName)}
                </span>
                <span className="float-right part-detail-info-value">
                  {t(item.value === "1" ? "Active" : "Inactive")}
                </span>
              </div>
            );
          }
          if (item.type === "FILE") {
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left">
                  {t(item.TicketColCfgName)}
                </span>
                <span className="float-right part-detail-info-value">
                  <ContentFile item={item} />
                </span>
              </div>
            );
          } else {
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left">
                  {t(item.TicketColCfgName)}
                </span>
                <span className="float-right part-detail-info-value">
                  {item.value ? item.value.toString() : "--"}
                </span>
              </div>
            );
          }
        } else {
          if (typeof text === "string" || typeof text === "number") {
            if (field === "Tags") {
              return (
                <div
                  className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                  key={index}
                >
                  <span className="eticket-nav-right__text-left text-gray float-left">
                    {t(field)}
                  </span>
                  <span className="float-right part-detail-info-value">
                    {text ? TagList(`${text}`) : "--"}
                  </span>
                </div>
              );
            }

            if (!item.caption) {
              // các trường tĩnh
              return (
                <div
                  className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                  key={index}
                >
                  <span className="eticket-nav-right__text-left text-gray float-left">
                    {t(field)}
                  </span>
                  <span className="float-right part-detail-info-value">
                    {text ? `${splitString(text, 100)}` : "--"}
                  </span>
                </div>
              );
            }
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left">
                  {t(item.caption)}
                </span>
                <span className="float-right part-detail-info-value">
                  {item.value ? item.value : "--"}
                </span>
              </div>
            );
          } else {
            if (!text) {
              return (
                <div
                  className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                  key={index}
                >
                  <span className="eticket-nav-right__text-left text-gray float-left">
                    {t(field)}
                  </span>
                  <span className="float-right part-detail-info-value">--</span>
                </div>
              );
            }
            if (field === "Follower") {
              return (
                <div
                  className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span className="eticket-nav-right__text-left text-gray float-left">
                    {t(field)}
                  </span>
                  <div className="float-right follower-css">
                    {text.map((itemFollower: any, index: number) => {
                      return (
                        <div
                          key={`box-follower-${index}`}
                          className="box-follower"
                        >
                          <Avatar
                            name={itemFollower.AgentName}
                            size={"sm"}
                            className="mr-1"
                          />
                          {itemFollower.AgentName}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left">
                  {t(field)}
                </span>
                <span className="float-right part-detail-info-value">--</span>
              </div>
            );
          }
        }
      })}
    </div>
  );
});
