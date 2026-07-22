# StaffRoleControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assignRole**](#assignrole) | **POST** /api/staff-roles | |
|[**getAll**](#getall) | **GET** /api/staff-roles | |
|[**getById**](#getbyid) | **GET** /api/staff-roles/{id} | |
|[**getRolesByStaffId**](#getrolesbystaffid) | **GET** /api/staff-roles/staff/{staffId} | |
|[**getStaffByRoleId**](#getstaffbyroleid) | **GET** /api/staff-roles/role/{roleId} | |
|[**removeRole**](#removerole) | **DELETE** /api/staff-roles/{id} | |
|[**updateStaffRole**](#updatestaffrole) | **PUT** /api/staff-roles/{id} | |

# **assignRole**
> StaffRoleResponse assignRole(staffRoleRequest)


### Example

```typescript
import {
    StaffRoleControllerApi,
    Configuration,
    StaffRoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffRoleControllerApi(configuration);

let staffRoleRequest: StaffRoleRequest; //

const { status, data } = await apiInstance.assignRole(
    staffRoleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffRoleRequest** | **StaffRoleRequest**|  | |


### Return type

**StaffRoleResponse**

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

# **getAll**
> Array<StaffRoleResponse> getAll()


### Example

```typescript
import {
    StaffRoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffRoleControllerApi(configuration);

const { status, data } = await apiInstance.getAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<StaffRoleResponse>**

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

# **getById**
> StaffRoleResponse getById()


### Example

```typescript
import {
    StaffRoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffRoleControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**StaffRoleResponse**

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

# **getRolesByStaffId**
> Array<StaffRoleResponse> getRolesByStaffId()


### Example

```typescript
import {
    StaffRoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffRoleControllerApi(configuration);

let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.getRolesByStaffId(
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**Array<StaffRoleResponse>**

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

# **getStaffByRoleId**
> Array<StaffRoleResponse> getStaffByRoleId()


### Example

```typescript
import {
    StaffRoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffRoleControllerApi(configuration);

let roleId: number; // (default to undefined)

const { status, data } = await apiInstance.getStaffByRoleId(
    roleId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleId** | [**number**] |  | defaults to undefined|


### Return type

**Array<StaffRoleResponse>**

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

# **removeRole**
> removeRole()


### Example

```typescript
import {
    StaffRoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffRoleControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.removeRole(
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

# **updateStaffRole**
> StaffRoleResponse updateStaffRole(staffRoleRequest)


### Example

```typescript
import {
    StaffRoleControllerApi,
    Configuration,
    StaffRoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffRoleControllerApi(configuration);

let id: number; // (default to undefined)
let staffRoleRequest: StaffRoleRequest; //

const { status, data } = await apiInstance.updateStaffRole(
    id,
    staffRoleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffRoleRequest** | **StaffRoleRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**StaffRoleResponse**

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

