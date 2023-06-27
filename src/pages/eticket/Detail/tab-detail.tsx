import ResponsiveBox, { Col, Item, Location, Row } from "devextreme-react/responsive-box";
import { Button, ScrollView, TabPanel, Tabs } from 'devextreme-react';
import { Item as TabItem } from 'devextreme-react/tabs';
import { useWindowSize } from '@/packages/hooks/useWindowSize';
import { PartReply } from "./part-reply";
import { PartMessageList } from "./part-message-list";
import { PartDetailInfo } from "./part-detail-info";
import { Eticket } from "@/packages/types";
export const Tab_Detail = ({ data }: { data: Eticket }) => {


    const windowSize = useWindowSize();
    const scrollHeight = windowSize.height - 100;
    return (
        <ResponsiveBox
            className={'w-full'}
        >
            <Row></Row>
            <Col ratio={3}></Col>
            <Col ratio={1}></Col>
            <Item >
                <Location
                    row={0}
                    col={0}
                />


                <ScrollView style={{ maxHeight: scrollHeight }}>

                    <div className="w-full" style={{ background: "#F5F7F9" }}>
                        <PartReply></PartReply>
                        <PartMessageList data={data} />
                    </div>
                </ScrollView>
            </Item>
            <Item >
                <Location
                    row={0}
                    col={1}
                />
                <PartDetailInfo data={data} />

            </Item>
        </ResponsiveBox>
    );
}