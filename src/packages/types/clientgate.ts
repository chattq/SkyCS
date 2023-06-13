export interface ClientGateInfo {
  SolutionCode: string;
  NetworkID: string;
  NetworkName: string;
  GroupNetworkID: string;
  CoreAddr: string | null;
  PingAddr: string | null;
  XSysAddr: string | null;
  WSUrlAddr: string;
  WSUrlAddrLAN: string;
  DBUrlAddr: string | null;
  DefaultVersion: string;
  MinVersion: string;
  FlagActive: string;
  LogLUDTime: string;
  LogLUBy: string;
}

export interface Mst_CampaignColumnConfig_GetCampaignColCfgCodeSys {
  Success: true;
  Data: "CCF.D69.10002";
  DataList: null;
  ErrorData: null;
}

export interface Mst_CarModel {
  ModelCode: string;
  ModelProductionCode: string;
  ModelName: string;
  SegmentType: string;
  QuotaDate: string;
  FlagBusinessPlan: string;
  FlagActive: string;
  LogLUDateTime: string;
  LogLUBy: string;
}
export interface Mst_DepartmentControl {
  DepartmentCode?: string;
  NetworkID?: string;
  DepartmentCodeParent?: string;
  DepartmentBUCode?: string;
  DepartmentBUPattern?: string;
  DepartmentLevel?: number;
  MST?: string;
  OrgID?: string;
  DepartmentName?: string;
  DepartmentDesc?: string;
  FlagActive?: string;
  LogLUDTimeUTC?: string;
  LogLUBy?: string;
  su_QtyUser?: number;
  md_DepartmentNameParent?: string;
  Mst_Department?: any;
  Lst_Sys_UserMapDepartment?: any;
  DataList?: any;
}
export interface Mst_NNTController {
  DataList?: any;
  MST: string;
  OrgID: string;
  NNTFullName: string;
  NNTShortName: string;
  NetworkID: string;
  MSTParent: string;
  MSTBUCode: string;
  MSTBUPattern: string;
  MSTLevel: string;
  ProvinceCode: string;
  DistrictCode: string;
  DLCode: string;
  NNTAddress: string;
  NNTMobile: string;
  NNTPhone: string;
  NNTFax: string;
  PresentBy: string;
  BusinessRegNo: string;
  NNTPosition: string;
  PresentIDNo: string;
  PresentIDType: string;
  GovTaxID: string;
  ContactName: string;
  ContactPhone: string;
  ContactEmail: string;
  Website: string;
  CANumber: string;
  CAOrg: string;
  CAEffDTimeUTCStart: string;
  CAEffDTimeUTCEnd: string;
  PackageCode: string;
  CreatedDate: string;
  CreateDTime: string;
  CreateBy: string;
  AccNo: string;
  AccHolder: string;
  BankName: string;
  BizType: string;
  BizFieldCode: string;
  BizSizeCode: string;
  DealerType: string;
  AreaCode: string;
  RegisterStatus: string;
  TCTStatus: string;
  FlagActive: string;
  Remark: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  mgt_GovTaxID: string;
  mgt_GovTaxName: string;
  DepartmentCode: string;
  DepartmentName: string;
  UserName: string;
  UserPassword: string;
  UserPasswordRepeat: string;
  mp_ProvinceCode: string;
  mp_ProvinceName: string;
  md_DistrictCode: string;
  md_DistrictName: string;
  QtyLicense: string;
  CTSPath: string;
  CTSPwd: string;
  msio_OrderId: string;
  ipmio_Status: string;
  OrgIDSln: string;
  ma_AreaName: string;
}

export interface Sys_GroupController {
  GroupCode: string;
  GroupName: string;
  GroupDesc: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  MST: string;
  QtyUser: number;
  Lst_Sys_UserInGroup?: any;
  Sys_Group?: any;
  Lst_Sys_Access?: any;
}
export interface Mst_PaymentTermData {
  PaymentTermCode: string;
  OrgID: string;
  NetworkID: string;
  PaymentTermName: string;
  PTType: string;
  PTDesc: string;
  OwedDay: number;
  CreditLimit: number;
  DepositPercent: number;
  FlagActive: string;
  Remark: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}
export interface Sys_AccessData {
  GroupCode: string;
  ObjectCode: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  so_ObjectCode: string;
  so_ObjectName: string;
  so_ServiceCode: string;
  so_ObjectType: string;
  so_FlagExecModal: string;
  so_FlagActive: string;
  Lst_Sys_Access?: any;
}

