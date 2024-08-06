export enum PermissionType {
  READ = "r",
  WRITE = "w",
  READ_WRITE = "rw",
}

export interface DecodeToken {
  status: string;
  message: string;
  token?: Token | any;
}

export interface Token {
  header: Header;
  payload: Payload;
}

export interface Header {
  alg: string;
  typ: string;
  kid: string;
}

export interface Payload {
  exp: number;
  iat?: number;
}
export interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}
export interface ResponseData {
  status: string;
  message: string;
  data?: Role;
}

export interface Role {
  id: string;
  name: string;
  systems: System[];
  isSpecial: boolean;
}

export interface System {
  id: string;
  name: string;
  modules: Module[];
}

export interface Module {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  status: string;
  key: string;
  name: string;
  view: boolean;
  edit: boolean;
}

export interface Permissions {
  // name: string;
  // system: string;
}

export interface PermissionInfo {
  [key: string]: { view?: boolean; edit?: boolean } | null | string;
}
