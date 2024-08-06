import {
  callApi,
  getPermissionsInGroup,
  getPermissionsUnique,
  isTokenActive,
} from "./helpers";

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
