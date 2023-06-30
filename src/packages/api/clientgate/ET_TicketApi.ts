import {
  ApiResponse,
  MdMetaColGroup,
  MdMetaColGroupSpec,
  MdMetaColGroupSpecDto,
  MdMetaColGroupSpecListOption,
  MdMetaColGroupSpecSearchParam,
  MdMetaColumnDataType,
  MdOptionValue,
} from "@/packages/types";
import { AxiosInstance } from "axios";
import { match } from "ts-pattern";

export interface ETICKET_REPONSE {
  TicketID: string;
  OrgID: string;
  NetworkID: string;
  TicketStatus: string;
  CustomerCodeSys: string;
  TicketName: string;
  TicketDetail: string;
  AgentCode: string;
  DepartmentCode: string;
  TicketType: string;
  TicketDeadline: string;
  TicketPriority: null;
  TicketJsonInfo: string;
  ReceptionDTimeUTC: string;
  TicketCustomType: string;
  TicketSource: string;
  ReceptionChannel: string;
  ContactChannel: string;
  Tags: string;
  SLAID: string;
  RemindWork: string | null;
  TicketEvaluate: string;
  RemindDTimeUTC: string;
  CreateDTimeUTC: string;
  CreateBy: string | null;
  ProcessDTimeUTC: string | null;
  ProcessBy: string | null;
  CloseDTimeUTC: string | null;
  CloseBy: string;
  LogLUDTimeUTC: string;
  LogLUBy: string | null;
}

export interface SearchParamEticket {
  FlagOutOfDate: string;
  FlagNotRespondingSLA: string;
  DepartmentCode: string;
  AgentCode: string;
  TicketStatus: string;
  TicketPriority: string;
  TicketDeadline: string;
  TicketType: string;
  CustomerCodeSys: string;
  TicketDetail: string;
  TicketName: string;
  TicketID: string;
  CreateDTimeUTCFrom: string;
  CreateDTimeUTCTo: string;
  LogLUDTimeUTCFrom: string;
  LogLUDTimeUTCTo: string;
  TicketSourceFrom: string;
  TicketSourceTo: string;
  OrgID: string;
  NetworkID: string;
  Ft_PageIndex: number;
  Ft_PageSize: number;
}

export const useETTicket = (apiBase: AxiosInstance) => {
  return {
    ET_Ticket_Search: async (
      param: SearchParamEticket
    ): Promise<ApiResponse<ETICKET_REPONSE[]>> => {
      console.log("param ", param);
      return await apiBase.post<
        SearchParamEticket,
        ApiResponse<ETICKET_REPONSE[]>
      >("ETTicket/Search", {
        ...param,
      });
    },
  };
};
