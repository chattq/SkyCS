import { Button, Form, List, Popup, ScrollView } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import React, { memo } from "react";
import { listCampaignAgentAtom, visiblePopupAtom } from "../../../store";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useI18n } from "@/i18n/useI18n";
import { GroupItem, Item, Label, SimpleItem } from "devextreme-react/form";
import { readOnly } from "@/pages/Business_Information/components/store";
import { toast } from "react-toastify";

interface Props {
  onSave: (t: any[]) => void;
  listCustomer: any[];
  onCancel: () => void;
}
//listCampaign
const DistrictBution_Agent = ({ onCancel, listCustomer, onSave }: Props) => {
  const popupVisible = useAtomValue(visiblePopupAtom);
  const listCampaignAgent = useAtomValue(listCampaignAgentAtom);
  console.log("listCampaignAgent", listCampaignAgent);
  const { t } = useI18n("DistrictBution_Agent");
  let newArr = listCampaignAgent.map((item, index) => {
    if (listCustomer.length < listCampaignAgent.length) {
      if (index + 1 > listCustomer.length) {
        return {
          // ...item,
          AgentCode: item.UserCode,
          AgentName: item.UserName,
          quantityCustomer: 0,
        };
      } else {
        return {
          // ...item,
          AgentCode: item.UserCode,
          AgentName: item.UserName,
          quantityCustomer: 1,
        };
      }
    } else {
      if (!(index + 1 === listCampaignAgent.length)) {
        return {
          // ...item,
          AgentCode: item.UserCode,
          AgentName: item.UserName,
          quantityCustomer: Math.floor(
            listCustomer.length / listCampaignAgent.length
          ),
        };
      } else {
        return {
          // ...item,
          AgentName: item.UserName,
          AgentCode: item.UserCode,
          quantityCustomer:
            (listCustomer.length % listCampaignAgent.length) +
            Math.floor(listCustomer.length / listCampaignAgent.length),
        };
      }
    }
  });

  const handleChangeQuantity = (e: any, dataItem: any) => {
    if (typeof e?.value === "number") {
      console.log("e ", e, "dataItem ", dataItem);
      const filterValue = newArr.map((item) => {
        if (item.AgentCode === dataItem.AgentCode) {
          return {
            ...item,
            quantityCustomer: e.value ?? 0,
          };
        } else {
          return item;
        }
      });
      newArr = filterValue;
    }
  };

  const handleSave = () => {
    const getTotal = newArr.reduce((acc, item) => {
      return acc + parseInt(item.quantityCustomer) ?? 0;
    }, 0);
    if (getTotal !== listCustomer.length) {
      toast.error(
        t("The distribution agent is no equal to list customer. please change!")
      );
    } else {
      let arr: any = [];
      let defaultIdx = 0;
      for (let i = 0; i < newArr.length; i++) {
        const itemAgent = newArr[i];
        if (itemAgent.quantityCustomer > 0) {
          for (let j = 0; j < itemAgent.quantityCustomer; j++) {
            const element = {
              ...listCustomer[defaultIdx],
              AgentCode: itemAgent.AgentCode,
              AgentName: itemAgent.AgentName,
              quantityCustomer: itemAgent.quantityCustomer,
            };
            defaultIdx++;
            arr = [...arr, element];
          }
        }
      }
      onSave(arr);
      onCancel();
    }
  };

  return (
    <Popup
      className="popup-campaign"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={`Add Field`}
      width={700}
      height={450}
      visible={popupVisible}
    >
      <ScrollView className="popup-customer-content" width={"100%"}>
        <p style={{ textAlign: "right" }}>
          {t(`total: ${listCustomer.length}`)}
        </p>
        <List
          dataSource={newArr}
          itemRender={(data: any) => {
            console.log("data ", data);
            return (
              <Form formData={data}>
                <GroupItem colCount={3}>
                  <SimpleItem
                    dataField="AgentName"
                    editorOptions={{
                      readOnly: true,
                    }}
                  ></SimpleItem>
                  <SimpleItem dataField="Extension"></SimpleItem>
                  <SimpleItem
                    dataField="quantityCustomer"
                    editorType="dxNumberBox"
                    editorOptions={{
                      onOptionChanged: (e: any) =>
                        handleChangeQuantity(e, data),
                    }}
                  ></SimpleItem>
                </GroupItem>
              </Form>
            );
          }}
        ></List>
      </ScrollView>

      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Save")}
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

export default memo(DistrictBution_Agent);