import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { useHub } from "@/packages/hooks/useHub";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { CcAgent } from "@/packages/types";
import { DataGrid, ScrollView, Switch } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
export const Tab_AgentMonitor = () => {

    const [list, setList] = useState<CcAgent[]>([]);
    const { auth } = useAuth();

    const hub = useHub("global");

    const [reload, setReload] = useState(0);


    useEffect(() => {
        hub.onReceiveMessage("AgentState", (c) => {

            console.log("AgentState", c);
            setReload((r) => { return r + 1; })
        });

    }, []);


    useEffect(() => {


        callApi.getOrgAgentList(auth.networkId).then((resp) => {



            if (resp.Success && resp.Data) {


                setList(resp.Data);

            }
        });




    }, [reload]);


    const togglEgentCalloutStatus = (item: CcAgent) => {

        if (item.AllowCallout)
            item.AllowCallout = false;
        else item.AllowCallout = true;

        callApi.setExtAgentCalloutStatus(auth.networkId, { id: item.ExtId, status: item.AllowCallout }).then((resp) => {

            console.log(resp);
        });

    }
    const togglEgentStatus = (item: CcAgent) => {

        if (item.AgentStatus == "On")
            item.AgentStatus = "Off";
        else item.AgentStatus = "On";

        callApi.setExtAgentStatus(auth.networkId, { id: item.ExtId, status: item.AgentStatus }).then((resp) => {

            console.log(resp);
        });

    }
    const windowSize = useWindowSize();

    const AgentItem = ({ item, idx }: { item: CcAgent, idx: any }) => {
        return <tr>
            <td>{idx + 1}</td>
            <td>
                {item.Name}
            </td>
            <td>{item.Alias}</td>
            <td>{item.Email}</td>
            <td><span className={`monitor-status ${item.DeviceState?.toLocaleLowerCase()}`}> {item.DeviceState}</span></td>


            <td>
                <Switch
                    value={item.AllowCallout}


                    onValueChange={(e) => {
                        togglEgentCalloutStatus(item);

                    }}
                />
            </td>


            <td>
                <Switch
                    value={item.AgentStatus == 'On'}


                    onValueChange={(e) => {
                        togglEgentStatus(item);

                    }}
                />
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
                                Tên Agent
                            </th>
                            <th>Số máy lẻ</th>
                            <th>Email</th>
                            <th>Trạng thái người dùng</th>
                            <th>Cho phép gọi ra</th>
                            <th>Hoạt động</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.map((item, idx) => {
                                return <AgentItem item={item} idx={idx} key={nanoid()} />
                            })
                        }

                    </tbody>
                </table>
            </ScrollView>
        </div>
    </>
}