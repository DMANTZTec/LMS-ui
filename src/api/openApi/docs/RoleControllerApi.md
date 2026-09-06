# RoleControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createRole**](#createrole) | **POST** /api/roles | |
|[**deleteRole**](#deleterole) | **DELETE** /api/roles/{id} | |
|[**getAllRoles**](#getallroles) | **GET** /api/roles | |
|[**getRoleById**](#getrolebyid) | **GET** /api/roles/{id} | |
|[**updateRole**](#updaterole) | **PUT** /api/roles/{id} | |

# **createRole**
> RoleResponse createRole(roleRequest)


### Example

```typescript
import {
    RoleControllerApi,
    Configuration,
    RoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let staffId: string; // (default to undefined)
let roleRequest: RoleRequest; //

const { status, data } = await apiInstance.createRole(
    staffId,
    roleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleRequest** | **RoleRequest**|  | |
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**RoleResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteRole**
> deleteRole()


### Example

```typescript
import {
    RoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteRole(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllRoles**
> Array<RoleResponse> getAllRoles()


### Example

```typescript
import {
    RoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

const { status, data } = await apiInstance.getAllRoles();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<RoleResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRoleById**
> RoleResponse getRoleById()


### Example

```typescript
import {
    RoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getRoleById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**RoleResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateRole**
> RoleResponse updateRole(roleRequest)


### Example

```typescript
import {
    RoleControllerApi,
    Configuration,
    RoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let id: number; // (default to undefined)
let staffId: string; // (default to undefined)
let roleRequest: RoleRequest; //

const { status, data } = await apiInstance.updateRole(
    id,
    staffId,
    roleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleRequest** | **RoleRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**RoleResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

