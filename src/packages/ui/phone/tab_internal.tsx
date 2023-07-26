import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import './phone.scss';
import { Button, ScrollView, SelectBox, TextBox } from "devextreme-react";
import { Item as TabItem } from 'devextreme-react/tabs';
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcAgent, CcCallingInfo, CcOrgInfo } from "@/packages/types";
import { Height } from "devextreme-react/chart";
import { ar } from "date-fns/locale";
import { select } from "ts-pattern/dist/patterns";
import { nanoid } from "nanoid";

const AgentItem = ({ data, idx }: { data: CcAgent, idx: number }) => {

    const [selectedNumber, setSelectedNumber] = useState('');


    
    const onValueNumberChanged = useCallback((e: any) => {
        setSelectedNumber(e.value);
    }, []);

    const dataSource = useMemo(() => {

        let arr = [];

        if (data.Alias) arr.push(data.Alias);
        if (data.PhoneNumber) arr.push(data.PhoneNumber);
        if (arr.length > 0) setSelectedNumber(arr[0]);

        return arr;

    }, [data]);
    const handleCallBtn = () => {
        //alert(selectedNumber)
        window.Phone.dial(selectedNumber);
    };

    return <tr>
        <td>{idx + 1}</td>
        <td>{data.Name}</td>
        <td>
            <SelectBox
                style={{ height: 25 }}
                dataSource={dataSource}

                value={selectedNumber}
                onValueChanged={onValueNumberChanged}

            >
            </SelectBox>


        </td>
        <td><Button icon="tel" className="bg-green" onClick={handleCallBtn}></Button> </td>
    </tr>

}
export const TabInternal = ({ callingInfo }: { callingInfo: CcCallingInfo }) => {
    const { auth } = useAuth();
    
    const [data, setData] = useState<CcOrgInfo | null>(null);

    useEffect(() => {

        setData(callingInfo.OrgInfo ?? null);

    }, []);

    return <div className="w-full p-3">
        <SelectBox className="mb-2"
            dataSource={data?.OrgList}
            searchEnabled={true}
            displayExpr="Name"
            placeholder="Chi nhánh"
        ></SelectBox>
        <TextBox className="mb-2" placeholder="Nhập tên agent, SĐT, số máy lẻ..."></TextBox>
        <ScrollView style={{ maxHeight: 200 }}>
            <table className="tb-list w-full">
                <tr>
                    <th style={{ width: 30 }}>STT</th>
                    <th>Agent</th>
                    <th style={{ width: 110 }}>Liên hệ</th>
                    <th style={{ width: 30 }}></th>
                </tr>
                <tbody>
                    {data?.AgentList.map((item, idx) => {
                        if(item.UserId==auth.currentUser?.Id) return <></>
                        return <AgentItem key={nanoid()} data={item} idx={idx}></AgentItem>

                    })}
                </tbody>
            </table>

        </ScrollView>
    </div>
}