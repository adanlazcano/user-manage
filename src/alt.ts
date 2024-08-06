import axios from "axios";
import {jwtDecode} from 'jwt-decode'
import { DateTime } from "luxon";


export enum PermissionType {
    READ = "r",
    WRITE = "w",
    READ_WRITE = "rw",
  }
  
  export interface DecodeToken {
    status:  string;
    message: string;
    token?:    Token | any;
  }
  
  export interface Token {
    header:  Header;
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
  
   
  export interface PermissionInfo {
    [key: string]: { view?: boolean; edit?: boolean } | null | string;
  }
  
 
//DEV https://zeus-api.mylabs.mx/usermanagement
 
const url =  " https://zeus-api.maxilabs.net/usermanagement/permissions/check";

export const callApi = async (token: string): Promise<ResponseData> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(url, config);

    return {
      status: "success",
      message: "Request successful.",
      data: res?.data?.data?.role,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Request failed.",
    };
  }
};

const decodeToken = (token: string) => {
  try {
    const decodedToken  = jwtDecode(token);
    return {
      status: "success",
      message: "Token decoded successfully.",
      token: decodedToken,
    };
  } catch (error) {
    return {
      status: "error",
      message: "The token is invalid.",
    };
  }
};

export const isTokenActive = (token: string) => {
  const decodeRes : DecodeToken = decodeToken(token);

  console.log(decodeRes)

  if (decodeRes?.status === "error" || !decodeRes?.token) {
    return {
      status: "error",
      message: "The token is invalid.",
    };
  }

  const tokenPayload = decodeRes.token;

  const expTimestamp = tokenPayload.exp;

  if (expTimestamp) {
    const expDateTime = DateTime.fromSeconds(expTimestamp, { zone: "utc" });
    if (expDateTime < DateTime.now().setZone("utc")) {
      return {
        status: "error",
        message: "The token has expired.",
      };
    }
  }
  return {
    status: "success",
    message: "The token is active.",
  };
};

export const getPermissionsUnique = async (
  userRole: Role,
  permissionSystem: string,
  permissionName: string
) => {
  const permissionInfo: PermissionInfo = {};

  for (const system of userRole.systems) {
    if (system.name === permissionSystem.toUpperCase()) {
      for (const module of system.modules) {
        let permissionFlag = false;
        for (const permission of module.permissions) {
          if (permission.key === permissionName) {
            permissionFlag = true;

            permissionInfo[permissionName] = JSON.stringify({
              view: permission.view,
              edit: permission.edit,
            });
          }
        }
        if (!permissionFlag) {
          permissionInfo[permissionName] = null;
        }
      }
    }
  }

  return permissionInfo;
};

export const getPermissionsInGroup = async (
  userRole: Role,
  systemName: string,
  permissions: string[],
 
) => {
  const permissionsList = [];

  for (const currentPermission of permissions) {
    const permissionInfo: PermissionInfo = {};
    for (const system of userRole.systems) {
         const currentPermissionName = currentPermission;

      let systemFlag = false;

      if (system.name === systemName.toUpperCase()) {
        systemFlag = true;
        for (const module of system.modules) {
          let permissionFlag = false;

          for (const permission of module.permissions) {
            if (permission.key === currentPermissionName) {
              permissionFlag = true;
           
              permissionInfo[currentPermission] = JSON.stringify({
                view: permission.view,
                edit: permission.edit,
              }); //REMOVER JSON stringify

              permissionsList.push(permissionInfo);
              break;
            }
          }
          if (!permissionFlag) {
            permissionInfo[currentPermissionName] = null;
            permissionsList.push(permissionInfo);
            break;
          }
        }
      }else{
        permissionInfo[currentPermissionName] = null;
        permissionsList.push();
        break;
      }

      if (!systemFlag) {
        permissionInfo[currentPermissionName] = null;
        permissionsList.push(permissionInfo);
      }
    }
  }

  return permissionsList?.filter(
    (val, index, arr) =>
      index === arr.findIndex((t) => JSON.stringify(t) === JSON.stringify(val))
  );
};


export const validatePermission = async (
    token: string,
    permissionSystem: string,
    permissionName: string,
  ) => {
    try {
     
  
      const tokenStatus = isTokenActive(token);
  
      if (tokenStatus?.status === "error") return tokenStatus;
  
      const { status, message, data } = await callApi(token);
  
      if (!data)
        return {
          status,
          message,
         };
  
      const userPermissionsData = data;
  
      const userData = await getPermissionsUnique(
        userPermissionsData,
        permissionSystem,
        permissionName,
     
      );
  
      if (userData.status === "error") return userData;
  
      return {
        status,
        message,
        permission: Object.keys(userData)?.length > 0 ? userData : null,
      };
    } catch (error) {
      console.log(error);
    }
  };
  export const validateGroupPermissions = async (
    token: string,
    systemName: string,
    permissions: string[],
    
  ) => {
    try {
        
      const tokenStatus = isTokenActive(token);
  
      if (tokenStatus?.status === "error") return tokenStatus;
  
      const { status, message, data } = await callApi(token);
  
      if (!data)
        return {
          status,
          message,
          permission: data,
        };
  
      const userPermissionsData = data;
  
      const userData = await getPermissionsInGroup(
        userPermissionsData,
      
        systemName,
        permissions,
      );
  
      return {
        status,
        message,
        permission: Object.keys(userData)?.length > 0 ? userData : null,
      };
    } catch (error) {
      console.log(error);
    }
  };