export interface SysUserData {
  Data?: any;
  DataList?: any;
  UserCode: string;
  NetworkID: string;
  UserName: string;
  UserPassword: string;
  UserPasswordNew: string;
  PhoneNo: string;
  EMail: string;
  MST: string;
  OrganCode: string;
  DepartmentCode: string;
  Position: string;
  VerificationCode: string;
  Avatar: string;
  UUID: string;
  FlagDLAdmin: string;
  FlagSysAdmin: string;
  FlagNNTAdmin: string;
  OrgID: string;
  CustomerCodeSys: string;
  CustomerCode: string;
  CustomerName: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  ACId: string;
  ACAvatar: string;
  ACEmail: string;
  ACLanguage: string;
  ACName: string;
  ACPhone: string;
  ACTimeZone: string;
  mo_OrganCode: string;
  mo_OrganName: string;
  mdept_DepartmentCode: string;
  mdept_DepartmentName: string;
  mnnt_DealerType: string;
  ctitctg_CustomerGrpCode: string;
}

export interface DeleteDealerParam {
  DealerCode: string;
}

export interface ClientGateInfoResponse {
  Data: {
    _strTId: string;
    _strAppTId: string;
    _objTTime: string;
    _strType: string;
    _strErrCode: string;
    _objResult?: ClientGateInfo[];
    _excResult: any;
    _dicDebugInfo: {
      strTid: string;
      strAppTId: string;
      "dataInput.SolutionCode": string;
      "dataInput.NetworkIDSearch": string;
    };
  };
}
export interface DeleteBankAccountParam {
  AccountNo: string;
  BankCode: string;
}

export interface Mst_Area {
  OrgID: string;
  AreaCode: string;
  NetworkID: string;
  AreaCodeUser: string;
  AreaCodeParent: string;
  AreaBUCode: string;
  AreaBUPattern: string;
  AreaLevel: number;
  AreaName: string;
  AreaDesc: string;
  FlagActive?: any;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  SolutionCode: string;
  FunctionActionType: string;
}
export interface Cpn_CampaignAgentData {
  Data?: any;
  CampaignCode: string;
  OrgID: string;
  CampaignName: string;
  CampaignStatus: string;
  UserName: string;
  Extension: string;
  QtyCustomer: string;
  QtyCustomerSuccess: string;
}
export interface Mst_CustomerGroupData {
  OrgID?: any;
  CustomerGrpCode?: any;
  NetworkID: string;
  CustomerGrpCodeParent: string;
  CustomerGrpBUCode: string;
  CustomerGrpBUPattern: string;
  CustomerGrpLevel: string;
  CustomerGrpName: string;
  CustomerGrpDesc: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  SolutionCode: string;
  FunctionActionType: string;
  CustomerGrpImage: string;
}

export interface Mst_Dealer {
  DealerCode: string;
  DealerType: string;
  ProvinceCode: string;
  BUCode: string;
  BUPattern: string;
  DealerName: string;
  FlagDirect: string;
  FlagActive: string;
  DealerScale: string;
  DealerPhoneNo: string;
  DealerFaxNo: string;
  CompanyName: string;
  CompanyAddress: string;
  ShowroomAddress: string;
  GarageAddress: string | null;
  GaragePhoneNo: string | null;
  GarageFaxNo: string | null;
  DirectorName: string | null;
  DirectorPhoneNo: string | null;
  DirectorEmail: string | null;
  SalesManagerName: string | null;
  SalesManagerPhoneNo: string | null;
  SalesManagerEmail: string;
  GarageManagerName: string | null;
  GarageManagerPhoneNo: string | null;
  GarageManagerEmail: string | null;
  TaxCode: string;
  ContactName: string;
  Signer: string | null;
  SignerPosition: string | null;
  CtrNoSigner: string | null;
  CtrNoSignerPosition: string | null;
  HTCStaffInCharge: string | null;
  Remark: string;
  DealerAddress01: string | null;
  DealerAddress02: string | null;
  DealerAddress03: string | null;
  DealerAddress04: string | null;
  DealerAddress05: string | null;
  FlagTCG: string;
  FlagAutoLXX: string;
  FlagAutoMapVIN: string;
  FlagAutoSOAppr: string;
}

