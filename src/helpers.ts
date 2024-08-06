import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { DateTime } from "luxon";
import {
  Role,
  ResponseData,
  PermissionInfo,
  DecodeToken,
  ErrorResponse,
} from "./types";
import * as env from "./env.json";

const url = env.API_URL_STAGE as string;

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
    const err = error as ErrorResponse;
    return {
      status: "error",
      message: err?.response?.data?.message ?? err?.message,
    };
  }
};

const decodeToken = (token: string) => {
  try {
    const decodedToken = jwtDecode(token);
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
  const decodeRes: DecodeToken = decodeToken(token);

  if (decodeRes?.status === "error" || !decodeRes?.token) {
    return {
      status: "error",
      message: "The token is invalid.",
    };
  }

  const tokenPayload = decodeRes.token;

  const expTimestamp = tokenPayload?.exp;

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

            permissionInfo[permissionName] = {
              view: permission.view,
              edit: permission.edit,
            };
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
  permissions: string[]
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

              permissionInfo[currentPermission] = {
                view: permission.view,
                edit: permission.edit,
              };

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
      } else {
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
