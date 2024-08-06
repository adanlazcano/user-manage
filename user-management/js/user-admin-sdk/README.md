# MAXI VALIDATE PERMISSIONS

This library provides utilities to manage and validate user permissions using JSON Web Tokens (JWT). The library includes functionalities to decode JWT, check token validity, and fetch user permissions.



## Table of Contents

  - [Installing](#installing)
  - [Explanation](#explanation)
  - [Examples](#example)
  - [Response](#response)
 
## Installing

To use this library, you need to have `maxi-validate-permissions-test` installed. You can install this dependency:

Using npm:

```bash
$ npm install maxi-validate-permissions-test
```

Using bower:

```bash
$ bower install maxi-validate-permissions-test
```

Using yarn:

```bash
$ yarn add maxi-validate-permissions-test
```

Using pnpm:

```bash
$ pnpm add maxi-validate-permissions-test
```
  ## Explanation

This code is a TypeScript module that includes functions for handling user permissions and validating them based on a token received from an API. Here is a step-by-step explanation of the code: 
 
1. The code imports necessary modules such as axios for making HTTP requests, jwt-decode for decoding JWT tokens, and luxon for date and time manipulation. 
 
2. It defines various interfaces and enums for handling token decoding, response data, user roles, systems, modules, permissions, and permission information. 
 
3. It sets a URL for an API endpoint that checks user permissions. 
 
4. The  callApi  function is defined to make a GET request to the API endpoint with a provided token. It returns a response containing the status, message, and user role data. 
 
5. The  decodeToken  function decodes a JWT token and returns the decoded token along with a status and message. 
 
6. The  isTokenActive  function checks if a token is valid and active by decoding the token and checking its expiration time against the current time. 
 
7. The  getPermissionsUnique  function retrieves unique permissions for a specific system and permission name from a user role. 
 
8. The  getPermissionsInGroup  function retrieves permissions for a group of systems and permission names from a user role. 
 
9. The  validatePermission  function validates a single permission based on the provided token, permission system, and permission name by calling  isTokenActive ,  callApi , and  getPermissionsUnique  functions. 
 
10. The  validateGroupPermissions  function validates a group of permissions for a system based on the provided token, system name, and array of permissions by calling  isTokenActive ,  callApi , and  getPermissionsInGroup  functions. 
 
In summary, this code module provides functions to handle user permissions, decode tokens, check token validity, and validate permissions based on the user's role and provided token.

## Examples

### Validate Permission
```js
import { validatePermission } from 'maxi-validate-permissions-test';
//const { validatePermission } = require('maxi-validate-permissions-test'); // legacy way

const token = "*****";
const permissionSystem = "test";
const permissionName = "TEST_USER_MANGEMENT_PERM_1000";

validatePermission(
  token,
  permissionSystem,
  permissionName,
 ).then((data) => console.log(data));
```

### Validate Group Permissions
```js
import { validateGroupPermissions } from 'maxi-validate-permissions-test';
//const { validateGroupPermissions } = require('maxi-validate-permissions-test'); // legacy way

const token = "*****";
const systemName = "test";

const permissions = [
  "TEST_USER_MANAGMENT_PERM_2",
  "TEST_USER_MANAGMENT_PERM_1",
  "TEST_USER_MANAGMENT_PERM_10",
  "TEST_USER_MANAGMENT_PERM_3",
];

validateGroupPermissions(token, systemName, permissions).then((data) =>
  console.log(data)
);
```

  ## Response
  
  When request failed.
  
  ```bash 
{ status: 'error', message: 'Request failed.' }
  ```
  When token is invalid.
  
  ```bash 
 { status: 'error', message: 'The token is invalid.' }
  ```
  When token is expired.
  
  ```bash 
 { status: 'error', message: 'The token has expired.' }
  ```
  When permission system doesn´t exist.
  
  ```bash 
 { status: 'success', message: 'Request successful.', permission: null }
  ```

### Validate Permission

  When permission doesn´t exist.
  
  ```bash 
{
      status: 'success',
      message: 'Request successful.',
      permission: { TEST_USER_MANGEMENT_PERM_1000: null }
}
  ```
  When the user has access to the permission.
  
  ```bash 
{
      status: 'success',
      message: 'Request successful.',
      permission: { TEST_USER_MANAGMENT_PERM_2: { view: true, edit: false } }
}
  ```

### Validate Group Permissions

 
List of permissions that the user has access to use.

  ```bash 
{
      status: 'success',
      message: 'Request successful.',
      permission: [
        { TEST_USER_MANAGMENT_PERM_2: {"view":true,"edit":false} },
        { TEST_USER_MANAGMENT_PERM_1: null },
        { TEST_USER_MANAGMENT_PERM_10: null },
        { TEST_USER_MANAGMENT_PERM_3: {"view":true,"edit":false} }
      ]
}
  ```