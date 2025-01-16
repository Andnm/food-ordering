export interface Base {
  id: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface BaseWithIdNumber {
  id: number;
  dateCreated: string;
  dateUpdated: string;
}

export interface PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalSize: number;
  pageSkip: number;
}

export interface ParamGet {
  pageIndex: number;
  pageSize: number;
  sortKey: string;
  sortOrder: string;
  searchValue?: string;
}

export interface ParamGetWithId extends ParamGet {
  Id: number;
}

export interface OptionType {
  value: string;
  label: string;
}

export interface ParamGetSuggestAdditional {
  ServerAllocationId: number;
  Quantity: number;
}
