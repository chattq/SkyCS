import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import './phone.scss';
import { Button, ScrollView, Tabs, DropDownBox, List, SelectBox } from "devextreme-react";
import { Item as TabItem } from 'devextreme-react/tabs';
import { Height } from "devextreme-react/chart";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcCall, CcCallingInfo } from "@/packages/types";
import { CallState } from "./call-button";
import { IncallKeypad } from "./incall-keypad";
import { showErrorAtom } from "@/packages/store";

export function InternalHasCall({ callingInfo, callState }: { callingInfo: CcCallingInfo, callState: CallState }) {

    const { auth } = useAuth();

    const [callData, setCallData] = useState<CcCall | null>(null);
    const [tabIdx, setTabIdx] = useState(1);

    useEffect(() => {


        if (callState.direction == 'outgoing') {
            var ext = callingInfo.OrgInfo?.AgentList.find(a =>
                a.Extension == callState.toNumber
                || a.Alias == callState.toNumber

            );

            if (!!ext) {

                setCallData({
                    RemoteNumber: ext.Alias,
                    Description: ext.Name,
                    Type: "internal"

                });
                setTabIdx(1);

            }
            else {

                var rn = callState.toNumber ?? "";


                if (rn.startsWith('spy')) {

                    var nx = rn.replaceAll('spy', '');

                    var extT = callingInfo.OrgInfo?.AgentList.find(a =>
                        a.Extension == nx

                    );
                    if (!extT) {
                        window.Phone.hangup();
                        rn = 'invalid call';
                    }
                    else rn = `Spying ${extT.Alias}`;

                }

                setCallData({
                    RemoteNumber: rn,
                    //Description: ext.Name,
                    Type: "outgoing"

                });
                setTabIdx(0);

            }
        }
        else {

            callApi.getMyLatestCall(auth.networkId).then((resp) => {
                console.log("getMyLatestCall", resp);
                if (resp.Success && resp.Data) {
                    setCallData(resp.Data);
                    if (resp.Data.Type == 'internal') setTabIdx(1);
                    else if (resp.Data.Type == 'outgoing') setTabIdx(0);
                    else setTabIdx(2);
                }
            });
        }


    }, [callingInfo])


    const canForward = useMemo(() => {
        if (callState.direction == 'outgoing') return false;
        return true;
    }, [callState]);

    const Ring = () => {
        return <>
            <div className={'w-full pb-5'}>
                <center>
                    <span>{"Cuộc gọi đến"}</span>
                    <br />
                    <br />
                    <strong>{!!callData && callData.Description}</strong>

                    <br />
                    <span>{!!callData && callData.RemoteNumber}</span>
                </center>
            </div>
            <div className={'w-full pb-5'}>

                <center>
                    <div className="dial-btn-group">

                        <p>
                            <button className="rounded-btn btn-green" onClick={() => { window.Phone.answer(); }}>
                                <i className="icon-accept"></i>
                            </button>
                        </p>
                        <p className="btn-text">Trả lời</p>

                    </div>
                    <div className="dial-btn-group">
                        <p>
                            <button className="rounded-btn btn-red" onClick={() => { window.Phone.hangup(); }}>
                                <i className="icon-reject"></i>
                            </button>
                        </p>
                        <p className="btn-text">từ chối</p>

                    </div>

                </center>



            </div >
        </>
    };

    const Incall = () => {

        const [callTime, setCallTime] = useState(0);

        const [isHeld, setIsHeld] = useState(false);
        const [isMuted, setIsMuted] = useState(false);



        useEffect(() => {
            if (callState.state == "incall") {
                setCallTime(1);
                console.log('start interval1');
                const interval1 = window.setInterval(() => {
                    setCallTime((o) => {
                        return o + 1;
                    });

                }, 1000);

                return () => {
                    console.log('clear interval1');
                    clearInterval(interval1);
                }
            }

        }, [callState]);
        const [showKeypad, setKeypadVisibility] = useState(false);

        return <>

            <div className={'w-full pb-5'}>
                <center>
                    {/* <span>{callState.direction == "incomming" ? "Cuộc gọi đến" : "Cuộc gọi đi"}</span>
                    <br /> */}

                    <h5>{!!callData && callData.Description}</h5>

                    <span>{!!callData && callData.RemoteNumber}</span>
                    <br />

                    <span className="countup mt-1 mb-2">{callTime}</span>

                </center>


            </div>

            {showKeypad &&
                <>
                    <IncallKeypad />
                </>
            }
            {
                !showKeypad &&
                <>
                    <center>

                        {!isMuted &&
                            <div className="dial-btn-group">
                                <p>
                                    <button className="rounded-btn" onClick={() => { window.Phone.mute(); setIsMuted(true); }}>
                                        <i className="icon-mute"></i>
                                    </button>
                                </p>
                                <p className="btn-text">tắt âm</p>
                            </div>
                        }
                        {isMuted &&
                            <div className="dial-btn-group">
                                <p>
                                    <button className="rounded-btn" onClick={() => { window.Phone.unmute(); setIsMuted(false); }}>
                                        <i className="icon-mic"></i>
                                    </button>
                                </p>
                                <p className="btn-text">bật âm</p>
                            </div>
                        }


                        {!isHeld &&

                            <div className="dial-btn-group">
                                <p>
                                    <button className="rounded-btn" onClick={() => { window.Phone.hold(); setIsHeld(true); }}>
                                        <i className="icon-pause"></i>
                                    </button>
                                </p>
                                <p className="btn-text">giữ cuộc gọi</p>

                            </div>

                        }
                        {isHeld &&

                            <div className="dial-btn-group">
                                <p>
                                    <button className="rounded-btn" onClick={() => { window.Phone.unhold(); setIsHeld(false); }}>
                                        <i className="icon-play"></i>
                                    </button>
                                </p>
                                <p className="btn-text">bỏ giữ</p>

                            </div>
                        }


                        <div className="dial-btn-group">
                            <p>
                                <button className="rounded-btn" onClick={() => { setKeypadVisibility(true); }}>
                                    <i className="icon-keyboard"></i>
                                </button>
                            </p>
                            <p className="btn-text">bàn phím</p>

                        </div>

                    </center>

                    <center className="mt-1">
                        {canForward &&
                            <div className="dial-btn-group">
                                <p>
                                    <button className="rounded-btn" onClick={() => { window.Phone.showForward(); }}>
                                        <i className="icon-forward"></i>
                                    </button>
                                </p>
                                <p className="btn-text">chuyển</p>

                            </div>
                        }
                         {!canForward &&
                            <div className="dial-btn-group disabled">
                                <p>
                                    <button className="rounded-btn" disabled>
                                        <i className="icon-forward"></i>
                                    </button>
                                </p>
                                <p className="btn-text">chuyển</p>

                            </div>
                        }
                        <div className="dial-btn-group disabled">
                            <p>
                                <button className="rounded-btn" disabled>
                                    <i className="dx-icon-group"></i>
                                </button>
                            </p>
                            <p className="btn-text">gọi nhóm</p>

                        </div>

                        <div className="dial-btn-group disabled">
                            <p>
                                <button className="rounded-btn" disabled>
                                    <i className="icon-ticket"></i>
                                </button>
                            </p>
                            <p className="btn-text">eTicket</p>

                        </div>

                    </center>
                </>
            }

            <div className={'w-full pb-5 mt-3 position-relative'}>

                <center>
                    <button className="rounded-btn btn-red" onClick={() => { window.Phone.hangup(); }}>
                        <i className="icon-reject"></i>
                    </button>

                </center>
                {showKeypad &&
                    <div style={{ position: "absolute", top: 0, right: 90 }}>
                        <button style={{ width: 40, height: 40 }} onClick={() => { setKeypadVisibility(false); }}>Ẩn</button>
                    </div>
                }

            </div >

        </>
    }

    const Calling = () => {
        return <>

            <div className={'w-full pb-5'}>
                <center>
                    <span>{callState.direction == "incomming" ? "Cuộc gọi đến" : "Cuộc gọi đi"}</span>
                    <br />
                    <br />
                    <strong>{!!callData && callData.Description}</strong>

                    <br />
                    <span>{!!callData && callData.RemoteNumber}</span>
                </center>
            </div>
            <div className={'w-full pb-5'}>

                <center>
                    <div className="dial-btn-group">
                        <p>
                            <button className="rounded-btn btn-red" onClick={() => { window.Phone.hangup(); }}>
                                <i className="dx-icon-tel"></i>
                            </button>
                        </p>
                        <p className="btn-text">kết thúc</p>

                    </div>

                </center>



            </div >

        </>
    }
    return (
        <div className="soft-phone">
            <div className={'w-full tab-ctn bg-white mb-2 position-relative'}>
                <div className="flex">
                    <Tabs
                        width={250}
                        selectedIndex={tabIdx}
                    >
                        <TabItem
                            text="Gọi ra"
                            disabled={callData?.Type != 'outgoing'}

                        >
                        </TabItem>
                        <TabItem
                            disabled={callData?.Type != 'internal'}
                            text="Gọi nội bộ"
                        >
                        </TabItem>

                        <TabItem
                            disabled={callData?.Type != 'incoming'}
                            text="Gọi vào"
                        >
                        </TabItem>

                    </Tabs>
                    <button className="float-right" style={{ position: 'absolute', right: 10, color: "#333", fontSize: 20, height: 40 }}>
                        <i className="dx-icon-expand"></i>
                    </button>
                </div>
            </div>
            {callState.state == 'ringing' && <Ring />}
            {callState.state == 'incall' && <Incall />}
            {callState.state == 'calling' && <Calling />}



        </div >


    )
}