import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import './phone.scss';
import { SelectBox } from "devextreme-react";
import { Item as TabItem } from 'devextreme-react/tabs';
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcCallingInfo } from "@/packages/types";

export const TabExternal = ({ callingInfo, onShowHistory }: { callingInfo: CcCallingInfo, onShowHistory: any }) => {

    const [selectedNumber, setSelectedNumber] = useState('');

    const onValueNumberChanged = useCallback((e: any) => {
        setSelectedNumber(e.value);
    }, []);


    const [number2Dial, setNumber2Dial] = useState('');

    const numberClick = (number: string) => {

        const newNum = number2Dial + number;
        setNumber2Dial(newNum);

    }

    const handleCallBtn = () => {
        window.Phone.dial(number2Dial);
    };

    useEffect(() => {
        if (callingInfo.CalloutNumbers && callingInfo.CalloutNumbers?.length > 0) {
            setSelectedNumber(callingInfo.CalloutNumbers[0]);
        }
    }, [callingInfo])

    return <>
        <div className="w-full pl-5 pr-5">
            <div className="w-full pl-5 pr-5">
                <input className="dial-text" value={number2Dial} onChange={(e: any) => {
                    setNumber2Dial(e.target.value)
                }}

                />
            </div>
        </div>
        <div className="dial-pad">
            <div className="w-full">
                <div className="flex">
                    <button className="rounded-btn" onClick={() => numberClick('1')}>1</button>
                    <button className="rounded-btn" onClick={() => numberClick('2')}>2</button>
                    <button className="rounded-btn" onClick={() => numberClick('3')}>3</button>
                </div>
            </div>
            <div className="w-full">
                <div className="flex">
                    <button className="rounded-btn" onClick={() => numberClick('4')}>4</button>
                    <button className="rounded-btn" onClick={() => numberClick('5')}>5</button>
                    <button className="rounded-btn" onClick={() => numberClick('6')}>6</button>
                </div>
            </div>
            <div className="w-full">
                <div className="flex">
                    <button className="rounded-btn" onClick={() => numberClick('7')}>7</button>
                    <button className="rounded-btn" onClick={() => numberClick('8')}>8</button>
                    <button className="rounded-btn" onClick={() => numberClick('9')}>9</button>
                </div>
            </div>
            <div className="w-full">
                <div className="flex">
                    <button className="rounded-btn" onClick={() => numberClick('*')}>*</button>
                    <button className="rounded-btn" onClick={() => numberClick('0')}>0</button>
                    <button className="rounded-btn" onClick={() => numberClick('#')} >#</button>
                </div>
            </div>
        </div>

        <div className="w-full pl-5 pr-5">
            <div className="flex ml-5 pl-1">
                <span className="mr-3">Gọi từ</span>
                <SelectBox
                    style={{ width: 150, height: 25 }}
                    dataSource={callingInfo.CalloutNumbers}
                    value={selectedNumber}
                    onValueChanged={onValueNumberChanged}
                ></SelectBox>

            </div>
        </div>
        <div className="w-full pl-5 pr-5 pb-5">
            <div className="flex ml-5 mt-2 pl-5">
                <button style={{ width: 40, height: 40 }} onClick={onShowHistory}><i className="dx-icon-bulletlist"></i></button>
                <button className="rounded-btn btn-green ml-5"
                    onClick={handleCallBtn}
                ><i className="dx-icon-tel"></i></button>

            </div>

        </div>

    </>
}