
export interface CcOrg {
    Id?: number,
    Name?: string,

    IsNetwork: boolean,
}

export interface CcAgent {
    OrgId?: number,
    UserId?: number,
    Name?: string,

    Email?: string,

    PhoneNumber?: string,
    ExtId?: number,
    Extension?: string,
    Alias?: string,

    OnlineStatus?: string,
    DeviceState?: string,
    AgentStatus?: string,
    LastCallDTime?:string,
}

export interface CcOrgInfo {
    OrgList: CcOrg[],
    AgentList: CcAgent[]
}

export interface CcCallingInfo {
    ExtId?: string,
    ExtDomain?: string,
    ExtSecret?: string,
    Protocol?: string,
    Server?: string,
    OrgId?: string,
    Alias?: string,
    AgentStatus?: string,
    Password?: string,

    CalloutNumbers?: string[]

    OrgInfo?: CcOrgInfo,


}

export interface CcCall {
    Id?: number,

    Type?: string, // incoming/outgoing/internal : đến, đi, nội bộ

    Status?: string,

    FromNumber?: string, //số gọi đến

    ToNumber?: string, //số nhận

    RemoteNumber?: string, // sđt khách (là số gọi đến khi type= incoming, số nhận khi type=outgoing, số của angen mình goi khi type== internal)

    AgentNumber?: string, //số máy agent


    QueueNumber?: string, // hàng đợi gọi đến

    Description?: string,

    AgentDesc?: string,

    CustomerDesc?: string,
    Extension?: string,

    Date?: string,
    Time?: string,


    CreateDTime?: Date, // thời điểm gọi

    TalkTime?: number, // số giây cuộc gọi

    RecfilePath?: string // file ghi âm
}