export interface Province {
  ProvinceCode: string;
  AreaCode: string;
  ProvinceName: string;
  FlagActive: string;
  LogLUDateTime: string;
  LogLUBy: string;
}
export interface Mst_CampaignTypeGetDate {
  Lst_Mst_CampaignType: Mst_CampaignTypeData;
  Lst_Mst_CustomColumnCampaignType: any[];
  Lst_Mst_CustomerFeedBack: any[];
}

export interface Mst_CampaignTypeData {
  CampaignTypeCode: string;
  OrgID: string;
  NetworkID: string;
  CampaignTypeName: string;
  CampaignTypeDesc: string;
  Remark: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  errorCode: string;
  errorInfo?: object;
  debugInfo: object;
  DataList?: T;
  Data?: T;
  ItemCount?: number;
  PageCount?: number;
  PageIndex?: number;
  PageSize?: number;
}

export interface SearchDealerParam extends SearchParam {
  DealerCode: string;
  DealerName: string;
  FlagAutoLXX: FlagActiveEnum;
  FlagAutoMapVIN: FlagActiveEnum;
  FlagAutoSOAppr: FlagActiveEnum;
}
export interface SearchUserControlParam {
  UserCode: string;
  UserName: string;
  PhoneNo: string;
  EMail: string;
  FlagActive: FlagActiveEnum;
  Ft_PageSize: number;
  Ft_PageIndex: number;
  KeyWord: string;
}

export enum FlagActiveEnum {
  Active = "1",
  Inactive = "0",
  All = "",
}

export interface SearchParam {
  KeyWord: string;
  FlagActive: FlagActiveEnum;
  Ft_PageSize: number;
  Ft_PageIndex: number;
}
export interface Cpn_CampaignAgentParam {
  AgentCode: string;
  CampaignCode: FlagActiveEnum;
}

