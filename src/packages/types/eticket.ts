export interface Customer {
  //Id: string;
  Name: string;
  Image: string | null;
  Email: string | null;
  Phone: string | null;
}

export interface UploadFile {
  Id?: string,
  Url: string,
  Type?: string, // docx,doc,...
  Name?: string;
  Size?: number;
}



export interface Email {
  Type: string | null; //In/Out
  From: string | null,
  To: string | null,
  Subject: string | null,
  Detail: string | null;
}

export interface Call {
  FromNumber: string,
  ToNumber: string;
  Type: string; // Out/In/Missed/NoAnswer
}

export interface EticketMessage {
  //Id: string;
  Type: string; //Email/Call/Note/Zalo/Event
  AuthorName: string | null;
  AuthorImage: string | null;

  IsPinned: boolean | null;
  Detail: string | null;
  Attachments?: UploadFile[]

  Call?: Call;
  Email?: Email;
  CreateDtime: string | null;
}
export interface Eticket {
  Id: string;
  Name: string;
  Status: string;
  Type: string | null;
  PreferredReplyChannel: string | null;
  UpdateDtime: string | null;

  Deadline: string | null;
  Agent: string | null;
  Tags: string | null;
  Customer: Customer;

  MessageList: EticketMessage[] | null;


}
