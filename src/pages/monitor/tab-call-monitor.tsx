
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { useHub } from "@/packages/hooks/useHub";
import { usePhone } from "@/packages/hooks/usePhone";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { CcAgent, CcCall } from "@/packages/types";
import { ScrollView } from "devextreme-react";
import ContextMenu, { Position } from 'devextreme-react/context-menu';

import { Column } from "devextreme-react/data-grid";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useState } from "react";
export const Tab_CallMonitor = () => {

    const [list, setList] = useState<CcCall[]>([]);
    const { auth } = useAuth();
    const [reload, setReload] = useState(0);




    const hub = useHub("global");

    useEffect(() => {
        hub.onReceiveMessage("CallState", (c) => {
            setReload((r) => { return r + 1; })
        });

    }, []);


    const phone = usePhone();


    useEffect(() => {
        console.log("reload", reload);

        callApi.getOrgCallListMonitor(auth.networkId).then((resp) => {

            if (resp.Success && resp.Data) {

                setList(resp.Data);

            }
        });




    }, [reload]);

    const hangup = (item: CcCall) => {
        callApi.hangup(auth.networkId, { callId: item.Id });
    };

    const spy = (item: CcCall) => {
        //callApi.snoop(auth.networkId, {callId: item.Id});
        phone.call(`spy${item.Extension}`);
    };


    const redirect = (item: CcCall) => {
        phone.showFowardCall(item);


    };

    const pickup = (item: CcCall) => {

        if (phone.status.isOnline && !!phone.status.extension) {

            callApi.redirect(auth.networkId, { callId: item.Id, target: phone.status.extension }).then((resp) => {

                console.log(resp);
                if (resp.Success && resp.Data) {
                
                }
                else alert(resp.ErrorMessage)
            });

        }
    };
    const windowSize = useWindowSize();

    const isDone = (call: CcCall) => {
        if (call.Status == 'Ringing' || call.Status == 'InCall') return false;
        return true;
    }

    const CallItem = ({ item, idx }: { item: CcCall, idx: any }) => {

        const [currentInterval, setInterval] = useState(0);
        useEffect(() => {


            console.log('start interval1');
            const interval1 = window.setInterval(() => {

                setInterval((o) => {
                    return o + 1;

                });


            }, 1000);

            return () => {
                console.log('clear interval1');
                clearInterval(interval1);
            }

        }, []);


        const menuId = useMemo(() => {
            return `call_menu${idx}`;
        }, []);
        const menuItems_in = useMemo(() => ([
            {
                text: 'Pickup',
                //icon: 'user',
                onClick: () => {
                    pickup(item);
                }
            },
            {
                text: 'Hangup',
                //icon: 'user',
                onClick: () => {
                    hangup(item);
                }
            },
            {
                text: 'Spy',
                //icon: 'user',
                onClick: () => {
                    spy(item);
                }
            },


            {
                text: 'Redirect',
                //icon: 'user',
                onClick: () => {
                    redirect(item);
                }
            },

        ]), []);

        const menuItems_out = useMemo(() => ([
            // {
            //     text: 'Pickup',
            //     //icon: 'user',
            //     onClick: () => {
            //         pickup(item);
            //     }
            // },
            {
                text: 'Hangup',
                //icon: 'user',
                onClick: () => {
                    hangup(item);
                }
            },
            {
                text: 'Spy',
                //icon: 'user',
                onClick: () => {
                    spy(item);
                }
            },


            // {
            //     text: 'Redirect',
            //     //icon: 'user',
            //     onClick: () => {
            //         redirect(item);
            //     }
            // },

        ]), []);

        return <tr>
            <td>{idx + 1}</td>
            <td>
                {item.Id}
            </td>
            <td>{item.AgentDesc}</td>
            <td>{item.RemoteNumber}</td>
            <td>{item.CustomerDesc}</td>

            <td><span className={`call-status ${item.Status?.toLocaleLowerCase()}`}> {item.Status}
            </span></td>
            <td>{item.Type}</td>
            <td>{item.Time}</td>
            {/* <td>{item.TalkTime ?? 0 + currentInterval}</td> */}
            <td>{currentInterval + (item.TalkTime ?? 0)}</td>
            <td>
                <i className="dx-icon-menu" id={`${menuId}`}></i>
                <ContextMenu
                    items={item.Type=='Incoming'? menuItems_in: menuItems_out}
                    target={`#${menuId}`}
                    showEvent={'dxclick'}
                    cssClass={'bg-white'}

                >
                    {/* <Position my={'top center'} at={'bottom center'} /> */}
                </ContextMenu>

            </td>

        </tr>
    }

    const CallItemDone = ({ item, idx }: { item: CcCall, idx: any }) => {



        return <tr>
            <td>{idx + 1}</td>
            <td>
                {item.Id}
            </td>
            <td>{item.AgentDesc}</td>
            <td>{item.RemoteNumber}</td>
            <td>{item.CustomerDesc}</td>

            <td><span className={`call-status ${item.Status?.toLocaleLowerCase()}`}> {item.Status}
            </span></td>
            <td>{item.Type}</td>
            <td>{item.Time}</td>
            <td>{item.TalkTime}</td>
            <td>



            </td>
        </tr>
    }

    return <>
        <div className={"w-full p-2"}>
            <ScrollView height={windowSize.height - 180}>
                <table className="w-full tb-list">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>
                                Id cuộc gọi
                            </th>
                            <th>Agent</th>
                            <th>Số liên hệ</th>
                            <th>Tên khách hàng</th>
                            <th>Trạng thái cuộc gọi</th>
                            <th>Loại cuộc gọi</th>
                            <th>Thời gian bắt đầu</th>
                            <th>Tổng thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.map((item, idx) => {
                                if (isDone(item)) return <CallItemDone item={item} idx={idx} key={nanoid()} />
                                else
                                    return <CallItem item={item} idx={idx} key={nanoid()} />

                            })
                        }

                    </tbody>
                </table>
            </ScrollView>
        </div>
    </>
}