export interface Mst_CampaignType {
  CampaignTypeCode: string;
  OrgID: string;
  NetworkID: string;
  CampaignTypeName: string;
  CampaignTypeDesc: string;
  Remark: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface Param_Mst_CampaignTypeCreate {
  Mst_CampaignType: Partial<Mst_CampaignType>;
  Lst_Mst_CustomColumnCampaignType: any[];
  Lst_Mst_CustomerFeedBack: any[];
}

export interface Mst_CampaignTypeSearchParam {
  CampaignTypeName: string;
  CampaignTypeDesc: string;
  KeyWord: string;
  FlagActive: FlagActiveEnum;
  Ft_PageSize: number;
  Ft_PageIndex: number;
}
export interface DepartmentSearchParam {
  KeyWord: string;
  FlagActive: FlagActiveEnum;
  Ft_PageSize: number;
  Ft_PageIndex: number;
}

export interface SearchCustomerParam extends SearchParam {
  CustomerCodeSys: string;
  ColGrpCodeSys: string;
  OrderByClause: string;
}

export interface MdMetaColGroupSpec {
  OrgID: string;
  ColGrpCodeSys: string;
  ColCodeSys: string;
  NetworkID: string;
  ColOperatorType: string;
  OrderIdx: number;
  JsonRenderParams?: any;
  JsonListOption: string;
  FlagIsNotNull: string;
  FlagIsCheckDuplicate: string;
  FlagIsQuery: string;
  FlagActive: string;
  FlagIsColDynamic: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  ColCode: string;
  ColCaption: string;
  ColDataType: string;
  Lst_MD_OptionValue?: any[];
}

export interface vggMst_CampaignColumnConfig_GetCampaignColCfgCodeSys {
  Success: boolean;
  Data: string;
  DataList: null;
  ErrorData: null;
}

export interface Mst_CampaignColumnConfig {
  CampaignColCfgCodeSys: string;
  CampaignColCfgCode: string;
  OrgID: string;
  NetworkID: string;
  CampaignColCfgDataType: string;
  CampaignColCfgName: string;
  CampaignColCfgDateUse: string;
  JsonListOption: string;
  FlagIsDynamic: string;
  FlagActive: true;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  IsRequired: boolean | string;
  IsUnique: boolean | string;
  IsSearchable: boolean | string;
  ListOption: any[];
  DataSource: string;
}

export interface Mst_Customer {
  OrgID: string;
  CustomerCodeSys: string;
  NetworkID: string;
  CustomerCode: string;
  CustomerType: string;
  CustomerGrpCode: string;
  CustomerSourceCode: string;
  CustomerName: string;
  CustomerNameEN: string;
  CustomerGender: string;
  CustomerPhoneNo: string;
  CustomerMobilePhone: string;
  ProvinceCode: string;
  DistrictCode: string;
  WardCode: string;
  AreaCode: string;
  CustomerAvatarName: string;
  CustomerAvatarSpec: string;
  FlagCustomerAvatarPath: string;
  CustomerAvatarPath: string;
  JsonCustomerInfo: string;
  CustomerAddress: string;
  CustomerEmail: string;
  CustomerDateOfBirth: string;
  GovIDType: string;
  GovIDCardNo: string;
  GovIDCardDate: string;
  GovIDCardPlace: string;
  TaxCode: string;
  BankCode: string;
  BankName: string;
  ListOfCustDynamicFieldValue: string;
  BankAccountNo: string;
  RepresentName: string;
  RepresentPosition: string;
  UserCodeOwner: string;
  ContactName: string;
  ContactPhone: string;
  ContactEmail: string;
  Fax: string;
  Facebook: string;
  InvoiceCustomerName: string;
  InvoiceCustomerAddress: string;
  InvoiceOrgName: string;
  InvoiceEmailSend: string;
  MST: string;
  FlagDealer: string;
  FlagSupplier: string;
  FlagEndUser: string;
  FlagShipper: string;
  FlagBank: string;
  FlagInsurrance: string;
  DTimeUsed: string;
  CreateDTimeUTC: string;
  CreateBy: string;
  LUDTimeUTC: string;
  LUBy: string;
  FlagActive: string;
  Remark: string;
  Coordinates: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  Org_NNTFullName: string;
  Network_NNTFullName: string;
  mct_CustomerTypeName: string;
  mcg_CustomerGrpName: string;
  mcs_CustomerSourceName: string;
  mp_ProvinceName: string;
  md_DistrictName: string;
  mw_WardName: string;
  ma_AreaName: string;
  mg_GovIDTypeName: string;
  SolutionCode: string;
  FunctionActionType: string;
  GetCustomData: string;
  GetCustomDataString: string;
  SetCustomData: string;
}

interface OptionItem {
  OrderIdx: number;
  Value: string;
}

export interface MstCampaignColumnConfig {
  CampaignColCfgCodeSys: string;
  CampaignColCfgCode: string;
  OrgID: string;
  NetworkID: string;
  CampaignColCfgDataType: string;
  CampaignColCfgName: string;
  CampaignColCfgDateUse: string;
  FlagIsDynamic: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface MdMetaColGroupSpecDto extends MdMetaColGroupSpec {
  ListOption: any[];
  // incase of select one
  DefaultIndex?: string;
  IsRequired: boolean;
  Enabled: boolean;
  IsUnique: boolean;
  IsSearchable: boolean;
  DataSource?: string;
}

interface ISearchParam {
  FlagActive: 0 | 1;
  Ft_PageIndex: number;
  Ft_PageSize: number;
}
export interface MdMetaColGroupSpecSearchParam extends ISearchParam {
  ColGrpCodeSys: string;
}

export interface MdMetaColGroupSearchParam extends ISearchParam {
  ScrTplCodeSys: string;
}

export interface MdMetaColGroup {
  OrgID: string;
  ColGrpCodeSys: string;
  NetworkID: string;
  ScrTplCodeSys: string;
  ColGrpCode: string;
  ColGrpName: string;
  OrderIdx: number;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface MdMetaColumnDataType {
  ColDataType: string;
  NetworkID: string;
  ColDataTypeDesc: string;
  SqlDataType: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface MdMetaColumnOperatorType {
  ColOperatorType: string;
  NetworkID: string;
  ColOperatorTypeDesc: string;
  SqlOperatorType: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface MdOptionValue {
  Key: string;
  OrderIdx: number;
  Value: string;
}

export interface MdMetaColGroupSpecListOption {
  OrgID: string;
  ColGrpCodeSys: string;
  ColCodeSys: string;
  NetworkID: string;
  ColOperatorType: string;
  OrderIdx: string;
  JsonRenderParams: string;
  JsonListOption: string;
  FlagIsNotNull: string;
  FlagIsCheckDuplicate: string;
  FlagIsQuery: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  ColCode: string;
  ColCaption: string;
  ColDataType: string;
  Lst_MD_OptionValue: {
    Key: string;
    Value: string;
    OrderIdx: string;
  }[];
}
